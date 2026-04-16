'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function VideoHero() {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    // Text animates in after a short delay regardless of video
    const t = setTimeout(() => setTextVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.addEventListener('canplay', () => setVideoLoaded(true))
    v.play().catch(() => {})
  }, [])

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>

      {/* ── VIDEO BACKGROUND ── */}
      {/* Drop your brand video at /public/hero.mp4 to activate */}
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        muted={muted}
        loop
        playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />

      {/* ── FALLBACK when no video ── */}
      {!videoLoaded && <FallbackBg />}

      {/* ── GRADIENT OVERLAYS ── */}
      {/* top fade for navbar */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.88) 100%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* ── CENTER CONTENT ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '0 1.5rem',
      }}>

        <AnimatePresence>
          {textVisible && (
            <>
              {/* Pill tag */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  backgroundColor: 'rgba(200,169,110,0.1)',
                  border: '1px solid rgba(200,169,110,0.3)',
                  padding: '0.35rem 1rem', marginBottom: '2rem',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#c8a96e', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.3em', color: '#c8a96e', textTransform: 'uppercase' }}>
                  Sri Lankan Streetwear — EST. 2026
                </span>
              </motion.div>

              {/* Brand name — full-width cinematic */}
              <div style={{ overflow: 'hidden' }}>
                {['LATE', '90S'].map((word, i) => (
                  <motion.div
                    key={word}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 'clamp(5.5rem, 22vw, 20rem)',
                      color: i === 0 ? '#fff' : '#c8a96e',
                      lineHeight: 0.85,
                      letterSpacing: '-0.02em',
                    }}
                  >{word}</motion.div>
                ))}
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.95rem)',
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  marginTop: '1.8rem',
                  marginBottom: '2.8rem',
                }}
              >
                Old School. New Rules.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.03, backgroundColor: '#e8c47e' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      backgroundColor: '#c8a96e', color: '#000',
                      border: 'none', padding: '0.95rem 2.8rem',
                      fontFamily: 'var(--font-inter)', fontSize: '0.72rem',
                      fontWeight: 700, letterSpacing: '0.22em',
                      textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                  >Shop Collection</motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ borderColor: '#c8a96e', color: '#c8a96e' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      backgroundColor: 'transparent', color: '#fff',
                      border: '1px solid rgba(255,255,255,0.35)',
                      padding: '0.95rem 2.8rem',
                      fontFamily: 'var(--font-inter)', fontSize: '0.72rem',
                      fontWeight: 700, letterSpacing: '0.22em',
                      textTransform: 'uppercase', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >Our Story</motion.button>
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM BAR ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem clamp(1.25rem, 4vw, 3rem)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Scroll hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
          >
            <div style={{ width: '32px', height: '1px', background: 'rgba(200,169,110,0.55)' }} />
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Scroll</span>
          </motion.div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[['500+', 'Orders'], ['25+', 'Designs'], ['🇱🇰', 'Made Locally']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.3rem', color: '#fff', lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.48rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Mute toggle */}
        {videoLoaded && (
          <button
            onClick={() => {
              setMuted(m => !m)
              if (videoRef.current) videoRef.current.muted = !muted
            }}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.55)', padding: '0.4rem 0.8rem',
              fontFamily: 'var(--font-inter)', fontSize: '0.55rem',
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >{muted ? '🔇 Sound' : '🔊 Mute'}</button>
        )}
      </motion.div>

      {/* ── SIDE LABEL ── */}
      <div style={{
        position: 'absolute', right: '1.5rem', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        transformOrigin: 'center',
        fontFamily: 'var(--font-inter)', fontSize: '0.5rem',
        color: 'rgba(255,255,255,0.2)', letterSpacing: '0.35em',
        textTransform: 'uppercase', zIndex: 2, pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        Late90s — Colombo, Sri Lanka
      </div>

    </section>
  )
}

/* ── FALLBACK (no video) — animated dark scene ── */
function FallbackBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#050505' }}>

      {/* Warm glow left */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,80,0,0.18) 0%, transparent 70%)',
          left: '-15vw', bottom: '-10vw',
        }}
      />

      {/* Purple glow right */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,0,200,0.2) 0%, transparent 70%)',
          right: '-12vw', top: '-10vw',
        }}
      />

      {/* Gold center radial */}
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%)',
          left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(200,169,110,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.022) 1px, transparent 1px)',
        backgroundSize: '70px 70px',
      }} />

      {/* Animated horizontal lines */}
      {[15, 42, 68, 88].map((top, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 0.15, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: 0, right: 0,
            top: `${top}%`, height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(200,169,110,0.4), transparent)',
            transformOrigin: 'left',
          }}
        />
      ))}
    </div>
  )
}
