'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight, Eye } from 'lucide-react';
import { ProductType } from './ProductCard';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
};

export default function HeroImageSlider({ initialProducts = [] }: { initialProducts?: ProductType[] }) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  // Fetch live products straight from database via API
  useEffect(() => {
    let isMounted = true;
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to sync live products from database', err);
      }
    }
    loadLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync if initialProducts from server changes
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  const total = products.length;
  const currentIndex = total > 0 ? ((page % total) + total) % total : 0;
  const activeProduct = total > 0 ? products[currentIndex] : null;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  // Auto-play timer (slides every 3.2 seconds - snappier)
  useEffect(() => {
    if (!isAutoPlay || total <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoPlay, total, paginate]);

  // Preload upcoming slide image for instant zero-lag transition
  useEffect(() => {
    if (products.length <= 1) return;
    const nextIdx = (currentIndex + 1) % products.length;
    const nextImg = products[nextIdx]?.image;
    if (nextImg) {
      const img = new Image();
      img.src = nextImg;
    }
  }, [currentIndex, products]);

  return (
    <section
      className="relative w-full h-[90vh] sm:h-[95vh] lg:h-screen overflow-hidden bg-black select-none hero-slider-section"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {activeProduct && (
        <>
          {/* Full Screen Image Slider Stage */}
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
                opacity: { duration: 0.35 },
                scale: { duration: 0.4 },
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
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Full Bleed Image with Instant Eager Loading */}
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                loading="eager"
                decoding="async"
                // @ts-ignore
                fetchPriority="high"
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-110"
              />

              {/* Cinematic Vignette & Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-bw pointer-events-none opacity-40" />

              {/* Overlaid Streetwear Content Container */}
              <div className="absolute inset-0 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 sm:py-16 pointer-events-none">
                
                {/* Bottom Centerpiece: Headline, Price, & Actions */}
                <div className="space-y-4 sm:space-y-6 max-w-2xl pointer-events-auto pb-6 sm:pb-8">
                  
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black uppercase text-white !text-white tracking-tighter leading-none drop-shadow-2xl">
                    {activeProduct.name}
                  </h1>

                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl sm:text-4xl font-mono-tech font-black text-[#dfff00] !text-[#dfff00] drop-shadow-lg">
                      LKR {activeProduct.price.toLocaleString('en-LK')}
                    </span>
                    
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2">
                    <Link
                      href={`/product/${activeProduct.id}`}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl btn-bw-primary text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Garment Piece</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi late90s! I want to order ${activeProduct.name} (LKR ${activeProduct.price}) from your fullscreen hero slider.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-black hover:bg-[#20ba5a] text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>

                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrow: Left Edge (Hidden on mobile to avoid overlapping WhatsApp button) */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Nav Arrow: Right Edge (Hidden on mobile to avoid overlapping WhatsApp button) */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next Slide"
            className="hidden sm:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>



          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
            <motion.div
              key={`progress-${page}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.2, ease: 'linear' }}
              className="h-full bg-[#dfff00]"
            />
          </div>
        </>
      )}
    </section>
  );
}
