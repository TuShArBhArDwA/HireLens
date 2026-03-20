import { SignUp } from '@clerk/nextjs';
import { Search } from 'lucide-react';

export default function SignUpPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '20px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '2.1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 8,
            }}
          >
            <Search size={32} strokeWidth={2.5} style={{ color: 'var(--accent)' }} /> 
            <span className="text-gradient">HireLens</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Create your account to get started
          </p>
        </div>
        <SignUp />
      </div>
    </main>
  );
}
