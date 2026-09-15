'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ShoppingBag, Check, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  createdAt?: string | Date;
}

interface ProductCardProps {
  product: ProductType;
  onQuickView?: (product: ProductType) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, setDirectCheckoutItem, setIsCheckoutOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleInstantWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setDirectCheckoutItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden flex flex-col justify-between border border-zinc-800 hover:border-[#dfff00]/40 hover:shadow-[0_0_25px_rgba(223,255,0,0.1)] transition-all duration-300">
      
      {/* Product Image Area */}
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="px-2.5 py-0.5 text-[9px] font-mono-tech font-bold uppercase bg-[#dfff00] text-black rounded tracking-widest shadow">
              FEATURED
            </span>
          )}
          <span
            className={`px-2 py-0.5 text-[9px] font-mono-tech font-bold uppercase rounded tracking-widest ${
              product.inStock
                ? 'bg-black/80 text-emerald-400 border border-emerald-500/40'
                : 'bg-zinc-900 text-red-400 border border-red-500/30'
            }`}
          >
            {product.inStock ? 'IN STOCK' : 'SOLD OUT'}
          </span>
        </div>

        {/* View Details Hover Badge */}
        <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-3.5 h-3.5 text-[#dfff00]" />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-mono-tech uppercase text-[#dfff00] tracking-widest">
              {product.category}
            </span>
            <span className="text-base font-mono-tech font-bold text-[#dfff00]">
              LKR {product.price.toLocaleString('en-LK')}
            </span>
          </div>

          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-display font-bold text-sm text-white group-hover:text-[#dfff00] transition-colors line-clamp-1 uppercase">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        <div>
          <label className="text-[10px] font-mono-tech uppercase text-zinc-500 block mb-1.5 tracking-wider">
            Size: <strong className="text-white">{selectedSize}</strong>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`px-2.5 py-1 text-[11px] font-mono-tech font-bold rounded border transition-all ${
                  selectedSize === s
                    ? 'bg-[#dfff00] text-black border-[#dfff00] shadow-[0_0_10px_rgba(223,255,0,0.3)]'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleInstantWhatsApp}
            disabled={!product.inStock}
            className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] text-black hover:bg-[#20ba5a] hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] text-[11px] font-mono-tech font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Place Order</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-white text-[11px] font-mono-tech font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#dfff00]" />
                <span className="text-[#dfff00]">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
