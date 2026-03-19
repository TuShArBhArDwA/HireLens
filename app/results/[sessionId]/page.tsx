'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession, Candidate } from '@/lib/supabase';
import { getInlineUrl } from '@/lib/utils';
import { CheckCircle2, Zap, XCircle, FileText, FileSearch, Download } from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 75) return 'var(--strong)';
  if (score >= 50) return 'var(--moderate)';
  return 'var(--not-fit)';
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (displayed / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    let start = 0;
    const step = score / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(start));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="score-ring-container">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDash}
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span className="score-ring-value" style={{ color, fontSize: size < 70 ? '1.2rem' : undefined }}>
          {displayed}
        </span>
        <span className="score-ring-label">Score</span>
      </div>
    </div>
  );
}

function RecommendationBadge({ rec }: { rec: string }) {
  const cls =
    rec === 'Strong Fit'
      ? 'badge-strong'
      : rec === 'Moderate Fit'
      ? 'badge-moderate'
      : 'badge-not-fit';
  const icon = rec === 'Strong Fit' ? <CheckCircle2 size={16} /> : rec === 'Moderate Fit' ? <Zap size={16} /> : <XCircle size={16} />;
  return <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{icon} {rec}</span>;
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
  return <div className={`rank-badge ${cls}`}>#{rank}</div>;
}

function CandidateDetailCard({ c, onClose }: { c: Candidate; onClose: () => void }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="candidate-header" style={{ marginBottom: 20 }}>
          <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
            <ScoreRing score={c.score} size={90} />
          </div>
          <div className="candidate-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <RankBadge rank={c.rank} />
              <h2 className="candidate-name" style={{ fontSize: '1.2rem' }}>{c.name}</h2>
            </div>
            <div style={{ marginTop: 8 }}>
              <RecommendationBadge rec={c.recommendation} />
            </div>
            <p className="candidate-summary" style={{ marginTop: 10 }}>{c.summary}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="strengths-gaps">
          <div className="sg-section">
            <h4 className="strengths-title">Key Strengths</h4>
            <ul className="sg-list">
              {c.strengths.map((s, i) => (
                <li key={i} className="strength-item">{s}</li>
              ))}
            </ul>
          </div>
          <div className="sg-section">
            <h4 className="gaps-title">Key Gaps</h4>
            <ul className="sg-list">
              {c.gaps.map((g, i) => (
                <li key={i} className="gap-item">{g}</li>
              ))}
            </ul>
          </div>
        </div>

        {c.file_url && (
          <div style={{ marginTop: 20 }}>
            <a
              href={getInlineUrl(c.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', padding: '8px 16px' }}
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
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const exportCSV = () => {
    if (!session?.candidates) return;
    const headers = ['Rank', 'Name', 'Score', 'Recommendation', 'Strengths', 'Gaps', 'Summary'];
    const rows = session.candidates.map((c) => [
      c.rank,
      c.name,
      c.score,
      c.recommendation,
      c.strengths.join(' | '),
      c.gaps.join(' | '),
      c.summary,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hirelens-results-${sessionId.slice(0, 8)}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="loading-overlay">
          <div className="spinner" />
          <p style={{ color: 'var(--text-secondary)' }}>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.candidates?.length) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar />
        <div className="container">
          <div className="empty-state" style={{ marginTop: 60 }}>
            <div className="empty-state-icon"><FileSearch size={48} /></div>
            <h3>Results not found</h3>
            <p>This session may have expired or doesn't exist.</p>
            <button onClick={() => router.push('/screen')} className="btn btn-primary" style={{ marginTop: 20 }}>
              Start New Screening
            </button>
          </div>
        </div>
      </div>
    );
  }

  const candidates = session.candidates;
  const avgScore = Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length);
  const strongFit = candidates.filter((c) => c.recommendation === 'Strong Fit').length;
  const topCandidate = candidates[0];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <Navbar />

      <div className="container">
        {/* Header */}
        <motion.div
          className="page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="page-title">{session.jd_title}</h1>
            <p className="page-subtitle">
              {new Date(session.created_at).toLocaleDateString('en-US', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={exportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={16} /> Export CSV
            </button>
            <button onClick={() => router.push('/screen')} className="btn btn-primary">
              + New Screening
            </button>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="stats-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { value: candidates.length, label: 'Candidates' },
            { value: avgScore, label: 'Avg Score' },
            { value: strongFit, label: 'Strong Fits' },
            { value: topCandidate.name.split(' ')[0], label: 'Top Candidate' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: 40 }}
        >
          <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 16, fontSize: '1.1rem' }}>
            Candidate Rankings
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th>Strengths</th>
                  <th>Gaps</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><RankBadge rank={c.rank} /></td>
                    <td>
                      <strong style={{ fontFamily: 'Space Grotesk' }}>{c.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: getScoreColor(c.score) }}>
                        {c.score}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {c.strengths[0]}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {c.gaps[0]}
                      </span>
                    </td>
                    <td><RecommendationBadge rec={c.recommendation} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.77rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Click any row to see full candidate details
          </p>
        </motion.div>

        {/* Candidate Cards Grid */}
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, marginBottom: 20, fontSize: '1.1rem' }}>
          Candidate Details
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              className="candidate-card-detail"
              onClick={() => setSelected(c)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <div className="candidate-header">
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                  <ScoreRing score={c.score} size={72} />
                </div>
                <div className="candidate-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <RankBadge rank={c.rank} />
                    <span className="candidate-name">{c.name}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <RecommendationBadge rec={c.recommendation} />
                  </div>
                </div>
              </div>

              <div className="strengths-gaps">
                <div className="sg-section">
                  <h4 className="strengths-title">Strengths</h4>
                  <ul className="sg-list">
                    {c.strengths.slice(0, 2).map((s, j) => (
                      <li key={j} className="strength-item">{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="sg-section">
                  <h4 className="gaps-title">Gaps</h4>
                  <ul className="sg-list">
                    {c.gaps.slice(0, 2).map((g, j) => (
                      <li key={j} className="gap-item">{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selected && (
          <CandidateDetailCard c={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
