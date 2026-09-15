'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MarqueeTicker from '@/components/MarqueeTicker';
import HeroVideo from '@/components/HeroVideo';
import ProductCard, { ProductType } from '@/components/ProductCard';
import LiveArchiveShowcase from '@/components/LiveArchiveShowcase';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Camera, Star, ShieldCheck, MessageCircle, Layers } from 'lucide-react';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, catRes, revRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/reviews'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const revData = await revRes.json();

        if (prodData.success) {
          setAllProducts(prodData.products);
        }
        if (catData.success) {
          setCategories(catData.categories);
        }
        if (revData.success) {
          setReviews(revData.reviews.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products by selected category
  const displayedProducts = allProducts.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      {/* Navigation */}
      <Navbar />

      {/* Hero Video with Sound Controls */}
      <HeroVideo />

      {/* Marquee Banner */}
      <MarqueeTicker />

      {/* Section 1: Live Catalog by Categories (Live from Neon DB) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#dfff00] animate-pulse" />
              <span className="text-[11px] font-mono-tech uppercase text-zinc-400 tracking-widest">
                ORIGINAL ARCHIVE SELECTION • LIVE INVENTORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
              VAULT APPAREL DROPS
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono-tech mt-2 max-w-xl leading-relaxed">
              Heavyweight 260+ GSM combed cotton tees, vintage distressed silhouettes, and custom cuts synced live with our database.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl btn-bw-primary text-xs font-mono-tech self-start md:self-auto w-full sm:w-auto"
          >
            <span>View All Vault Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Category Filter Tabs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-[#dfff00] text-black font-bold shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ALL PIECES</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                {allProducts.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = allProducts.filter(
                (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
              ).length;
              const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#dfff00] text-black font-bold shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 aspect-[3/5] animate-pulse"
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4 my-6">
            <span className="text-xs font-mono-tech uppercase tracking-widest text-[#dfff00] block">
              ✦ ARCHIVE STATUS
            </span>
            <h3 className="font-display font-black text-xl uppercase text-white">
              No garments currently listed under this category
            </h3>
            <p className="text-xs font-mono-tech text-zinc-400 max-w-md mx-auto">
              New archive pieces are added weekly. You can also request custom orders directly on WhatsApp.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="px-5 py-2.5 rounded-xl btn-bw-primary text-xs font-mono-tech"
              >
                Show All Available Drops ({allProducts.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Editorial Lookbook & Live Database Photo Showcase */}
      <section className="py-16 sm:py-24 bg-zinc-950 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            
            {/* Left: Editorial Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#dfff00]" />
                <span className="text-xs font-mono-tech uppercase text-zinc-400 tracking-widest block">
                  EDITORIAL ARCHIVE • LIVE LOOKBOOK
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
                THE 1999 STREETWEAR LOOKBOOK
              </h2>
              <p className="text-xs sm:text-sm font-mono-tech text-zinc-400 leading-relaxed font-light">
                Extreme oversized proportions, heavyweight organic cottons, and non-conformist aesthetics. Styled exclusively with original late90s archive pieces pulled live from our inventory.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/lookbook"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-bw-primary text-xs font-mono-tech w-full sm:w-auto"
                >
                  <Camera className="w-4 h-4" />
                  <span>View Full Lookbook</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-bw-outline text-xs font-mono-tech w-full sm:w-auto"
                >
                  <span>Brand Manifesto</span>
                </Link>
              </div>
            </div>

            {/* Right: Live Database Animated Photo Showcase (Replacing mock polaroids) */}
            <div className="lg:col-span-7 w-full">
              <LiveArchiveShowcase products={allProducts} loading={loading} />
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: Verified Community Testimonials Snippet */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono-tech uppercase text-zinc-500 tracking-widest block mb-2">
              ✦ COMMUNITY VALIDATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
              WHAT BUYERS ARE SAYING
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono-tech mt-2">
              100% verified feedback pulled live from our Neon database.
            </p>
          </div>

          <Link
            href="/reviews"
            className="text-xs font-mono-tech uppercase text-white hover:underline flex items-center gap-1.5"
          >
            <span>Read All Testimonials ({reviews.length}) →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-2xl glass-card border border-zinc-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex text-white mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-white" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-mono-tech text-zinc-300 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs font-mono-tech">
                <span className="font-bold text-white uppercase">{rev.customerName}</span>
                <span className="text-zinc-500 text-[10px]">Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTO Direct Banner */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-6 relative overflow-hidden">
          <span className="text-xs font-mono-tech uppercase text-zinc-400 tracking-widest block">
            ✦ 1-ON-1 DIRECT ORDERING
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
            ORDER ANY DROP DIRECTLY ON WHATSAPP
          </h2>
          <p className="text-xs sm:text-sm font-mono-tech text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Skip complex checkouts. Select your garment and size, click <strong className="text-[#25D366]">Place Order</strong>, and confirm your delivery details directly with our team.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl btn-bw-primary text-xs font-mono-tech"
            >
              <span>Explore Vault Drops</span>
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201'}?text=${encodeURIComponent('Hi late90s! I want to check available inventory.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-black hover:bg-[#20ba5a] text-xs font-mono-tech font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Place Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
