'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession } from '@/lib/supabase';
import { Search, ArrowRight, Clock, FileText } from 'lucide-react';

interface SessionSummary extends ScreeningSession {
  candidateCount?: number;
  topScore?: number;
}

const stagger = { animate: { transition: { staggerChildren: 0.065 } } };
const rowVariant = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => { setSessions(data.sessions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <Navbar />

      <div className="container">
        <motion.div
          className="page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: 6 }}>Overview</div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your screening session history</p>
          </div>
          <Link href="/screen" className="btn btn-primary">
            New Screening <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 24 }}>
            <div className="ai-loader-container">
              <div className="ai-loader-ring" />
              <div className="ai-loader-ring" />
              <div className="ai-loader-ring" />
              <div className="ai-loader-pulse" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading sessions…</p>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="empty-state-icon"><Search size={44} /></div>
            <h3>No screenings yet</h3>
            <p>Run your first screening to see candidate results here.</p>
            <Link href="/screen" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
              Screen Candidates <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}
            >
              {sessions.length} session{sessions.length !== 1 ? 's' : ''}
            </motion.p>
            <motion.div
              className="session-list"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {sessions.map((s) => (
                <motion.div key={s.id} variants={rowVariant}>
                  <Link href={`/results/${s.id}`} className="session-item">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'var(--accent-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <FileText size={20} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="session-arrow"><ArrowRight size={16} /></div>
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0, marginTop: 4 }}>
                      <div className="session-title" style={{
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {s.jd_title}
                      </div>
                    </div>

                    <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <div className="session-meta">
                        <Clock size={13} />
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
