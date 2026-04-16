import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

const clerkAppearance = {
  variables: {
    colorPrimary: '#c8a96e',
    colorBackground: '#111111',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255,255,255,0.45)',
    colorInputBackground: '#1a1a1a',
    colorInputText: '#ffffff',
    colorNeutral: '#2a2a2a',
    borderRadius: '0px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
  },
  elements: {
    rootBox: { width: '100%' },
    card: {
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0',
      width: '100%',
      padding: '0',
    },
    headerTitle: { display: 'none' },
    headerSubtitle: { display: 'none' },
    header: { display: 'none' },
    socialButtonsBlockButton: {
      border: '1px solid #2a2a2a',
      backgroundColor: 'transparent',
      color: '#fff',
      borderRadius: '0',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      letterSpacing: '0.08em',
      transition: 'border-color 0.2s ease',
    },
    dividerLine: { backgroundColor: '#1e1e1e' },
    dividerText: { color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' },
    formFieldLabel: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: '0.6rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '600',
    },
    formFieldInput: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#fff',
      borderRadius: '0',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.85rem',
      outline: 'none',
    },
    formButtonPrimary: {
      backgroundColor: '#c8a96e',
      color: '#000',
      fontFamily: 'Inter, sans-serif',
      fontWeight: '700',
      fontSize: '0.7rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      borderRadius: '0',
      boxShadow: 'none',
    },
    footerActionLink: { color: '#c8a96e' },
    footerActionText: { color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' },
    footer: { backgroundColor: 'transparent', borderTop: '1px solid #1e1e1e', marginTop: '1rem' },
    identityPreviewEditButton: { color: '#c8a96e' },
    otpCodeFieldInput: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #2a2a2a',
      color: '#fff',
      borderRadius: '0',
    },
    formFieldInputShowPasswordButton: { color: 'rgba(255,255,255,0.3)' },
    internal_backArrow: { color: '#c8a96e' },
  },
}

export default function SignInPage() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}
      className="auth-grid"
    >
      {/* LEFT — Brand panel */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        borderRight: '1px solid #1a1a1a',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%)',
          bottom: '-100px', left: '-100px', pointerEvents: 'none',
        }} />
        {/* Ghost text */}
        <div style={{
          position: 'absolute', fontFamily: 'var(--font-bebas)',
          fontSize: '16rem', color: 'transparent',
          WebkitTextStroke: '1px rgba(200,169,110,0.04)',
          userSelect: 'none', lineHeight: 1,
          right: '-2rem', bottom: '-1rem', pointerEvents: 'none',
        }}>L9</div>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.06em', color: '#fff', lineHeight: 1 }}>LATE90S</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.45rem', letterSpacing: '0.4em', color: '#c8a96e', textTransform: 'uppercase' }}>EST. 2026</div>
        </Link>

        {/* Main text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            backgroundColor: 'rgba(200,169,110,0.08)',
            border: '1px solid rgba(200,169,110,0.2)',
            padding: '0.35rem 0.9rem', marginBottom: '2rem',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#c8a96e', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.28em', color: '#c8a96e', textTransform: 'uppercase' }}>Members Only</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3rem, 5vw, 5.5rem)',
            color: '#fff', lineHeight: 0.92, letterSpacing: '0.01em', marginBottom: '1.5rem',
          }}>
            Welcome<br /><span style={{ color: '#c8a96e' }}>Back.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.85, maxWidth: '320px' }}>
            Sign in to track your orders, save favourite pieces, and get early access to new drops.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', position: 'relative', zIndex: 1 }}>
          {[['500+', 'Orders Shipped'], ['98%', 'Satisfaction'], ['25+', 'Designs']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#fff', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2rem', backgroundColor: '#0a0a0a',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.8rem', color: '#fff', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '0.4rem' }}>
            Sign In
          </h2>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
            No account yet?{' '}
            <Link href="/sign-up" style={{ color: '#c8a96e', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
          </p>
          <SignIn routing="hash" appearance={clerkAppearance} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-grid > div:first-child { display: none !important; }
        }
      `}</style>
    </main>
  )
}
