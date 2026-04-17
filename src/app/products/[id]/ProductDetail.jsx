'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Share2 } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageZoomed, setImageZoomed] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProduct(data.data)
          // Fetch related products from same category
          return fetch(`/api/products?category=${data.data.category}`)
        }
      })
      .then(res => res && res.json())
      .then(data => {
        if (data && data.success) {
          setRelatedProducts(data.data.filter(p => p.id !== id).slice(0, 4))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleOrder = () => {
    if (!selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2500)
      return
    }
    const totalPrice = (product.price * quantity).toLocaleString()
    const message = [
      `Hi Late90s! I want to order:`,
      ``,
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      `Size: ${selectedSize}`,
      `Quantity: ${quantity}`,
      `Total: LKR ${totalPrice}`,
      `View Product: ${window.location.href}`,
      ``,
      `Please confirm availability!`,
    ].join('\n')
    window.open(`https://wa.me/94775494201?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingTop: '80px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div style={{ aspectRatio: '4/5', backgroundColor: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1rem' }}>
            {[80, 200, 60, 100, 160, 50].map((w, i) => (
              <div key={i} style={{ height: i === 1 ? '60px' : '16px', width: `${w}%`, maxWidth: `${w * 2}px`, backgroundColor: 'var(--border)', borderRadius: '2px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </main>
    )
  }

  if (!product) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '6rem', color: 'var(--border)', lineHeight: 1 }}>404</div>
          <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--subtitle)', marginBottom: '1.5rem' }}>Product not found.</p>
          <Link href="/products" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: 'var(--gold)', color: '#000', border: 'none', padding: '0.75rem 2rem', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Back to Shop
            </button>
          </Link>
        </div>
      </main>
    )
  }

  const totalPrice = (product.price * quantity).toLocaleString()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingTop: '80px' }}>
      <div className="product-grid" style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem 3rem 5rem' }}>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <Link href="/products" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'var(--subtitle)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--subtitle)'}
          >
            <ArrowLeft size={13} />
            Back to Shop
          </Link>
        </motion.div>

        {/* Product Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
          className="product-grid"
        >

          {/* LEFT — Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              onClick={() => setImageZoomed(!imageZoomed)}
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                backgroundColor: 'var(--product-bg)',
                border: '1px solid var(--border)',
                cursor: 'zoom-in',
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: imageZoomed ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: '8rem',
                    color: 'var(--border)',
                    letterSpacing: '0.1em',
                  }}>L9</span>
                </div>
              )}

              {/* Stock badge */}
              {!product.inStock && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  padding: '0.3rem 0.9rem',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#888',
                  textTransform: 'uppercase',
                }}>
                  Sold Out
                </div>
              )}

              {product.featured && product.inStock && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: 'var(--gold)',
                  padding: '0.3rem 0.9rem',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#000',
                  textTransform: 'uppercase',
                }}>
                  New Drop
                </div>
              )}

              {/* Zoom hint */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '0.3rem 0.7rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(4px)',
              }}>
                {imageZoomed ? 'Click to zoom out' : 'Click to zoom'}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="product-sticky"
            style={{ position: 'sticky', top: '100px' }}
          >

            {/* Category + Share row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
              }}>
                {product.category}
              </span>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: copied ? 'var(--gold)' : 'var(--subtitle)',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
              >
                <Share2 size={13} />
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Name */}
            <h1 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.8rem, 4vw, 4.5rem)',
              color: 'var(--text)',
              letterSpacing: '0.02em',
              lineHeight: 0.95,
              marginBottom: '1.25rem',
            }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--gold)',
                letterSpacing: '0.03em',
              }}>
                LKR {product.price.toLocaleString()}
              </span>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.7rem',
                color: 'var(--subtitle)',
              }}>
                per piece
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.88rem',
                color: 'var(--subtitle)',
                lineHeight: 1.8,
                marginBottom: '2rem',
              }}>
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    color: sizeError ? '#e85454' : 'var(--text)',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    transition: 'color 0.2s ease',
                  }}>
                    {sizeError ? 'Please select a size' : 'Select Size'}
                  </span>
                  {selectedSize && (
                    <span style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      color: 'var(--gold)',
                      fontWeight: 700,
                    }}>
                      {selectedSize} selected
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => { setSelectedSize(selectedSize === size ? null : size); setSizeError(false) }}
                      style={{
                        padding: '0.6rem 1.1rem',
                        border: `1px solid ${sizeError ? '#e85454' : selectedSize === size ? 'var(--gold)' : 'var(--border)'}`,
                        backgroundColor: selectedSize === size ? 'var(--gold)' : 'transparent',
                        color: selectedSize === size ? '#000' : 'var(--text)',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        minWidth: '48px',
                        textAlign: 'center',
                      }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'var(--text)',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.75rem',
              }}>
                Quantity
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <Minus size={13} />
                </button>
                <div style={{
                  width: '60px',
                  height: '40px',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}>
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <Plus size={13} />
                </button>
                {quantity > 1 && (
                  <span style={{
                    marginLeft: '1rem',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    color: 'var(--subtitle)',
                  }}>
                    Total: <strong style={{ color: 'var(--gold)' }}>LKR {totalPrice}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Order Button */}
            <motion.button
              whileHover={product.inStock ? { scale: 1.01, opacity: 0.9 } : {}}
              whileTap={product.inStock ? { scale: 0.98 } : {}}
              onClick={handleOrder}
              disabled={!product.inStock}
              style={{
                width: '100%',
                padding: '1.1rem',
                backgroundColor: product.inStock ? 'var(--gold)' : 'var(--border)',
                color: product.inStock ? '#000' : 'var(--muted)',
                border: 'none',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                marginBottom: '0.75rem',
              }}
            >
              {product.inStock ? `Order via WhatsApp — LKR ${totalPrice}` : 'Out of Stock'}
            </motion.button>

            {/* WhatsApp note */}
            {product.inStock && (
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.65rem',
                color: 'var(--muted)',
                letterSpacing: '0.05em',
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                WhatsApp will open with your order pre-filled. We confirm and ship within 24–48 hrs.
              </p>
            )}

            {/* Divider + Meta */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              {[
                ['Category', product.category],
                ['Availability', product.inStock ? 'In Stock' : 'Out of Stock'],
                ['Sizes Available', product.sizes?.join(', ')],
              ].map(([label, value]) => value && (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.15em',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    minWidth: '120px',
                  }}>{label}</span>
                  <span style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    color: label === 'Availability' && product.inStock ? 'var(--gold)' : 'var(--subtitle)',
                    fontWeight: label === 'Availability' ? 600 : 400,
                  }}>{value}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--border)' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: '2.5rem' }}
            >
              <p style={{
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-inter)',
                marginBottom: '0.5rem',
              }}>
                You Might Also Like
              </p>
              <h2 style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: 'var(--text)',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>
                Related Products
              </h2>
            </motion.div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}>
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1.25rem !important;
          }
          .product-related { padding: 1.25rem 1.25rem 4rem !important; }
          .product-sticky { position: static !important; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </main>
  )
}
