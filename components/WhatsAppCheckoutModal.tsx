'use client';

import React, { useState } from 'react';
import { X, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';

export default function WhatsAppCheckoutModal() {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    directCheckoutItem,
    setDirectCheckoutItem,
    cart,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  if (!isCheckoutOpen) return null;

  const itemsToOrder = directCheckoutItem ? [directCheckoutItem] : cart;
  const totalAmount = itemsToOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and WhatsApp Phone Number.');
      return;
    }

    setLoading(true);

    try {
      let payload: any = {
        customerName,
        customerPhone,
        address,
        notes,
      };

      if (directCheckoutItem) {
        payload.productId = directCheckoutItem.productId;
        payload.size = directCheckoutItem.size;
        payload.quantity = directCheckoutItem.quantity;
      } else {
        payload.items = cart.map((c) => ({
          productId: c.productId,
          size: c.size,
          quantity: c.quantity,
          price: c.price,
        }));
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.whatsappUrl) {
        setGeneratedUrl(data.whatsappUrl);
        setOrderCompleted(true);

        // Monochrome confetti
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#27272a', '#000000'],
        });

        if (!directCheckoutItem) {
          clearCart();
        }

        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 600);
      } else {
        alert(data.error || 'Failed to generate WhatsApp order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setDirectCheckoutItem(null);
    setOrderCompleted(false);
    setGeneratedUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderCompleted ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-white uppercase tracking-tight">
                  Place Order via WhatsApp
                </h3>
                <p className="text-[11px] text-zinc-500 font-mono-tech">
                  Synced with Neon PostgreSQL Database
                </p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-6 space-y-3">
              <span className="text-[10px] font-mono-tech uppercase text-zinc-500 block tracking-wider">
                Order Summary ({itemsToOrder.length} items)
              </span>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {itemsToOrder.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover bg-zinc-800"
                      />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-tech font-bold text-white">
                      LKR {(item.price * item.quantity).toLocaleString('en-LK')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                <span className="font-mono-tech uppercase text-zinc-400">Total Payable:</span>
                <span className="font-mono-tech font-black text-lg text-white">
                  LKR {totalAmount.toLocaleString('en-LK')}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Yash Vardhan"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-xs font-mono-tech"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-xs font-mono-tech"
                />
                <span className="text-[10px] text-zinc-600 mt-1 block font-mono-tech">
                  Order tracking & dispatch receipt is sent to this number.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono-tech uppercase text-zinc-400 mb-1.5">
                  Delivery Address (Optional)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Pincode..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-xs font-mono-tech"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl btn-bw-primary text-xs font-mono-tech flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4 shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Order...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Confirm & Launch WhatsApp Chat</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5 pt-1 font-mono-tech">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                Direct 1-on-1 team verification with instant order record
              </p>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono-tech bg-zinc-900 text-white border border-zinc-800 uppercase tracking-widest">
                Order Registered in Database
              </span>
              <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-3">
                Order Ready on WhatsApp
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-2 font-mono-tech leading-relaxed">
                Your order is saved. Click below if WhatsApp didn&apos;t open automatically.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl btn-bw-primary text-xs font-mono-tech uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl inline-block"
              >
                <MessageCircle className="w-4 h-4 fill-current inline" />
                <span>Open WhatsApp Chat Now</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono-tech uppercase"
              >
                Back to Archive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
