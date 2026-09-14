'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function HangerAnimation({ isRestocking = true }) {
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  // Pendulum swing angles
  const hangerSwing = shouldReduceMotion
    ? [0, 0]
    : isHovered
    ? [-4.5, 4.5, -4.5]
    : [-2.8, 2.8, -2.8]

  const tagSwing = shouldReduceMotion
    ? [0, 0]
    : isHovered
    ? [6, -6, 6]
    : [3.8, -3.8, 3.8]

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[380px] h-[210px] sm:h-[250px] flex items-start justify-center select-none mx-auto overflow-visible">
      {/* Ceiling / Rack Suspension Rail */}
      <div className="absolute top-0 z-10 flex flex-col items-center pointer-events-none">
        {/* Metal clothes rack rail horizontal bar */}
        <div className="w-48 sm:w-64 h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent rounded-full opacity-80 shadow-[0_1px_4px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Main Pendulum: Clothes Hanger Assembly */}
      <motion.div
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing z-20 scale-90 sm:scale-100 origin-top"
        style={{
          transformOrigin: '50% 8px',
        }}
        animate={{
          rotate: hangerSwing,
        }}
        transition={{
          repeat: Infinity,
          duration: isHovered ? 4.0 : 5.4,
          ease: 'easeInOut',
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* SVG Clothing Hanger */}
        <svg
          viewBox="0 0 280 114"
          className="w-[200px] sm:w-[230px] h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swivel Hook at top */}
          <path
            d="M 152 20 C 153 14, 149 7.5, 140 7.5 C 131 7.5, 126 14, 126 21 C 126 28, 137 34, 137 42"
            stroke="#a1a1aa"
            strokeWidth="3.2"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          {/* Hook rounded metallic tip */}
          <circle cx="152" cy="20" r="1.8" fill="#d4d4d8" />

          {/* Swivel base mount collar */}
          <rect x="135.5" y="41" width="9" height="6.5" rx="1.5" fill="#3f3f46" stroke="#71717a" strokeWidth="0.8" />

          {/* Wooden / Matte Black Streetwear Hanger Body */}
          <path
            d="M 140 46 L 268 92 C 274 94, 276 100, 271 104 C 267 107, 260 105, 256 102 L 140 60 L 24 102 C 20 105, 13 107, 9 104 C 4 100, 6 94, 12 92 Z"
            fill="url(#hangerMatteGradient)"
            stroke="#3f3f46"
            strokeWidth="1.2"
          />

          {/* Shoulder notches */}
          <path d="M 230 80 C 233 82, 238 82, 240 80" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 80 C 47 82, 42 82, 40 80" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />

          {/* Lower crossbar */}
          <line x1="24" y1="99" x2="256" y2="99" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Waxed cord loop holding tag */}
          <rect x="137.5" y="96.5" width="5" height="5.5" rx="1.5" fill="#52525b" stroke="#71717a" strokeWidth="0.8" />
          <line x1="138.5" y1="102" x2="138.5" y2="114" stroke="#71717a" strokeWidth="1.2" />
          <line x1="141.5" y1="102" x2="141.5" y2="114" stroke="#71717a" strokeWidth="1.2" />

          <defs>
            <linearGradient id="hangerMatteGradient" x1="0" y1="46" x2="280" y2="106" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#222226" />
              <stop offset="35%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#27272a" />
              <stop offset="65%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#222226" />
            </linearGradient>
          </defs>
        </svg>

        {/* Suspended Garment Tag Assembly */}
        <motion.div
          className="relative -mt-1 flex flex-col items-center"
          style={{
            transformOrigin: '50% 0px',
          }}
          animate={{
            rotate: tagSwing,
          }}
          transition={{
            repeat: Infinity,
            duration: isHovered ? 4.0 : 5.4,
            ease: 'easeInOut',
            delay: 0.25,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Hanging Waxed Cord Loop */}
          <div className="flex flex-col items-center">
            <div className="w-[1.5px] h-4 sm:h-5 bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-600" />
            <div className="w-3 h-1.5 rounded-full border border-zinc-400 bg-zinc-800 -mb-1 shadow-xs" />
          </div>

          {/* Garment Tag Card */}
          <div className="relative w-[190px] sm:w-[210px] bg-[#141416] border border-zinc-700/80 rounded-md p-2.5 sm:p-3 text-zinc-200 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden">
            {/* Eyelet Hole */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-zinc-500 bg-[#0d0d0d] shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Tag Header */}
            <div className="text-center pt-1 px-1">
              <span className="font-syne font-black text-base sm:text-lg tracking-[0.16em] text-white block whitespace-nowrap">
                LATE90s
              </span>
              <span className="text-[8px] font-mono-custom tracking-[0.2em] text-zinc-400 uppercase mt-0.5 block">
                COLLECTION 2026
              </span>
            </div>

            {/* Status Badge */}
            <div className="mt-1.5 flex items-center justify-center">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-emerald-800/80 shadow-xs">
                <span className="relative flex h-1.5 w-1.5">
                  {isRestocking && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[8.5px] font-mono-custom tracking-wider text-emerald-300 font-semibold uppercase">
                  [ STORE MAINTENANCE ]
                </span>
              </div>
            </div>

            {/* Laser Loading Bar */}
            <div className="mt-1.5 px-0.5 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[7.5px] font-mono-custom">
                <span className="text-zinc-500 tracking-wider">UPDATING INVENTORY</span>
                <span className="text-emerald-400 font-semibold tracking-wider animate-pulse">SYNCING</span>
              </div>

              <div className="relative w-full h-[2.5px] bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-16 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                  animate={
                    shouldReduceMotion
                      ? { left: '35%' }
                      : {
                          left: ['-25%', '105%'],
                        }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>

            {/* Tag Specs */}
            <div className="mt-1.5 pt-1.5 border-t border-zinc-800/90 text-[8px] font-mono-custom text-zinc-400 flex justify-between items-center">
              <span className="text-zinc-500">ORIGIN:</span>
              <span className="text-zinc-300">DHARGA TOWN, LK</span>
            </div>

            {/* Barcode */}
            <div className="mt-1.5 pt-1 border-t border-dashed border-zinc-800/80 flex flex-col items-center">
              <div className="flex items-end gap-[1px] h-3.5 justify-center w-full">
                {[
                  2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1,
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-300"
                    style={{
                      width: `${w * 0.9}px`,
                      height: `${8 + (idx % 3) * 2}px`,
                      opacity: idx % 4 === 0 ? 0.7 : 0.95,
                    }}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono-custom tracking-[0.2em] text-zinc-500 mt-0.5">
                90 2026 0119 LK
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
