'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, MessageCircle, Package, Truck } from 'lucide-react'

const steps = [
  { icon: ShoppingBag, number: '01', title: 'Browse & Pick', body: 'Go to our Shop, find the piece you want, select your size.' },
  { icon: MessageCircle, number: '02', title: 'Order via WhatsApp', body: 'Tap the WhatsApp button. A pre-filled message is sent straight to us.' },
  { icon: Package, number: '03', title: 'We Confirm', body: 'We reply within minutes to confirm availability and payment details.' },
  { icon: Truck, number: '04', title: 'We Ship', body: 'Your order is packed and shipped islandwide within 24–48 hours.' },
]

export default function CartPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingTop: '80px' }}>

      {/* Header */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '5rem 3rem 4rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(200,169,110,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.025) 1px, transparent 1px)',
          backgroundSize: '50px 50px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(10rem, 22vw, 18rem)', color: 'transparent',
          WebkitTextStroke: '1px rgba(200,169,110,0.04)',
          userSelect: 'none', lineHeight: 1,
          right: '-1rem', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>ORDER</div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              backgroundColor: 'rgba(200,169,110,0.08)',
              border: '1px solid rgba(200,169,110,0.2)',
              padding: '0.35rem 0.9rem', marginBottom: '1.5rem',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--gold)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                How to Order
              </span>
            </div>

            <div style={{ overflow: 'hidden' }}>
              {['No Cart.', 'Just WhatsApp.'].map((line, i) => (
                <motion.h1
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(3rem, 6vw, 6rem)',
                    color: i === 0 ? 'var(--text)' : 'var(--gold)',
                    lineHeight: 0.92, letterSpacing: '-0.01em', display: 'block',
                  }}
                >{line}</motion.h1>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.9rem',
              color: 'var(--subtitle)', lineHeight: 1.8,
              maxWidth: '480px', marginTop: '1.5rem',
            }}>
              We keep it simple. No complicated checkout, no payment forms. Just pick what you want and message us — we handle everything from there.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', backgroundColor: 'var(--border)', marginBottom: '4rem' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                backgroundColor: 'var(--bg)',
                padding: '2.5rem',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: 'var(--gold)', transformOrigin: 'left' }}
              />

              <div style={{
                width: '42px', height: '42px',
                backgroundColor: 'rgba(200,169,110,0.1)',
                border: '1px solid rgba(200,169,110,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <step.icon size={18} color="var(--gold)" />
              </div>

              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.25em', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>{step.number}</span>
              <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '0.03em', lineHeight: 1, marginBottom: '0.75rem' }}>{step.title}</h3>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: 'var(--subtitle)', lineHeight: 1.75 }}>{step.body}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
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
              Browse Collection
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
              Chat on WhatsApp
            </motion.button>
          </a>
        </motion.div>
      </div>
    </main>
  )
}
