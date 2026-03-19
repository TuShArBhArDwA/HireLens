'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession } from '@/lib/supabase';
import { Search, ArrowRight, Clock } from 'lucide-react';

interface SessionSummary extends ScreeningSession {
  candidateCount?: number;
  topScore?: number;
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const rowVariant = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <Navbar />

      <div className="container">
        <motion.div
          className="page-header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your past screening sessions</p>
          </div>
          <Link href="/screen" className="btn btn-primary">
            New Screening <ArrowRight size={15} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading sessions…</p>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="empty-state-icon">
              <Search size={44} />
            </div>
            <h3>No screenings yet</h3>
            <p>Start your first candidate screening to see results here.</p>
            <Link href="/screen" className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
              Screen Candidates <ArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="session-list"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {sessions.map((s) => (
              <motion.div key={s.id} variants={rowVariant}>
                <Link href={`/results/${s.id}`} className="session-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(79,70,229,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Search size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <div className="session-title">{s.jd_title}</div>
                      <div className="session-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>View Results</span>
                    <span className="session-arrow"><ArrowRight size={16} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
