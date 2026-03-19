'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession, Candidate } from '@/lib/supabase';
import { getViewerUrl } from '@/lib/utils';
import { CheckCircle2, Zap, XCircle, FileText, FileSearch, Download, ArrowLeft } from 'lucide-react';

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
  const cls = rec === 'Strong Fit' ? 'badge-strong' : rec === 'Moderate Fit' ? 'badge-moderate' : 'badge-not-fit';
  const icon = rec === 'Strong Fit' ? <CheckCircle2 size={12} /> : rec === 'Moderate Fit' ? <Zap size={12} /> : <XCircle size={12} />;
  return <span className={`badge ${cls}`}>{icon} {rec}</span>;
}

function RankBadge({ rank }: { rank: number }) {
  const cls = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
  return <div className={`rank-badge ${cls}`}>#{rank}</div>;
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
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <ScoreRing score={c.score} size={80} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <RankBadge rank={c.rank} />
                <h2 style={{
                  fontFamily: '\'Space Grotesk\', sans-serif',
                  fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em',
                }}>{c.name}</h2>
              </div>
              <RecommendationBadge rec={c.recommendation} />
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ flexShrink: 0, marginLeft: 12 }}>×</button>
        </div>

        {c.summary && (
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: '0.845rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}>
            {c.summary}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1fr)', gap: 24 }}>
          <div className="sg-section">
            <h4 className="strengths-title">Key Strengths</h4>
            <ul className="sg-list">
              {c.strengths.map((s, i) => <li key={i} className="strength-item">{s}</li>)}
            </ul>
          </div>
          <div style={{ background: 'var(--border)' }} />
          <div className="sg-section">
            <h4 className="gaps-title">Key Gaps</h4>
            <ul className="sg-list">
              {c.gaps.map((g, i) => <li key={i} className="gap-item">{g}</li>)}
            </ul>
          </div>
        </div>

        {c.file_url && (
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <a
              href={getViewerUrl(c.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ gap: 8 }}
            >
              <FileText size={15} /> View Resume PDF
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
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="loading-overlay">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading results…</p>
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
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <Navbar />

      <div className="container">
        {/* Page Header */}
        <motion.div
          className="page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer',
                color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600,
                padding: '5px 12px', borderRadius: 999, transition: 'all 0.2s',
                marginBottom: 16
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--accent-light)';
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.borderColor = 'var(--accent-light)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="page-title">{session.jd_title}</h1>
            <p className="page-subtitle">
              {new Date(session.created_at).toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 28 }}>
            <button onClick={exportCSV} className="btn btn-secondary">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => router.push('/screen')} className="btn btn-primary">
              + New Screening
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="stats-bar"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { value: candidates.length, label: 'Candidates' },
            { value: `${avgScore}/100`, label: 'Avg Score' },
            { value: strongFit, label: 'Strong Fits' },
            { value: topCandidate.name.split(' ')[0], label: '#1 Candidate' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07 }}
            >
              <div className="stat-value" style={{ fontSize: typeof stat.value === 'string' && stat.value.length > 4 ? '1.3rem' : undefined }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div className="section-label">Rankings</div>
              <div className="section-title">All Candidates</div>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Click a row for full details</p>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th style={{ minWidth: 200 }}>Top Strength</th>
                  <th style={{ minWidth: 200 }}>Top Gap</th>
                  <th>Fit</th>
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
                    transition={{ delay: 0.28 + i * 0.06 }}
                  >
                    <td><RankBadge rank={c.rank} /></td>
                    <td>
                      <span style={{ fontFamily: '\'Space Grotesk\',sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
                        {c.name}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontFamily: '\'Space Grotesk\',sans-serif',
                        fontWeight: 700, fontSize: '1.05rem',
                        color: getScoreColor(c.score),
                      }}>
                        {c.score}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {c.strengths[0]}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {c.gaps[0]}
                    </td>
                    <td><RecommendationBadge rec={c.recommendation} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Candidate Cards Grid */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label">Deep Dive</div>
          <div className="section-title">Candidate Details</div>
        </div>
        <div className="results-grid">
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              className="candidate-card-detail"
              onClick={() => setSelected(c)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.06 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
            >
              <div className="candidate-header">
                <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
                  <ScoreRing score={c.score} size={68} />
                </div>
                <div className="candidate-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <RankBadge rank={c.rank} />
                    <span className="candidate-name">{c.name}</span>
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <RecommendationBadge rec={c.recommendation} />
                  </div>
                </div>
              </div>

              {c.summary && (
                <p className="candidate-summary">{c.summary}</p>
              )}



              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 16 }}>
                <FileText size={14} /> Click to view full profile
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
