'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, ShoppingBag, Star, Layers,
  Plus, Pencil, Trash2, X, Upload, Check,
  ChevronDown, ToggleLeft, ToggleRight, AlertCircle, LogOut,
} from 'lucide-react'

const TABS = [
  { id: 'products',   label: 'Products',   icon: Package },
  { id: 'orders',     label: 'Orders',     icon: ShoppingBag },
  { id: 'reviews',    label: 'Reviews',    icon: Star },
  { id: 'categories', label: 'Categories', icon: Layers },
]

const STATUS_COLORS = {
  pending:   { bg: 'rgba(200,169,110,0.15)', color: 'var(--gold)' },
  confirmed: { bg: 'rgba(100,180,100,0.15)', color: '#6db86d' },
  shipped:   { bg: 'rgba(100,150,220,0.15)', color: '#6496dc' },
  delivered: { bg: 'rgba(100,220,150,0.15)', color: '#64dc96' },
  cancelled: { bg: 'rgba(220,80,80,0.15)',  color: '#dc5050' },
}

const EMPTY_PRODUCT_FORM = {
  name: '', description: '', price: '', category: '',
  sizes: [], image: '', inStock: true, featured: false,
}

const EMPTY_CAT_FORM = { name: '', slug: '', description: '', accent: '#c8a96e' }

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const ACCENT_OPTIONS = [
  { label: 'Gold',   value: '#c8a96e' },
  { label: 'White',  value: '#ffffff' },
  { label: 'Silver', value: '#a0a0a0' },
  { label: 'Red',    value: '#dc5050' },
  { label: 'Blue',   value: '#6496dc' },
  { label: 'Green',  value: '#6db86d' },
]

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('products')

  // ── Products state ──
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const fileInputRef = useRef(null)

  // ── Orders state ──
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // ── Reviews state ──
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)

  // ── Categories state ──
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [catPanelOpen, setCatPanelOpen] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM)
  const [savingCat, setSavingCat] = useState(false)
  const [catDeleteConfirm, setCatDeleteConfirm] = useState(null)

  // ── Toast ──
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
  }

  // ── Logout ──
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  // ── Load on mount ──
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    if (tab === 'orders'  && orders.length  === 0) loadOrders()
    if (tab === 'reviews' && reviews.length === 0) loadReviews()
  }, [tab])

  // ── Loaders ──
  const loadProducts = async () => {
    setProductsLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) setProducts(data.data)
    } catch {}
    setProductsLoading(false)
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.success) setOrders(data.data)
    } catch {}
    setOrdersLoading(false)
  }

  const loadReviews = async () => {
    setReviewsLoading(true)
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      if (data.success) setReviews(data.data)
    } catch {}
    setReviewsLoading(false)
  }

  const loadCategories = async () => {
    setCategoriesLoading(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.success) setCategories(data.data)
    } catch {}
    setCategoriesLoading(false)
  }

  // ── Product handlers ──
  const openAdd = () => {
    setEditingProduct(null)
    setForm({ ...EMPTY_PRODUCT_FORM, category: categories[0]?.name || '' })
    setImageFile(null)
    setImagePreview('')
    setPanelOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name, description: product.description,
      price: product.price, category: product.category,
      sizes: product.sizes || [], image: product.image || '',
      inStock: product.inStock, featured: product.featured,
    })
    setImagePreview(product.image || '')
    setImageFile(null)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditingProduct(null)
    setForm(EMPTY_PRODUCT_FORM)
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price || form.sizes.length === 0) {
      showToast('Name, price and at least one size are required.', 'error')
      return
    }
    setSaving(true)
    try {
      let imageUrl = form.image
      if (imageFile) {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        } else {
          showToast('Image upload failed.', 'error')
          setSaving(false)
          setUploading(false)
          return
        }
        setUploading(false)
      }

      const payload = { ...form, price: parseFloat(form.price), image: imageUrl }
      let res
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      const data = await res.json()
      if (data.success) {
        showToast(editingProduct ? 'Product updated.' : 'Product added.')
        closePanel()
        loadProducts()
      } else {
        showToast('Something went wrong.', 'error')
      }
    } catch {
      showToast('Something went wrong.', 'error')
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('Product deleted.')
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        showToast(data.message || 'Delete failed.', 'error')
      }
    } catch (err) {
      showToast(err?.message || 'Delete failed.', 'error')
    }
    setDeleteConfirm(null)
  }

  const toggleFeatured = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured }),
      })
      const data = await res.json()
      if (data.success)
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: !p.featured } : p))
    } catch {}
  }

  const toggleStock = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !product.inStock }),
      })
      const data = await res.json()
      if (data.success)
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: !p.inStock } : p))
    } catch {}
  }

  // ── Order handlers ──
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
        showToast('Order status updated.')
      }
    } catch {}
  }

  // ── Review handlers ──
  const deleteReview = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setReviews(prev => prev.filter(r => r.id !== id))
        showToast('Review deleted.')
      }
    } catch {}
  }

  // ── Category handlers ──
  const openAddCat = () => {
    setEditingCat(null)
    setCatForm(EMPTY_CAT_FORM)
    setCatPanelOpen(true)
  }

  const openEditCat = (cat) => {
    setEditingCat(cat)
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description, accent: cat.accent })
    setCatPanelOpen(true)
  }

  const closeCatPanel = () => {
    setCatPanelOpen(false)
    setEditingCat(null)
    setCatForm(EMPTY_CAT_FORM)
  }

  const handleCatNameChange = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    setCatForm(prev => ({ ...prev, name, slug }))
  }

  const handleSaveCat = async () => {
    if (!catForm.name.trim()) { showToast('Category name is required.', 'error'); return }
    setSavingCat(true)
    try {
      let res
      if (editingCat) {
        res = await fetch(`/api/categories/${editingCat.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        })
      } else {
        res = await fetch('/api/categories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catForm),
        })
      }
      const data = await res.json()
      if (data.success) {
        showToast(editingCat ? 'Category updated.' : 'Category created.')
        closeCatPanel()
        loadCategories()
      } else {
        showToast(data.message || 'Something went wrong.', 'error')
      }
    } catch {
      showToast('Something went wrong.', 'error')
    }
    setSavingCat(false)
  }

  const handleDeleteCat = async (id) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('Category deleted.')
        setCategories(prev => prev.filter(c => c.id !== id))
      }
    } catch {
      showToast('Delete failed.', 'error')
    }
    setCatDeleteConfirm(null)
  }

  // ─────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingTop: '80px' }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '90px', right: '2rem', zIndex: 999,
              backgroundColor: toast.type === 'error' ? '#2a1a1a' : '#1a2a1a',
              border: `1px solid ${toast.type === 'error' ? '#dc5050' : '#6db86d'}`,
              color: toast.type === 'error' ? '#dc5050' : '#6db86d',
              padding: '0.75rem 1.25rem',
              fontFamily: 'var(--font-inter)', fontSize: '0.75rem',
              letterSpacing: '0.05em',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {toast.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '2.5rem 3rem' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: '2.5rem', paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Admin Panel
            </p>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 1 }}>
              Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--subtitle)', cursor: 'pointer',
              fontFamily: 'var(--font-inter)', fontSize: '0.62rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0.55rem 1rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc5050'; e.currentTarget.style.color = '#dc5050' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--subtitle)' }}
          >
            <LogOut size={13} /> Log Out
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }} className="stats-grid">
          {[
            { label: 'Products',   value: products.length,   icon: Package },
            { label: 'Orders',     value: orders.length,     icon: ShoppingBag },
            { label: 'Reviews',    value: reviews.length,    icon: Star },
            { label: 'Categories', value: categories.length, icon: Layers },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'var(--card)', border: '1px solid var(--border)',
              padding: '1.4rem', display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <div style={{
                width: '38px', height: '38px',
                backgroundColor: 'rgba(200,169,110,0.1)',
                border: '1px solid rgba(200,169,110,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <stat.icon size={16} color="var(--gold)" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.9rem', color: 'var(--text)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', color: 'var(--subtitle)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.15rem' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 1.5rem', backgroundColor: 'transparent', border: 'none',
                borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`,
                color: tab === t.id ? 'var(--gold)' : 'var(--subtitle)',
                fontFamily: 'var(--font-inter)', fontSize: '0.68rem',
                fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: '-1px',
              }}
            >
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <motion.button
                whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
                onClick={openAdd}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  backgroundColor: 'var(--gold)', color: '#000', border: 'none',
                  padding: '0.7rem 1.5rem', fontFamily: 'var(--font-inter)',
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                <Plus size={14} />Add Product
              </motion.button>
            </div>

            {productsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} style={{ height: '72px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--subtitle)', fontSize: '0.85rem' }}>No products yet. Add your first product.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 110px 110px 100px',
                  gap: '1rem', padding: '0.6rem 1.25rem',
                  fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)',
                }}>
                  <span>Image</span><span>Product</span><span>Price</span><span>Category</span>
                  <span>Featured</span><span>In Stock</span><span>Actions</span>
                </div>
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 110px 110px 100px',
                      gap: '1rem', alignItems: 'center',
                      padding: '0.85rem 1.25rem',
                      backgroundColor: 'var(--card)', border: '1px solid var(--border)',
                      transition: 'border-color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--product-bg)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.9rem', color: 'var(--border)' }}>L9</span></div>
                      }
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>{product.name}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.2rem', letterSpacing: '0.1em' }}>{product.sizes?.join(' · ')}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)' }}>{product.price.toLocaleString()}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--subtitle)', letterSpacing: '0.05em' }}>{product.category}</span>
                    <button onClick={() => toggleFeatured(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {product.featured ? <ToggleRight size={22} color="var(--gold)" /> : <ToggleLeft size={22} color="var(--border)" />}
                    </button>
                    <button onClick={() => toggleStock(product)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {product.inStock ? <ToggleRight size={22} color="#6db86d" /> : <ToggleLeft size={22} color="var(--border)" />}
                    </button>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => openEdit(product)} style={{ width: '32px', height: '32px', backgroundColor: 'var(--border)', border: '1px solid transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
                      ><Pencil size={13} /></button>
                      <button onClick={() => setDeleteConfirm(product.id)} style={{ width: '32px', height: '32px', backgroundColor: 'var(--border)', border: '1px solid transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(220,80,80,0.15)'; e.currentTarget.style.borderColor = '#dc5050'; e.currentTarget.style.color = '#dc5050' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
                      ><Trash2 size={13} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {Array(4).fill(0).map((_, i) => <div key={i} style={{ height: '72px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--subtitle)', fontSize: '0.85rem' }}>No orders yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 120px 140px', gap: '1rem', padding: '0.6rem 1.25rem', fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  <span>Customer</span><span>Product</span><span>Size</span><span>Qty</span><span>Total</span><span>Status</span>
                </div>
                {orders.map((order, i) => (
                  <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 80px 120px 140px', gap: '1rem', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{order.customerName}</div>
                      <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--muted)' }}>{order.customerPhone}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--subtitle)' }}>{order.product?.name || '—'}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--subtitle)' }}>{order.size}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--subtitle)' }}>{order.quantity}</div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)' }}>LKR {order.totalPrice?.toLocaleString()}</div>
                    <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                      style={{ backgroundColor: STATUS_COLORS[order.status]?.bg || 'var(--card)', border: `1px solid ${STATUS_COLORS[order.status]?.color || 'var(--border)'}`, color: STATUS_COLORS[order.status]?.color || 'var(--text)', padding: '0.35rem 0.6rem', fontFamily: 'var(--font-inter)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}
                    >
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s} style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>{s}</option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {reviewsLoading ? (
              Array(3).fill(0).map((_, i) => <div key={i} style={{ height: '180px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />)
            ) : reviews.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--subtitle)', fontSize: '0.85rem' }}>No reviews yet.</p>
              </div>
            ) : reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', padding: '1.25rem', position: 'relative' }}
              >
                <button onClick={() => deleteReview(review.id)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: 'var(--border)', cursor: 'pointer', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#dc5050'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--border)'}
                ><Trash2 size={14} /></button>
                <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.75rem' }}>
                  {Array(5).fill(0).map((_, idx) => <span key={idx} style={{ color: idx < review.rating ? 'var(--gold)' : 'var(--border)', fontSize: '0.85rem' }}>★</span>)}
                </div>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--subtitle)', lineHeight: 1.7, marginBottom: '1rem' }}>{review.comment}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-bebas)', fontSize: '0.9rem', color: '#000' }}>{review.customerName[0]}</div>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{review.customerName}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === 'categories' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.75rem', color: 'var(--subtitle)', lineHeight: 1.6, maxWidth: '480px' }}>
                Categories appear on the homepage and as filters on the shop page. They are applied to products when you add or edit a product.
              </p>
              <motion.button
                whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}
                onClick={openAddCat}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  backgroundColor: 'var(--gold)', color: '#000', border: 'none',
                  padding: '0.7rem 1.5rem', fontFamily: 'var(--font-inter)',
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0,
                }}
              >
                <Plus size={14} />New Category
              </motion.button>
            </div>

            {categoriesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {Array(3).fill(0).map((_, i) => <div key={i} style={{ height: '68px', backgroundColor: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
              </div>
            ) : categories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--border)' }}>
                <Layers size={32} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--subtitle)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  No categories yet.
                </p>
                <p style={{ fontFamily: 'var(--font-inter)', color: 'var(--muted)', fontSize: '0.72rem' }}>
                  Add your first category to organise the shop.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr 140px 100px auto',
                  gap: '1rem', padding: '0.6rem 1.25rem',
                  fontFamily: 'var(--font-inter)', fontSize: '0.58rem',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)',
                }}>
                  <span>#</span><span>Name</span><span>Slug</span><span>Accent</span><span>Actions</span>
                </div>

                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'grid', gridTemplateColumns: '24px 1fr 140px 100px auto',
                      gap: '1rem', alignItems: 'center',
                      padding: '0.9rem 1.25rem',
                      backgroundColor: 'var(--card)', border: '1px solid var(--border)',
                      transition: 'border-color 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {/* Order number */}
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.85rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Name + description */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', color: cat.accent, letterSpacing: '0.04em', lineHeight: 1 }}>
                        {cat.name}
                      </div>
                      {cat.description && (
                        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--muted)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>
                          {cat.description}
                        </div>
                      )}
                    </div>

                    {/* Slug */}
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      {cat.slug}
                    </span>

                    {/* Accent dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: cat.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--muted)' }}>{cat.accent}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEditCat(cat)}
                        style={{ width: '32px', height: '32px', backgroundColor: 'var(--border)', border: '1px solid transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(200,169,110,0.15)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
                      ><Pencil size={13} /></button>
                      <button onClick={() => setCatDeleteConfirm(cat.id)}
                        style={{ width: '32px', height: '32px', backgroundColor: 'var(--border)', border: '1px solid transparent', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(220,80,80,0.15)'; e.currentTarget.style.borderColor = '#dc5050'; e.currentTarget.style.color = '#dc5050' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--border)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text)' }}
                      ><Trash2 size={13} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════
          ADD/EDIT PRODUCT PANEL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePanel}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border)', zIndex: 101, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 1 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
                    {editingProduct ? editingProduct.name : 'New Product'}
                  </h2>
                </div>
                <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'var(--subtitle)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Panel body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

                {/* Image upload */}
                <div>
                  <label style={labelStyle}>Product Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ aspectRatio: '4/3', border: '2px dashed var(--border)', backgroundColor: 'var(--product-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative', transition: 'border-color 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s ease' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.65rem', color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Upload size={24} color="var(--border)" />
                        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem' }}>Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                </div>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input type="text" placeholder="e.g. Vintage Oversized Tee" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>

                {/* Price + Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Price (LKR) *</label>
                    <input type="number" placeholder="2500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                      {categories.length > 0
                        ? categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)
                        : <>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Pants">Pants</option>
                        </>
                      }
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea placeholder="Describe the product..." rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                {/* Sizes */}
                <div>
                  <label style={labelStyle}>Sizes *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ALL_SIZES.map(size => (
                      <button key={size} type="button" onClick={() => toggleSize(size)}
                        style={{ padding: '0.4rem 0.9rem', border: `1px solid ${form.sizes.includes(size) ? 'var(--gold)' : 'var(--border)'}`, backgroundColor: form.sizes.includes(size) ? 'var(--gold)' : 'transparent', color: form.sizes.includes(size) ? '#000' : 'var(--subtitle)', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease' }}
                      >{size}</button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {[{ key: 'inStock', label: 'In Stock' }, { key: 'featured', label: 'Featured Drop' }].map(toggle => (
                    <button key={toggle.key} type="button" onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key] })}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: form[toggle.key] ? 'var(--gold)' : 'var(--muted)', fontFamily: 'var(--font-inter)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', transition: 'color 0.2s ease' }}
                    >
                      {form[toggle.key] ? <ToggleRight size={22} color="var(--gold)" /> : <ToggleLeft size={22} color="var(--border)" />}
                      {toggle.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel footer */}
              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', position: 'sticky', bottom: 0, backgroundColor: 'var(--bg)' }}>
                <button onClick={closePanel} style={{ flex: 1, padding: '0.85rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
                  style={{ flex: 2, padding: '0.85rem', backgroundColor: 'var(--gold)', border: 'none', color: '#000', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >{saving ? (uploading ? 'Uploading...' : 'Saving...') : (editingProduct ? 'Save Changes' : 'Add Product')}</motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          ADD/EDIT CATEGORY PANEL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {catPanelOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCatPanel}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '460px', backgroundColor: 'var(--bg)', borderLeft: '1px solid var(--border)', zIndex: 101, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 1 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.58rem', letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {editingCat ? 'Edit Category' : 'New Category'}
                  </p>
                  <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
                    {editingCat ? editingCat.name : 'Create Category'}
                  </h2>
                </div>
                <button onClick={closeCatPanel} style={{ background: 'none', border: 'none', color: 'var(--subtitle)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

                {/* Preview */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--card)',
                  border: `1px solid ${catForm.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.55rem', letterSpacing: '0.25em', color: catForm.accent, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Preview</p>
                    <h3 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: catForm.accent, letterSpacing: '0.03em', lineHeight: 1 }}>
                      {catForm.name || 'Category Name'}
                    </h3>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: catForm.accent, flexShrink: 0 }} />
                </div>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. T-Shirts"
                    value={catForm.name}
                    onChange={e => handleCatNameChange(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={labelStyle}>Slug (auto-generated)</label>
                  <input
                    type="text"
                    value={catForm.slug}
                    onChange={e => setCatForm(prev => ({ ...prev, slug: e.target.value }))}
                    style={{ ...inputStyle, color: 'var(--muted)' }}
                  />
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                    Used in URLs. Edit if needed.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    placeholder="Short description for this category..."
                    rows={2}
                    value={catForm.description}
                    onChange={e => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Accent colour */}
                <div>
                  <label style={labelStyle}>Accent Colour</label>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {ACCENT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCatForm(prev => ({ ...prev, accent: opt.value }))}
                        title={opt.label}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: opt.value,
                          border: catForm.accent === opt.value ? '3px solid var(--text)' : '2px solid transparent',
                          cursor: 'pointer',
                          boxShadow: catForm.accent === opt.value ? `0 0 0 2px ${opt.value}` : 'none',
                          transition: 'all 0.15s ease',
                          outline: 'none',
                        }}
                      />
                    ))}
                    {/* Custom hex input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <input
                        type="color"
                        value={catForm.accent}
                        onChange={e => setCatForm(prev => ({ ...prev, accent: e.target.value }))}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
                      />
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '0.62rem', color: 'var(--muted)' }}>Custom</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', position: 'sticky', bottom: 0, backgroundColor: 'var(--bg)' }}>
                <button onClick={closeCatPanel} style={{ flex: 1, padding: '0.85rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                <motion.button whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }} onClick={handleSaveCat} disabled={savingCat}
                  style={{ flex: 2, padding: '0.85rem', backgroundColor: 'var(--gold)', border: 'none', color: '#000', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: savingCat ? 'not-allowed' : 'pointer', opacity: savingCat ? 0.7 : 1 }}
                >{savingCat ? 'Saving...' : (editingCat ? 'Save Changes' : 'Create Category')}</motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Product delete confirm ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200 }}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--card)', border: '1px solid var(--border)', padding: '2rem', zIndex: 201, width: '90%', maxWidth: '380px', textAlign: 'center' }}
            >
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#dc5050', marginBottom: '0.5rem' }}>Delete Product?</div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--subtitle)', marginBottom: '1.5rem', lineHeight: 1.6 }}>This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#dc5050', border: 'none', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Category delete confirm ── */}
      <AnimatePresence>
        {catDeleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCatDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 200 }}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--card)', border: '1px solid var(--border)', padding: '2rem', zIndex: 201, width: '90%', maxWidth: '380px', textAlign: 'center' }}
            >
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#dc5050', marginBottom: '0.5rem' }}>Delete Category?</div>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--subtitle)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                This will remove the category. Existing products with this category name will not be affected.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setCatDeleteConfirm(null)} style={{ flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => handleDeleteCat(catDeleteConfirm)} style={{ flex: 1, padding: '0.75rem', backgroundColor: '#dc5050', border: 'none', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-inter)',
  fontSize: '0.6rem', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'var(--subtitle)',
  marginBottom: '0.5rem', fontWeight: 600,
}

const inputStyle = {
  width: '100%', backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--border)', color: 'var(--text)',
  padding: '0.75rem 1rem', fontFamily: 'var(--font-inter)',
  fontSize: '0.85rem', outline: 'none',
}
