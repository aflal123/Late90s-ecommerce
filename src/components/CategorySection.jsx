'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const FALLBACK_CATS = [
  { id: 'f1', name: 'T-Shirts', slug: 'T-Shirts', description: 'Oversized fits, vintage prints, street-ready styles.', accent: '#ffffff', sortOrder: 0 },
  { id: 'f2', name: 'Pants',    slug: 'Pants',    description: 'Wide leg, cargo, and relaxed cuts for the bold.',    accent: '#ffffff', sortOrder: 1 },
]

/* ── auto-scroll rail ── */
function ImageRail({ products, accent, paused }) {
  // products = [{ id, image, name }] — duplicated 3× for seamless loop
  const hasProducts = products.length > 0
  const items = hasProducts
    ? [...products, ...products, ...products]
    : Array(8).fill(null)

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      position: 'relative',
      padding: '1.25rem 0 2rem',
    }}>
      {/* left / right fade masks */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(to right, var(--bg), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(to left, var(--bg), transparent)',
        pointerEvents: 'none',
      }} />

      <div
        className={`rail-track${paused ? ' rail-paused' : ''}`}
        style={{ display: 'flex', gap: '0.75rem', width: 'max-content' }}
      >
        {items.map((product, i) =>
          hasProducts && product ? (
            <Link key={i} href={`/products/${product.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: '140px', height: '186px',
                backgroundColor: '#111',
                overflow: 'hidden',
                outline: `1px solid ${accent}18`,
                position: 'relative',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.outline = `1px solid ${accent}55` }}
                onMouseLeave={e => { e.currentTarget.style.outline = `1px solid ${accent}18` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            </Link>
          ) : (
            /* placeholder tile */
            <div key={i} style={{
              width: '140px', height: '186px', flexShrink: 0,
              backgroundColor: '#111',
              outline: `1px solid ${accent}10`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2.5rem', color: accent,
                opacity: 0.07, letterSpacing: '0.1em',
              }}>L90S</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default function CategorySection() {
  const [categories, setCategories] = useState(FALLBACK_CATS)
  const [products, setProducts]     = useState([])
  const [hoveredIdx, setHoveredIdx] = useState(null)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setCategories(d.data) })
      .catch(() => {})

    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.data) })
      .catch(() => {})
  }, [])

  const getProducts = (catName) =>
    products.filter(p => p.category === catName && p.image)

  return (
    <section style={{ backgroundColor: 'var(--bg)', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem' }}>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '4rem', paddingBottom: '2rem',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap', gap: '1rem',
          }}
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
              letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>Collections</p>
            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 0.95,
            }}>Shop By Category</h2>
          </div>
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <motion.span
              whileHover={{ color: 'var(--gold)' }}
              style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.62rem',
                letterSpacing: '0.25em', color: 'var(--subtitle)',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
            >View All →</motion.span>
          </Link>
        </motion.div>

        {/* ── Category strips ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categories.map((cat, i) => {
            const catProducts = getProducts(cat.name)
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  borderBottom: `1px solid ${hoveredIdx === i ? cat.accent + '28' : 'var(--border)'}`,
                  transition: 'border-color 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Hover glow */}
                <motion.div
                  animate={{ opacity: hoveredIdx === i ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse at 10% 40%, ${cat.accent}05 0%, transparent 60%)`,
                  }}
                />

                {/* Clickable strip header */}
                <Link href={`/products?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    alignItems: 'center', gap: '2rem',
                    padding: '2.5rem 0 0',
                    cursor: 'pointer', position: 'relative', zIndex: 1,
                  }}
                    className="cat-strip"
                  >
                    {/* Left: number + name + description */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '2rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 'clamp(0.7rem, 1.2vw, 1rem)',
                        color: cat.accent, letterSpacing: '0.2em',
                        opacity: 0.5, flexShrink: 0,
                      }}>{String(i + 1).padStart(2, '0')}</span>

                      <h3 style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: 'clamp(3.5rem, 8vw, 8rem)',
                        color: hoveredIdx === i ? cat.accent : 'var(--text)',
                        letterSpacing: '-0.01em', lineHeight: 0.9,
                        transition: 'color 0.35s ease', whiteSpace: 'nowrap',
                      }}>{cat.name}</h3>

                      <p className="cat-desc" style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem', color: 'var(--subtitle)',
                        lineHeight: 1.7, maxWidth: '260px', marginLeft: '1rem',
                      }}>{cat.description}</p>
                    </div>

                    {/* Right: explore arrow */}
                    <motion.div
                      animate={{
                        x: hoveredIdx === i ? 6 : 0,
                        color: hoveredIdx === i ? cat.accent : 'var(--subtitle)',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.8rem',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-inter)', fontSize: '0.6rem',
                        letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600,
                      }}>Explore</span>
                      <div style={{
                        width: '40px', height: '1px',
                        backgroundColor: hoveredIdx === i ? cat.accent : 'var(--border)',
                        transition: 'background-color 0.3s ease',
                      }} />
                      <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', lineHeight: 1 }}>→</span>
                    </motion.div>
                  </div>
                </Link>

                {/* ── Image scroll rail ── */}
                <ImageRail
                  products={catProducts}
                  accent={cat.accent}
                  paused={hoveredIdx === i}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes rail-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .rail-track {
          animation: rail-scroll 22s linear infinite;
        }
        .rail-paused {
          animation-play-state: paused !important;
        }
        @media (max-width: 768px) {
          .cat-strip  { grid-template-columns: 1fr !important; gap: 1.5rem !important; padding-top: 1.75rem !important; }
          .cat-desc   { display: none !important; }
          .rail-track { animation-duration: 16s; }
        }
      `}</style>
    </section>
  )
}
