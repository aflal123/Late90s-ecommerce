'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function MaintenanceFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full max-w-6xl mx-auto px-6 py-6 sm:py-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-custom text-zinc-400"
    >
      {/* Copyright on left */}
      <div className="flex items-center gap-2 tracking-wider">
        <span>© {new Date().getFullYear()} LATE90s.</span>
        <span className="text-zinc-600 hidden xs:inline">ALL RIGHTS RESERVED.</span>
      </div>

      {/* Social Links & EvliqLabs Credit */}
      <div className="flex items-center gap-5 sm:gap-6 tracking-widest uppercase flex-wrap justify-center">
        <a
          href="https://www.instagram.com/late90s_outlet/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-[#f5f5f5] transition-colors"
        >
          <span>INSTAGRAM</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-500" />
        </a>

        <a
          href="https://www.tiktok.com/@late90s_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-[#f5f5f5] transition-colors"
        >
          <span>TIKTOK</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-500" />
        </a>

        <a
          href="https://www.late90s.online"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 hover:text-emerald-400 text-zinc-400 transition-colors"
        >
          <span>LATE90S.ONLINE</span>
        </a>

        <a
          href="https://www.evliqlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-emerald-400 text-zinc-500 transition-colors border-l border-zinc-800 pl-4"
        >
          <span>BY EVLIQLABS</span>
          <ArrowUpRight className="w-3 h-3 text-zinc-500" />
        </a>
      </div>
    </motion.footer>
  )
}
