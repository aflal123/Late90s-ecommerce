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
    { name: 'Home', href: '/' },
    { name: 'Apparel Vault', href: '/shop' },
    { name: '1999 Lookbook', href: '/lookbook' },
    { name: 'Testimonials', href: '/reviews' },
    { name: 'The Archive', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-black/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo without (r) */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <span className="w-2.5 h-2.5 rounded-full bg-[#dfff00] group-hover:scale-125 transition-transform" />
              <span className="text-2xl sm:text-3xl font-display font-black tracking-tighter uppercase text-white group-hover:text-[#dfff00] transition-colors">
                LATE<span className="text-[#dfff00]">90S</span>
              </span>
            </Link>
          </div>

          {/* Multi-Page Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-tech tracking-widest uppercase">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors flex items-center gap-1 ${
                    isActive
                      ? 'text-[#dfff00] font-bold underline underline-offset-8 decoration-[#dfff00]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* WhatsApp Direct Support CTA with vivid color */}
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hi late90s team! I want to inquire about your apparel collection and place an order.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] text-xs font-mono-tech uppercase font-bold tracking-wider hover:bg-[#25D366] hover:text-black hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
              title="Place order on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Place Order</span>
            </a>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </Link>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#dfff00]" /> : <Moon className="w-4 h-4 text-zinc-800" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white text-black hover:bg-[#dfff00] transition-all flex items-center justify-center cursor-pointer shadow-lg"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#25D366] text-black font-mono-tech font-bold text-[10px] w-5 h-5 rounded-full border border-black flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Multi-Page Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-4 font-mono-tech uppercase text-sm tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 flex items-center justify-between ${
                  pathname === link.href ? 'text-[#dfff00] font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-600" />
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="py-1 text-zinc-400 hover:text-white flex items-center justify-between w-full text-left cursor-pointer"
            >
              <span>Appearance: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#dfff00]" /> : <Moon className="w-4 h-4 text-zinc-400" />}
            </button>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-zinc-400 hover:text-white flex items-center justify-between"
            >
              <span>Shopping Bag ({totalItems})</span>
              <ShoppingBag className="w-4 h-4 text-[#dfff00]" />
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-500 hover:text-white flex items-center gap-2 pt-2 border-t border-zinc-800 text-xs"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Portal
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
