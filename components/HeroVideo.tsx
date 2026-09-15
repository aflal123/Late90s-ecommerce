'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, ArrowDown, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroVideo() {
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 28, seconds: 40 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black text-white scanlines">
      {/* Black & White Video Loop */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover object-center grayscale contrast-125 opacity-40 scale-105"
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
          />
        </video>
        {/* Deep Black Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-radial-bw" />
      </div>

      {/* Sound Toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-zinc-950/80 border border-white/20 text-white hover:bg-white hover:text-black transition-all cursor-pointer backdrop-blur-md flex items-center gap-2 text-xs font-mono-tech uppercase font-bold"
        aria-label="Toggle sound"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
      </button>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Drop Ticker Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/20 backdrop-blur-md mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-[11px] font-mono-tech tracking-widest uppercase text-zinc-300">
            LIMITED ARCHIVE COLLECTION:
          </span>
          <div className="font-mono-tech font-bold text-white text-xs flex gap-1">
            <span>{String(timeLeft.hours).padStart(2, '0')}H</span> :
            <span>{String(timeLeft.minutes).padStart(2, '0')}M</span> :
            <span>{String(timeLeft.seconds).padStart(2, '0')}S</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-9xl font-display font-black tracking-tighter uppercase leading-[0.88] mb-6 text-white"
        >
          LATE 90S <br />
          <span className="text-zinc-500 hover:text-white transition-colors duration-500">
            STREETWEAR
          </span>
        </motion.h1>

        {/* Manifesto Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-sm sm:text-base text-zinc-300 mb-10 font-mono-tech tracking-wide leading-relaxed"
        >
          Heavyweight French Terry, 260+ GSM combed vintage cotton tees, and baggy skater silhouettes.
          Place orders directly on <strong className="text-[#25D366] underline underline-offset-4">WhatsApp</strong> with same-day confirmation.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 rounded-xl btn-bw-primary text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer shadow-2xl"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Enter Apparel Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s! I want to check available inventory and place an order directly on WhatsApp.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-black hover:bg-[#20ba5a] text-xs font-mono-tech font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Place Order on WhatsApp</span>
          </a>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 text-zinc-400 text-xs font-mono-tech tracking-widest uppercase border-t border-white/10 pt-8 w-full max-w-2xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#25D366]">✦</span>
            <span>Instant WhatsApp Order</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>✦</span>
            <span>Heavyweight 260+ GSM</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <span>✦</span>
            <span>No Restocks Policy</span>
          </div>
        </motion.div>

      </div>

      {/* Down Arrow */}
      <Link
        href="/shop"
        className="absolute bottom-6 z-10 flex flex-col items-center text-zinc-500 hover:text-white transition-colors text-[10px] font-mono-tech uppercase tracking-widest gap-2"
      >
        <span>Explore Collection</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-white" />
      </Link>
    </section>
  );
}
