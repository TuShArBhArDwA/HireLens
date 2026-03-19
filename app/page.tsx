'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@clerk/nextjs';

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const features = [
    'Match Score 0–100',
    'Key Strengths & Gaps',
    'Candidate Ranking',
    'Strong / Moderate / Not Fit',
  ];

  return (
    <main>
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          🔍 <span>HireLens</span>
        </Link>
        <div className="navbar-links">
          {isSignedIn ? (
            <>
              <Link href="/screen" className="nav-link">Screen</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/screen" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Get Started →
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-link">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Get Started →
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />

        <motion.div
          className="hero-tag"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ✦ AI-Powered · Groq LLM · Instant Results
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Screen Resumes<br />10× Faster with AI
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Upload your Job Description and up to 10 resumes. HireLens uses Groq LLM to
          score, rank, and surface key insights for every candidate — in seconds.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href={isSignedIn ? '/screen' : '/sign-up'} className="btn btn-primary">
            🚀 Start Screening
          </Link>
          <Link href={isSignedIn ? '/dashboard' : '/sign-in'} className="btn btn-secondary">
            View Dashboard
          </Link>
        </motion.div>

        <motion.div
          className="hero-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {features.map((f) => (
            <div className="hero-feature" key={f}>
              <div className="hero-feature-dot" />
              {f}
            </div>
          ))}
        </motion.div>

        {/* Info cards */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginTop: 64,
            width: '100%',
            maxWidth: 900,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          {[
            { icon: '📄', title: 'Upload Resumes', desc: 'PDF, DOCX, or TXT — drag & drop up to 10 files' },
            { icon: '🤖', title: 'AI Analysis', desc: 'Groq LLM evaluates each resume against your JD' },
            { icon: '📊', title: 'Ranked Results', desc: 'Instant ranked dashboard with scores and insights' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="card"
              style={{ textAlign: 'center' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
