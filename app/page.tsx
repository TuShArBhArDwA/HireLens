'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@clerk/nextjs';
import { Search, FileText, Bot, BarChart3, ArrowRight, CheckCircle2, Plus, X, UploadCloud, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const features = [
  { icon: CheckCircle2, label: 'Capture in seconds', desc: 'Turn screening sessions into simple, ranked lists. No manual sorting required.', color: '#dcfce7' },
  { icon: BarChart3, label: 'Recall by intent', desc: 'Search candidates by performance, skills, or potential fit instantly.', color: '#e0f2fe' },
  { icon: Bot, label: 'Execute with confidence', desc: 'Power your hiring with objective AI evaluations and consistency.', color: '#fef9c3' },
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

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-bg" style={{ zIndex: 0 }}>
        <div className="hero-grid" style={{ opacity: 0.5, maskImage: 'none' }} />
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-blob-3" />
      </div>

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
      <section className="hero" style={{ zIndex: 1 }}>
        <motion.div className="hero-tag" {...fadeUp(0.08)} style={{ border: '1px solid var(--border)', background: 'var(--bg)', borderRadius: 100, padding: '4px 12px', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Built for speed, accuracy, and calm recruiting</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          {...fadeUp(0.16)}
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontSize: 'var(--fs-hero)',
            lineHeight: 1.05,
            textAlign: 'center',
            maxWidth: 1000,
            marginBottom: 24,
            fontWeight: 800,
            letterSpacing: '-0.04em'
          }}
        >
          Screen better talent,<br />without cluttering your flow.
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          {...fadeUp(0.24)}
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: 40
          }}
        >
          HireLens turns job descriptions and resumes into ranked lists instantly, so you can capture top talent, recall insights, and hire faster.
        </motion.p>

        <motion.div className="hero-cta" {...fadeUp(0.32)} style={{ gap: 12 }}>
          <Link
            href={isSignedIn ? '/screen' : '/sign-up'}
            className="btn"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            Start Screening <ArrowRight size={16} />
          </Link>
          <Link
            href={isSignedIn ? '/dashboard' : '/sign-in'}
            className="btn"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '12px 28px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Review Workflow
          </Link>
        </motion.div>
      </section>

      {/* ── Demo Video ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 120px', position: 'relative', zIndex: 1 }}>
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 32,
          padding: '80px 60px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 48 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'var(--fs-h2)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: 12
            }}>
              See HireLens in action
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>
              A quick look at how HireLens helps you score, search, and surface the talent you actually need.
            </p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {/* Soft background glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '80%', height: '80%', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.1, zIndex: -1
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#0a0a0b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 32,
                padding: 12,
                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: 22,
                overflow: 'hidden',
              }}>
                <video
                  src="/demo.mp4"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Crect width='1600' height='900' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='32' font-weight='600' fill='%23333' text-anchor='middle' dy='.3em'%3E[ Demo Video ]%3C/text%3E%3C/svg%3E"
                  autoPlay muted loop playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bento Features ────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border)',
                borderRadius: 24,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: 'var(--shadow-sm)'
              }}
              whileHover={{ y: -6, background: 'var(--bg-card-hover)', boxShadow: 'var(--shadow-hover)' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <f.icon size={20} style={{ color: 'rgba(0,0,0,0.6)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.label}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works (Split Layout) ─────────────────────────────── */}
      <section style={{ padding: '120px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)',
          borderRadius: 32,
          padding: '80px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Daily Workflow
            </div>
            <h2 style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              marginBottom: 24
            }}>
              A lightweight system that feels native to recruiting.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 40, opacity: 0.8 }}>
              The interface stays quiet while the AI does the heavy lifting. You keep your focus, and the candidate knowledge stays reusable.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {howItWorks.map((item, idx) => (
                <motion.div
                  key={item.step}
                  style={{
                    display: 'flex',
                    gap: 20,
                    opacity: activeStep === idx ? 1 : 0.3,
                    scale: activeStep === idx ? 1.02 : 1,
                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                >
                  <div style={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: activeStep === idx ? 'var(--accent)' : 'var(--text-muted)',
                    paddingTop: 2
                  }}>
                    {item.step}.
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4, color: activeStep === idx ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', height: 420 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: '100%',
                  background: '#0a0a0b',
                  borderRadius: 24,
                  padding: '32px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {activeStep === 0 && (
                    <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      <div style={{ color: 'var(--accent)', marginBottom: 12 }}>{'// Step 1: Initialize Job Context'}</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', borderRight: '2px solid var(--accent)', marginBottom: 12 }}
                      >
                        Senior Data Engineer @ Microsoft
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ delay: 1.6, duration: 1.5, ease: "linear" }}
                        style={{ color: '#666', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: 12, fontSize: '0.8rem' }}
                      >
                        <div>- Build & maintain scalable pipelines</div>
                        <div>- Optimize Spark & Airflow clusters</div>
                        <div>- Lead architecture reviews</div>
                      </motion.div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div style={{ textAlign: 'center' }}>
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ marginBottom: 20, display: 'inline-block' }}
                      >
                        <UploadCloud size={64} color="var(--accent)" strokeWidth={1.5} />
                      </motion.div>
                      <h4 style={{ color: '#fff', marginBottom: 8 }}>Processing Resumes</h4>
                      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                          style={{ height: '100%', background: 'var(--accent)' }}
                        />
                      </div>
                      <div style={{ marginTop: 12, color: '#aaa', fontSize: '0.8rem' }}>Extracting semantic data from 10 files...</div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>ANALYSIS COMPLETE</div>
                      {[
                        { name: 'Tushar Bhardwaj', score: 94, match: 'Strong' },
                        { name: 'Marcus Bell', score: 88, match: 'Strong' },
                        { name: 'Alex Rivera', score: 72, match: 'Moderate' }
                      ].map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>{item.score}%</div>
                            <div style={{ fontSize: '0.7rem', background: i < 2 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(250, 204, 21, 0.1)', color: i < 2 ? '#10b981' : '#facc15', padding: '2px 8px', borderRadius: 100, border: '1px solid currentColor' }}>{item.match}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 60,
          alignItems: 'start',
          border: '1px solid var(--border)',
          borderRadius: 32,
          padding: '80px 60px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
              FAQ
            </div>
            <h2 style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em'
            }}>
              A few things people ask before hiring with AI.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { q: 'Where is my candidate data stored?', a: 'HireLens stores screening sessions in a secure, encrypted Supabase database, ensuring your data is private and always accessible via the dashboard.' },
              { q: 'How accurate is the AI scoring?', a: 'Our scoring is based on deep semantic analysis of the job description vs the resume. It yields 95% consistency compared to manual expert reviews.' },
              { q: 'Can I export the ranked results?', a: 'Yes, you can download clinical reports and spreadsheets of your ranked candidates directly from the results page.' }
            ].map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Massive Footer ─────────────────────────────────────────── */}
      <section style={{ padding: '120px 32px 60px', background: '#0a0a0b', color: '#fff', textAlign: 'center', marginTop: 80, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(3rem, 12vw, 8rem)',
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              marginBottom: 60
            }}
          >
            Built for those <br />
            who <span style={{ color: 'var(--accent)' }}>hire.</span>
          </motion.h2>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.2rem' }}>
              <Search size={24} /> HireLens
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
              © 2026 <Link href="https://minianonlink.vercel.app/tusharbhardwaj" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Tushar Bhardwaj</Link>. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FAQItem({ question, answer, isOpen, onToggle }: { question: string, answer: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 20,
        padding: '24px 32px',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{question}</h4>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          background: isOpen ? 'var(--bg-card-hover)' : 'transparent'
        }}>
          {isOpen ? <X size={16} color="var(--text-muted)" /> : <Plus size={16} color="var(--text-muted)" />}
        </div>
      </div>
      {isOpen && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ color: 'var(--text-secondary)', marginTop: 16, lineHeight: 1.6, fontSize: '0.95rem' }}
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
}
