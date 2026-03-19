import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side client with elevated permissions
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface Candidate {
  id: string;
  session_id: string;
  name: string;
  file_url: string | null;
  resume_text: string;
  score: number;
  rank: number;
  strengths: string[];
  gaps: string[];
  recommendation: 'Strong Fit' | 'Moderate Fit' | 'Not Fit';
  summary: string;
  created_at: string;
}

export interface ScreeningSession {
  id: string;
  user_id: string;
  jd_title: string;
  jd_text: string;
  created_at: string;
  candidates?: Candidate[];
}

export async function insertSession(
  userId: string,
  jdTitle: string,
  jdText: string
): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('screening_sessions')
    .insert({ user_id: userId, jd_title: jdTitle, jd_text: jdText })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to insert session: ${error.message}`);
  return data.id;
}

export async function insertCandidates(
  sessionId: string,
  candidates: Omit<Candidate, 'id' | 'session_id' | 'created_at'>[]
): Promise<void> {
  const rows = candidates.map((c) => ({ ...c, session_id: sessionId }));
  const { error } = await supabaseAdmin.from('candidates').insert(rows);
  if (error) throw new Error(`Failed to insert candidates: ${error.message}`);
}

export async function getSessionsByUser(userId: string): Promise<ScreeningSession[]> {
  const { data, error } = await supabaseAdmin
    .from('screening_sessions')
    .select('id, user_id, jd_title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);
  return (data as ScreeningSession[]) || [];
}

export async function getSessionWithCandidates(
  sessionId: string,
  userId: string
): Promise<ScreeningSession | null> {
  const { data, error } = await supabaseAdmin
    .from('screening_sessions')
    .select(`*, candidates (*)`)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  if (data?.candidates) {
    (data as ScreeningSession).candidates = (data.candidates as Candidate[]).sort(
      (a, b) => a.rank - b.rank
    );
  }
  return data as ScreeningSession;
}
