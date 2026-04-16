'use client'

import { useTheme } from 'next-themes'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { isSignedIn, user } = useUser()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: scrolled ? 'var(--bg)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: isMobile ? '0 1.25rem' : '0 3rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
          textDecoration: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '1.8rem',
            letterSpacing: '0.06em',
            color: 'var(--text)',
            lineHeight: 1,
          }}>
            LATE90S
          </span>
          <span style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.45rem',
            letterSpacing: '0.4em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
          }}>
            EST. 2026
          </span>
        </Link>

        {/* Desktop Nav — hidden on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => e.target.style.opacity = 1}
                onMouseLeave={e => e.target.style.opacity = 0.7}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                opacity: 0.6,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          {/* Cart icon */}
          <Link href="/cart" style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
            <ShoppingBag size={18} />
          </Link>

          {/* Auth — desktop only */}
          {!isMobile && (
            isSignedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-inter)',
                }}>
                  {user.firstName}
                </span>
                <SignOutButton>
                  <button style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    padding: '0.5rem 1.2rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter)',
                    transition: 'all 0.2s ease',
                  }}>
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <Link href="/sign-in">
                <button style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#000',
                  backgroundColor: 'var(--gold)',
                  border: 'none',
                  padding: '0.6rem 1.4rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  marginLeft: '0.5rem',
                  transition: 'opacity 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                  Sign In
                </button>
              </Link>
            )
          )}

          {/* Mobile hamburger — only on mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              backgroundColor: 'var(--bg)',
              borderTop: '1px solid var(--border)',
              overflow: 'hidden',
            }}>
            <div style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter)',
                    opacity: 0.7,
                  }}>
                  {link.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                {isSignedIn ? (
                  <SignOutButton>
                    <button style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      padding: '0.6rem 1.4rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-inter)',
                      width: '100%',
                    }}>
                      Sign Out
                    </button>
                  </SignOutButton>
                ) : (
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                    <button style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#000',
                      backgroundColor: 'var(--gold)',
                      border: 'none',
                      padding: '0.7rem 1.4rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 700,
                      width: '100%',
                    }}>
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
