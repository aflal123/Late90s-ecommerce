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

    // Simulate clean API response
    setTimeout(() => {
      setStatus('submitted')
    }, 900)
  }

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4">
      <AnimatePresence mode="wait">
        {status === 'submitted' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center justify-center p-4 rounded-md bg-zinc-900/90 border border-emerald-800/80 text-center"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-mono-custom text-xs tracking-widest uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ACCESS LIST CONFIRMED</span>
            </div>
            <p className="text-[11px] font-mono-custom text-zinc-400 mt-1.5">
              You will be notified the instant the next drop goes live.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-2"
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
                className="w-full h-12 pl-4 pr-32 bg-[#141416] border border-zinc-700/80 rounded-md text-xs font-mono-custom text-[#f5f5f5] placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors shadow-inner"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-1.5 h-9 px-4 rounded bg-[#f5f5f5] hover:bg-white text-[#0d0d0d] font-syne font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                ) : (
                  <>
                    <span>[NOTIFY ME]</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-red-400 text-[10.5px] font-mono-custom px-1"
              >
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
