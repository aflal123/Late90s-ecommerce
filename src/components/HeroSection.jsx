'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.length > 0) { setFeatured(d.data[0]); return }
        return fetch('/api/products').then(r => r.json()).then(d2 => {
          if (d2.success && d2.data.length > 0) setFeatured(d2.data[0])
        })
      })
      .catch(() => {})
  }, [])

  const productName = featured?.name || 'Oversized Tee'
  const productPrice = featured?.price || 2500
  const productImage = featured?.image || null

  return (
    <section style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Left gradient orb */}
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%)',
        left: '-250px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }} />

      {/* Ghost 90S */}
      <div style={{
        position: 'absolute',
        fontFamily: 'var(--font-bebas)',
        fontSize: 'clamp(14rem, 28vw, 26rem)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(200,169,110,0.04)',
        letterSpacing: '-0.02em',
        userSelect: 'none',
        lineHeight: 1,
        right: '-3rem',
        bottom: '-2rem',
        pointerEvents: 'none',
        zIndex: 0,
      }}>90S</div>

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 3rem',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* LEFT — Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'rgba(200,169,110,0.08)',
              border: '1px solid rgba(200,169,110,0.2)',
              padding: '0.4rem 1rem',
              marginBottom: '2.5rem',
            }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--gold)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>
              Sri Lankan Streetwear — EST. 2026
            </span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            {['Bring Back', 'The Late', '90s Vibe.'].map((line, i) => (
              <motion.h1
                key={i}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(3.5rem, 7vw, 7.5rem)',
                  lineHeight: 0.92,
                  color: 'var(--text)',
                  letterSpacing: '-0.01em',
                  display: 'block',
                }}>
                {line}
              </motion.h1>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ height: '1px', backgroundColor: 'var(--border)', margin: '2rem 0', transformOrigin: 'left' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              fontSize: '0.95rem',
              color: 'var(--subtitle)',
              lineHeight: 1.9,
              maxWidth: '400px',
              marginBottom: '2.5rem',
              fontFamily: 'var(--font-inter)',
            }}>
            Premium streetwear designed for today, inspired by the past.
            Locally made, globally styled. Order directly via WhatsApp — no checkout, no hassle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#e8c47e' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: 'var(--gold)', color: '#000', border: 'none',
                  padding: '1rem 2.5rem', fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                SHOP NOW
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: 'transparent', color: 'var(--text)',
                  border: '1px solid var(--border)', padding: '1rem 2.5rem',
                  fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                OUR STORY
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', marginTop: '4rem' }}>
            {[
              { number: '500+', label: 'Drops Shipped' },
              { number: '98%', label: 'Happy Customers' },
              { number: '25+', label: 'Unique Designs' },
            ].map((stat, i) => (
              <div key={i} style={{
                paddingRight: i < 2 ? '2rem' : 0,
                marginRight: i < 2 ? '2rem' : 0,
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', color: 'var(--text)', lineHeight: 1 }}>{stat.number}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--subtitle)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.3rem', fontFamily: 'var(--font-inter)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Product Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', height: '580px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute',
            width: '420px', height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Gold corner — top right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{
              position: 'absolute', top: '5%', right: '3%',
              width: '55px', height: '55px',
              borderTop: '2px solid rgba(200,169,110,0.4)',
              borderRight: '2px solid rgba(200,169,110,0.4)',
            }} />

          {/* Gold corner — bottom left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            style={{
              position: 'absolute', bottom: '5%', left: '3%',
              width: '55px', height: '55px',
              borderBottom: '2px solid rgba(200,169,110,0.4)',
              borderLeft: '2px solid rgba(200,169,110,0.4)',
            }} />

          {/* Main image frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '340px',
              height: '440px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              /* Placeholder — shows until a product with image is added */
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
                backgroundImage: 'linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Animated scan line */}
                <motion.div
                  animate={{ y: [-440, 440] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                  style={{
                    position: 'absolute', left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(to right, transparent, rgba(200,169,110,0.5), transparent)',
                  }}
                />
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '5.5rem', color: 'rgba(200,169,110,0.12)', letterSpacing: '0.05em', lineHeight: 1 }}>LATE</span>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '5.5rem', color: 'rgba(200,169,110,0.12)', letterSpacing: '0.05em', lineHeight: 1, marginTop: '-1rem' }}>90S</span>
                <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.35em', color: 'rgba(200,169,110,0.35)', textTransform: 'uppercase', marginTop: '1.5rem' }}>Add Products in Admin</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '130px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
              pointerEvents: 'none',
            }} />

            {/* NEW DROP badge */}
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              backgroundColor: 'var(--gold)',
              padding: '0.2rem 0.7rem',
              fontFamily: 'var(--font-inter)', fontSize: '0.55rem',
              fontWeight: 700, letterSpacing: '0.2em', color: '#000',
              textTransform: 'uppercase',
            }}>
              New Drop
            </div>
          </motion.div>

          {/* Floating card — product info */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '13%', left: '0',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '0.9rem 1.2rem',
              zIndex: 2, minWidth: '140px',
            }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)', marginBottom: '0.3rem' }}>Featured</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1.1 }}>{productName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--subtitle)', fontFamily: 'var(--font-inter)', marginTop: '0.25rem', fontWeight: 600 }}>LKR {productPrice.toLocaleString()}</div>
          </motion.div>

          {/* Floating card — WhatsApp */}
          <motion.a
            href="https://wa.me/94775494201"
            target="_blank"
            rel="noopener noreferrer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              position: 'absolute', bottom: '13%', right: '0',
              backgroundColor: 'var(--gold)',
              padding: '0.9rem 1.2rem',
              zIndex: 2, textDecoration: 'none', cursor: 'pointer',
            }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: '#000', letterSpacing: '0.05em', lineHeight: 1 }}>ORDER VIA</div>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: '#000', letterSpacing: '0.05em', lineHeight: 1 }}>WHATSAPP</div>
          </motion.a>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '3rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
        <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--gold)', opacity: 0.5 }} />
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--subtitle)', textTransform: 'uppercase', fontFamily: 'var(--font-inter)' }}>Scroll Down</span>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  )
}
