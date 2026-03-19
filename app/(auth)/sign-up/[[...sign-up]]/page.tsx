import { SignUp } from '@clerk/nextjs';

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
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            🔍 <span className="text-gradient">HireLens</span>
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
