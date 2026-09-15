'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ProductType } from './ProductCard';

export default function HeroImageShowcase() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load hero products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Auto-cycle through products every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlay || products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, products.length]);

  const activeProduct = products[currentIndex] || null;
  const nextProduct = products.length > 1 ? products[(currentIndex + 1) % products.length] : null;

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white py-12 lg:py-20 scanlines border-b border-zinc-800"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Dynamic Ambient Background Glow from Active Product Image */}
      <AnimatePresence mode="wait">
        {activeProduct && (
          <motion.div
            key={`bg-${activeProduct.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          >
            <img
              src={activeProduct.image}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-125 saturate-150"
            />
            <div className="absolute inset-0 bg-black/80" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none z-1" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Typography & Direct CTA */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Live Inventory Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/20 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono-tech tracking-widest uppercase text-[#dfff00] font-bold">
                LIVE DATABASE ARCHIVE
              </span>
              {products.length > 0 && (
                <span className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-400">
                  • {products.length} PIECES READY
                </span>
              )}
            </div>

            {/* Giant Streetwear Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tighter uppercase leading-[0.88] text-white">
              LATE 90S <br />
              <span className="text-zinc-500 hover:text-[#dfff00] transition-colors duration-500">
                STREETWEAR
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-mono-tech max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Heavyweight French Terry, 260+ GSM combed vintage cotton blanks, and oversized cuts. Each garment is cataloged in real-time from our database and fulfilled directly on <strong className="text-[#25D366]">WhatsApp</strong>.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-bw-primary text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
              >
                <span>Explore Vault ({products.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s! I want to check available inventory and place an order directly on WhatsApp.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-black hover:bg-[#20ba5a] text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Order</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-[10px] font-mono-tech text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="text-[#dfff00]">✦</span> Same-Day Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#dfff00]">✦</span> 100% Cotton Blanks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#dfff00]">✦</span> Verified Archive
              </span>
            </div>

          </div>

          {/* Right Column: Dynamic Live Database Photo Animation Cards */}
          <div className="lg:col-span-6 w-full flex flex-col items-center">
            {loading ? (
              <div className="w-full max-w-md aspect-[3/4] rounded-3xl bg-zinc-950 border border-zinc-800 animate-pulse flex items-center justify-center text-xs font-mono-tech text-zinc-600">
                LOADING LIVE ARCHIVE PIECES...
              </div>
            ) : !activeProduct ? (
              <div className="w-full max-w-md p-10 rounded-3xl bg-zinc-950 border border-zinc-800 text-center font-mono-tech text-xs text-zinc-500">
                ✦ NO PRODUCTS LOADED YET. ADD ITEMS IN ADMIN PORTAL.
              </div>
            ) : (
              <div className="relative w-full max-w-md">
                
                {/* Secondary Background Stack Card (Preview of next product from DB) */}
                {nextProduct && (
                  <div className="hidden sm:block absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden scale-95 opacity-60 pointer-events-none transition-all duration-500">
                    <img
                      src={nextProduct.image}
                      alt=""
                      className="w-full h-full object-cover object-center grayscale contrast-125"
                    />
                  </div>
                )}

                {/* Primary Interactive Front Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-card-${activeProduct.id}`}
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -15 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="relative rounded-3xl bg-zinc-950 border border-zinc-700/80 hover:border-[#dfff00] p-4 sm:p-5 shadow-2xl transition-all duration-300 group -rotate-1 hover:rotate-0"
                  >
                    {/* Live Garment Image */}
                    <Link href={`/product/${activeProduct.id}`} className="block">
                      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-900">
                        <img
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          <span className="px-2.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-black/85 text-emerald-400 border border-emerald-500/40">
                            LIVE INVENTORY
                          </span>
                          {activeProduct.featured && (
                            <span className="px-2.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase bg-[#dfff00] text-black">
                              FEATURED
                            </span>
                          )}
                        </div>

                        {/* Hover Prompt */}
                        <div className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-mono-tech">
                          <span>View Piece</span>
                          <ExternalLink className="w-3 h-3 text-[#dfff00]" />
                        </div>
                      </div>

                      {/* Card Meta Bar */}
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono-tech uppercase text-[#dfff00] tracking-wider block truncate">
                            CATEGORY / {activeProduct.category}
                          </span>
                          <h3 className="font-display font-black text-lg uppercase text-white group-hover:text-[#dfff00] transition-colors truncate">
                            {activeProduct.name}
                          </h3>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-base font-mono-tech font-black text-white block">
                            LKR {activeProduct.price.toLocaleString('en-LK')}
                          </span>
                          <span className="text-[10px] font-mono-tech text-emerald-400">
                            ● IN STOCK
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Quick Order Actions on the Card */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <Link
                        href={`/product/${activeProduct.id}`}
                        className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-mono-tech font-bold uppercase tracking-wider text-center transition-colors"
                      >
                        View Garment
                      </Link>
                      
                      <a
                        href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi late90s! I want to order ${activeProduct.name} (LKR ${activeProduct.price}) from your live hero showcase.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-black text-[11px] font-mono-tech font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Order WA</span>
                      </a>
                    </div>

                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls & Garment Counter */}
                <div className="mt-5 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tech text-zinc-400">
                      Archive Garment <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{products.length}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous garment"
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next garment"
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicator Dots */}
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {products.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setIsAutoPlay(false);
                        setCurrentIndex(idx);
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex
                          ? 'w-6 bg-[#dfff00]'
                          : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
