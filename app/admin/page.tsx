'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  Package,
  ShoppingBag,
  Layers,
  Star,
  Plus,
  Trash2,
  Edit2,
  UploadCloud,
  CheckCircle,
  XCircle,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Loader2,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'reviews'>('overview');

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // New/Edit Product Form
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'tees',
    sizes: 'S, M, L, XL, XXL',
    inStock: true,
    featured: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Category Form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    accent: '#dfff00',
    sortOrder: '1',
  });

  // Check auth session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('late90s_admin_session') === 'true';
    if (isAuth) {
      setAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        sessionStorage.setItem('late90s_admin_session', 'true');
        fetchAllData();
      } else {
        setAuthError(data.error || 'Incorrect admin password');
      }
    } catch (err) {
      setAuthError('Failed to login. Try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('late90s_admin_session');
    setAuthenticated(false);
  };

  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [prodRes, ordRes, catRes, revRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/categories'),
        fetch('/api/reviews?all=true'),
      ]);

      const [prodData, ordData, catData, revData] = await Promise.all([
        prodRes.json(),
        ordRes.json(),
        catRes.json(),
        revRes.json(),
      ]);

      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (catData.success) setCategories(catData.categories);
      if (revData.success) setReviews(revData.reviews);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Image upload via Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setProductForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert('Cloudinary upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error uploading to Cloudinary');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        image: productForm.image,
        category: productForm.category,
        sizes: productForm.sizes.split(',').map((s) => s.trim()),
        inStock: productForm.inStock,
        featured: productForm.featured,
      };

      let res;
      if (editingProductId) {
        res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setShowProductModal(false);
        setEditingProductId(null);
        setProductForm({
          name: '',
          description: '',
          price: '',
          image: '',
          category: 'tees',
          sizes: 'S, M, L, XL, XXL',
          inStock: true,
          featured: false,
        });
        fetchAllData();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      image: p.image,
      category: p.category,
      sizes: p.sizes.join(', '),
      inStock: p.inStock,
      featured: p.featured,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleToggleStock = async (p: any) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !p.inStock }),
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAllData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Delete order record?')) return;
    try {
      await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  // Category Management
  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      accent: cat.accent || '#dfff00',
      sortOrder: cat.sortOrder?.toString() || '1',
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let accentFormatted = categoryForm.accent.trim();
      if (!accentFormatted.startsWith('#') && accentFormatted.length > 0) {
        accentFormatted = '#' + accentFormatted;
      }

      const payload = {
        ...categoryForm,
        accent: accentFormatted || '#dfff00',
      };

      const url = editingCategoryId ? `/api/categories/${editingCategoryId}` : '/api/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowCategoryModal(false);
        setEditingCategoryId(null);
        setCategoryForm({ name: '', slug: '', description: '', accent: '#dfff00', sortOrder: '1' });
        fetchAllData();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Failed to save category');
    }
  };

  // Review Moderation
  const handleToggleReviewApprove = async (id: string, approved: boolean) => {
    try {
      await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      fetchAllData();
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      fetchAllData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-4 scanlines">
        <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl relative">
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#dfff00]/20 border border-[#dfff00]/40 flex items-center justify-center text-[#dfff00] mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
              LATE90S ADMIN
            </h1>
            <p className="text-xs text-zinc-400 font-mono-tech">
              Enter admin master key to access inventory & WhatsApp orders.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (late90sadmin)..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#dfff00]"
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 font-mono-tech">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Control Panel</span>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono-tech flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col">
      {/* Admin Topbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dfff00]" />
            <span className="font-display font-black text-xl tracking-tight text-white">
              LATE<span className="text-[#dfff00]">90S</span> ADMIN
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono-tech bg-zinc-900 border border-zinc-800 text-emerald-400 rounded">
            Neon Connected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/60"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 px-6">
        <nav className="flex space-x-6 overflow-x-auto text-xs font-mono-tech uppercase font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#dfff00] text-[#dfff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'orders'
                ? 'border-[#dfff00] text-[#dfff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>WhatsApp Orders ({orders.length})</span>
            {pendingOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#dfff00] text-[#dfff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#dfff00] text-[#dfff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#dfff00] text-[#dfff00]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </nav>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono-tech uppercase text-zinc-400">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#dfff00]" />
                </div>
                <div className="text-3xl font-display font-black text-[#dfff00]">
                  LKR {totalRevenue.toLocaleString('en-LK')}
                </div>
                <p className="text-[11px] font-mono-tech text-zinc-500 mt-2">
                  From {orders.length} placed WhatsApp orders
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono-tech uppercase text-zinc-400">Active Orders</span>
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-display font-black text-white">
                  {orders.length}
                </div>
                <p className="text-[11px] font-mono-tech text-emerald-400 mt-2">
                  {pendingOrders} Pending confirmation
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono-tech uppercase text-zinc-400">Catalog Products</span>
                  <Package className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-display font-black text-white">
                  {products.length}
                </div>
                <p className="text-[11px] font-mono-tech text-zinc-500 mt-2">
                  Across {categories.length} categories
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono-tech uppercase text-zinc-400">Reviews</span>
                  <Star className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-3xl font-display font-black text-white">
                  {reviews.length}
                </div>
                <p className="text-[11px] font-mono-tech text-zinc-500 mt-2">
                  Community verified feedback
                </p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-black text-lg uppercase text-white">
                  Recent WhatsApp CTO Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-mono-tech text-[#dfff00] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono-tech py-4">No orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-tech">
                    <thead className="border-b border-zinc-800 text-zinc-400">
                      <tr>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-900/50">
                          <td className="py-3 px-4 font-bold text-white">
                            #{ord.id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3 px-4">{ord.customerName}</td>
                          <td className="py-3 px-4">{ord.customerPhone}</td>
                          <td className="py-3 px-4">{ord.product?.name || 'Apparel Item'}</td>
                          <td className="py-3 px-4 text-[#dfff00] font-bold">LKR {ord.totalPrice}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-900 text-zinc-300 border border-zinc-700">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-black uppercase text-white">
                Catalog Management
              </h2>
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    image: '',
                    category: 'tees',
                    sizes: 'S, M, L, XL, XXL',
                    inStock: true,
                    featured: false,
                  });
                  setShowProductModal(true);
                }}
                className="px-4 py-2.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-zinc-900">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleToggleStock(p)}
                      className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-mono-tech font-bold uppercase ${
                        p.inStock ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono-tech uppercase text-[#dfff00]">
                        {p.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-white line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-base font-display font-black text-[#dfff00] mt-1">
                        LKR {p.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/80"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  WhatsApp CTO Orders ({orders.length})
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-1">
                  Orders submitted via WhatsApp Click-to-Order button.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-tech">
                  <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                    <tr>
                      <th className="py-3 px-4">Ref #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Size & Qty</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-zinc-300">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-900/50">
                        <td className="py-4 px-4 font-bold text-white">
                          #{ord.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-white">{ord.customerName}</p>
                          <p className="text-zinc-500 text-[11px]">{ord.customerPhone}</p>
                        </td>
                        <td className="py-4 px-4">
                          {ord.product?.name || 'Streetwear Apparel'}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#dfff00] font-bold">
                            {ord.size}
                          </span>{' '}
                          × {ord.quantity}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#dfff00]">
                          LKR {ord.totalPrice}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#dfff00]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed_whatsapp">Confirmed on WhatsApp</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {/* Direct WhatsApp Contact Button */}
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${ord.customerName}, regarding your late90s order #${ord.id.slice(-6).toUpperCase()}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366] hover:text-black font-bold text-[10px]"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/70"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-black uppercase text-white">
                  Categories ({categories.length})
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400 mt-1">
                  Manage product categories, slugs, and custom theme accent colors.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategoryId(null);
                  setCategoryForm({
                    name: '',
                    slug: '',
                    description: '',
                    accent: '#dfff00',
                    sortOrder: (categories.length + 1).toString(),
                  });
                  setShowCategoryModal(true);
                }}
                className="px-4 py-2.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between"
                  style={{ borderTopColor: cat.accent || '#dfff00', borderTopWidth: '3px' }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display font-black text-lg uppercase text-white tracking-tight">
                        {cat.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md border border-white/20 shadow-inner"
                          style={{ backgroundColor: cat.accent || '#dfff00' }}
                          title={`HEX: ${cat.accent || '#dfff00'}`}
                        />
                        <span className="text-[10px] font-mono-tech font-bold uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {cat.accent || '#dfff00'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-mono-tech text-[#dfff00]">
                      Slug: <span className="text-white">/{cat.slug}</span>
                    </p>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {cat.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono-tech text-zinc-300 hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-2 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/80"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-black uppercase text-white">
                Review Moderation ({reviews.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-display font-bold text-sm text-white">
                        {rev.customerName}
                      </span>
                      <div className="flex text-[#dfff00]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#dfff00]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <button
                      onClick={() => handleToggleReviewApprove(rev.id, !rev.approved)}
                      className={`px-3 py-1 rounded text-xs font-mono-tech font-bold uppercase ${
                        rev.approved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {rev.approved ? 'Approved' : 'Pending'}
                    </button>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-900/60"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-black text-white uppercase mb-6">
              {editingProductId ? 'Edit Product' : 'Add New Streetwear Drop'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Acid Vintage Heavyweight Boxy Tee"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1499"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Description / Fabric GSM Specs *
                </label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="260 GSM combed cotton, drop-shoulder vintage oversized fit..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                />
              </div>

              {/* Cloudinary Image Upload */}
              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Product Image (Cloudinary or URL) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono-tech text-[#dfff00] hover:bg-zinc-700 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cloudinary'}</span>
                  </button>
                </div>
                {productForm.image && (
                  <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-zinc-700">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Sizes (Comma separated)
                </label>
                <input
                  type="text"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  placeholder="S, M, L, XL, XXL"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                />
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 accent-[#dfff00]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono-tech text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#dfff00]"
                  />
                  <span>Featured Drop</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider mt-4"
              >
                {editingProductId ? 'Save Product Changes' : 'Create & Publish Drop'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal with Full HEX Code & Preset Swatches */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowCategoryModal(false);
                setEditingCategoryId(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-black text-white uppercase mb-2">
              {editingCategoryId ? 'Edit Category' : 'Create New Category'}
            </h3>
            <p className="text-xs text-zinc-400 font-mono-tech mb-6">
              Define the category identity, slug, and custom accent HEX color.
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: newName,
                      slug: editingCategoryId ? prev.slug : newName.toLowerCase().replace(/\s+/g, '-'),
                    }));
                  }}
                  placeholder="e.g. Vintage Track Jackets"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="track-jackets"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={categoryForm.sortOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: e.target.value })}
                    placeholder="1"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tech uppercase text-zinc-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="e.g. 90s oversized fits and vintage distressed outerwear"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono-tech focus:border-[#dfff00] focus:outline-none"
                />
              </div>

              {/* Enhanced HEX Code + Color Picker Section */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <label className="block text-xs font-mono-tech uppercase text-zinc-300">
                  Accent Color (HEX Code)
                </label>

                <div className="flex items-center gap-3">
                  {/* Visual Color Preview Box & Native Picker trigger */}
                  <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-zinc-600 flex-shrink-0 cursor-pointer shadow-md">
                    <input
                      type="color"
                      value={
                        categoryForm.accent?.startsWith('#') && categoryForm.accent.length === 7
                          ? categoryForm.accent
                          : '#dfff00'
                      }
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, accent: e.target.value.toUpperCase() })
                      }
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                    />
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: categoryForm.accent || '#dfff00',
                      }}
                    />
                  </div>

                  {/* Direct HEX Text Input */}
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-zinc-500 font-mono-tech text-xs">#</span>
                    <input
                      type="text"
                      maxLength={7}
                      value={categoryForm.accent ? categoryForm.accent.replace(/^#/, '') : 'DFFF00'}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9a-fA-F]/g, '');
                        setCategoryForm({ ...categoryForm, accent: '#' + val.toUpperCase() });
                      }}
                      placeholder="DFFF00"
                      className="w-full pl-7 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono-tech uppercase font-bold focus:border-[#dfff00] focus:outline-none tracking-wider"
                    />
                  </div>
                </div>

                {/* Preset Streetwear Color Palette Swatches */}
                <div>
                  <span className="text-[10px] font-mono-tech uppercase text-zinc-500 block mb-1.5">
                    Streetwear Preset Swatches:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Neon Lime', hex: '#DFFF00' },
                      { name: 'WhatsApp Green', hex: '#25D366' },
                      { name: 'Electric Red', hex: '#FF3E3E' },
                      { name: 'Cyber Cyan', hex: '#00F0FF' },
                      { name: 'Acid Purple', hex: '#A855F7' },
                      { name: 'Hot Magenta', hex: '#FF007F' },
                      { name: 'Olive Green', hex: '#3B5E41' },
                      { name: 'Vintage Gold', hex: '#C8A96E' },
                      { name: 'Pure White', hex: '#FFFFFF' },
                      { name: 'Charcoal', hex: '#27272A' },
                    ].map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, accent: swatch.hex })}
                        className={`w-7 h-7 rounded-lg border transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                          categoryForm.accent?.toUpperCase() === swatch.hex.toUpperCase()
                            ? 'ring-2 ring-white border-white scale-105'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                        title={`${swatch.name} (${swatch.hex})`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-neon-lime text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
              >
                {editingCategoryId ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
