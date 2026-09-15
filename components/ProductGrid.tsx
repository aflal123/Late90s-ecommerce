'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import ProductCard, { ProductType } from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  // Fetch products & categories
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title & Subheader */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase text-[#dfff00] tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEASON 01 • DROP ARCHIVE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            THE APPAREL VAULT
          </h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl font-light">
            Custom engineered silhouettes inspired by late 90s skater & cyberpunk subcultures. Limited inventory per drop.
          </p>
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drops, hoodies, tees..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-[#dfff00] text-xs font-mono-tech transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-[#dfff00] text-black shadow-[0_0_20px_rgba(223,255,0,0.3)]'
              : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-zinc-600'
          }`}
        >
          ✦ ALL DROPS ({products.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono-tech font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeCategory.toLowerCase() === cat.slug.toLowerCase()
                ? 'bg-[#dfff00] text-black shadow-[0_0_20px_rgba(223,255,0,0.3)]'
                : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-zinc-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-zinc-900/50 border border-zinc-800/60 p-4 aspect-[3/5] animate-pulse flex flex-col justify-between"
            >
              <div className="bg-zinc-800 rounded-xl aspect-[3/4] w-full" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-zinc-800 bg-zinc-950/50 p-8">
          <p className="text-lg font-display text-zinc-400 uppercase font-bold">
            No products found matching your search.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-6 py-2.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
