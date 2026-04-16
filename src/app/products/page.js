'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['T-Shirts', 'Pants']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSize, setActiveSize] = useState('all')
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => activeSize === 'all' || (p.sizes && p.sizes.includes(activeSize)))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      return 0
    })

  const clearFilters = () => {
    setActiveCategory('all')
    setActiveSize('all')
    setSort('newest')
  }

  const hasActiveFilters = activeCategory !== 'all' || activeSize !== 'all'

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      paddingTop: '80px',
    }}>

      {/* Page Header */}
      <div style={{
        position: 'relative',
        borderBottom: '1px solid var(--border)',
        overflow: 'hidden',
        padding: '4rem 3rem 3rem',
      }}>

        {/* Ghost background text */}
        <div style={{
          position: 'absolute',
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(10rem, 22vw, 20rem)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(200,169,110,0.05)',
          letterSpacing: '-0.02em',
          userSelect: 'none',
          lineHeight: 1,
          right: '-2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          SHOP
        </div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Top row: tag + count */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: 'rgba(200,169,110,0.08)',
              border: '1px solid rgba(200,169,110,0.2)',
              padding: '0.3rem 0.9rem',
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: '0.58rem',
                letterSpacing: '0.3em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
              }}>
                Sri Lankan Streetwear
              </span>
            </div>

            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}>
              {loading ? '—' : `${filtered.length} products`}
            </span>
          </motion.div>

          {/* Main heading */}
          <div style={{ overflow: 'hidden' }}>
            {['The', 'Collection.'].map((word, i) => (
              <motion.h1
                key={word}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(4rem, 8vw, 8rem)',
                  color: i === 0 ? 'var(--text)' : 'var(--gold)',
                  letterSpacing: '0.01em',
                  lineHeight: 0.95,
                  display: 'block',
                }}
              >
                {word}
              </motion.h1>
            ))}
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              marginTop: '2rem',
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 3rem' }}>

        {/* Filter + Sort Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem 0',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap',
          }}
        >

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <SlidersHorizontal size={13} />
            Filters
            {hasActiveFilters && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--gold)',
                display: 'inline-block',
              }} />
            )}
          </button>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  border: `1px solid ${activeCategory === cat ? 'var(--gold)' : 'var(--border)'}`,
                  backgroundColor: activeCategory === cat ? 'var(--gold)' : 'transparent',
                  color: activeCategory === cat ? '#000' : 'var(--subtitle)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)' }} />

          {/* Size pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', ...SIZES].map(size => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                style={{
                  padding: '0.35rem 0.6rem',
                  border: `1px solid ${activeSize === size ? 'var(--gold)' : 'var(--border)'}`,
                  backgroundColor: activeSize === size ? 'var(--gold)' : 'transparent',
                  color: activeSize === size ? '#000' : 'var(--subtitle)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  minWidth: '32px',
                  textAlign: 'center',
                }}
              >
                {size === 'all' ? 'All' : size}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--subtitle)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--subtitle)'}
            >
              <X size={11} /> Clear
            </button>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '0.45rem 0.85rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

        </motion.div>

        {/* Products Grid */}
        <div style={{ padding: '2.5rem 0 5rem' }}>

          {loading ? (
            /* Skeleton loader */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} style={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    aspectRatio: '4/5',
                    backgroundColor: 'var(--border)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ height: '8px', width: '60px', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
                    <div style={{ height: '24px', width: '140px', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
                    <div style={{ height: '10px', width: '80px', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
                    <div style={{ height: '38px', backgroundColor: 'var(--border)', borderRadius: '2px', marginTop: '0.5rem' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '6rem 0',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                color: 'var(--border)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                marginBottom: '1rem',
              }}>
                EMPTY
              </div>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                color: 'var(--subtitle)',
                marginBottom: '1.5rem',
              }}>
                No products match your filters.
              </p>
              <button
                onClick={clearFilters}
                style={{
                  backgroundColor: 'var(--gold)',
                  color: '#000',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            /* Product grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              <AnimatePresence>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  )
}
