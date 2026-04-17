'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'T-Shirts', href: '/products?category=T-Shirts' },
    { label: 'Pants', href: '/products?category=Pants' },
  ],
  Info: [
    { label: 'About Us', href: '/about' },
  ],
  Order: [
    { label: 'Order via WhatsApp', href: 'https://wa.me/94775494201', external: true },
    { label: 'Track My Order', href: 'https://wa.me/94775494201?text=Hi%20Late90s!%20I%20want%20to%20track%20my%20order.', external: true },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      backgroundColor: '#080808',
      borderTop: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ghost text */}
      <div style={{
        position: 'absolute',
        fontFamily: 'var(--font-bebas)',
        fontSize: 'clamp(10rem, 25vw, 22rem)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        userSelect: 'none',
        lineHeight: 1,
        bottom: '-3rem',
        left: '-2rem',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        L90S
      </div>

      {/* Top CTA strip */}
      <div className="footer-cta" style={{
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 3rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                color: '#ffffff',
                letterSpacing: '0.01em',
                lineHeight: 0.95,
              }}
            >
              Ready to Order?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.4)',
                marginTop: '0.6rem',
                letterSpacing: '0.03em',
              }}
            >
              Message us on WhatsApp — we confirm and ship within 24–48 hours.
            </motion.p>
          </div>
          <motion.a
            href="https://wa.me/94775494201?text=Hi%20Late90s!%20I%20want%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--gold)',
              color: '#000',
              padding: '1rem 2.5rem',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </motion.a>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="footer-grid footer-body" style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '4rem 3rem 3rem',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '3rem',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Brand column */}
        <div>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}>
            <div style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '2.2rem',
              letterSpacing: '0.06em',
              color: '#ffffff',
              lineHeight: 1,
            }}>
              LATE90S
            </div>
            <div style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.45rem',
              letterSpacing: '0.4em',
              color: 'var(--gold)',
              textTransform: 'uppercase',
            }}>
              EST. 2026
            </div>
          </Link>

          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.85,
            maxWidth: '280px',
            marginBottom: '1.75rem',
          }}>
            Premium Sri Lankan streetwear designed for today, inspired by the past. Locally made. Globally styled.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/late90s_outlet/?hl=en', svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/> },
              { label: 'TikTok', href: 'https://www.tiktok.com/@late90s_', svg: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/> },
            ].map(social => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">{social.svg}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}>
              {title}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {links.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        letterSpacing: '0.03em',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                        letterSpacing: '0.03em',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom" style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.25rem 3rem',
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.08em',
        }}>
          {year} Late90s. All rights reserved.
        </span>
        <span style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.08em',
        }}>
          Made in Sri Lanka &nbsp;·&nbsp; Built by{' '}
          <a
            href="https://www.evliqlabs.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--gold)',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            evliqlabs.com
          </a>
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .footer-cta { padding: 3rem 1.25rem !important; }
          .footer-body { padding: 3rem 1.25rem 2rem !important; }
          .footer-bottom { padding: 1.25rem !important; flex-direction: column !important; gap: 0.75rem !important; text-align: center !important; }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
