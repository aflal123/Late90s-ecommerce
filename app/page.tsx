'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MarqueeTicker from '@/components/MarqueeTicker';
import HeroVideo from '@/components/HeroVideo';
import ProductCard, { ProductType } from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Camera, Star, ShieldCheck, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/reviews'),
        ]);

        const prodData = await prodRes.json();
        const revData = await revRes.json();

        if (prodData.success) {
          // If less than 4 featured, fallback to first 4 products
          if (prodData.products.length < 4) {
            const allProdRes = await fetch('/api/products');
            const allProdData = await allProdRes.json();
            if (allProdData.success) setFeaturedProducts(allProdData.products.slice(0, 4));
          } else {
            setFeaturedProducts(prodData.products.slice(0, 4));
          }
        }
        if (revData.success) setReviews(revData.reviews.slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      {/* Navigation */}
      <Navbar />

      {/* Hero Video with Sound Controls */}
      <HeroVideo />

      {/* Marquee Banner */}
      <MarqueeTicker />

      {/* Section 1: Featured Archive Drops (Live from Neon DB) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-mono-tech uppercase text-zinc-500 tracking-widest block mb-2">
              ✦ ORIGINAL ARCHIVE SELECTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
              FEATURED ARCHIVE DROPS
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono-tech mt-2">
              Heavyweight 260+ GSM combed tees and 480 GSM French Terry fleeces.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-bw-primary text-xs font-mono-tech self-start md:self-auto"
          >
            <span>View All Vault Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 aspect-[3/5] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: 1999 Lookbook Editorial Teaser */}
      <section className="py-20 bg-zinc-950 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono-tech uppercase text-zinc-500 tracking-widest block">
                ✦ EDITORIAL ARCHIVE
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
                THE 1999 STREETWEAR LOOKBOOK
              </h2>
              <p className="text-xs sm:text-sm font-mono-tech text-zinc-400 leading-relaxed font-light">
                Extreme oversized proportions, heavyweight organic cottons, and non-conformist aesthetics. Styled exclusively with original late90s archive pieces.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/lookbook"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-bw-primary text-xs font-mono-tech"
                >
                  <Camera className="w-4 h-4" />
                  <span>View Full Lookbook</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-bw-outline text-xs font-mono-tech"
                >
                  <span>Brand Manifesto</span>
                </Link>
              </div>
            </div>

            {/* Lookbook Preview Polaroid Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="p-3 bg-black border border-zinc-800 rounded-2xl -rotate-2 hover:rotate-0 transition-transform">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                    alt="Look 01"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
                <p className="text-[11px] font-mono-tech uppercase font-bold text-white mt-2">
                  Acid Subway Drift
                </p>
              </div>

              <div className="p-3 bg-black border border-zinc-800 rounded-2xl rotate-2 hover:rotate-0 transition-transform">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
                    alt="Look 02"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
                <p className="text-[11px] font-mono-tech uppercase font-bold text-white mt-2">
                  480 GSM Heavy Fleece
                </p>
              </div>
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
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent('Hi late90s! I want to check available inventory.')}`}
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
