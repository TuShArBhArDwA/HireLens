'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import type { ScreeningSession } from '@/lib/supabase';

interface SessionSummary extends ScreeningSession {
  candidateCount?: number;
  topScore?: number;
}

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Your past screening sessions</p>
          </div>
          <Link href="/screen" className="btn btn-primary">
            + New Screening
          </Link>
        </motion.div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p style={{ color: 'var(--text-secondary)' }}>Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-state-icon">🔍</div>
            <h3>No screenings yet</h3>
            <p>Start your first candidate screening to see results here.</p>
            <Link href="/screen" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
              🚀 Screen Candidates
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="session-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {sessions.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Link href={`/results/${s.id}`} className="session-item">
                  <div>
                    <div className="session-title">{s.jd_title}</div>
                    <div className="session-meta">
                      {new Date(s.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        View Results
                      </div>
                    </div>
                    <span className="session-arrow">›</span>
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
