import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume, AnalysisResult } from '@/lib/groq';
import { parseFile, extractNameFromFilename } from '@/lib/parseFile';
import { uploadResumeBuffer } from '@/lib/cloudinary';
import {
  insertSession,
  insertCandidates,
  getSessionWithCandidates,
} from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

interface ProcessedCandidate extends AnalysisResult {
  name: string;
  fileUrl: string | null;
  resumeText: string;
  rank?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const jdTitle = formData.get('jdTitle') as string;
    const jdText = formData.get('jdText') as string;
    const files = formData.getAll('files') as File[];

    if (!jdTitle || !jdText) {
      return NextResponse.json(
        { error: 'Job description title and text are required' },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one resume file is required' },
        { status: 400 }
      );
    }

    // 1. Create screening session
    const sessionId = await insertSession(userId, jdTitle, jdText);

    // 2. Process all resumes in parallel
    const results = await Promise.allSettled(
      files.map(async (file): Promise<ProcessedCandidate> => {
        const name = extractNameFromFilename(file.name);

        // Parse resume text
        const resumeText = await parseFile(file);
        if (!resumeText) {
          throw new Error(`Could not extract text from ${file.name}`);
        }

        // Upload to Cloudinary (non-blocking)
        const buffer = Buffer.from(await file.arrayBuffer());
        let fileUrl: string | null = null;
        try {
          fileUrl = await uploadResumeBuffer(buffer, file.name);
        } catch (e) {
          console.warn(`Cloudinary upload failed for ${file.name}:`, e);
        }

        // Analyze via Groq
        const analysis = await analyzeResume(jdText, resumeText);

        return { name, fileUrl, resumeText, ...analysis };
      })
    );

    // 3. Collect successful analyses
    const successfulCandidates: ProcessedCandidate[] = results
      .filter((r): r is PromiseFulfilledResult<ProcessedCandidate> => r.status === 'fulfilled')
      .map((r) => r.value);

    if (successfulCandidates.length === 0) {
      return NextResponse.json(
        { error: 'Failed to analyze any resumes' },
        { status: 500 }
      );
    }

    // 4. Sort by score and assign ranks
    const ranked = successfulCandidates
      .sort((a, b) => b.score - a.score)
      .map((c, i) => ({ ...c, rank: i + 1 }));

    // 5. Save to Supabase
    await insertCandidates(
      sessionId,
      ranked.map(({ name, fileUrl, resumeText, score, rank, strengths, gaps, recommendation, summary }) => ({
        name,
        file_url: fileUrl ?? null,
        resume_text: resumeText,
        score,
        rank: rank!,
        strengths,
        gaps,
        recommendation,
        summary,
      }))
    );

    // 6. Return full session with candidates
    const session = await getSessionWithCandidates(sessionId, userId);
    return NextResponse.json({ sessionId, session }, { status: 200 });
  } catch (error) {
    console.error('Screening error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
