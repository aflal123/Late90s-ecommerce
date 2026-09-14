'use client'

import { motion } from 'framer-motion'
import { MaintenanceHeader } from './MaintenanceHeader'
import { HangerAnimation } from './HangerAnimation'
import { NotificationBox } from './NotificationBox'
import { MaintenanceFooter } from './MaintenanceFooter'

export default function MaintenanceView() {
  return (
    <div className="min-h-[100svh] w-full bg-[#0d0d0d] text-[#f5f5f5] flex flex-col justify-between overflow-x-hidden selection:bg-zinc-800 selection:text-white">
      {/* Top Navigation / Beacon */}
      <MaintenanceHeader />

      {/* Hero Content & Center Piece */}
      <main className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex flex-col items-center justify-center text-center my-auto">
        {/* Suspended Clothes Hanger & Garment Tag */}
        <HangerAnimation isRestocking={true} />

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-6 max-w-2xl px-2"
        >
          <h1 className="font-syne font-black text-2xl sm:text-4xl md:text-5xl tracking-[0.14em] uppercase text-[#f5f5f5] leading-tight">
            PREPARING THE NEXT DROP
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-mono-custom text-zinc-400 max-w-lg mx-auto leading-relaxed">
            We are currently organizing new pieces and refining the online store. Check back shortly.
          </p>
        </motion.div>

        {/* Early Access Notification Box */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full"
        >
          <NotificationBox />
        </motion.div>
      </main>

      {/* Footer */}
      <MaintenanceFooter />
    </div>
  )
}
