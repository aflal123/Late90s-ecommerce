'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const defaultReviews = [
  { id: 1, customerName: 'Kasun P.', rating: 5, comment: 'Quality is insane for the price. The oversized tee fits perfectly. Ordered via WhatsApp, arrived in 2 days.' },
  { id: 2, customerName: 'Amara S.', rating: 5, comment: 'Finally a Sri Lankan brand that actually delivers on the hype. The cargo pants are my new favorite.' },
  { id: 3, customerName: 'Dilshan R.', rating: 4, comment: 'Great quality and fast delivery. The designs are unique, nothing like this locally. Will order again.' },
]

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(defaultReviews)
  const [form, setForm] = useState({ customerName: '', rating: 5, comment: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) setReviews(data.data)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setReviews(prev => [data.data, ...prev])
        setForm({ customerName: '', rating: 5, comment: '' })
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <section style={{
      backgroundColor: 'var(--bg)',
      padding: '6rem 2rem',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}>
          <p style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-inter)'
          }}>
            // What They Say
          </p>
          <h2 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: 'var(--text)',
            letterSpacing: '0.02em'
          }}>
            Customer Reviews
          </h2>
        </motion.div>

        {/* Review Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '2rem',
                position: 'relative'
              }}>

              {/* Quote mark */}
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '5rem',
                color: 'rgba(200,169,110,0.1)',
                lineHeight: 1,
                position: 'absolute',
                top: '0.5rem',
                right: '1.5rem',
                userSelect: 'none'
              }}>
                "
              </div>

              {/* Stars */}
              <div style={{ marginBottom: '1rem' }}>
                {Array(5).fill(0).map((_, idx) => (
                  <span key={idx} style={{
                    color: idx < review.rating ? 'var(--gold)' : 'var(--border)',
                    fontSize: '0.9rem'
                  }}>★</span>
                ))}
              </div>

              {/* Comment */}
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                color: 'var(--subtitle)',
                lineHeight: 1.8,
                marginBottom: '1.5rem'
              }}>
                {review.comment}
              </p>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '1rem',
                  color: '#000',
                  flexShrink: 0
                }}>
                  {review.customerName[0]}
                </div>
                <span style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  letterSpacing: '0.05em'
                }}>
                  {review.customerName}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            padding: '2.5rem',
            maxWidth: '600px'
          }}>
          <h3 style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.8rem',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em'
          }}>
            Leave a Review
          </h3>

          {submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: 'var(--gold)',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                padding: '0.75rem',
                border: '1px solid var(--gold)',
              }}>
              Your review has been added. Thank you!
            </motion.p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.9rem 1.2rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%'
              }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--subtitle)',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Rating:
              </span>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    color: n <= form.rating ? 'var(--gold)' : 'var(--border)',
                    padding: '0 0.1rem'
                  }}>
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Share your experience..."
              required
              rows={4}
              value={form.comment}
              onChange={e => setForm({ ...form, comment: e.target.value })}
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '0.9rem 1.2rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical',
                width: '100%'
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--gold)',
                color: '#000000',
                border: 'none',
                padding: '1rem',
                fontFamily: 'var(--font-inter)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
