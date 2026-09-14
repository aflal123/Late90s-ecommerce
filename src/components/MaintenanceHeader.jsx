'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function MaintenanceHeader() {
  const [colomboTime, setColomboTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-800/80 shrink-0"
    >
      {/* Brand Title on Left */}
      <div className="flex items-center gap-2.5">
        <a href="/" className="group inline-flex items-center gap-2">
          <span className="font-syne font-black text-lg sm:text-xl tracking-[0.25em] uppercase text-[#f5f5f5] group-hover:text-white transition-colors">
            LATE90s
          </span>
        </a>
        <span className="hidden sm:inline-block text-[9px] font-mono-custom tracking-widest text-zinc-500 uppercase px-1.5 py-0.5 border border-zinc-800 rounded-xs">
          EST. 2024
        </span>
      </div>

      {/* Local City Indicator on Right */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono-custom text-zinc-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-wider text-zinc-200 uppercase">
            DHARGA TOWN, LK
          </span>
        </div>
        {colomboTime && (
          <span className="hidden md:inline-block text-[11px] font-mono-custom text-zinc-500 tracking-wider border-l border-zinc-800 pl-2.5">
            {colomboTime} GMT+5:30
          </span>
        )}
      </div>
    </motion.header>
  )
}
