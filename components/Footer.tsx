'use client';

export function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px 24px',
      borderTop: '1px solid var(--border)',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      letterSpacing: '0.01em',
    }}>
      Made with 💙 by{' '}
      <a
        href="https://minianonlink.vercel.app/tusharbhardwaj"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Tushar Bhardwaj
      </a>
    </footer>
  );
}
