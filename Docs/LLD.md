# LLD – Low Level Design

## File Structure

```
HireLens/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── dashboard/page.tsx
│   ├── screen/page.tsx
│   ├── results/[sessionId]/page.tsx
│   ├── api/
│   │   ├── screen/route.ts
│   │   └── sessions/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── UploadForm.tsx
│   ├── CandidateCard.tsx
│   ├── RankingTable.tsx
│   ├── ScoreRing.tsx
│   ├── RecommendationBadge.tsx
│   └── Navbar.tsx
├── lib/
│   ├── groq.ts
│   ├── supabase.ts
│   ├── cloudinary.ts
│   └── parseFile.ts
├── sample_data/
│   ├── jd_senior_data_engineer.txt
│   └── resumes/ (8 × .txt files)
├── Docs/
│   ├── HLD.md
│   └── LLD.md
├── .env.local
├── middleware.ts
├── next.config.js
├── tsconfig.json
├── package.json
├── LICENSE
└── README.md
```

---

## API Design

### `POST /api/screen`

**Request** (multipart/form-data):
```
jdTitle:    string
jdText:     string
files[]:    File[] (PDF / DOCX / TXT)
```

**Response** (JSON):
```json
{
  "sessionId": "uuid",
  "jdTitle": "Senior Data Engineer",
  "candidates": [
    {
      "id": "uuid",
      "name": "Alice Chen",
      "rank": 1,
      "score": 88,
      "recommendation": "Strong Fit",
      "strengths": ["5+ years Spark/Hadoop", "Strong Python & SQL", "Kubernetes experience"],
      "gaps": ["No Kafka experience mentioned", "Limited data governance exposure"],
      "summary": "Alice is an excellent match with deep data engineering expertise.",
      "fileUrl": "https://res.cloudinary.com/..."
    }
  ]
}
```

**Processing Steps:**
1. Validate Clerk auth token
2. For each uploaded file → call `parseFile()` to extract text
3. Upload raw file to Cloudinary → get `fileUrl`
4. For each resume → call `analyzeResume(jdText, resumeText)` (Groq)
5. Sort candidates by `score` descending → assign `rank`
6. Insert to Supabase: 1 `screening_sessions` row + N `candidates` rows
7. Return full candidate array

---

### `GET /api/sessions`

Returns paginated list of past sessions for the authenticated user.

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "jdTitle": "Senior Data Engineer",
      "createdAt": "2026-03-19T...",
      "candidateCount": 8,
      "topScore": 88
    }
  ]
}
```

---

## Module: `lib/groq.ts`

```typescript
// Core prompt template
const SYSTEM_PROMPT = `You are an expert technical recruiter...`

// analyzeResume(jdText: string, resumeText: string): Promise<AnalysisResult>
// - Constructs prompt with JD + resume
// - Calls Groq chat.completions.create()
// - Parses JSON from response content
// - Returns: { score, strengths, gaps, recommendation, summary }

interface AnalysisResult {
  score: number;                  // 0–100
  strengths: string[];            // 2–3 items
  gaps: string[];                 // 2–3 items
  recommendation: "Strong Fit" | "Moderate Fit" | "Not Fit";
  summary: string;
}
```

**Groq Model**: `llama-3.3-70b-versatile`
**Temperature**: `0.3` (deterministic, factual outputs)
**Max Tokens**: `512` per resume

---

## Module: `lib/parseFile.ts`

```typescript
// parseFile(file: File): Promise<string>
// Branches on MIME type:
//   application/pdf      → pdf-parse
//   application/vnd...   → mammoth (DOCX)
//   text/plain           → file.text()
```

---

## Module: `lib/supabase.ts`

```typescript
// createClient() → supabase client (anon key for public, service key for server)

// insertSession(userId, jdTitle, jdText) → sessionId
// insertCandidates(sessionId, candidates[]) → void
// getSessionsByUser(userId) → Session[]
// getSessionWithCandidates(sessionId) → { session, candidates[] }
```

---

## Module: `lib/cloudinary.ts`

```typescript
// uploadFile(buffer: Buffer, filename: string): Promise<string>
// → Returns secure_url from Cloudinary response
// Uses upload_preset: "hirelens_resumes" (unsigned upload)
```

---

## Database Schema (Supabase)

### `screening_sessions`
```sql
CREATE TABLE screening_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  jd_title    TEXT NOT NULL,
  jd_text     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### `candidates`
```sql
CREATE TABLE candidates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES screening_sessions(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  file_url        TEXT,
  resume_text     TEXT,
  score           INTEGER NOT NULL,
  rank            INTEGER NOT NULL,
  strengths       JSONB NOT NULL DEFAULT '[]',
  gaps            JSONB NOT NULL DEFAULT '[]',
  recommendation  TEXT NOT NULL,
  summary         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Key Components

### `ScoreRing.tsx`
- SVG circular progress ring
- Motion animate from 0 → final score on mount
- Color: green (≥75), amber (50–74), red (<50)

### `CandidateDetailCard` (in `results/page.tsx`)
- Logic: Refactored as a flex-column modal container.
- **`modal-header`**: Contains Score, Name, Close button. Fixed height.
- **`modal-body`**: Contains Summary, Strengths, Gaps. `flex: 1; overflow-y: auto;`.
- **`modal-footer`**: Sticky/fixed footer containing the "View Resume" button to ensure constant accessibility.
- Motion: Fade-in + Slide-up entry with staggered child elements.

### `FAQItem.tsx` (in `page.tsx`)
- Interactive accordion component.
- Uses **`AnimatePresence`** for height-based transition (`height: 0` → `height: auto`).
- `overflow: hidden` on the motion wrapper to ensure smooth sliding without layout jumps.
- Exit animation for closing states.

### `DashboardItem` (in `dashboard/page.tsx`)
- Session summary card.
- **Session Title**: Uses CSS `line-clamp: 2` and `word-break: break-word` to handle extra-long job titles gracefully.
- Layout: Adaptive flex layout that ensures consistent icon placement regardless of title wrapping.

### `RankingTable.tsx`
- Sortable columns: rank, score, recommendation
- Each row animates in with staggered delay (Motion)
- Click row → opens CandidateCard detail modal

### `UploadForm.tsx`
- Dropzone (react-dropzone) for multi-file PDF/DOCX/TXT upload
- JD title + textarea input
- "Load Sample Data" button fills form with pre-built demo data
- Validates: max 10 files, max 5MB per file

---

## Middleware (`middleware.ts`)

```typescript
// Clerk middleware protecting all routes except sign-in / sign-up / public
export default clerkMiddleware();
export const config = {
  matcher: ['/((?!_next|favicon.ico|sign-in|sign-up|api/public).*)'],
};
```

---

## Scoring Logic (via Groq LLM)

The LLM receives:
- Full JD text (skills, requirements, responsibilities)
- Full resume text (experience, skills, education)

It returns a holistic score (0–100) considering:
- **Skills match** – required vs present skills
- **Experience depth** – years + seniority signals
- **Domain relevance** – industry/role alignment
- **Education** – degree match

Recommendation thresholds set in prompt:
- `≥ 75` → **Strong Fit**
- `50 – 74` → **Moderate Fit**
- `< 50` → **Not Fit**
