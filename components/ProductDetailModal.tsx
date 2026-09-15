'use client';

import React, { useState } from 'react';
import { X, MessageCircle, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { ProductType } from './ProductCard';
import { useCart } from '@/context/CartContext';

interface ProductDetailModalProps {
  product: ProductType | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, setDirectCheckoutItem, setIsCheckoutOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || 'M';

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, currentSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const handleInstantWhatsApp = () => {
    if (!product.inStock) return;
    setDirectCheckoutItem({
      id: `${product.id}-${currentSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: currentSize,
      quantity,
    });
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Image Showcase */}
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900 border border-zinc-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-mono-tech font-bold uppercase bg-[#dfff00] text-black rounded tracking-wider shadow">
                DROP 001 EXCLUSIVE
              </span>
            )}
          </div>

          {/* Product Info & WhatsApp Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono-tech uppercase text-[#dfff00] tracking-widest">
                  CATEGORY: {product.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-xs font-mono-tech uppercase rounded ${
                    product.inStock ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                  }`}
                >
                  {product.inStock ? 'In Stock (Ready to Ship)' : 'Sold Out'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                {product.name}
              </h2>

              <div className="text-3xl font-display font-black text-[#dfff00] mt-3">
                ₹{product.price.toLocaleString('en-IN')}
                <span className="text-xs font-mono-tech text-zinc-400 font-normal ml-2">
                  (Includes all taxes)
                </span>
              </div>

              <p className="text-sm text-zinc-300 mt-4 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono-tech uppercase text-zinc-400">
                  Select Size: <strong className="text-white">{currentSize}</strong>
                </label>
                <span className="text-[11px] font-mono-tech text-[#dfff00] underline cursor-pointer">
                  Size Guide (Streetwear Oversized)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm font-mono-tech font-bold rounded-xl border transition-all ${
                      currentSize === s
                        ? 'bg-[#dfff00] text-black border-[#dfff00] shadow-[0_0_15px_rgba(223,255,0,0.4)]'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-mono-tech uppercase text-zinc-400 block mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-xl bg-zinc-900 border border-zinc-700 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="px-4 font-mono-tech font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-zinc-300 hover:bg-zinc-800 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <button
                onClick={handleInstantWhatsApp}
                disabled={!product.inStock}
                className="w-full py-4 rounded-xl btn-whatsapp text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Place Order (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:border-[#dfff00] hover:text-[#dfff00] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 text-[#dfff00]" />
                    <span className="text-[#dfff00]">Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantee Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono-tech text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#dfff00]" />
                <span>Fast 3-5 Day Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#dfff00]" />
                <span>100% Cotton 260 GSM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#dfff00]" />
                <span>Easy Size Exchange</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
