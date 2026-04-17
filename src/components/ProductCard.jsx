'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function ProductCard({ product, index = 0 }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [hovered, setHovered] = useState(false)

  const badge = !product.inStock
    ? { label: 'SOLD OUT', bg: 'rgba(0,0,0,0.75)', color: '#555' }
    : product.featured
    ? { label: 'NEW DROP', bg: 'var(--gold)', color: '#000' }
    : null

  const productLink = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.id}` : ''
  const whatsappMessage = [
    `Hi Late90s! I want to order:`,
    ``,
    `Product: ${product.name}`,
    `Category: ${product.category}`,
    `Size: ${selectedSize || 'Please advise'}`,
    `Price: LKR ${product.price.toLocaleString()}`,
    productLink ? `View Product: ${productLink}` : null,
    ``,
    `Please confirm availability!`,
  ].filter(Boolean).join('\n')
  const whatsappUrl = `https://wa.me/94775494201?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
      }}
    >
      {/* Image block */}
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          backgroundColor: '#0d0d0d',
          outline: `1px solid ${hovered ? 'rgba(200,169,110,0.35)' : 'rgba(255,255,255,0.04)'}`,
          transition: 'outline-color 0.35s ease',
        }}>

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.4rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '4.5rem',
                color: '#1a1a1a',
                letterSpacing: '0.1em',
                lineHeight: 1,
              }}>L90S</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              backgroundColor: badge.bg, color: badge.color,
              padding: '0.18rem 0.6rem',
              fontFamily: 'var(--font-inter)', fontSize: '0.52rem',
              fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>{badge.label}</div>
          )}

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => { e.preventDefault(); setWishlisted(!wishlisted) }}
            style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              width: '32px', height: '32px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: `1px solid ${wishlisted ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'border-color 0.2s ease',
            }}
          >
            <Heart
              size={13}
              fill={wishlisted ? 'var(--gold)' : 'none'}
              color={wishlisted ? 'var(--gold)' : 'rgba(255,255,255,0.7)'}
            />
          </motion.button>

          {/* Sold out overlay */}
          {!product.inStock && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.6rem', color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.3em',
              }}>SOLD OUT</span>
            </div>
          )}

          {/* Hover: view prompt */}
          <motion.div
            animate={{ opacity: hovered && product.inStock ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '0.6rem',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
              textAlign: 'center',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.55rem',
              letterSpacing: '0.3em', color: 'rgba(255,255,255,0.85)',
              textTransform: 'uppercase', fontWeight: 600,
            }}>View Product</span>
          </motion.div>
        </div>
      </Link>

      {/* Text block */}
      <div style={{ paddingTop: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Category */}
        <span style={{
          fontSize: '0.54rem', letterSpacing: '0.3em',
          color: 'var(--gold)', textTransform: 'uppercase',
          fontFamily: 'var(--font-inter)', marginBottom: '0.3rem', display: 'block',
        }}>{product.category}</span>

        {/* Name */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.45rem', color: 'var(--text)',
            letterSpacing: '0.03em', lineHeight: 1.05,
            marginBottom: '0.3rem',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
          >{product.name}</h3>
        </Link>

        {/* Price */}
        <p style={{
          fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
          fontWeight: 700, color: 'var(--text)',
          letterSpacing: '0.04em', marginBottom: '0.85rem',
          opacity: 0.9,
        }}>LKR {product.price.toLocaleString()}</p>

        {/* Size pills */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                style={{
                  padding: '0.22rem 0.55rem',
                  border: `1px solid ${selectedSize === size ? 'var(--gold)' : 'rgba(255,255,255,0.12)'}`,
                  backgroundColor: selectedSize === size ? 'var(--gold)' : 'transparent',
                  color: selectedSize === size ? '#000' : 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
                  fontWeight: 600, letterSpacing: '0.06em',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >{size}</button>
            ))}
          </div>
        )}

        {/* WhatsApp CTA */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href={product.inStock ? whatsappUrl : undefined}
            target={product.inStock ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={e => !product.inStock && e.preventDefault()}
            style={{
              display: 'block', width: '100%', padding: '0.72rem',
              backgroundColor: product.inStock ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
              color: product.inStock ? '#000' : 'rgba(255,255,255,0.2)',
              border: 'none',
              fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
              fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
              textAlign: 'center', textDecoration: 'none',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => product.inStock && (e.currentTarget.style.opacity = '0.82')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {product.inStock ? 'ORDER VIA WHATSAPP' : 'OUT OF STOCK'}
          </a>
        </div>
      </div>
    </motion.div>
  )
}
