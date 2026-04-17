'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

export default function ReviewsSection() {
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState({ customerName: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [justPosted, setJustPosted] = useState(null) // holds the new review id briefly

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => { if (d.success) setReviews(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerName.trim() || !form.comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        // Instantly prepend to list
        setReviews(prev => [data.data, ...prev])
        setJustPosted(data.data.id)
        setForm({ customerName: '', rating: 5, comment: '' })
        // Remove the "new" highlight after 4s
        setTimeout(() => setJustPosted(null), 4000)
      }
    } catch {}
    setSubmitting(false)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section style={{
      backgroundColor: 'var(--bg)',
      padding: '6rem 3rem',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '3rem', paddingBottom: '2rem',
            borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap', gap: '1rem',
          }}
        >
          <div>
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
              letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', marginBottom: '0.5rem',
            }}>What They Say</p>
            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 0.95,
            }}>Customer Reviews</h2>
          </div>

          {/* Live count + avg rating */}
          {avgRating && (
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2.8rem', color: '#ffffff', lineHeight: 1,
              }}>{avgRating}</div>
              <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end', marginBottom: '0.2rem' }}>
                {Array(5).fill(0).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(avgRating) ? 'var(--gold)' : 'var(--border)', fontSize: '0.75rem' }}>★</span>
                ))}
              </div>
              <div style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
                color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase',
              }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
          )}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }} className="reviews-grid">

          {/* ── Left: review cards ── */}
          <div>
            {loading ? (
              /* Skeleton */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', padding: '1.75rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                    <div style={{ height: '12px', width: '80px', backgroundColor: 'var(--border)', marginBottom: '1rem', borderRadius: '2px' }} />
                    <div style={{ height: '10px', width: '100%', backgroundColor: 'var(--border)', marginBottom: '0.5rem', borderRadius: '2px' }} />
                    <div style={{ height: '10px', width: '80%', backgroundColor: 'var(--border)', marginBottom: '1.5rem', borderRadius: '2px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--border)' }} />
                      <div style={{ height: '10px', width: '80px', backgroundColor: 'var(--border)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '4rem 2rem', textAlign: 'center',
                  border: '1px dashed var(--border)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-bebas)', fontSize: '4rem',
                  color: 'var(--border)', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '1rem',
                }}>NO REVIEWS YET</div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.82rem', color: 'var(--subtitle)' }}>
                  Be the first to leave a review →
                </p>
              </motion.div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                <AnimatePresence>
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: justPosted === review.id ? 0 : i * 0.07 }}
                      style={{
                        backgroundColor: 'var(--card)',
                        border: `1px solid ${justPosted === review.id ? 'rgba(255,255,255,0.35)' : 'var(--border)'}`,
                        padding: '1.75rem',
                        position: 'relative',
                        transition: 'border-color 0.4s ease',
                      }}
                    >
                      {/* "JUST POSTED" badge */}
                      {justPosted === review.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute', top: '0.75rem', right: '0.75rem',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            padding: '0.2rem 0.55rem',
                            fontFamily: 'var(--font-inter)', fontSize: '0.5rem',
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            color: '#ffffff',
                          }}
                        >
                          <Check size={9} /> Live
                        </motion.div>
                      )}

                      {/* Quote mark */}
                      <div style={{
                        fontFamily: 'var(--font-bebas)', fontSize: '4rem',
                        color: 'rgba(200,169,110,0.08)', lineHeight: 1,
                        position: 'absolute', top: '0.5rem', right: '1.2rem',
                        userSelect: 'none',
                      }}>"</div>

                      {/* Stars */}
                      <div style={{ marginBottom: '0.85rem' }}>
                        {Array(5).fill(0).map((_, idx) => (
                          <span key={idx} style={{ color: idx < review.rating ? 'var(--gold)' : 'var(--border)', fontSize: '0.85rem' }}>★</span>
                        ))}
                      </div>

                      {/* Comment */}
                      <p style={{
                        fontFamily: 'var(--font-inter)', fontSize: '0.82rem',
                        color: 'var(--subtitle)', lineHeight: 1.75, marginBottom: '1.4rem',
                      }}>{review.comment}</p>

                      {/* Name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div style={{
                          width: '30px', height: '30px', backgroundColor: 'var(--gold)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', color: '#000', flexShrink: 0,
                        }}>
                          {review.customerName[0].toUpperCase()}
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-inter)', fontSize: '0.78rem',
                          fontWeight: 600, color: 'var(--text)', letterSpacing: '0.04em',
                        }}>{review.customerName}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── Right: submit form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'sticky', top: '100px',
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '2rem',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
              letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', marginBottom: '0.4rem',
            }}>Share Your Experience</p>
            <h3 style={{
              fontFamily: 'var(--font-bebas)', fontSize: '2rem',
              color: 'var(--text)', letterSpacing: '0.04em',
              lineHeight: 1, marginBottom: '1.75rem',
            }}>Leave a Review</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kasun P."
                  required
                  value={form.customerName}
                  onChange={e => setForm({ ...form, customerName: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Star rating */}
              <div>
                <label style={labelStyle}>Rating</label>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.6rem', lineHeight: 1, color: n <= form.rating ? 'var(--gold)' : 'var(--border)', transition: 'color 0.15s ease', padding: '0 0.05rem' }}
                    >★</button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label style={labelStyle}>Your Review</label>
                <textarea
                  placeholder="What did you think? Quality, fit, delivery..."
                  required
                  rows={4}
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ opacity: submitting ? 0.7 : 0.88 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: 'var(--gold)', color: '#000',
                  border: 'none', padding: '0.9rem',
                  fontFamily: 'var(--font-inter)', fontSize: '0.62rem',
                  fontWeight: 700, letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.5rem',
                }}
              >
                {submitting ? 'Posting...' : 'Post Review'}
              </motion.button>

              <p style={{
                fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
                color: 'var(--muted)', letterSpacing: '0.05em',
                textAlign: 'center', lineHeight: 1.6,
              }}>
                Your review goes live instantly.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .reviews-grid { padding: 0 !important; }
        }
      `}</style>
    </section>
  )
}

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-inter)',
  fontSize: '0.58rem', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'var(--subtitle)',
  marginBottom: '0.4rem', fontWeight: 600,
}

const inputStyle = {
  width: '100%', backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--border)', color: 'var(--text)',
  padding: '0.75rem 1rem', fontFamily: 'var(--font-inter)',
  fontSize: '0.82rem', outline: 'none',
}
