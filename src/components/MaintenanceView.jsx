'use client'

import { motion } from 'framer-motion'
import { MaintenanceHeader } from './MaintenanceHeader'
import { HangerAnimation } from './HangerAnimation'
import { NotificationBox } from './NotificationBox'
import { MaintenanceFooter } from './MaintenanceFooter'

export default function MaintenanceView() {
  return (
    <div className="h-svh w-full bg-[#0d0d0d] text-[#f5f5f5] flex flex-col justify-between items-center overflow-hidden selection:bg-zinc-800 selection:text-white">
      {/* 1. Top Navigation Bar */}
      <div className="w-full flex justify-center shrink-0">
        <MaintenanceHeader />
      </div>

      {/* 2. Unified Perfectly Centered Hero Stack */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center overflow-hidden my-auto gap-2 sm:gap-3 shrink-0">
        {/* Hanger Centerpiece */}
        <div className="w-full flex justify-center items-center shrink-0">
          <HangerAnimation isRestocking={true} />
        </div>

        {/* Headline & Subtitle Stack */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center justify-center text-center max-w-lg px-2 shrink-0"
        >
          <h1 className="font-['Bebas_Neue',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl tracking-[0.18em] uppercase text-[#f5f5f5] leading-none text-center">
            PREPARING THE NEXT DROP
          </h1>
          <p className="mt-1.5 text-[10.5px] sm:text-xs font-mono-custom text-zinc-400 max-w-md mx-auto leading-relaxed text-center">
            We are currently organizing new pieces and refining the online store. Check back shortly.
          </p>
        </motion.div>

        {/* Early Access Notification Box */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full flex justify-center max-w-sm shrink-0"
        >
          <NotificationBox />
        </motion.div>
      </main>

      {/* 3. Bottom Footer Bar */}
      <div className="w-full flex justify-center shrink-0">
        <MaintenanceFooter />
      </div>
    </div>
  )
}
