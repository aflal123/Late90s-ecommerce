'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import { ShieldCheck, Sparkles, MessageCircle, ArrowRight, Layers, Truck, Check } from 'lucide-react';

export default function AboutPage() {
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      {/* Hero */}
      <section className="py-20 border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-mono-tech uppercase text-zinc-400 tracking-widest block mb-3">
            ✦ THE UNDERGROUND MANIFESTO
          </span>
          <h1 className="text-4xl sm:text-7xl font-display font-black uppercase text-white tracking-tight">
            THE LATE90S ARCHIVE
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-mono-tech mt-4 max-w-2xl mx-auto leading-relaxed">
            Reclaiming the raw weight, extreme proportions, and non-conformist energy of 1990s streetwear culture.
          </p>
        </div>
      </section>

      {/* Brand Heritage & Fabric Specs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono-tech text-zinc-500 uppercase tracking-widest">
              01 / THE ORIGIN
            </span>
            <h2 className="text-3xl font-display font-black uppercase text-white">
              BORN FROM VINTAGE SKATE & CYBER CLUBS
            </h2>
            <p className="text-xs sm:text-sm font-mono-tech text-zinc-300 leading-relaxed font-light">
              late90s was founded on a simple realization: modern fast-fashion cuts corners on weight, silhouette drape, and authentic distressing.
            </p>
            <p className="text-xs sm:text-sm font-mono-tech text-zinc-400 leading-relaxed font-light">
              We engineer custom heavyweight blanks—260+ GSM combed cotton for boxy tees and 480 GSM French Terry for heavyweight distressed hoodies that maintain their structure for years.
            </p>
          </div>

          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80"
              alt="late90s Archive Streetwear"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
        </div>

        {/* GSM Specs Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono-tech text-zinc-500 uppercase tracking-widest block mb-1">
              02 / MATERIAL STANDARDS
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
              FABRIC ENGINEERING CODES
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-3xl font-display font-black text-white">260+ GSM</span>
              <h4 className="font-display font-bold text-sm uppercase text-white">
                Combed Vintage Tees
              </h4>
              <p className="text-xs font-mono-tech text-zinc-400 leading-relaxed">
                Thick, pre-shrunk organic combed cotton with tight 1.25&quot; ribbing collar and vintage enzyme wash.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-3xl font-display font-black text-white">480 GSM</span>
              <h4 className="font-display font-bold text-sm uppercase text-white">
                French Terry Fleece
              </h4>
              <p className="text-xs font-mono-tech text-zinc-400 leading-relaxed">
                Ultra-dense loopback French Terry with no synthetic polyester blends. Natural drape with raw distressed cuffs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-3xl font-display font-black text-white">14 OZ</span>
              <h4 className="font-display font-bold text-sm uppercase text-white">
                Rigid Skater Denims
              </h4>
              <p className="text-xs font-mono-tech text-zinc-400 leading-relaxed">
                Heavyweight 100% cotton rigid denim with authentic 90s vintage wash patterns and reinforced knee panels.
              </p>
            </div>
          </div>
        </div>

        {/* Why WhatsApp CTO? */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black uppercase text-white">
                WHY PLACE ORDERS ON WHATSAPP?
              </h3>
              <p className="text-xs font-mono-tech text-zinc-400">
                Direct community connection with instant confirmation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-tech text-zinc-300">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>Direct 1-on-1 size confirmation and fit double-check before shipping.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>Real-time courier dispatch tracking sent straight to your chat.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>Zero third-party checkout popups; saved directly into our Neon DB.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl btn-bw-primary text-xs font-mono-tech flex items-center justify-center gap-2"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s! I want to ask a question regarding your brand and sizing.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl btn-bw-outline text-xs font-mono-tech flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </section>

      <Footer />
    </main>
  );
}
