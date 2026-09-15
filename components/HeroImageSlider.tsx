'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Sparkles, ExternalLink, ShieldCheck, Eye } from 'lucide-react';
import { ProductType } from './ProductCard';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.96,
  }),
};

export default function HeroImageSlider() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [[page, direction], setPage] = useState([0, 0]);
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
        console.error('Failed to load hero slider products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const total = products.length;
  const currentIndex = total > 0 ? ((page % total) + total) % total : 0;
  const activeProduct = products[currentIndex] || null;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  // Auto-play timer (advances slider every 4.5 seconds)
  useEffect(() => {
    if (!isAutoPlay || total <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, total, paginate]);

  return (
    <section
      className="relative min-h-[88vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden bg-black text-white scanlines border-b border-zinc-800 select-none"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Dynamic Blurred Ambience Glow from current product */}
      <AnimatePresence mode="wait">
        {activeProduct && (
          <motion.div
            key={`ambience-${activeProduct.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <img
              src={activeProduct.image}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-125 saturate-150"
            />
            <div className="absolute inset-0 bg-black/75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dfff00] animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono-tech uppercase tracking-widest text-[#dfff00] font-bold">
              LIVE ARCHIVE SLIDER
            </span>
            {total > 0 && (
              <span className="text-[11px] font-mono-tech text-zinc-400">
                • {total} VAULT GARMENTS IN DATABASE
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
            <span className="hidden md:inline text-zinc-500">
              CLICK & SWIPE TO BROWSE COLLECTION
            </span>
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 px-3 py-1 rounded-full text-white font-bold">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-zinc-600">/</span>
              <span>{String(total || 1).padStart(2, '0')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Center Slider Stage */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex items-center justify-center">
        {loading ? (
          <div className="w-full max-w-5xl aspect-[16/9] rounded-3xl bg-zinc-950 border border-zinc-800 animate-pulse flex items-center justify-center text-xs font-mono-tech text-zinc-500">
            SYNCING SLIDER WITH NEON DATABASE GARMENTS...
          </div>
        ) : !activeProduct ? (
          <div className="w-full max-w-3xl p-12 rounded-3xl bg-zinc-950 border border-zinc-800 text-center text-xs font-mono-tech text-zinc-400">
            ✦ NO ARCHIVE GARMENTS FOUND IN DATABASE. ADD PRODUCTS IN ADMIN PORTAL.
          </div>
        ) : (
          <div className="relative w-full max-w-5xl">
            
            {/* Nav Arrow: Left */}
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous Slide"
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/80 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Nav Arrow: Right */}
            <button
              onClick={() => paginate(1)}
              aria-label="Next Slide"
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-2xl bg-black/80 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer group"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Slide Track with AnimatePresence */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-700/80 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 260, damping: 28 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -10000 || offset.x < -100) {
                      paginate(1);
                    } else if (swipe > 10000 || offset.x > 100) {
                      paginate(-1);
                    }
                  }}
                  className="w-full grid grid-cols-1 lg:grid-cols-12 cursor-grab active:cursor-grabbing"
                >
                  {/* Slide Left: High-Resolution Photo */}
                  <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[480px] overflow-hidden bg-black group">
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-black/85 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                        LIVE NEON DB
                      </span>
                      {activeProduct.featured && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-[#dfff00] text-black shadow">
                          FEATURED
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech font-bold uppercase bg-white/10 text-white backdrop-blur-md">
                        {activeProduct.category}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden pointer-events-none" />
                  </div>

                  {/* Slide Right: Garment Editorial Data & Direct WhatsApp Order */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-zinc-950/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-zinc-800">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono-tech uppercase text-[#dfff00]">
                        <span>ARCHIVE ITEM • #{activeProduct.id.slice(-6).toUpperCase()}</span>
                        <span className="text-emerald-400 font-bold">● IN STOCK</span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-tight leading-tight">
                        {activeProduct.name}
                      </h2>

                      <p className="text-xs sm:text-sm font-mono-tech text-zinc-400 leading-relaxed font-light line-clamp-3">
                        {activeProduct.description || 'Heavyweight vintage washed streetwear blank. Custom oversized cut tailored with 100% combed cotton.'}
                      </p>

                      <div className="pt-2 flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-mono-tech font-black text-white">
                          LKR {activeProduct.price.toLocaleString('en-LK')}
                        </span>
                        <span className="text-xs font-mono-tech text-zinc-500 uppercase">
                          ALL TAXES INCLUDED
                        </span>
                      </div>

                      {/* Sizes Pill */}
                      {activeProduct.sizes && activeProduct.sizes.length > 0 && (
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">
                            SIZES:
                          </span>
                          <div className="flex gap-1.5">
                            {activeProduct.sizes.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono-tech font-bold text-zinc-300"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                          href={`/product/${activeProduct.id}`}
                          className="py-3.5 px-4 rounded-xl btn-bw-primary text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Garment</span>
                        </Link>

                        <a
                          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi late90s! I want to order ${activeProduct.name} (LKR ${activeProduct.price}) from the hero image slider.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-center shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Order on WA</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-500 pt-1">
                        <span>✦ Dispatches in 24-48 hours</span>
                        <span>✦ Cash on Delivery Available</span>
                      </div>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Progress Fill Line */}
            <div className="w-full bg-zinc-900 h-1 mt-4 rounded-full overflow-hidden">
              <motion.div
                key={`progress-${page}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className="h-full bg-[#dfff00]"
              />
            </div>

          </div>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Strip */}
      {total > 1 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 scrollbar-none">
            {products.map((p, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    const diff = idx - currentIndex;
                    paginate(diff === 0 ? 1 : diff);
                  }}
                  className={`group relative rounded-xl overflow-hidden aspect-[4/3] w-14 sm:w-20 transition-all duration-300 border cursor-pointer ${
                    isSelected
                      ? 'border-[#dfff00] ring-2 ring-[#dfff00]/50 scale-105 shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                      : 'border-zinc-800 opacity-50 hover:opacity-100 hover:border-zinc-600'
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
}
