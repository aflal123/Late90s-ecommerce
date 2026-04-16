'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '80px',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Ghost 404 */}
      <div style={{
        position: 'absolute',
        fontFamily: 'var(--font-bebas)',
        fontSize: 'clamp(16rem, 35vw, 32rem)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(200,169,110,0.04)',
        userSelect: 'none', lineHeight: 1,
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>404</div>

      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem' }}>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            backgroundColor: 'rgba(200,169,110,0.08)',
            border: '1px solid rgba(200,169,110,0.2)',
            padding: '0.35rem 0.9rem', marginBottom: '2rem',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--gold)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            Page Not Found
          </span>
        </motion.div>

        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          {['Lost in', 'The Void.'].map((line, i) => (
            <motion.h1
              key={i}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 7vw, 7rem)',
                color: i === 0 ? 'var(--text)' : 'var(--gold)',
                lineHeight: 0.92, letterSpacing: '-0.01em', display: 'block',
              }}
            >{line}</motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
            color: 'var(--subtitle)', lineHeight: 1.8,
            maxWidth: '400px', margin: '0 auto 2.5rem',
          }}
        >
          This page doesn't exist — but the collection does. Head back and find something worth wearing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: 'var(--gold)', color: '#000',
                border: 'none', padding: '1rem 2.5rem',
                fontFamily: 'var(--font-inter)', fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>
              Go Home
            </motion.button>
          </Link>
          <Link href="/products">
            <motion.button
              whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: 'transparent', color: 'var(--text)',
                border: '1px solid var(--border)', padding: '1rem 2.5rem',
                fontFamily: 'var(--font-inter)', fontSize: '0.75rem',
                fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
              Browse Collection
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </main>
  )
}
