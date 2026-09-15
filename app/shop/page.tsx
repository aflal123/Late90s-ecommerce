'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import ProductCard, { ProductType } from '@/components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
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
      } catch (e) {
        console.error('Failed to load shop products', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and Sort logic
  const filteredProducts = products
    .filter((p) => {
      const matchCat = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStock = inStockOnly ? p.inStock : true;
      return matchCat && matchSearch && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return new Date(b.createdAt as any || 0).getTime() - new Date(a.createdAt as any || 0).getTime();
    });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      {/* Shop Header Banner */}
      <section className="py-16 border-b border-zinc-800 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-[11px] font-mono-tech tracking-widest uppercase text-zinc-400 block mb-2">
              ✦ ORIGINAL ARCHIVE • DROP 001
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tight text-white">
              THE APPAREL VAULT
            </h1>
            <p className="text-sm text-zinc-400 mt-3 font-mono-tech leading-relaxed">
              Heavyweight 260+ GSM tees, 480 GSM French Terry hoodies, and baggy skater denims. Direct WhatsApp order placement with same-day dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="sticky top-20 z-30 glass-panel border-b border-zinc-800 py-4 px-4 sm:px-6 lg:px-8 bg-black/90">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded text-xs font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#dfff00] text-black font-bold shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
              }`}
            >
              ALL ITEMS ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded text-xs font-mono-tech uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory.toLowerCase() === cat.slug.toLowerCase()
                    ? 'bg-[#dfff00] text-black font-bold shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search, Sort, and In-Stock */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-9 pr-4 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono-tech text-zinc-300 focus:outline-none focus:border-white"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Stock Toggle */}
            <label className="hidden sm:flex items-center gap-2 text-xs font-mono-tech text-zinc-400 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-white"
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </div>
      </section>

      {/* Product Grid Area */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 aspect-[3/5] animate-pulse flex flex-col justify-between"
              >
                <div className="bg-zinc-900 rounded-xl aspect-[3/4] w-full" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-zinc-900 rounded w-3/4" />
                  <div className="h-3 bg-zinc-900 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <p className="text-base font-mono-tech text-zinc-400 uppercase">
              No products found matching your active filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-4 px-6 py-2.5 rounded btn-bw-primary text-xs font-mono-tech"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
