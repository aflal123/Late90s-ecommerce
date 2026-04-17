'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PhotoHero() {
  const [images, setImages] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const imgs = d.data
            .filter(p => p.image)
            .slice(0, 10)
            .map(p => ({ src: p.image, name: p.name, category: p.category, id: p.id }))
          setImages(imgs)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>

      {/* Looping photo background */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          >
            <img
              src={images[current]?.src}
              alt={images[current]?.name || ''}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                filter: 'brightness(0.52)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom gradient — text legibility */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, rgba(0,0,0,0.82) 100%)',
      }} />

      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '250px 250px',
      }} />

      {/* Content */}
      <div className="hero-content" style={{
        position: 'absolute', inset: 0, zIndex: 4,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(2rem, 4vw, 4.5rem)',
      }}>

        {/* Eyebrow */}
        <motion.p
          key={`cat-${current}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
            letterSpacing: '0.45em', color: 'rgba(255,255,255,0.38)',
            textTransform: 'uppercase', marginBottom: '1.25rem',
          }}
        >
          {images.length > 0
            ? (images[current]?.category || 'Sri Lankan Streetwear')
            : 'Sri Lankan Streetwear — Est. 2026'}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(6rem, 20vw, 20rem)',
            color: '#ffffff', lineHeight: 0.83,
            letterSpacing: '-0.02em', marginBottom: '2.5rem',
          }}
        >
          LATE<br />90S
        </motion.h1>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '1.5rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-inter)', fontSize: '0.68rem',
            letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)',
            textTransform: 'uppercase', lineHeight: 2,
          }}>
            Old School.<br />New Rules.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/products">
              <button
                style={{
                  background: '#fff', color: '#000', border: 'none',
                  padding: '0.9rem 2.5rem', fontFamily: 'var(--font-inter)',
                  fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button
                style={{
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.28)',
                  padding: '0.9rem 2.5rem', fontFamily: 'var(--font-inter)',
                  fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'}
              >
                Our Story
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Image counter dots */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '2rem', right: '2rem',
          display: 'flex', gap: '0.4rem', zIndex: 5,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '24px' : '6px',
                height: '2px',
                background: i === current ? '#fff' : 'rgba(255,255,255,0.2)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hero-content { padding: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
