'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function ProductCard({ product, index = 0 }) {
  const [selectedSize, setSelectedSize] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [hovered, setHovered] = useState(false)

  const getBadge = () => {
    if (!product.inStock) return { label: 'SOLD OUT', bg: '#2a2a2a', color: '#888' }
    if (product.featured) return { label: 'NEW DROP', bg: 'var(--gold)', color: '#000' }
    return null
  }
  const badge = getBadge()

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* Image Area */}
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'relative',
          aspectRatio: '4/5',
          overflow: 'hidden',
          backgroundColor: 'var(--product-bg)',
        }}>

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '5rem',
                color: 'var(--border)',
                letterSpacing: '0.1em',
                lineHeight: 1,
              }}>L9</span>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.55rem',
                letterSpacing: '0.3em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}>No Image</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div style={{
              position: 'absolute',
              top: '0.85rem',
              left: '0.85rem',
              backgroundColor: badge.bg,
              padding: '0.2rem 0.65rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: badge.color,
              textTransform: 'uppercase',
            }}>
              {badge.label}
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => { e.preventDefault(); setWishlisted(!wishlisted) }}
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
              width: '34px',
              height: '34px',
              backgroundColor: 'rgba(0,0,0,0.55)',
              border: `1px solid ${wishlisted ? 'var(--gold)' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              transition: 'border 0.2s ease',
            }}
          >
            <Heart
              size={14}
              fill={wishlisted ? 'var(--gold)' : 'none'}
              color={wishlisted ? 'var(--gold)' : 'rgba(255,255,255,0.8)'}
            />
          </motion.button>

          {/* Sold Out Overlay */}
          {!product.inStock && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.8rem',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.25em',
              }}>SOLD OUT</span>
            </div>
          )}

          {/* Hover: View Product overlay */}
          <motion.div
            animate={{ opacity: hovered && product.inStock ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '0.75rem',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}>
            <span style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>View Product</span>
          </motion.div>

        </div>
      </Link>

      {/* Card Body */}
      <div style={{
        padding: '1.1rem 1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>

        {/* Category */}
        <span style={{
          fontSize: '0.58rem',
          letterSpacing: '0.28em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-inter)',
          marginBottom: '0.35rem',
          display: 'block',
        }}>
          {product.category}
        </span>

        {/* Name */}
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.55rem',
            color: 'var(--text)',
            letterSpacing: '0.04em',
            lineHeight: 1.05,
            marginBottom: '0.5rem',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.88rem',
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.05em',
          marginBottom: '1rem',
        }}>
          LKR {product.price.toLocaleString()}
        </p>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.35rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}>
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                style={{
                  padding: '0.28rem 0.65rem',
                  border: `1px solid ${selectedSize === size ? 'var(--gold)' : 'var(--border)'}`,
                  backgroundColor: selectedSize === size ? 'var(--gold)' : 'transparent',
                  color: selectedSize === size ? '#000' : 'var(--subtitle)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {size}
              </button>
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
              display: 'block',
              width: '100%',
              padding: '0.78rem',
              backgroundColor: product.inStock ? 'var(--gold)' : 'var(--border)',
              color: product.inStock ? '#000' : 'var(--muted)',
              border: 'none',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textAlign: 'center',
              textDecoration: 'none',
              cursor: product.inStock ? 'pointer' : 'not-allowed',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => product.inStock && (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {product.inStock ? 'ORDER VIA WHATSAPP' : 'OUT OF STOCK'}
          </a>
        </div>

      </div>
    </motion.div>
  )
}
