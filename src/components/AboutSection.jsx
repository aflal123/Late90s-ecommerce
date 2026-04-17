'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section style={{
      backgroundColor: '#000',
      padding: '8rem 0',
      borderTop: '1px solid #1a1a1a',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 3rem',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6rem',
        alignItems: 'center',
      }}
        className="about-grid">

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>

          <p style={{
            fontSize: '0.58rem',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.28)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-inter)',
          }}>
            Our Story
          </p>

          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(4rem, 7vw, 8rem)',
            color: '#ffffff',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            marginBottom: '2.5rem',
          }}>
            Built in<br />Sri Lanka.<br />Worn<br />Worldwide.
          </h2>

          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '2rem' }} />

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.95,
            marginBottom: '1.25rem',
            maxWidth: '440px',
          }}>
            Late 90s was born from a simple obsession — the golden era of streetwear,
            when baggy fits, bold graphics, and raw authenticity ruled the culture.
            We brought that energy to Sri Lanka, crafting pieces that honor the past
            while living in the now.
          </p>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.95,
            marginBottom: '2.5rem',
            maxWidth: '440px',
          }}>
            Every piece is designed locally, inspired globally.
            Order via WhatsApp — we pack it, courier delivers it to your door.
          </p>

          <Link href="/about" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '0.85rem 2rem', fontFamily: 'var(--font-inter)',
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'}
            >
              Read More →
            </button>
          </Link>
        </motion.div>

        {/* Right — stats grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderTop: '1px solid #1c1c1c',
            borderLeft: '1px solid #1c1c1c',
            marginBottom: '3rem',
          }}>
            {[
              { number: '500+', label: 'Drops Shipped' },
              { number: '98%', label: 'Happy Customers' },
              { number: '25+', label: 'Unique Designs' },
              { number: 'LKR', label: 'Local Currency' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '2rem',
                borderRight: '1px solid #1c1c1c',
                borderBottom: '1px solid #1c1c1c',
              }}>
                <div style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '3.2rem',
                  color: '#ffffff',
                  lineHeight: 1,
                  marginBottom: '0.4rem',
                }}>{stat.number}</div>
                <div style={{
                  fontSize: '0.55rem',
                  color: 'rgba(255,255,255,0.28)',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-inter)',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.18)',
            textTransform: 'uppercase',
          }}>
            Colombo, Sri Lanka — Est. 2026
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            padding: 0 1.25rem !important;
          }
        }
      `}</style>
    </section>
  )
}
