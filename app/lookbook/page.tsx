'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import { Camera, MessageCircle, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { ProductType } from '@/components/ProductCard';

export default function LookbookPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load lookbook products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      {/* Hero Header */}
      <section className="py-20 border-b border-zinc-800 bg-zinc-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/20 text-[#dfff00] text-[11px] font-mono-tech uppercase tracking-widest mb-6">
            <Camera className="w-3.5 h-3.5" />
            <span>EDITORIAL ARCHIVE • REAL DATABASE CATALOG</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-display font-black uppercase text-white tracking-tight">
            THE 1999 LOOKBOOK
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 font-mono-tech max-w-2xl mx-auto leading-relaxed">
            Direct visual showcase of the original archive garments pulled live from our Neon database.
          </p>
        </div>
      </section>

      {/* Editorial Grid from Real Database */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-[3/4] bg-zinc-950 border border-zinc-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <div
                key={product.id}
                className="group rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-[#dfff00]/40 transition-all duration-300"
              >
                <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-900 block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded text-[9px] font-mono-tech font-bold uppercase bg-black/80 text-[#dfff00] border border-[#dfff00]/30 backdrop-blur-md">
                    {product.category}
                  </span>
                  <span className="absolute bottom-4 right-4 text-xs font-mono-tech font-bold text-white/60 bg-black/70 px-2 py-0.5 rounded">
                    FIT #{String(idx + 1).padStart(2, '0')}
                  </span>
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-display font-black text-base uppercase text-white group-hover:text-[#dfff00] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <span className="font-mono-tech font-bold text-[#dfff00] text-sm">
                      LKR {product.price.toLocaleString('en-LK')}
                    </span>
                  </div>

                  <p className="text-xs font-mono-tech text-zinc-400 leading-relaxed font-light line-clamp-2">
                    {product.description}
                  </p>

                  <div className="pt-4 border-t border-zinc-800/80 flex justify-between items-center">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-xs font-mono-tech uppercase font-bold text-white hover:text-[#dfff00] flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View & Place Order</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201'}?text=${encodeURIComponent(`Hi late90s! I am looking at ${product.name} (LKR ${product.price}) from the 1999 lookbook.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] text-black text-xs font-mono-tech font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(37,211,102,0.4)] hover:bg-[#20ba5a]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Order Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="font-display font-black text-xl uppercase tracking-tight text-white">
            Need Custom Fit or Sizing Advice?
          </h3>
          <p className="text-xs font-mono-tech text-zinc-400">
            Chat directly with our styling team on WhatsApp for oversized drop-shoulder sizing guidelines.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201'}?text=${encodeURIComponent('Hi late90s! Can I get sizing advice for my height and weight?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-mono-tech font-bold uppercase shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat with Styling Team on WhatsApp</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
