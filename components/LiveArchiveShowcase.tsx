'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ProductType } from './ProductCard';

interface LiveArchiveShowcaseProps {
  products: ProductType[];
  loading: boolean;
}

export default function LiveArchiveShowcase({ products, loading }: LiveArchiveShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-advance cards every 4 seconds
  useEffect(() => {
    if (!isAutoPlay || products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, products.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
        <div className="aspect-[3/4] rounded-2xl bg-zinc-900 border border-zinc-800" />
        <div className="aspect-[3/4] rounded-2xl bg-zinc-900 border border-zinc-800 hidden sm:block" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-zinc-500 font-mono-tech text-xs">
        ✦ ARCHIVE GALLERY SYNCING WITH NEON DATABASE...
      </div>
    );
  }

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  // Get active item and next item for dynamic display
  const activeProduct = products[currentIndex];
  const nextProduct = products[(currentIndex + 1) % products.length];

  return (
    <div
      className="relative flex flex-col space-y-4"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Live Badge & Carousel Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-emerald-400 font-bold">
            LIVE NEON DB ARCHIVE
          </span>
          <span className="text-[10px] font-mono-tech text-zinc-500">
            [{currentIndex + 1}/{products.length}]
          </span>
        </div>

        {/* Carousel Prev/Next Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            aria-label="Previous garment"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next garment"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Display Grid (Mobile: 1 card, Desktop: 2 animated staggered cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Main Active Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`active-${activeProduct.id}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4 }}
            className="group relative p-3 sm:p-4 bg-zinc-950 border border-zinc-800 hover:border-[#dfff00]/50 rounded-2xl sm:-rotate-1 hover:rotate-0 transition-all duration-300 shadow-xl"
          >
            <Link href={`/product/${activeProduct.id}`} className="block">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Live Tag Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-black/85 text-emerald-400 border border-emerald-500/40">
                    LIVE INVENTORY
                  </span>
                  {activeProduct.featured && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-[#dfff00] text-black">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5 text-[#dfff00]" />
                </div>
              </div>

              {/* Garment Details Footer */}
              <div className="pt-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono-tech uppercase text-[#dfff00] tracking-wider block truncate">
                    CATEGORY / {activeProduct.category}
                  </span>
                  <h4 className="font-display font-black text-sm uppercase text-white group-hover:text-[#dfff00] transition-colors truncate">
                    {activeProduct.name}
                  </h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-mono-tech font-bold text-white block">
                    LKR {activeProduct.price.toLocaleString('en-LK')}
                  </span>
                  <span className="text-[9px] font-mono-tech text-emerald-400">
                    AVAILABLE
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Secondary Staggered Card (Shows next garment from live DB) */}
        {nextProduct && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`next-${nextProduct.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="hidden sm:block group relative p-3 sm:p-4 bg-zinc-950 border border-zinc-800 hover:border-[#dfff00]/50 rounded-2xl rotate-1 hover:rotate-0 transition-all duration-300 shadow-xl"
            >
              <Link href={`/product/${nextProduct.id}`} className="block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src={nextProduct.image}
                    alt={nextProduct.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Live Tag Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-black/85 text-white border border-white/20">
                      NEXT IN VAULT
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-[#dfff00]" />
                  </div>
                </div>

                {/* Garment Details Footer */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono-tech uppercase text-zinc-400 tracking-wider block truncate">
                      CATEGORY / {nextProduct.category}
                    </span>
                    <h4 className="font-display font-black text-sm uppercase text-white group-hover:text-[#dfff00] transition-colors truncate">
                      {nextProduct.name}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono-tech font-bold text-white block">
                      LKR {nextProduct.price.toLocaleString('en-LK')}
                    </span>
                    <span className="text-[9px] font-mono-tech text-emerald-400">
                      AVAILABLE
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              setIsAutoPlay(false);
              setCurrentIndex(idx);
            }}
            aria-label={`Go to product ${idx + 1}`}
            className={`h-1 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-6 bg-[#dfff00]'
                : 'w-2 bg-zinc-800 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
