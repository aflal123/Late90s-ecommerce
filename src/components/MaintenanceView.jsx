'use client'

import { motion } from 'framer-motion'
import { MaintenanceHeader } from './MaintenanceHeader'
import { HangerAnimation } from './HangerAnimation'
import { NotificationBox } from './NotificationBox'
import { MaintenanceFooter } from './MaintenanceFooter'

export default function MaintenanceView() {
  return (
    <div className="h-svh w-full bg-[#0d0d0d] text-[#f5f5f5] flex flex-col justify-between overflow-hidden selection:bg-zinc-800 selection:text-white">
      {/* 1. Top Navigation Bar */}
      <MaintenanceHeader />

      {/* 2. Main Middle Container (Centered vertically, max single viewport height) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-1.5 flex flex-col items-center justify-center text-center overflow-hidden my-auto">
        {/* Suspended Clothes Hanger & Garment Tag */}
        <div className="w-full flex justify-center">
          <HangerAnimation isRestocking={true} />
        </div>

        {/* Headline & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-1 sm:mt-2 max-w-xl px-2"
        >
          <h1 className="font-['Bebas_Neue',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl tracking-[0.16em] uppercase text-[#f5f5f5] leading-tight">
            PREPARING THE NEXT DROP
          </h1>
          <p className="mt-1.5 text-[11px] sm:text-xs font-mono-custom text-zinc-400 max-w-md mx-auto leading-relaxed">
            We are currently organizing new pieces and refining the online store. Check back shortly.
          </p>
        </motion.div>

        {/* Early Access Notification Box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full mt-2"
        >
          <NotificationBox />
        </motion.div>
      </main>

      {/* 3. Bottom Footer Bar */}
      <MaintenanceFooter />
    </div>
  )
}
