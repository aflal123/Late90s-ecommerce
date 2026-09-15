'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    setIsCheckoutOpen,
    setDirectCheckoutItem,
  } = useCart();

  const handleOpenCheckout = () => {
    setDirectCheckoutItem(null); // multi-item checkout
    setIsCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      <section className="py-12 flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono-tech uppercase text-zinc-500 tracking-widest block mb-1">
              CHECKOUT SYSTEM
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white">
              YOUR SHOPPING BAG ({totalItems})
            </h1>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold uppercase text-white">
                Your Shopping Bag is Empty
              </h3>
              <p className="text-xs font-mono-tech text-zinc-500 mt-1">
                Explore the latest oversized drops from our archive.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-bw-primary text-xs font-mono-tech"
            >
              <span>Explore Apparel Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl glass-card border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <Link href={`/product/${item.productId}`}>
                        <h4 className="font-display font-bold text-sm uppercase text-white hover:text-zinc-300 transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-xs font-mono-tech text-zinc-400">
                        Size: <strong className="text-white">{item.size}</strong>
                      </p>
                      <p className="text-sm font-mono-tech font-bold text-white">
                        LKR {item.price.toLocaleString('en-LK')} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                    <div className="inline-flex items-center rounded-lg bg-zinc-950 border border-zinc-800 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded text-zinc-400 hover:text-white flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-mono-tech font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded text-zinc-400 hover:text-white flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-tech font-bold text-base text-white block">
                        LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] font-mono-tech text-zinc-500 hover:text-red-400 mt-1 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 sticky top-28">
                <h3 className="font-display font-black text-base uppercase text-white">
                  Order Breakdown
                </h3>

                <div className="space-y-3 text-xs font-mono-tech">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal ({totalItems} items):</span>
                    <span className="text-white">LKR {totalPrice.toLocaleString('en-LK')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping:</span>
                    <span className="text-white font-bold">FREE (Drop 001)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Order Mode:</span>
                    <span className="text-[#25D366] font-bold">WhatsApp Direct</span>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm font-bold">
                    <span className="text-white uppercase font-display">Total Amount:</span>
                    <span className="text-2xl font-mono-tech font-bold text-[#dfff00]">
                      LKR {totalPrice.toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Place Order on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] font-mono-tech text-zinc-500 text-center leading-relaxed">
                  🔒 Your cart items are automatically logged to our Neon PostgreSQL database and confirmed with our staff on WhatsApp.
                </p>
              </div>
            </div>

          </div>
        )}

      </section>

      <Footer />
    </main>
  );
}
