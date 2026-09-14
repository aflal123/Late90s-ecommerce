'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function MaintenanceFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-6xl mx-auto h-11 sm:h-12 px-4 sm:px-6 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-[10.5px] sm:text-xs font-mono-custom text-zinc-400 shrink-0"
    >
      {/* Copyright on left */}
      <div className="flex items-center gap-1.5 tracking-wider truncate">
        <span>© {new Date().getFullYear()} LATE90S.</span>
        <span className="text-zinc-500 hidden md:inline">ALL RIGHTS RESERVED.</span>
      </div>

      {/* Social Links & EvliqLabs Credit */}
      <div className="flex items-center gap-3 sm:gap-5 tracking-wider uppercase text-[10px] sm:text-[11px] font-medium">
        <a
          href="https://www.instagram.com/late90s_outlet/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-zinc-300 hover:text-white transition-colors"
        >
          <span>INSTAGRAM</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-400" />
        </a>

        <a
          href="https://www.tiktok.com/@late90s_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-zinc-300 hover:text-white transition-colors"
        >
          <span>TIKTOK</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-400" />
        </a>

        <a
          href="https://www.evliqlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors border-l border-zinc-800 pl-3 font-semibold"
        >
          <span>BY EVLIQLABS</span>
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        </a>
      </div>
    </motion.footer>
  )
}
