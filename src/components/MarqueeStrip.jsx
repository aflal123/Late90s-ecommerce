'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = [
  { icon: '★', text: 'Islandwide Delivery — Fast & Reliable' },
  { icon: '◆', text: 'Order via WhatsApp — No Checkout Needed' },
  { icon: '★', text: 'Premium Streetwear — Made in Sri Lanka' },
  { icon: '◆', text: 'New Drops Every Month — Est. 2026' },
]

export default function MarqueeStrip() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % messages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const msg = messages[current]

  return (
    <div style={{
      backgroundColor: '#111111',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      height: '42px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Side fade gradients */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to right, #111111, transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to left, #111111, transparent)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.5rem',
          }}>
            {msg.icon}
          </span>
          <span style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
          }}>
            {msg.text}
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.5rem',
          }}>
            {msg.icon}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        right: '2rem',
        display: 'flex',
        gap: '8px',
        zIndex: 2,
      }}>
        {messages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to message ${i + 1} of ${messages.length}`}
            aria-current={i === current ? 'true' : 'false'}
            style={{
              width: '24px', height: '24px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{
              width: i === current ? '16px' : '4px',
              height: '4px',
              backgroundColor: i === current ? '#ffffff' : 'rgba(255,255,255,0.18)',
              display: 'block',
              transition: 'all 0.3s ease',
            }} />
          </button>
        ))}
      </div>
    </div>
  )
}
