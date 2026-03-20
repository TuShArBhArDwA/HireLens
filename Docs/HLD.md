# HLD – High Level Design

## Overview

**HireLens** is a cloud-native, AI-powered resume screening system that automates the candidate evaluation pipeline for HR teams. It accepts a Job Description (JD) and multiple resumes, processes them through a Large Language Model (Groq), and generates structured, ranked outputs including match scores, strengths, gaps, and fit recommendations.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│              Next.js 14 App (Browser / SSR)                 │
│   ┌──────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│   │  /screen │  │ /results/[id]│  │    /dashboard        │  │
│   │ Upload UI│  │ Results View │  │  Session History     │  │
│   └──────────┘  └──────────────┘  └─────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / API Routes
┌────────────────────────▼────────────────────────────────────┐
│                      API LAYER (Next.js)                    │
│   ┌─────────────────────┐  ┌──────────────────────────┐    │
│   │  POST /api/screen   │  │  GET /api/sessions       │    │
│   │  (Screening Engine) │  │  (History Retrieval)     │    │
│   └──────────┬──────────┘  └──────────────────────────┘    │
└──────────────┼──────────────────────────────────────────────┘
               │
    ┌──────────┴──────────────────────────────┐
    │           PROCESSING PIPELINE           │
    │                                         │
    │  1. Parse resume files (PDF/DOCX/TXT)   │
    │  2. Upload raw files → Cloudinary       │
    │  3. For each resume:                    │
    │     → Build prompt (JD + resume text)   │
    │     → Call Groq LLM API                 │
    │     → Parse structured JSON response    │
    │  4. Rank all candidates by score        │
    │  5. Persist session → Supabase          │
    └─────────────────────────────────────────┘
               │
   ┌───────────┴────────────────────────────────────────────┐
   │                   EXTERNAL SERVICES                     │
   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
   │  │  Clerk   │  │ Supabase │  │Cloudinary│  │  Groq  │ │
   │  │  (Auth)  │  │   (DB)   │  │(Storage) │  │  (LLM) │ │
   │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
   └────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 14 + Motion | UI, routing, animations |
| Authentication | Clerk | User sessions, protected routes |
| AI Engine | Groq (llama-3.3-70b) | Resume analysis, scoring, structured output |
| File Storage | Cloudinary | Resume PDF/DOCX object storage |
| Database | Supabase (PostgreSQL) | Sessions, candidates, results persistence |
| Text Parsing | pdf-parse + mammoth | Extract text from PDF/DOCX/TXT |

---

## Data Flow

```
User Upload
    │
    ▼
Parse File Text  ──────────────►  Cloudinary (file stored)
    │
    ▼
Groq LLM Analysis (per resume)
    │
    ▼
JSON Response: { score, strengths, gaps, recommendation, summary }
    │
    ▼
Rank All Candidates
    │
    ▼
Supabase Insert (session + candidates)
    │
    ▼
Results Dashboard (with Motion animations)
```

---

## Non-Functional Requirements

| NFR | Approach |
|---|---|
| Security | Clerk JWT validation on all API routes |
| Scalability | Groq API handles concurrent requests; Supabase scales automatically |
| Reliability | Each resume processed independently (one failure doesn't kill session) |
| Performance | Groq llama-3.3-70b: ~1–2s per resume |
| Usability | Premium glassmorphism, responsive adaptive layouts, and orchestrated Motion animations |

---

## UI/UX Design Strategy

### 1. Aesthetic Principles
- **Glassmorphism**: Use of `backdrop-filter: blur()`, semi-transparent backgrounds (`var(--glass-bg)`), and thin borders to create a modern, depth-oriented interface.
- **Dark Mode First**: High-contrast, accessibility-focused dark theme with vibrant accent highlights (`#4f46e5`).
- **Space Grotesk Typography**: Modern, technical feel for headers; optimized Inter/System fonts for readability.

### 2. Responsiveness (Mobile Adaptive)
- **Fluid Grids**: Use of `grid-template-columns: repeat(auto-fill, minmax(...))` for dashboards and results to ensure seamless scaling from 320px to 2560px.
- **Adaptive Paddings**: Utility classes (`.section-container`) that adjust internal spacing based on viewport width.
- **Sticky Actions**: Critical UI elements (like "View Resume" in modals) are pinned to the viewport to ensure constant accessibility on small screens.

### 3. Animation Orchestration
- **Sequential Loading**: Staggered list animations using `motion` variants to reduce perceived latency.
- **Contextual Meaning**: Expanding accordions (FAQ) and score rings provide immediate visual feedback for state changes.

---

## Deployment Model

- **Development**: `npm run dev` on localhost:3000
- **Production**: Vercel (recommended for Next.js)
- **DB Hosting**: Supabase cloud
- **File Storage**: Cloudinary cloud
- **LLM**: Groq cloud API

---

## Security Model

- All routes under `/screen`, `/results`, `/dashboard` are Clerk-protected (middleware)
- API routes validate `auth()` from Clerk before processing
- `.env.local` keeps all secrets out of the repository
