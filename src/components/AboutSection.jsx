'use client'

import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section style={{
      backgroundColor: '#f5f0e8',
      padding: '6rem 2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }}
        className="about-grid">

        {/* Left — Dark box */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            backgroundColor: '#111111',
            aspectRatio: '4/5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
          <div style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '12rem',
            color: 'rgba(255,255,255,0.06)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em'
          }}>
            L9
          </div>
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
          }}>
            <div style={{
              width: '40px',
              height: '2px',
              backgroundColor: 'var(--gold)',
              marginBottom: '1rem'
            }} />
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}>
              Colombo, Sri Lanka
            </p>
          </div>
        </motion.div>

        {/* Right — Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>

          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-inter)'
          }}>
            // Our Story
          </p>

          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            color: '#111111',
            lineHeight: 0.95,
            letterSpacing: '-0.01em',
            marginBottom: '2rem'
          }}>
            Built in Sri Lanka.<br />
            Worn Worldwide.
          </h2>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            color: '#555555',
            lineHeight: 1.9,
            marginBottom: '1.5rem'
          }}>
            Late 90s was born from a simple obsession — the golden era of streetwear,
            when baggy fits, bold graphics, and raw authenticity ruled the culture.
            We brought that energy to Sri Lanka, crafting pieces that honor the past
            while living in the now.
          </p>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.9rem',
            color: '#555555',
            lineHeight: 1.9,
            marginBottom: '2.5rem'
          }}>
            Every piece is designed locally, inspired globally.
            Order via WhatsApp — we pack it, courier delivers it to your door.
          </p>

          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {[
              { number: 'LKR', label: 'Local Currency' },
              { number: '100%', label: 'Sri Lankan Brand' },
              { number: '0%', label: 'Compromise' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1.8rem',
                  color: '#111111',
                  lineHeight: 1
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#888888',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '0.25rem',
                  fontFamily: 'var(--font-inter)'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
