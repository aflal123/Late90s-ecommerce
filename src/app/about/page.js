'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const values = [
  {
    number: '01',
    title: 'Locally Crafted',
    body: 'Every piece is designed and produced in Sri Lanka. We work with local manufacturers who share our obsession for quality.',
  },
  {
    number: '02',
    title: 'Globally Inspired',
    body: 'The golden era of 90s streetwear — oversized silhouettes, raw graphics, authentic culture — brought into the present.',
  },
  {
    number: '03',
    title: 'No Middleman',
    body: 'Order directly via WhatsApp. We handle everything from packing to islandwide delivery. Simple, fast, personal.',
  },
]

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: '80px' }}>

      {/* HERO */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 3rem 5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(12rem, 25vw, 22rem)', color: 'transparent',
          WebkitTextStroke: '1px rgba(200,169,110,0.04)',
          userSelect: 'none', lineHeight: 1,
          right: '-2rem', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>STORY</div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              backgroundColor: 'rgba(200,169,110,0.08)',
              border: '1px solid rgba(200,169,110,0.2)',
              padding: '0.35rem 0.9rem', marginBottom: '2rem',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--gold)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase' }}>Our Story</span>
            </div>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            {['Built in Sri Lanka.', 'Worn Worldwide.'].map((line, i) => (
              <motion.h1
                key={i}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(3.5rem, 7vw, 7rem)',
                  color: i === 0 ? 'var(--text)' : 'var(--gold)',
                  lineHeight: 0.92, letterSpacing: '-0.01em', display: 'block',
                }}
              >{line}</motion.h1>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section style={{ padding: '6rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '1300px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '5rem', alignItems: 'center',
        }} className="about-story-grid">

          {/* Left — dark visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            {/* Grid pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            {/* Big L9 */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)', fontSize: '14rem',
                color: 'rgba(200,169,110,0.07)', letterSpacing: '-0.05em', lineHeight: 1,
              }}>L9</span>
            </div>
            {/* Gold corner top-right */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '40px', height: '40px', borderTop: '2px solid rgba(200,169,110,0.5)', borderRight: '2px solid rgba(200,169,110,0.5)' }} />
            {/* Gold corner bottom-left */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', width: '40px', height: '40px', borderBottom: '2px solid rgba(200,169,110,0.5)', borderLeft: '2px solid rgba(200,169,110,0.5)' }} />
            {/* Bottom label */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div style={{ width: '30px', height: '2px', backgroundColor: 'var(--gold)', marginBottom: '0.75rem' }} />
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Colombo, Sri Lanka
              </p>
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              How It Started
            </p>
            <h2 style={{
              fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
              color: 'var(--text)', lineHeight: 1, letterSpacing: '0.02em', marginBottom: '2rem',
            }}>
              Born from a<br />Culture, Not a Brief.
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--subtitle)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
              Late90s was born from a simple obsession — the golden era of streetwear, when baggy fits, bold graphics, and raw authenticity ruled the culture. We brought that energy to Sri Lanka, crafting pieces that honour the past while living in the now.
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--subtitle)', lineHeight: 1.9, marginBottom: '2.5rem' }}>
              We believe fashion doesn't need to be complicated. Pick what you love, message us on WhatsApp, and we'll handle the rest — packed and delivered to your door anywhere on the island.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '0', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {[['LKR', 'Local Currency'], ['100%', 'Sri Lankan Brand'], ['0%', 'Compromise']].map(([n, l], i) => (
                <div key={l} style={{
                  paddingRight: i < 2 ? '2rem' : 0,
                  marginRight: i < 2 ? '2rem' : 0,
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'var(--text)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', color: 'var(--subtitle)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '6rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '4rem' }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What We Stand For</p>
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: 'var(--text)', letterSpacing: '0.01em', lineHeight: 1 }}>
              Our Values
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', backgroundColor: 'var(--border)' }}>
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                style={{
                  backgroundColor: 'var(--bg)',
                  padding: '3rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top gold line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: 'var(--gold)', transformOrigin: 'left' }}
                />
                {/* Ghost number */}
                <div style={{
                  position: 'absolute', right: '-0.5rem', bottom: '-1.5rem',
                  fontFamily: 'var(--font-bebas)', fontSize: '8rem',
                  color: 'transparent', WebkitTextStroke: '1px rgba(200,169,110,0.06)',
                  userSelect: 'none', lineHeight: 1,
                }}>{v.number}</div>

                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: '0.25em', opacity: 0.7 }}>{v.number}</span>
                <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--text)', letterSpacing: '0.03em', margin: '0.75rem 0', lineHeight: 1 }}>{v.title}</h3>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.85rem', color: 'var(--subtitle)', lineHeight: 1.8, maxWidth: '280px' }}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 3rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3rem, 6vw, 6rem)', color: 'var(--text)', letterSpacing: '0.01em', lineHeight: 0.95, marginBottom: '1.5rem' }}>
              Ready to Shop<br /><span style={{ color: 'var(--gold)' }}>The Collection?</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.9rem', color: 'var(--subtitle)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '460px', margin: '0 auto 2.5rem' }}>
              Browse our full collection and order directly via WhatsApp. No checkout, no hassle — just great fits.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/products">
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
                  Shop Now
                </motion.button>
              </Link>
              <a href="https://wa.me/94775494201" target="_blank" rel="noopener noreferrer">
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
                  WhatsApp Us
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-story-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .about-story-grid > div:first-child { aspect-ratio: 1/1 !important; }
        }
      `}</style>
    </main>
  )
}
