-- Create screening_sessions table
CREATE TABLE public.screening_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    jd_title TEXT NOT NULL,
    jd_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.screening_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_url TEXT,
    resume_text TEXT NOT NULL,
    score INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    strengths TEXT[] NOT NULL,
    gaps TEXT[] NOT NULL,
    recommendation TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
