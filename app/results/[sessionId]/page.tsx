'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession, Candidate } from '@/lib/supabase';
import { getViewerUrl } from '@/lib/utils';
import { CheckCircle2, Zap, XCircle, FileText, FileSearch, Download, ArrowLeft, ArrowRight, Users, Target, Gauge, Award } from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 75) return 'var(--strong)';
  if (score >= 50) return 'var(--moderate)';
  return 'var(--not-fit)';
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (displayed / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    let start = 0;
    const step = score / 45;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(Math.round(start));
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="score-ring-container">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={5} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDash}
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="score-ring-value" style={{ color, fontSize: size < 70 ? '1.1rem' : undefined }}>{displayed}</span>
        <span className="score-ring-label">Score</span>
      </div>
    </div>
  );
}

function RecommendationBadge({ rec }: { rec: string }) {
  const cls = rec === 'Strong Fit' ? 'badge-premium-strong' : rec === 'Moderate Fit' ? 'badge-premium-moderate' : 'badge-premium-not-fit';
  const icon = rec === 'Strong Fit' ? <CheckCircle2 size={13} /> : rec === 'Moderate Fit' ? <Zap size={13} /> : <XCircle size={13} />;
  return <span className={`badge-premium ${cls}`}>{icon} {rec}</span>;
}

function StatCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1500;
    const end = value;
    if (end === 0) return;
    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{current}{suffix}</>;
}

function RankBadge({ rank }: { rank: number }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
  return <div className={`rank-badge ${cls}`} style={{ border: rank <= 3 ? 'none' : undefined }}>#{rank}</div>;
}

