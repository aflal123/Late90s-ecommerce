'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function MaintenanceHeader() {
  const [colomboTime, setColomboTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Colombo is UTC+5:30
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setColomboTime(formatter.format(now))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-5 sm:py-6 border-b border-zinc-800/80"
    >
      {/* Brand Title on Left */}
      <div className="flex items-center gap-3">
        <a href="/" className="group inline-flex items-center gap-2.5">
          <span className="font-syne font-black text-xl sm:text-2xl tracking-[0.3em] uppercase text-[#f5f5f5] group-hover:text-white transition-colors">
            LATE90s
          </span>
        </a>
        <span className="hidden sm:inline-block text-[10px] font-mono-custom tracking-widest text-zinc-500 uppercase px-2 py-0.5 border border-zinc-800 rounded-xs">
          EST. 2024
        </span>
      </div>

      {/* Local City Indicator on Right */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono-custom text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-widest text-zinc-200 uppercase">
            DHARGA TOWN, LK
          </span>
        </div>
        {colomboTime && (
          <span className="hidden md:inline-block text-xs font-mono-custom text-zinc-500 tracking-wider border-l border-zinc-800 pl-3">
            {colomboTime} GMT+5:30
          </span>
        )}
      </div>
    </motion.header>
  )
}
