'use client'

import { motion, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { MessageCircle, Clock, ArrowRight } from 'lucide-react'

// Dynamically import Three.js Canvas to prevent SSR hydration mismatches
const MaintenanceCanvas3D = dynamic(() => import('./MaintenanceCanvas3D'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center text-xs tracking-widest text-white/30 uppercase"
      style={{ height: 'clamp(220px, 35vh, 420px)' }}
    >
      <span className="animate-pulse">Loading 3D Visual...</span>
    </div>
  ),
})

export default function MaintenanceView() {
  const shouldReduceMotion = useReducedMotion()

  // Framer Motion Variant Generators
  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  })

  return (
    <main
      className="relative w-full flex flex-col justify-between bg-[#0a0a0a] text-white overflow-x-hidden select-none"
      style={{
        minHeight: '100svh',
        paddingLeft: 'max(20px, 5vw)',
        paddingRight: 'max(20px, 5vw)',
        paddingTop: 'max(16px, 3vw)',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
      }}
    >
      {/* Background CRT Scanline & Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[300px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.6) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)' }}
        />
        {/* Subtle Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 1. HEADER SECTION */}
      <header className="relative z-10 w-full flex items-center justify-between py-2 border-b border-white/10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.1)}
          className="flex items-center gap-3"
        >
          {/* LATE90S Brand Mark */}
          <span className="font-['Bebas_Neue',sans-serif] text-2xl md:text-3xl tracking-wider text-white font-bold leading-none">
            LATE<span className="text-[#c8a96e]">90S</span>
          </span>
        </motion.div>

        {/* Live Status Badge */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.2)}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] md:text-xs font-mono tracking-widest text-white/70 uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Upgrade</span>
        </motion.div>
      </header>

      {/* 2. HERO CONTENT SECTION */}
      <section className="relative z-10 w-full my-auto py-6 md:py-10 flex flex-col items-center justify-center text-center">
        {/* Large Headline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.3)}
          className="w-full max-w-4xl"
        >
          <h1
            className="font-['Bebas_Neue',sans-serif] text-white font-bold tracking-tight uppercase leading-[0.88] select-none"
            style={{
              fontSize: 'clamp(3.2rem, 13.5vw, 7.5rem)',
              wordBreak: 'break-word',
            }}
          >
            WE&apos;LL BE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#c8a96e]">
              BACK SOON.
            </span>
          </h1>
        </motion.div>

        {/* 3D Three.js Object Container (Positioned below/behind headline on mobile) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.4)}
          className="w-full max-w-lg my-2 md:my-4"
        >
          <MaintenanceCanvas3D />
        </motion.div>

        {/* Supporting Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.5)}
          className="w-full flex flex-col items-center gap-4"
        >
          <p
            className="font-['Bebas_Neue',sans-serif] text-white/90 tracking-wider uppercase text-lg md:text-2xl leading-snug"
            style={{
              fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
              maxWidth: '340px',
            }}
          >
            WE&apos;RE CURRENTLY
            <br />
            UPGRADING THE EXPERIENCE.
          </p>

          <p className="text-xs md:text-sm text-white/60 max-w-[320px] leading-relaxed font-normal">
            Our platform is undergoing scheduled updates and inventory drops. We&apos;ll be back online shortly.
          </p>

          {/* Quick Action: WhatsApp Button */}
          <a
            href="https://wa.me/94775494201?text=Hi%20Late90s,%20please%20notify%20me%20when%20you%20are%20back%20online!"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black hover:bg-[#c8a96e] hover:text-black transition-all duration-300 font-medium text-xs md:text-sm tracking-wider uppercase shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-black text-black" />
            <span>Notify Me On WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </motion.div>
      </section>

      {/* 3. BOTTOM FOOTER SECTION */}
      <footer className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] md:text-xs font-mono tracking-widest text-white/40 uppercase">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.6)}
          className="flex items-center gap-2"
        >
          <Clock className="w-3.5 h-3.5 text-[#c8a96e]" />
          <span>EST. RETURN: SOON</span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn(0.7)}
          className="text-center sm:text-right"
        >
          <span>LATE90S &copy; {new Date().getFullYear()} &mdash; COLOMBO, SRI LANKA</span>
        </motion.div>
      </footer>
    </main>
  )
}
