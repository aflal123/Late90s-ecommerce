'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  const placeholders = [
    { id: 'p1', name: 'Grunge Oversized Tee', price: 2100, category: 'T-Shirts', badge: 'HOT' },
    { id: 'p2', name: 'Vintage Wash Hoodie', price: 3800, category: 'Hoodies', badge: 'NEW' },
    { id: 'p3', name: '90s Logo Cargo Pants', price: 4200, category: 'Pants', badge: null },
    { id: 'p4', name: 'Distressed Graphic Tee', price: 1990, category: 'T-Shirts', badge: null },
    { id: 'p5', name: 'Skate Culture Jacket', price: 5490, category: 'Outerwear', badge: 'NEW' },
    { id: 'p6', name: 'Washed Baggy Shorts', price: 2190, category: 'Pants', badge: null },
  ]

  const displayProducts = products.length > 0 ? products : placeholders

  return (
    <section style={{ backgroundColor: '#080808', padding: '7rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            borderBottom: '1px solid #1c1c1c',
            paddingBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ position: 'relative' }}>
            {/* Ghost text */}
            <div style={{
              position: 'absolute',
              left: '-0.5rem', top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(5rem, 10vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.03)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 0,
            }}>FEATURED</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.58rem', letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}>New Arrivals</p>

              <h2 style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                color: '#ffffff', lineHeight: 0.95,
                letterSpacing: '0.02em',
              }}>Featured Drops</h2>
            </div>
          </div>

          <Link href="/products" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ x: 4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.62rem', letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)', cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              View All Collection
              <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1rem' }}>→</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* ── Editorial grid ── */}
        {/* Desktop: 3-col grid with thin 1px dividers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid #161616',
          borderLeft: '1px solid #161616',
        }}
          className="featured-grid"
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRight: '1px solid #161616',
                borderBottom: '1px solid #161616',
                position: 'relative',
                backgroundColor: hovered === i ? '#0d0d0d' : '#080808',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>

                {/* Image */}
                <div style={{
                  position: 'relative',
                  aspectRatio: i === 0 ? '3/4' : i === 4 ? '3/4' : '4/5',
                  overflow: 'hidden',
                  backgroundColor: '#0a0a0a',
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transform: hovered === i ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '5rem', color: '#161616',
                        letterSpacing: '0.1em',
                      }}>L90S</span>
                    </div>
                  )}

                  {/* Item number */}
                  <div style={{
                    position: 'absolute', top: '1rem', left: '1rem',
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.2em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Badge */}
                  {(product.badge || product.featured) && (
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      backgroundColor: product.badge === 'HOT' ? '#dc2626' : 'var(--gold)',
                      color: product.badge === 'HOT' ? '#fff' : '#000',
                      padding: '0.15rem 0.55rem',
                      fontFamily: 'var(--font-inter)', fontSize: '0.5rem',
                      fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                    }}>
                      {product.badge || 'NEW'}
                    </div>
                  )}

                  {/* Hover gradient */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
                    opacity: hovered === i ? 1 : 0,
                    transition: 'opacity 0.35s ease',
                  }} />
                </div>

                {/* Text block */}
                <div style={{ padding: '1.1rem 1.25rem 1.4rem' }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-inter)', fontSize: '0.52rem',
                    letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', marginBottom: '0.4rem',
                  }}>{product.category}</span>
                  <h3 style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '1.35rem', color: '#ffffff',
                    letterSpacing: '0.04em', lineHeight: 1.05,
                    marginBottom: '0.4rem',
                    transition: 'color 0.2s ease',
                    color: hovered === i ? 'var(--gold)' : '#ffffff',
                  }}>{product.name}</h3>
                  <span style={{
                    fontFamily: 'var(--font-inter)', fontSize: '0.78rem',
                    fontWeight: 700, color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '0.04em',
                  }}>LKR {product.price?.toLocaleString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', paddingTop: '4rem' }}
        >
          <Link href="/products">
            <motion.button
              whileHover={{ backgroundColor: '#e8c47e', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: 'var(--gold)', color: '#000',
                border: 'none', padding: '1rem 3.5rem',
                fontFamily: 'var(--font-inter)', fontSize: '0.65rem',
                fontWeight: 700, letterSpacing: '0.25em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >Shop Full Collection</motion.button>
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
