'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@clerk/nextjs';
import { Search, FileText, Bot, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
});

const features = [
  { icon: FileText, label: 'Match Score 0–100' },
  { icon: BarChart3, label: 'Candidate Ranking' },
  { icon: Bot, label: 'Strength & Gap Analysis' },
  { icon: Sparkles, label: 'Instant Recommendations' },
];

const howItWorks = [
  {
    step: '01',
    icon: FileText,
    title: 'Upload Your JD',
    desc: 'Paste your job description — responsibilities, requirements, and nice-to-haves.',
  },
  {
    step: '02',
    icon: BarChart3,
    title: 'Add Candidate Resumes',
    desc: 'Upload up to 10 resumes in PDF, DOCX or TXT format via drag & drop.',
  },
  {
    step: '03',
    icon: Bot,
    title: 'Get Ranked Results',
    desc: 'Every candidate is scored, ranked, and analyzed with key strengths and gaps.',
  },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Navbar ─────────────────────────────────── */}
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="navbar-logo">
          <Search size={20} />
          HireLens
        </Link>
        <div className="navbar-links">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Link href="/screen" className="nav-link">Screen</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/screen" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.83rem' }}>
                Go to App <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-link">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.83rem' }}>
                Get Started <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
        </div>

        <motion.div className="hero-tag" {...fadeUp(0.1)}>
          <Sparkles size={12} />
          AI-Powered Resume Intelligence
        </motion.div>

        <motion.h1 className="hero-title" {...fadeUp(0.18)}>
          Hire Smarter.<br />Screen Faster.
        </motion.h1>

        <motion.p className="hero-subtitle" {...fadeUp(0.26)}>
          Upload your job description and up to 10 resumes. HireLens automatically
          scores, ranks, and surfaces key insights on every candidate — in seconds.
        </motion.p>

        <motion.div className="hero-cta" {...fadeUp(0.34)}>
          <Link href={isSignedIn ? '/screen' : '/sign-up'} className="btn btn-primary" style={{ padding: '11px 24px', fontSize: '0.95rem' }}>
            Start Screening <ArrowRight size={16} />
          </Link>
          <Link href={isSignedIn ? '/dashboard' : '/sign-in'} className="btn btn-secondary" style={{ padding: '11px 24px', fontSize: '0.95rem' }}>
            View Dashboard
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div className="hero-features" {...fadeUp(0.44)}>
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="hero-feature">
              <Icon size={13} style={{ color: 'var(--accent)' }} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* How it works cards */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 72,
            width: '100%',
            maxWidth: 840,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              className="card"
              style={{ textAlign: 'left', position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: '1.8rem', color: 'var(--border)',
                lineHeight: 1, letterSpacing: '-0.04em',
              }}>
                {item.step}
              </div>
              <item.icon size={24} style={{ color: 'var(--accent)', marginBottom: 14 }} />
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, letterSpacing: '-0.01em' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
