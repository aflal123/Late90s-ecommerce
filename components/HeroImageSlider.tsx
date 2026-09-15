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

const FALLBACK_HERO_PRODUCTS: ProductType[] = [
  {
    id: 'hero-drop-1',
    name: 'LATE90S Acid Cyber Vintage Tee',
    price: 6500,
    category: 'tees',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1600&auto=format&fit=crop',
    featured: true,
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    description: 'Heavyweight 260+ GSM vintage washed drop-shoulder boxy tee.',
  },
  {
    id: 'hero-drop-2',
    name: 'Distressed 450 GSM Heavy French Terry Hoodie',
    price: 14500,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1600&auto=format&fit=crop',
    featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Custom boxy heavyweight hoodie with distressed hems.',
  },
  {
    id: 'hero-drop-3',
    name: 'Subway Cyber Drift Track Jacket',
    price: 18500,
    category: 'outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1600&auto=format&fit=crop',
    featured: true,
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    description: 'Retro racing nylon bomber with reflective piping.',
  },
  {
    id: 'hero-drop-4',
    name: 'Wide-Leg 90s Cyber Skater Cargo Pants',
    price: 9500,
    category: 'bottoms',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop',
    featured: true,
    sizes: ['30', '32', '34'],
    inStock: true,
    description: 'Wide-leg skater denim with utility pockets and reinforced knees.',
  },
];

export default function HeroImageSlider({ initialProducts }: { initialProducts?: ProductType[] }) {
  const [products, setProducts] = useState<ProductType[]>(
    initialProducts && initialProducts.length > 0 ? initialProducts : FALLBACK_HERO_PRODUCTS
  );
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  // Fetch live products in the background without blocking render
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
        console.error('Silently fallback to initial hero products', err);
      }
    }
    loadLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const total = products.length;
  const currentIndex = total > 0 ? ((page % total) + total) % total : 0;
  const activeProduct = products[currentIndex] || FALLBACK_HERO_PRODUCTS[0];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    []
  );

  // Auto-play timer (slides every 4.5 seconds)
  useEffect(() => {
    if (!isAutoPlay || total <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 4500);
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
      className="relative w-full h-[90vh] sm:h-[95vh] lg:h-screen overflow-hidden bg-black select-none"
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
                x: { type: 'spring', stiffness: 220, damping: 26 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.6 },
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
                  <span className="text-xs sm:text-sm font-mono-tech uppercase text-zinc-300 tracking-[0.3em] block">
                    ✦ LATE90S ORIGINAL ARCHIVE
                  </span>

                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black uppercase text-white tracking-tighter leading-none drop-shadow-2xl">
                    {activeProduct.name}
                  </h1>

                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl sm:text-4xl font-mono-tech font-black text-[#dfff00] drop-shadow-lg">
                      LKR {activeProduct.price.toLocaleString('en-LK')}
                    </span>
                    <span className="text-xs font-mono-tech uppercase px-2.5 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40">
                      ● IN STOCK
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

          {/* Nav Arrow: Left Edge */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous Slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Nav Arrow: Right Edge */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next Slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#dfff00] text-white hover:text-black border border-white/20 hover:border-[#dfff00] transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>



          {/* Bottom Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
            <motion.div
              key={`progress-${page}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="h-full bg-[#dfff00]"
            />
          </div>
        </>
      )}
    </section>
  );
}
