import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
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
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            🔍 <span className="text-gradient">HireLens</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to start screening candidates
          </p>
        </div>
        <SignIn />
      </div>
    </main>
  );
}
