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
    <div className="relative w-full max-w-[320px] sm:max-w-[380px] h-[200px] sm:h-[230px] flex flex-col items-center justify-center select-none mx-auto overflow-visible">
      {/* Ceiling / Rack Suspension Rail */}
      <div className="absolute top-0 z-10 flex flex-col items-center pointer-events-none w-full">
        {/* Metal clothes rack rail horizontal bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-gradient-to-r from-transparent via-zinc-400 to-transparent rounded-full opacity-90 shadow-[0_1px_6px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Main Pendulum: Clothes Hanger Assembly */}
      <motion.div
        className="relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing z-20 scale-90 sm:scale-95 origin-top mx-auto"
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
        {/* SVG Clothing Hanger - 100% Symmetrical around Center X=140 */}
        <svg
          viewBox="0 0 280 114"
          className="w-[200px] sm:w-[230px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] overflow-visible mx-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Swivel Hook at top - Perfectly Centered */}
          <path
            d="M 140 10 C 147 10, 151 15, 151 22 C 151 30, 140 34, 140 42"
            stroke="#d4d4d8"
            strokeWidth="3.4"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          {/* Hook tip */}
          <circle cx="140" cy="10" r="2" fill="#f4f4f5" />

          {/* Swivel base mount collar */}
          <rect x="135.5" y="41" width="9" height="6.5" rx="1.5" fill="#3f3f46" stroke="#a1a1aa" strokeWidth="0.8" />

          {/* Wooden / Matte Black Streetwear Hanger Body - Symmetrical (X=20 to X=260) */}
          <path
            d="M 140 46 L 260 92 C 265 94, 267 99, 262 103 C 258 106, 252 104, 248 101 L 140 60 L 32 101 C 28 104, 22 106, 18 103 C 13 99, 15 94, 20 92 Z"
            fill="url(#hangerMatteGradient)"
            stroke="#52525b"
            strokeWidth="1.2"
          />

          {/* Shoulder notches (Symmetrical 90px from center 140) */}
          <path d="M 230 80 C 233 82, 238 82, 240 80" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 80 C 47 82, 42 82, 40 80" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />

          {/* Lower crossbar (Symmetrical 20 to 260) */}
          <line x1="20" y1="99" x2="260" y2="99" stroke="#3f3f46" strokeWidth="2.5" strokeLinecap="round" />

          {/* Waxed cord loop holding tag - Perfectly Centered */}
          <rect x="137.5" y="96.5" width="5" height="5.5" rx="1.5" fill="#52525b" stroke="#a1a1aa" strokeWidth="0.8" />
          <line x1="138.5" y1="102" x2="138.5" y2="114" stroke="#a1a1aa" strokeWidth="1.2" />
          <line x1="141.5" y1="102" x2="141.5" y2="114" stroke="#a1a1aa" strokeWidth="1.2" />

          <defs>
            <linearGradient id="hangerMatteGradient" x1="0" y1="46" x2="280" y2="106" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="35%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#2d2d30" />
              <stop offset="65%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#27272a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Suspended Garment Tag Assembly */}
        <motion.div
          className="relative -mt-1 flex flex-col items-center justify-center mx-auto"
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
            <div className="w-[1.5px] h-3.5 sm:h-4 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-500" />
            <div className="w-3 h-1 rounded-full border border-zinc-400 bg-zinc-800 -mb-1 shadow-xs" />
          </div>

          {/* Garment Tag Card */}
          <div className="relative w-[190px] sm:w-[210px] bg-[#121214] border border-zinc-700/90 rounded-md p-2.5 sm:p-3 text-zinc-100 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.9)] backdrop-blur-md overflow-hidden mx-auto">
            {/* Eyelet Hole */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border border-zinc-400 bg-[#0d0d0d] shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
              </div>
            </div>

            {/* Tag Header: Brand Mark LATE90S */}
            <div className="text-center pt-1 px-1">
              <span className="font-['Bebas_Neue',sans-serif] font-bold text-lg sm:text-xl tracking-[0.22em] text-white block leading-none text-center">
                LATE<span className="text-[#c8a96e]">90S</span>
              </span>
              <span className="text-[8px] font-mono-custom tracking-[0.22em] text-zinc-400 uppercase mt-0.5 block text-center">
                COLLECTION 2026
              </span>
            </div>

            {/* Status Badge */}
            <div className="mt-1.5 flex items-center justify-center">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#09090b] border border-emerald-500/40 shadow-xs">
                <span className="relative flex h-1.5 w-1.5">
                  {isRestocking && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[8.5px] font-mono-custom tracking-wider text-emerald-300 font-bold uppercase">
                  [ STORE MAINTENANCE ]
                </span>
              </div>
            </div>

            {/* Laser Loading Bar */}
            <div className="mt-1.5 px-0.5 flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-[7.5px] font-mono-custom">
                <span className="text-zinc-400 tracking-wider">UPDATING INVENTORY</span>
                <span className="text-emerald-400 font-bold tracking-wider animate-pulse">SYNCING</span>
              </div>

              <div className="relative w-full h-[2.5px] bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-14 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"
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
            <div className="mt-1.5 pt-1.5 border-t border-zinc-800 text-[8px] font-mono-custom text-zinc-400 flex justify-between items-center">
              <span className="text-zinc-500 font-semibold">ORIGIN:</span>
              <span className="text-zinc-200 font-bold">DHARGA TOWN, LK</span>
            </div>

            {/* Barcode */}
            <div className="mt-1 pt-1 border-t border-dashed border-zinc-800 flex flex-col items-center">
              <div className="flex items-end gap-[1px] h-3 justify-center w-full">
                {[
                  2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 3,
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-300"
                    style={{
                      width: `${w * 0.95}px`,
                      height: `${8 + (idx % 3) * 2}px`,
                      opacity: idx % 4 === 0 ? 0.75 : 0.95,
                    }}
                  />
                ))}
              </div>
              <span className="text-[7px] font-mono-custom tracking-[0.22em] text-zinc-400 mt-0.5">
                90 2026 0119 LK
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
