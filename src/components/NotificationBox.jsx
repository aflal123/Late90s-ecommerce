'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export function NotificationBox() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    setTimeout(() => {
      setStatus('submitted')
    }, 800)
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto my-1 px-2">
      <AnimatePresence mode="wait">
        {status === 'submitted' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center justify-center p-2.5 rounded-md bg-zinc-900/90 border border-emerald-800/80 text-center"
          >
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono-custom text-[11px] tracking-widest uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACCESS LIST CONFIRMED</span>
            </div>
            <p className="text-[10px] font-mono-custom text-zinc-400 mt-1">
              You will be notified the instant the next drop goes live.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col gap-1"
          >
            <div className="relative flex items-center w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                placeholder="ENTER YOUR EMAIL FOR DROP ACCESS..."
                className="w-full h-9 sm:h-10 pl-3 pr-28 bg-[#141416] border border-zinc-700/80 rounded text-[11px] font-mono-custom text-[#f5f5f5] placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors shadow-inner"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1 h-7 sm:h-8 px-3 rounded bg-[#f5f5f5] hover:bg-white text-[#0d0d0d] font-syne font-bold text-[10.5px] tracking-wider uppercase flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3 h-3 animate-spin text-black" />
                ) : (
                  <>
                    <span>[NOTIFY ME]</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-red-400 text-[10px] font-mono-custom px-1"
              >
                <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