function CandidateDetailCard({ c, onClose }: { c: Candidate; onClose: () => void }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        style={{ padding: 0, overflow: 'hidden', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '32px 32px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
                <ScoreRing score={c.score} size={84} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <RankBadge rank={c.rank} />
                  <h2 style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)'
                  }}>{c.name}</h2>
                </div>
                <RecommendationBadge rec={c.recommendation} />
              </div>
            </div>
            <button className="modal-close" onClick={onClose} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--text-muted)' }}>×</button>
          </div>

          {c.summary && (
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 28,
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}>
              {c.summary}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1fr)', gap: 32, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 20, padding: 24 }}>
            <div className="sg-section">
              <h4 className="strengths-title" style={{ fontSize: '0.75rem', marginBottom: 12 }}>Key Strengths</h4>
              <ul className="sg-list" style={{ gap: 6 }}>
                {c.strengths.map((s, i) => <li key={i} className="strength-item" style={{ padding: '8px 12px' }}>{s}</li>)}
              </ul>
            </div>
            <div style={{ background: 'var(--border)' }} />
            <div className="sg-section">
              <h4 className="gaps-title" style={{ fontSize: '0.75rem', marginBottom: 12 }}>Key Gaps</h4>
              <ul className="sg-list" style={{ gap: 6 }}>
                {c.gaps.map((g, i) => <li key={i} className="gap-item" style={{ padding: '8px 12px' }}>{g}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {c.file_url && (
          <div style={{ padding: '20px 32px', background: 'var(--glass-bg-hover)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <a
              href={getViewerUrl(c.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ gap: 10, padding: '10px 20px' }}
            >
              <FileText size={16} /> View Resume
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { sessionId } = useParams() as { sessionId: string };
  const router = useRouter();
  const [session, setSession] = useState<ScreeningSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Candidate | null>(null);

  useEffect(() => {
    fetch(`/api/sessions?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setSession(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const exportCSV = () => {
    if (!session?.candidates) return;
    const headers = ['Rank', 'Name', 'Score', 'Recommendation', 'Strengths', 'Gaps', 'Summary'];
    const rows = session.candidates.map((c) => [
      c.rank, c.name, c.score, c.recommendation,
      c.strengths.join(' | '), c.gaps.join(' | '), c.summary,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirelens-${sessionId.slice(0, 8)}.csv`;
    a.click();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="results-gradient" />
      <Navbar />
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        minHeight: '70vh', gap: 32 
      }}>
        <div className="ai-loader-container">
          <div className="ai-loader-ring" />
          <div className="ai-loader-ring" />
          <div className="ai-loader-ring" />
          <div className="ai-loader-pulse" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 8, fontFamily: 'var(--font-space-grotesk)' }}>
            Loading High-Match Results...
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Fetching the latest performance stats and evaluations.
          </p>
        </div>
      </div>
    </div>
  );

  if (!session || !session.candidates?.length) return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container">
        <div className="empty-state" style={{ marginTop: 60 }}>
          <div className="empty-state-icon"><FileSearch size={48} /></div>
          <h3>Results not found</h3>
          <p>This session may have expired or doesn&apos;t exist.</p>
          <button onClick={() => router.push('/screen')} className="btn btn-primary" style={{ marginTop: 20 }}>
            Start New Screening
          </button>
        </div>
      </div>
    </div>
  );

  const candidates = session.candidates;
  const avgScore = Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length);
  const strongFit = candidates.filter((c) => c.recommendation === 'Strong Fit').length;
  const topCandidate = candidates[0];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, position: 'relative' }}>
      <div className="results-gradient" />
      <Navbar />

      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', cursor: 'pointer',
                color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600,
                padding: '6px 14px', borderRadius: 12, transition: 'all 0.2s',
                marginBottom: 20
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-light)';
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="page-title" style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{session.jd_title}</h1>
            <p className="page-subtitle" style={{ fontSize: '1rem', marginTop: 8 }}>
              Ranked results from {new Date(session.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, paddingTop: 32 }}>
            <button onClick={exportCSV} className="btn btn-secondary" style={{ borderRadius: 12, padding: '10px 18px' }}>
              <Download size={15} /> Export CSV
            </button>
            <button onClick={() => router.push('/screen')} className="btn btn-primary" style={{ borderRadius: 12, padding: '10px 18px' }}>
              + New Screening
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="stats-bar"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 56 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { value: candidates.length, label: 'Candidates', icon: <Users size={16} /> },
            { value: avgScore, suffix: '%', label: 'Efficiency', icon: <Gauge size={16} /> },
            { value: strongFit, label: 'High Match', icon: <Target size={16} /> },
            { value: topCandidate.name.split(' ')[0], label: 'Top Pick', icon: <Award size={16} /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item-premium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <div style={{ position: 'absolute', top: 16, right: 16, color: 'var(--accent)', opacity: 0.5 }}>
                {stat.icon}
              </div>
              <div className="stat-value" style={{ fontSize: typeof stat.value === 'string' && stat.value.length > 6 ? '1.5rem' : undefined }}>
                {typeof stat.value === 'number' ? (
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
            <div>
              <div className="section-label" style={{ letterSpacing: '0.15em' }}>Leaderboard</div>
              <div className="section-title" style={{ fontSize: '1.5rem' }}>Top Rankings</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Click rows for deep analysis</p>
          </div>
          <div className="table-wrapper" style={{ borderRadius: 24, padding: 8, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
              <thead>
                <tr>
                  <th style={{ background: 'transparent', padding: '16px' }}>Rank</th>
                  <th style={{ background: 'transparent' }}>Candidate</th>
                  <th style={{ background: 'transparent' }}>Match Score</th>
                  <th style={{ background: 'transparent', minWidth: 200 }}>Principal Strength</th>
                  <th style={{ background: 'transparent', minWidth: 200 }}>Primary Gap</th>
                  <th style={{ background: 'transparent' }}>Stability</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    className={
                      c.rank === 1 ? 'row-rank-1' :
                      c.rank === 2 ? 'row-rank-2' :
                      c.rank === 3 ? 'row-rank-3' : undefined
                    }
                    onClick={() => setSelected(c)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '16px', borderBottom: 'none' }}><RankBadge rank={c.rank} /></td>
                    <td style={{ borderBottom: 'none' }}>
                      <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {c.name}
                      </span>
                    </td>
                    <td style={{ borderBottom: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                            style={{ height: '100%', background: getScoreColor(c.score) }} 
                          />
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-space-grotesk), sans-serif',
                          fontWeight: 700, fontSize: '1.1rem',
                          color: getScoreColor(c.score),
                        }}>
                          {c.score}%
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderBottom: 'none' }}>
                      {c.strengths[0]}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderBottom: 'none' }}>
                      {c.gaps[0]}
                    </td>
                    <td style={{ borderBottom: 'none' }}><RecommendationBadge rec={c.recommendation} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Candidate Cards Grid */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-label" style={{ letterSpacing: '0.15em' }}>Evaluation</div>
          <div className="section-title" style={{ fontSize: '1.5rem' }}>Detailed Profiles</div>
        </div>
        <div className="results-grid" style={{ gap: 24 }}>
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              className="card-premium"
              onClick={() => setSelected(c)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div className="candidate-header" style={{ marginBottom: 24 }}>
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <ScoreRing score={c.score} size={72} />
                </div>
                <div className="candidate-info" style={{ gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <RankBadge rank={c.rank} />
                    <span className="candidate-name" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{c.name}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <RecommendationBadge rec={c.recommendation} />
                  </div>
                </div>
              </div>

              {c.summary && (
                <p className="candidate-summary" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.summary}
                </p>
              )}

              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                View Full Analysis <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <CandidateDetailCard c={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}


