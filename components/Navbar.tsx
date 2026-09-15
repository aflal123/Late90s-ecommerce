'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle, Menu, X, Shield, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const whatsappNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94775494201';

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'Lookbook', href: '/lookbook' },
    { name: 'About', href: '/about' },
    { name: 'Reviews', href: '/reviews' },
  ];

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200 ${
      isLight ? 'bg-white/95 border-zinc-200 shadow-sm' : 'bg-black/90 border-zinc-800/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 sm:h-20">
          
          {/* Brand Logo - Left */}
          <div className="flex items-center justify-start">
            <Link href="/" className="inline-flex items-center group">
              <span className={`text-2xl sm:text-3xl font-display font-black tracking-tighter uppercase transition-colors leading-none ${
                isLight ? 'text-black group-hover:text-zinc-600' : 'text-white group-hover:text-[#dfff00]'
              }`}>
                LATE<span className={isLight ? 'text-zinc-900 underline decoration-black underline-offset-4' : 'text-[#dfff00]'}>90S</span>
              </span>
            </Link>
          </div>

          {/* Minimalist Navigation - Dead Center in Straight Line */}
          <nav className="hidden md:flex items-center justify-center space-x-8 text-xs font-mono-tech tracking-widest uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1.5 border-b-2 ${
                    isActive
                      ? isLight
                        ? 'text-black font-bold border-black'
                        : 'text-[#dfff00] font-bold border-[#dfff00]'
                      : isLight
                        ? 'text-zinc-600 hover:text-black border-transparent font-medium'
                        : 'text-zinc-400 hover:text-white border-transparent'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons - Right */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3">
            
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-colors cursor-pointer ${
                isLight
                  ? 'text-zinc-800 hover:text-black hover:bg-zinc-100 border-zinc-300'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-black" /> : <Sun className="w-4 h-4 text-[#dfff00]" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md ${
                isLight
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-white text-black hover:bg-[#dfff00]'
              }`}
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 font-mono-tech font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse ${
                  isLight
                    ? 'bg-black text-white border border-white'
                    : 'bg-[#25D366] text-black border border-black'
                }`}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2.5 rounded-xl border transition-colors ${
                isLight
                  ? 'text-zinc-800 hover:bg-zinc-100 border-zinc-300'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900 border-zinc-800'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Multi-Page Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t backdrop-blur-xl px-6 py-6 space-y-4 ${
          isLight ? 'bg-white/98 border-zinc-200' : 'bg-black/95 border-zinc-800'
        }`}>
          <nav className="flex flex-col space-y-4 font-mono-tech uppercase text-sm tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 flex items-center justify-between ${
                  pathname === link.href
                    ? isLight ? 'text-black font-bold' : 'text-[#dfff00] font-bold'
                    : isLight ? 'text-zinc-600 hover:text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ArrowUpRight className={`w-4 h-4 ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`} />
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`py-1 flex items-center justify-between w-full text-left cursor-pointer ${
                isLight ? 'text-zinc-700 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Appearance: {isLight ? 'Light Mode' : 'Dark Mode'}</span>
              {isLight ? <Moon className="w-4 h-4 text-black" /> : <Sun className="w-4 h-4 text-[#dfff00]" />}
            </button>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 flex items-center justify-between ${
                isLight ? 'text-zinc-700 hover:text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Shopping Bag ({totalItems})</span>
              <ShoppingBag className={`w-4 h-4 ${isLight ? 'text-black' : 'text-[#dfff00]'}`} />
            </Link>
          </nav>
          <div className="pt-2">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s! I want to order via WhatsApp.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-black font-bold uppercase tracking-wider text-xs font-mono-tech shadow-lg"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Place Order on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
