<h1 align="center">
  <img src="https://img.icons8.com/color/96/000000/search-in-list.png" alt="HireLens Logo" />
  <br/>
  HireLens
</h1>

<p align="center">
  <strong>AI-Powered Resume Screening System</strong><br/>
  Automatically rank candidates, surface key strengths & gaps, and generate fit recommendations — all powered by Groq LLM.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js"/>
  <img alt="Groq" src="https://img.shields.io/badge/Groq-llama--3.3--70b-orange"/>
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase"/>
  <img alt="Clerk" src="https://img.shields.io/badge/Auth-Clerk-purple"/>
  <img alt="Cloudinary" src="https://img.shields.io/badge/Storage-Cloudinary-blue"/>
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow"/>
</p>

---

## What It Does

**HireLens** is a fully automated AI resume screening pipeline. HR teams upload a Job Description + up to 10 resumes and receive:

| Output | Description |
|---|---|
| **Match Score (0–100)** | Holistic LLM-evaluated fit score |
| **Candidate Ranking** | Sorted from best to worst fit |
| **Key Strengths (2–3)** | What the candidate does well |
| **Key Gaps (2–3)** | What the candidate is missing |
| **Recommendation** | Strong Fit / Moderate Fit / Not Fit |
| **Recruiter Summary** | 2-sentence AI-generated note |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Authentication | [Clerk](https://clerk.com) |
| AI / LLM Engine | [Groq API](https://groq.com) – `llama-3.3-70b-versatile` |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| File Storage | [Cloudinary](https://cloudinary.com) |
| Animations | [Motion](https://motion.dev) |
| Styling | Vanilla CSS (dark glassmorphism) |

---

## Project Structure

```
HireLens/
├── app/                     # Next.js App Router pages & API routes
│   ├── (auth)/              # Sign-in / Sign-up (Clerk)
│   ├── screen/              # Upload JD + Resumes
│   ├── results/[sessionId]/ # Results Dashboard
│   └── dashboard/           # Session History
├── components/              # Reusable UI components
├── lib/                     # Core modules (Groq, Supabase, Cloudinary, parseFile)
├── sample_data/             # 1 JD + 8 realistic resume profiles
├── Docs/                    # Architecture documentation
│   ├── HLD.md               # High Level Design
│   └── LLD.md               # Low Level Design
├── .env.local               # Environment variables (never commit!)
├── LICENSE
└── README.md
```

---

## Architecture & Design Docs

| Document | Description |
|---|---|
| [High Level Design (HLD)](./Docs/HLD.md) | System architecture, data flow, component overview, deployment model |
| [Low Level Design (LLD)](./Docs/LLD.md) | API specs, module interfaces, DB schema, component breakdown |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Accounts on: Clerk, Supabase, Cloudinary, Groq

### 1. Clone & Install

```bash
git clone https://github.com/TuShArBhArDwA/HireLens.git
cd HireLens
npm install
```

### 2. Configure Environment

Copy and fill in your API keys:

```bash
cp .env.local .env.local.filled
```

Edit `.env.local` with your keys for Clerk, Supabase, Groq, and Cloudinary. See `.env.local` for the full list of variables.

### 3. Set Up Supabase

Run these SQL commands in your Supabase SQL editor:

```sql
CREATE TABLE screening_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL,
  jd_title   TEXT NOT NULL,
  jd_text    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     UUID REFERENCES screening_sessions(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  file_url       TEXT,
  resume_text    TEXT,
  score          INTEGER NOT NULL,
  rank           INTEGER NOT NULL,
  strengths      JSONB NOT NULL DEFAULT '[]',
  gaps           JSONB NOT NULL DEFAULT '[]',
  recommendation TEXT NOT NULL,
  summary        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## How to Use

1. **Sign in** with Clerk
2. Go to **Screen Candidates** → upload your JD and resumes (PDF/DOCX/TXT)
3. Or click **"Load Sample Data"** to use the built-in demo
4. Click **"Screen Candidates"** → Groq analyzes each resume
5. View the **ranked results dashboard** with scores, strengths, gaps, and recommendations
6. Review **past sessions** in the Dashboard

---

## Sample Data

Located in `sample_data/`:
- `jd_senior_data_engineer.txt` – Realistic JD for a Senior Data Engineer role
- `resumes/` – 8 diverse candidate profiles covering Strong Fit, Moderate Fit, and Not Fit scenarios

---

## Security

- All app routes are protected by Clerk authentication middleware
- API routes validate the authenticated user before processing
- No API keys are ever exposed to the client
- `.env.local` is gitignored

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Connect with me

If you’d like to connect, feel free to reach out — [Click here](https://minianonlink.vercel.app/tusharbhardwaj)


---

**[Try HireLens](https://hirelens.vercel.app/)** | **[Submit Feedback](https://github.com/TuShArBhArDwA/HireLens/issues)**