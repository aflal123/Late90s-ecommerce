'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarqueeTicker from '@/components/MarqueeTicker';
import ProductCard, { ProductType } from '@/components/ProductCard';
import {
  MessageCircle,
  ShoppingBag,
  Check,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addToCart, setDirectCheckoutItem, setIsCheckoutOpen } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string>('specs');

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes[0] || 'M');

          // Fetch related products
          const relRes = await fetch(`/api/products?category=${data.product.category}`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelatedProducts(relData.products.filter((p: any) => p.id !== data.product.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 w-full animate-pulse space-y-8">
          <div className="h-6 w-32 bg-zinc-900 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-zinc-900 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-zinc-900 rounded w-3/4" />
              <div className="h-6 bg-zinc-900 rounded w-1/4" />
              <div className="h-24 bg-zinc-900 rounded w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <h2 className="text-2xl font-display font-black uppercase">Product Not Found</h2>
          <p className="text-xs font-mono-tech text-zinc-400">The requested drop may have been archived.</p>
          <Link href="/shop" className="px-6 py-2.5 rounded btn-bw-primary text-xs font-mono-tech">
            Back to Apparel Vault
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleInstantWhatsApp = () => {
    if (!product.inStock) return;
    setDirectCheckoutItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
    });
    setIsCheckoutOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col bg-bw-grid">
      <Navbar />
      <MarqueeTicker />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-mono-tech uppercase text-zinc-400 hover:text-[#dfff00] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vault</span>
        </Link>
      </div>

      {/* Product Detail Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: High-Res Image Display */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.featured && (
                  <span className="px-3 py-1 rounded text-[10px] font-mono-tech font-bold uppercase bg-[#dfff00] text-black shadow">
                    DROP 001 EXCLUSIVE
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded text-[10px] font-mono-tech font-bold uppercase ${
                    product.inStock ? 'bg-black/90 text-emerald-400 border border-emerald-500/40' : 'bg-zinc-900 text-red-400'
                  }`}
                >
                  {product.inStock ? 'IN STOCK' : 'SOLD OUT'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Garment Specs & WhatsApp Ordering */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono-tech uppercase text-[#dfff00] mb-2">
                <span>CATEGORY / {product.category}</span>
                <span className="text-zinc-500">ORIGINAL ARCHIVE PIECE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mt-4">
                <span className="text-4xl font-mono-tech font-bold text-[#dfff00]">
                  LKR {product.price.toLocaleString('en-LK')}
                </span>
                <span className="text-xs font-mono-tech text-zinc-400">
                  (Inclusive of all taxes & free shipping)
                </span>
              </div>

              <p className="text-sm text-zinc-300 font-mono-tech mt-4 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-6 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs font-mono-tech uppercase">
                <span className="text-zinc-400">
                  Select Size: <strong className="text-[#dfff00]">{selectedSize}</strong>
                </span>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'sizing' ? '' : 'sizing')}
                  className="text-[#dfff00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-5 py-3 rounded-xl text-xs font-mono-tech font-bold transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#dfff00] text-black border border-[#dfff00] shadow-[0_0_15px_rgba(223,255,0,0.35)]'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono-tech uppercase text-zinc-400 block">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-xl bg-zinc-950 border border-zinc-800 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="px-6 font-mono-tech font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: WhatsApp CTO & Add to Bag */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={handleInstantWhatsApp}
                disabled={!product.inStock}
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(37,211,102,0.35)] disabled:opacity-40 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Place Order (LKR {(product.price * quantity).toLocaleString('en-LK')})</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-white hover:text-black hover:border-white text-xs font-mono-tech font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#dfff00]" />
                    <span className="text-[#dfff00]">Added to Shopping Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Accordion Specs */}
            <div className="pt-6 border-t border-zinc-800 space-y-3">
              {/* Garment Specifications */}
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'specs' ? '' : 'specs')}
                  className="w-full px-5 py-4 flex justify-between items-center text-xs font-mono-tech uppercase font-bold text-white text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#dfff00]">✦</span> Garment Specifications & GSM
                  </span>
                  {activeAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'specs' && (
                  <div className="px-5 pb-5 text-xs font-mono-tech text-zinc-400 space-y-2 border-t border-zinc-800/60 pt-3">
                    <p>• Heavyweight combed cotton & custom French Terry fleece.</p>
                    <p>• Mineral enzyme vintage wash with reinforced double-needle stitching.</p>
                    <p>• Drop shoulder silhouette with relaxed streetwear drape.</p>
                    <p>• Custom woven late90s archive neck & hem labels.</p>
                  </div>
                )}
              </div>

              {/* Sizing Chart */}
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'sizing' ? '' : 'sizing')}
                  className="w-full px-5 py-4 flex justify-between items-center text-xs font-mono-tech uppercase font-bold text-white text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#dfff00]">✦</span> Sizing Chart (Oversized Streetwear Fit)
                  </span>
                  {activeAccordion === 'sizing' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'sizing' && (
                  <div className="px-5 pb-5 text-xs font-mono-tech text-zinc-400 border-t border-zinc-800/60 pt-3 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-zinc-500 border-b border-zinc-800">
                        <tr>
                          <th className="py-2">Size</th>
                          <th className="py-2">Chest (in)</th>
                          <th className="py-2">Length (in)</th>
                          <th className="py-2">Shoulder (in)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 text-zinc-300">
                        <tr><td className="py-2 font-bold text-white">S</td><td>42</td><td>28</td><td>21</td></tr>
                        <tr><td className="py-2 font-bold text-white">M</td><td>44</td><td>29</td><td>22</td></tr>
                        <tr><td className="py-2 font-bold text-white">L</td><td>46</td><td>30</td><td>23</td></tr>
                        <tr><td className="py-2 font-bold text-white">XL</td><td>48</td><td>31</td><td>24</td></tr>
                        <tr><td className="py-2 font-bold text-white">XXL</td><td>50</td><td>32</td><td>25</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Shipping & WhatsApp Verification */}
              <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full px-5 py-4 flex justify-between items-center text-xs font-mono-tech uppercase font-bold text-white text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#25D366]">✦</span> WhatsApp Order Confirmation & Dispatch
                  </span>
                  {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="px-5 pb-5 text-xs font-mono-tech text-zinc-400 space-y-2 border-t border-zinc-800/60 pt-3">
                    <p>• Orders are logged directly in our database and confirmed on WhatsApp.</p>
                    <p>• Same-day courier dispatch with live tracking updates.</p>
                    <p>• Free 7-day size exchange guarantee.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 text-[10px] font-mono-tech text-zinc-400 pt-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#dfff00]" />
                <span>3-5 Day Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#dfff00]" />
                <span>100% Combed Cotton</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#dfff00]" />
                <span>Free Size Swap</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Drops Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-800 w-full">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-mono-tech uppercase text-[#dfff00] tracking-widest block mb-1">
                COMPLEMENTARY PIECES
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
                MORE FROM THIS CATEGORY
              </h3>
            </div>
            <Link href="/shop" className="text-xs font-mono-tech text-[#dfff00] hover:underline uppercase">
              View All Vault Drops →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
