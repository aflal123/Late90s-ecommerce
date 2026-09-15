'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, MessageCircle, ArrowUpRight } from 'lucide-react';
import { ProductType } from './ProductCard';

export default function LookbookSection() {
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products.slice(0, 4));
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <section id="lookbook" className="py-24 bg-zinc-950 border-y border-zinc-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-[#dfff00] text-xs font-mono-tech uppercase tracking-widest mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>EDITORIAL 1999 • ARCHIVE CATALOG</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            VINTAGE STREETWEAR CODES
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 font-mono-tech leading-relaxed">
            Raw textures, extreme oversized draping, and non-conformist aesthetics. Styled exclusively with original late90s archive pieces.
          </p>
        </div>

        {/* Real Products Polaroid Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item, idx) => (
            <Link
              key={item.id}
              href={`/product/${item.id}`}
              className={`p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#dfff00]/50 ${
                idx % 2 === 0 ? '-rotate-1' : 'rotate-1'
              } group block`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded text-[9px] font-mono-tech font-bold uppercase bg-black/80 text-[#dfff00] border border-[#dfff00]/30 backdrop-blur-md">
                  {item.category}
                </span>
                <span className="absolute top-3 right-3 text-xs font-mono-tech font-bold text-[#dfff00]">
                  LKR {item.price}
                </span>
              </div>

              <div className="mt-4 px-1 flex justify-between items-center">
                <div>
                  <h4 className="font-display font-black text-xs text-white uppercase tracking-wider group-hover:text-[#dfff00] transition-colors truncate max-w-[180px]">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono-tech mt-0.5">
                    Click to View & Place Order
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#dfff00] transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* View Full Lookbook Link */}
        <div className="mt-16 text-center">
          <Link
            href="/lookbook"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl btn-bw-primary text-xs font-mono-tech"
          >
            <span>View Complete 1999 Lookbook</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
