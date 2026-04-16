'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  const placeholders = [
    { id: 'p1', name: 'Grunge Oversized Tee', price: 2100, category: 'tshirts', badge: 'HOT' },
    { id: 'p2', name: 'Vintage Wash Hoodie', price: 3800, category: 'hoodies', badge: 'NEW' },
    { id: 'p3', name: '90s Logo Cargo Pants', price: 4200, category: 'pants', badge: null },
    { id: 'p4', name: 'Distressed Graphic Tee', price: 1990, category: 'tshirts', badge: null },
    { id: 'p5', name: 'Skate Culture Jacket', price: 5490, category: 'outerwear', badge: 'NEW' },
    { id: 'p6', name: 'Washed Baggy Shorts', price: 2190, category: 'pants', badge: null },
  ]

  const displayProducts = products.length > 0 ? products : placeholders

  return (
    <section style={{
      backgroundColor: '#0a0a0a',
      padding: '5rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <p style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-inter)'
            }}>
              // Trending Now
            </p>
            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '0.02em'
            }}>
              Featured Drops
            </h2>
          </div>

          <Link href="/products">
            <motion.span
              whileHover={{ x: 5 }}
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.5)',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter)'
              }}>
              VIEW ALL COLLECTION &gt;
            </motion.span>
          </Link>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #1a1a1a'
        }}>
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Link href={`/products/${product.id}`}>
                <motion.div
                  whileHover={{ backgroundColor: '#141414' }}
                  style={{
                    backgroundColor: '#0d0d0d',
                    padding: '0',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>

                  {/* Product Image Area */}
                  <div style={{
                    height: '320px',
                    backgroundColor: '#111111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        fontFamily: 'var(--font-bebas)',
                        fontSize: '5rem',
                        color: 'rgba(255,255,255,0.05)',
                        letterSpacing: '0.1em'
                      }}>
                        L90S
                      </div>
                    )}

                    {/* Badge */}
                    {product.badge && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: product.badge === 'HOT' ? '#dc2626' : '#16a34a',
                        color: '#ffffff',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        padding: '0.25rem 0.6rem',
                        fontFamily: 'var(--font-inter)'
                      }}>
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '0.4rem'
                    }}>
                      {product.name}
                    </h3>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.5)'
                      }}>
                        LKR {product.price?.toLocaleString()}
                      </span>
                      <span style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.1em',
                        textTransform: 'capitalize',
                        fontFamily: 'var(--font-inter)'
                      }}>
                        {product.category}
                      </span>
                    </div>
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
