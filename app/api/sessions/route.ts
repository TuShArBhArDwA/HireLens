import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getSessionsByUser, getSessionWithCandidates } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await getSessionWithCandidates(sessionId, userId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json(session);
    }

    const sessions = await getSessionsByUser(userId);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Sessions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
