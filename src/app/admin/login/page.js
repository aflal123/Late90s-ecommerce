'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Incorrect password. Try again.')
        setPassword('')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }

    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '3.5rem',
            color: '#ffffff',
            letterSpacing: '0.06em',
            lineHeight: 1,
          }}>LATE90S</div>
          <div style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.55rem',
            letterSpacing: '0.45em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginTop: '0.4rem',
          }}>Admin Access</div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#1a1a1a', marginBottom: '2.5rem' }} />

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '0.5rem',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Enter admin password"
              required
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#0d0d0d',
                border: `1px solid ${error ? '#dc5050' : '#1f1f1f'}`,
                color: '#ffffff',
                padding: '0.85rem 1rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                letterSpacing: '0.1em',
              }}
              onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.3)' }}
              onBlur={e  => { if (!error) e.target.style.borderColor = '#1f1f1f' }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.68rem',
              color: '#dc5050',
              letterSpacing: '0.05em',
            }}>{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              marginTop: '0.5rem',
              backgroundColor: loading || !password ? '#1a1a1a' : '#ffffff',
              color: loading || !password ? 'rgba(255,255,255,0.25)' : '#000',
              border: 'none',
              padding: '1rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          marginTop: '2.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.55rem',
          color: 'rgba(255,255,255,0.12)',
          letterSpacing: '0.1em',
        }}>
          Restricted access. Unauthorised entry is prohibited.
        </p>
      </div>
    </main>
  )
}
