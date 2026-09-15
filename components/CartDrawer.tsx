'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    setIsCheckoutOpen,
    setDirectCheckoutItem,
  } = useCart();

  if (!isCartOpen) return null;

  const handleOpenCheckout = () => {
    setDirectCheckoutItem(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-white" />
              <h2 className="text-base font-display font-black uppercase tracking-tight">
                Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase text-sm text-zinc-300">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono-tech mt-1">
                    Select garments from our apparel vault.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded btn-bw-primary text-xs font-mono-tech"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover bg-zinc-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-display font-bold text-xs uppercase text-white truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-black text-white border border-zinc-700">
                        Size: {item.size}
                      </span>
                      <span className="text-xs font-mono-tech text-zinc-400">
                        LKR {item.price.toLocaleString('en-LK')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="inline-flex items-center rounded bg-zinc-950 border border-zinc-800 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono-tech font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-600 hover:text-red-400 text-xs p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono-tech font-bold text-sm text-white">
                      LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800 space-y-4 bg-zinc-950">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400 font-mono-tech">
                  <span>Subtotal:</span>
                  <span className="text-white">LKR {totalPrice.toLocaleString('en-LK')}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 font-mono-tech">
                  <span>Shipping:</span>
                  <span className="text-white font-bold">FREE (Drop Special)</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                  <span className="font-mono-tech uppercase text-xs text-zinc-400">Total:</span>
                  <span className="font-mono-tech font-black text-xl text-white">
                    LKR {totalPrice.toLocaleString('en-LK')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpenCheckout}
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Place Order on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block text-center text-[11px] font-mono-tech text-zinc-400 hover:text-white uppercase tracking-wider underline pt-1"
              >
                View Full Cart Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
