'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@clerk/nextjs';
import { Search, FileText, Bot, BarChart3, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const features = [
  { icon: CheckCircle2, label: 'Match Score 0–100' },
  { icon: BarChart3, label: 'Candidate Ranking' },
  { icon: Bot, label: 'Strength & Gap Analysis' },
  { icon: Sparkles, label: 'AI Recommendations' },
];

const howItWorks = [
  {
    step: '01',
    icon: FileText,
    title: 'Paste Your Job Description',
    desc: 'Add your role title, responsibilities, and requirements. We handle the rest.',
  },
  {
    step: '02',
    icon: BarChart3,
    title: 'Upload Candidate Resumes',
    desc: 'Drag & drop up to 10 resumes in PDF, DOCX, or TXT — no formatting required.',
  },
  {
    step: '03',
    icon: Bot,
    title: 'Get Instant AI Rankings',
    desc: 'Every candidate is scored, ranked, and analyzed with key strengths and gaps.',
  },
];

const outcomes = [
  { value: '10x', label: 'Faster Screening' },
  { value: '<30s', label: 'Per Candidate' },
  { value: '100%', label: 'Consistent Scoring' },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="navbar-logo">
          <Search size={18} strokeWidth={2.5} />
          HireLens
        </Link>
        <div className="navbar-links">
          <ThemeToggle />
          <div className="nav-divider" />
          {isSignedIn ? (
            <>
              <Link href="/screen" className="nav-link">Screen</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/screen" className="btn btn-primary" style={{ marginLeft: 4 }}>
                Go to App <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-link">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary" style={{ marginLeft: 4 }}>
                Get Started <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="hero-blob-3" />
        </div>

        <motion.div className="hero-tag" {...fadeUp(0.08)}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--strong)', boxShadow: '0 0 8px var(--strong)' }} />
          AI-Powered Resume Intelligence
        </motion.div>

        <motion.h1 className="hero-title" {...fadeUp(0.16)}>
          Hire Smarter.<br />Screen Faster.
        </motion.h1>

        <motion.p className="hero-subtitle" {...fadeUp(0.24)}>
          Upload your job description and up to 10 resumes.
          HireLens scores, ranks, and surfaces key insights on every candidate — in seconds.
        </motion.p>

        <motion.div className="hero-cta" {...fadeUp(0.32)}>
          <Link
            href={isSignedIn ? '/screen' : '/sign-up'}
            className="btn btn-primary btn-lg"
          >
            Start Screening <ArrowRight size={15} />
          </Link>
          <Link
            href={isSignedIn ? '/dashboard' : '/sign-in'}
            className="btn btn-secondary btn-lg"
          >
            View Dashboard
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div className="hero-features" {...fadeUp(0.42)}>
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="hero-feature">
              <Icon size={13} style={{ color: 'var(--accent)' }} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Outcome stats */}
        <motion.div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 64,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
          {...fadeUp(0.50)}
        >
          {outcomes.map((o) => (
            <div key={o.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-space-grotesk,\'Space Grotesk\'), sans-serif',
                fontSize: '1.7rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}>
                {o.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
                {o.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', position: 'relative' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 56 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 10 }}>
              How It Works
            </div>
            <h2 style={{
              fontFamily: 'var(--font-space-grotesk,\'Space Grotesk\'), sans-serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}>
              From JD to ranked results in three steps
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                className="card"
                style={{ textAlign: 'left', position: 'relative', overflow: 'hidden', padding: 28 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontFamily: '\'Space Grotesk\', sans-serif', fontWeight: 700,
                  fontSize: '2.2rem', color: 'var(--border)',
                  lineHeight: 1, letterSpacing: '-0.05em', userSelect: 'none',
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <item.icon size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{
                  fontFamily: '\'Space Grotesk\', sans-serif', fontWeight: 700,
                  fontSize: '0.97rem', marginBottom: 8, letterSpacing: '-0.015em',
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.835rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
