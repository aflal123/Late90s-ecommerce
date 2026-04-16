'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const categories = [
  {
    number: '01',
    name: 'T-Shirts',
    description: 'Oversized fits, vintage prints, street-ready styles.',
    slug: 'tshirts',
    accent: 'var(--gold)',
  },
  {
    number: '02',
    name: 'Pants',
    description: 'Wide leg, cargo, and relaxed cuts for the bold.',
    slug: 'pants',
    accent: '#ffffff',
  },
]

export default function CategorySection() {
  return (
    <section style={{
      backgroundColor: 'var(--bg)',
      padding: '8rem 3rem',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
          <div>
            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-inter)',
            }}>
              // Collections
            </p>
            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              color: 'var(--text)',
              letterSpacing: '0.01em',
              lineHeight: 1,
            }}>
              Shop By Category
            </h2>
          </div>
          <Link href="/products">
            <motion.span
              whileHover={{ color: 'var(--gold)' }}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                color: 'var(--subtitle)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)',
                transition: 'color 0.2s ease',
              }}>
              View All &rarr;
            </motion.span>
          </Link>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}>
              <Link href={`/products?category=${cat.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    padding: '3rem',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>

                  {/* Top accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: cat.accent,
                      transformOrigin: 'left',
                    }}
                  />

                  {/* Number */}
                  <span style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '0.9rem',
                    color: cat.accent,
                    letterSpacing: '0.25em',
                    opacity: 0.6,
                  }}>
                    {cat.number}
                  </span>

                  {/* Large ghost number */}
                  <div style={{
                    position: 'absolute',
                    right: '-1rem',
                    bottom: '-2rem',
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '10rem',
                    color: 'transparent',
                    WebkitTextStroke: `1px ${cat.accent}08`,
                    userSelect: 'none',
                    lineHeight: 1,
                  }}>
                    {cat.number}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '3.5rem',
                      color: 'var(--text)',
                      letterSpacing: '0.03em',
                      marginBottom: '0.75rem',
                      lineHeight: 1,
                    }}>
                      {cat.name}
                    </h3>
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--subtitle)',
                      lineHeight: 1.7,
                      marginBottom: '2rem',
                      fontFamily: 'var(--font-inter)',
                      maxWidth: '260px',
                    }}>
                      {cat.description}
                    </p>
                    <span style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.25em',
                      color: cat.accent,
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 600,
                    }}>
                      Explore &rarr;
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
