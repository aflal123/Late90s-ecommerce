'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Send, Shield } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dfff00]" />
              <span className="text-2xl font-display font-black text-white tracking-tighter uppercase">
                LATE<span className="text-[#dfff00]">90S</span>
              </span>
            </Link>
            <p className="text-xs font-mono-tech text-zinc-500 leading-relaxed font-light">
              Underground streetwear blanks engineered with 260+ GSM combed cottons and 480 GSM French Terry fleeces.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s! I want to check drop availability.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-mono-tech uppercase font-bold hover:bg-[#25D366] hover:text-black transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Place Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-mono-tech font-bold text-xs uppercase tracking-widest text-white">
              Archive Directory
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech">
              <li>
                <Link href="/shop" className="hover:text-[#dfff00] transition-colors">
                  ✦ Apparel Vault
                </Link>
              </li>
              <li>
                <Link href="/lookbook" className="hover:text-[#dfff00] transition-colors">
                  ✦ 1999 Lookbook
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[#dfff00] transition-colors">
                  ✦ Community Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#dfff00] transition-colors">
                  ✦ Brand Story & Specs
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#dfff00] transition-colors">
                  ✦ Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Fit */}
          <div className="space-y-3">
            <h4 className="font-mono-tech font-bold text-xs uppercase tracking-widest text-white">
              Ordering Standards
            </h4>
            <ul className="space-y-2 text-xs font-mono-tech text-zinc-500">
              <li>
                <span className="text-zinc-300">WhatsApp Dispatch:</span> <span className="text-emerald-400">24-48 Hours</span>
              </li>
              <li>
                <span className="text-zinc-300">Fabric:</span> 100% Combed Heavy Cotton
              </li>
              <li>
                <span className="text-zinc-300">Sizes:</span> S, M, L, XL, XXL
              </li>
              <li>
                <span className="text-zinc-300">Size Swap:</span> Free 7-Day Exchange
              </li>
              <li>
                <Link href="/admin" className="text-zinc-600 hover:text-white flex items-center gap-1 pt-1">
                  <Shield className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Early Drop Pass */}
          <div className="space-y-3">
            <h4 className="font-mono-tech font-bold text-xs uppercase tracking-widest text-white">
              VIP Drop Alert
            </h4>
            <p className="text-xs font-mono-tech text-zinc-500">
              Get notified 15 minutes before the next archive drop goes live on WhatsApp.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-xs font-mono-tech focus:outline-none focus:border-[#dfff00]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-[#dfff00] text-black hover:scale-105 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] font-mono-tech text-[#dfff00] block animate-pulse">
                  ✓ You are added to the VIP notification list.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} LATE90S APPAREL ARCHIVE. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-2">
            <span>Powered by <strong className="text-emerald-400">Neon Postgres</strong></span>
            <span>•</span>
            <span><strong className="text-[#25D366]">WhatsApp Instant Ordering</strong></span>
          </p>
        </div>
      </div>
    </footer>
  );
}
