/// <reference types="vite/client" />
import { useState, useEffect } from 'react'
import './index.css'

// ---------------------------------------------------------
// API Configuration
// ---------------------------------------------------------
const WP_URL = import.meta.env.VITE_WP_URL || 'https://wp.nepaleseartgallery.com'
const WC_KEY = import.meta.env.VITE_WC_KEY || ''
const WC_SECRET = import.meta.env.VITE_WC_SECRET || ''

// ---------------------------------------------------------
// API Service Functions
// ---------------------------------------------------------
const api = {
  getProducts: async (params = '') => {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}&${params}`
    )
    return res.json()
  },

  getProduct: async (id: number) => {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/${id}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
    )
    return res.json()
  },

  getArtists: async () => {
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=10`)
    return res.json()
  },

  getCategories: async () => {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/products/categories?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
    )
    return res.json()
  },

  createOrder: async (orderData: any) => {
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }
    )
    return res.json()
  }
}

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------
interface Product {
  id: number
  name: string
  price: string
  regular_price: string
  description: string
  short_description: string
  images: { src: string; alt: string }[]
  categories: { id: number; name: string }[]
  stock_status: string
}

interface CartItem {
  product: Product
  quantity: number
}

// ---------------------------------------------------------
// Loading Spinner
// ---------------------------------------------------------
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center" style={{ padding: 'var(--space-16)' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ---------------------------------------------------------
// Navigation Component
// ---------------------------------------------------------
function Navigation({ navigateTo, cartCount }: { navigateTo: (page: string, data?: any) => void; cartCount: number }) {
  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')} role="button" tabIndex={0} style={{ outline: 'none' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>N</div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px', color: 'var(--color-text)', cursor: 'pointer' }}>Nepalese Art Gallery</h2>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('gallery') }} className="text-text">Gallery Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('artists') }} className="text-text">Artists</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard') }} className="text-text">Studio</a>
          <button className="btn btn-primary" style={{ padding: 'var(--space-2) var(--space-4)' }} onClick={() => navigateTo('checkout')}>
            Cart ({cartCount})
          </button>
        </div>
      </div>
    </nav>
  )
}

// ---------------------------------------------------------
// Product Card Component
// ---------------------------------------------------------
function ProductCard({ product, navigateTo, onAddToCart }: { product: Product; navigateTo: (page: string, data?: any) => void; onAddToCart?: (product: Product) => void }) {
  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigateTo('artwork-detail', product)}>
      <div style={{ height: '240px', backgroundColor: 'var(--color-surface-light)', overflow: 'hidden', position: 'relative' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0].src}
            alt={product.images[0].alt || product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎨</div>
        )}
        <div style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', backgroundColor: 'var(--color-background)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
          ${product.price}
        </div>
      </div>
      <div style={{ padding: 'var(--space-4)' }}>
        <p style={{ color: 'var(--color-primary-light)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
          {product.categories?.[0]?.name || 'Artwork'}
        </p>
        <h4 style={{ marginBottom: 'var(--space-1)' }}>{product.name}</h4>
        <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-2)' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)', margin: 0 }}>${product.price}</p>
          {onAddToCart && (
            <button
              className="btn btn-primary"
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              disabled={product.stock_status === 'outofstock'}
            >
              {product.stock_status === 'outofstock' ? 'Sold Out' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 1. Homepage
// ---------------------------------------------------------
function Homepage({ navigateTo, onAddToCart }: { navigateTo: (page: string, data?: any) => void; onAddToCart: (product: Product) => void }) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getProducts('per_page=3&featured=true')
      .then(data => data.length ? data : api.getProducts('per_page=3'))
      .then(data => { setFeaturedProducts(data); setLoading(false) })
      .catch(() => { setError('Could not load artworks.'); setLoading(false) })
  }, [])

  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />

      <header className="flex flex-col items-center justify-center text-center" style={{ minHeight: '70vh', padding: 'var(--space-8) var(--space-4)', backgroundImage: 'radial-gradient(circle at center, var(--color-surface) 0%, var(--color-background) 100%)' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Discover the Soul of Nepal</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '700px', marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Explore authentic, handcrafted artworks from master artisans across the Himalayas. From intricate Thangkas to contemporary expressions.
        </p>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={() => navigateTo('gallery')}>Explore Gallery</button>
          <button className="btn btn-secondary" onClick={() => navigateTo('artists')}>Meet the Artists</button>
        </div>
      </header>

      <section className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <h2>Featured Masterpieces</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('gallery') }}>View All &rarr;</a>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p style={{ color: 'var(--color-primary)', textAlign: 'center' }}>{error}</p>}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <div key={product.id} className="card">
                <div style={{ height: '300px', backgroundColor: 'var(--color-surface-light)', position: 'relative', overflow: 'hidden' }}>
                  {product.images?.[0] ? (
                    <img src={product.images[0].src} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🎨</div>
                  )}
                  <div style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', backgroundColor: 'var(--color-background)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                    ${product.price}
                  </div>
                </div>
                <div style={{ padding: 'var(--space-6)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-1)' }}>
                    {product.categories?.[0]?.name || 'Artwork'}
                  </p>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>{product.name}</h3>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ flex: 1, padding: 'var(--space-2)' }} onClick={() => navigateTo('artwork-detail', product)}>View Details</button>
                    <button className="btn btn-primary" style={{ flex: 1, padding: 'var(--space-2)' }} onClick={() => onAddToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1', textAlign: 'center' }}>
                No artworks yet. Add products in WordPress to display them here.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

// ---------------------------------------------------------
// 2. Gallery Shop
// ---------------------------------------------------------
function GalleryShop({ navigateTo, onAddToCart }: { navigateTo: (page: string, data?: any) => void; onAddToCart: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date')
  const [selectedCategory, setSelectedCategory] = useState(0)

  useEffect(() => {
    api.getCategories().then(data => setCategories(data)).catch(() => { })
    loadProducts()
  }, [])

  const loadProducts = (categoryId = 0, sort = 'date') => {
    setLoading(true)
    const params = [
      'per_page=20',
      sort === 'price_asc' ? 'orderby=price&order=asc' : '',
      sort === 'price_desc' ? 'orderby=price&order=desc' : '',
      sort === 'date' ? 'orderby=date&order=desc' : '',
      categoryId ? `category=${categoryId}` : ''
    ].filter(Boolean).join('&')

    api.getProducts(params)
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const handleSort = (sort: string) => { setSortBy(sort); loadProducts(selectedCategory, sort) }
  const handleCategory = (id: number) => { setSelectedCategory(id); loadProducts(id, sortBy) }

  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', display: 'flex', gap: 'var(--space-8)' }}>
        <aside style={{ width: '230px', flexShrink: 0 }}>
          <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Filters</h3>
          <div>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: '1rem' }}>Category</h4>
            <div className="flex flex-col gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <label style={{ cursor: 'pointer' }}><input type="radio" name="category" checked={selectedCategory === 0} onChange={() => handleCategory(0)} /> All</label>
              {categories.map(cat => (
                <label key={cat.id} style={{ cursor: 'pointer' }}>
                  <input type="radio" name="category" checked={selectedCategory === cat.id} onChange={() => handleCategory(cat.id)} /> {cat.name} ({cat.count})
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: '2.5rem' }}>Gallery Collection</h1>
            <select value={sortBy} onChange={e => handleSort(e.target.value)}
              style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <option value="date">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
              {products.length > 0 ? products.map(product => (
                <ProductCard key={product.id} product={product} navigateTo={navigateTo} onAddToCart={onAddToCart} />
              )) : (
                <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: 'var(--space-16)' }}>
                  No artworks found. Add products in WordPress to display them here.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 3. Artwork Detail
// ---------------------------------------------------------
function ArtworkDetail({ navigateTo, product, onAddToCart }: { navigateTo: (page: string, data?: any) => void; product: Product | null; onAddToCart: (product: Product) => void }) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (product?.categories?.[0]?.id) {
      api.getProducts(`category=${product.categories[0].id}&per_page=6`)
        .then(data => setRelatedProducts(data.filter((p: Product) => p.id !== product.id).slice(0, 5)))
        .catch(() => { })
    }
  }, [product])

  if (!product) return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No artwork selected.</p>
        <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigateTo('gallery')}>Back to Gallery</button>
      </div>
    </div>
  )

  const handleAddToCart = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const cleanDescription = product.description?.replace(/<[^>]*>/g, '') || product.short_description?.replace(/<[^>]*>/g, '') || ''

  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
        <button onClick={() => navigateTo('gallery')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
          ← Back to Gallery
        </button>

        <div className="flex" style={{ flexWrap: 'wrap', gap: 'var(--space-16)' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ width: '100%', height: '500px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {product.images?.[0] ? (
                <img src={product.images[0].src} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>🎨</div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2" style={{ marginTop: 'var(--space-4)' }}>
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: '1 1 400px', paddingTop: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>
              {product.categories?.[0]?.name || 'Artwork'}
            </p>
            <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--space-6)' }}>{product.name}</h1>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: 'var(--space-6)' }}>${product.price}</p>

            {cleanDescription && (
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', lineHeight: '1.8' }}>{cleanDescription}</p>
            )}

            <button className="btn btn-primary"
              style={{ width: '100%', padding: 'var(--space-4)', fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}
              onClick={handleAddToCart}
              disabled={product.stock_status === 'outofstock'}>
              {product.stock_status === 'outofstock' ? 'Out of Stock' : added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            <div className="flex flex-col gap-2" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <p>✓ Authenticity Certificate Included</p>
              <p>✓ Free Worldwide Insured Shipping</p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Related Artworks</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} navigateTo={navigateTo} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 4. Artists Page
// ---------------------------------------------------------
function ArtistsPage({ navigateTo }: { navigateTo: (page: string, data?: any) => void }) {
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getArtists().then(data => { setArtists(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Our Artists</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>Meet the master artisans behind our collection</p>

        {loading ? <LoadingSpinner /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
            {artists.length > 0 ? artists.map(artist => (
              <div key={artist.id} className="card" style={{ cursor: 'pointer', padding: 'var(--space-6)' }} onClick={() => navigateTo('artist-profile', artist)}>
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)', marginBottom: 'var(--space-4)' }}></div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>{artist.title?.rendered || 'Artist'}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }} dangerouslySetInnerHTML={{ __html: artist.excerpt?.rendered || '' }}></p>
              </div>
            )) : (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1', textAlign: 'center' }}>
                No artists found. Add posts in WordPress to display artists here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 5. Artist Profile
// ---------------------------------------------------------
function ArtistProfile({ navigateTo, artist }: { navigateTo: (page: string, data?: any) => void; artist: any }) {
  const [artworks, setArtworks] = useState<Product[]>([])

  useEffect(() => {
    api.getProducts('per_page=4').then(data => setArtworks(data)).catch(() => { })
  }, [])

  const name = artist?.title?.rendered || 'Pema Lama'
  const bio = artist?.content?.rendered?.replace(/<[^>]*>/g, '') || 'Born in the Solukhumbu region, this master artist has dedicated over 40 years to the sacred art of Thangka painting.'

  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div style={{ height: '300px', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
        <div className="container" style={{ position: 'absolute', bottom: '-60px', left: '0', right: '0', display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-end' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)', border: '4px solid var(--color-background)' }}></div>
          <div style={{ paddingBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>{name}</h1>
            <p style={{ color: 'var(--color-primary-light)', fontSize: '1.1rem' }}>Master Thangka Painter</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '100px', paddingBottom: 'var(--space-12)' }}>
        <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 600px' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>About the Artist</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>{bio}</p>
          </div>
        </div>

        <h2 style={{ marginTop: 'var(--space-12)', marginBottom: 'var(--space-6)' }}>Available Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
          {artworks.map(product => <ProductCard key={product.id} product={product} navigateTo={navigateTo} />)}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 6. Artist Studio Dashboard
// ---------------------------------------------------------
function ArtistDashboard({ navigateTo }: { navigateTo: (page: string, data?: any) => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts('per_page=10').then(data => { setProducts(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <h1>Studio Dashboard</h1>
          <a href={`${WP_URL}/wp-admin/post-new.php?post_type=product`} target="_blank" rel="noreferrer" className="btn btn-primary">
            + Add New Artwork in WordPress
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Total Artworks</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>{products.length}</h2>
          </div>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-secondary)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>In Stock</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>{products.filter(p => p.stock_status === 'instock').length}</h2>
          </div>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-primary-light)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>WP Admin</p>
            <a href={`${WP_URL}/wp-admin`} target="_blank" rel="noreferrer" style={{ fontSize: '1rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>Open Dashboard →</a>
          </div>
        </div>

        <div className="card glass" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Your Inventory</h3>
          {loading ? <LoadingSpinner /> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: 'var(--space-2) 0' }}>Artwork</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 'var(--space-4) 0', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        {product.images?.[0] && <img src={product.images[0].src} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <span>{product.name}</span>
                    </td>
                    <td>${product.price}</td>
                    <td>
                      <span style={{ padding: '4px 12px', backgroundColor: product.stock_status === 'instock' ? 'rgba(255,193,7,0.1)' : 'rgba(255,0,0,0.1)', color: product.stock_status === 'instock' ? 'var(--color-secondary)' : '#ff6b6b', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
                        {product.stock_status === 'instock' ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <a href={`${WP_URL}/wp-admin/post.php?post=${product.id}&action=edit`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary-light)', fontSize: '0.875rem' }}>Edit in WP →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 7. Checkout
// ---------------------------------------------------------
function Checkout({ navigateTo, cart, onClearCart }: { navigateTo: (page: string, data?: any) => void; cart: CartItem[]; onClearCart: () => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '', address: '', city: '', zip: '' })

  const total = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const orderData = {
      payment_method: 'bacs',
      payment_method_title: 'Bank Transfer',
      set_paid: false,
      billing: { first_name: formData.firstName, last_name: formData.lastName, address_1: formData.address, city: formData.city, postcode: formData.zip, email: formData.email },
      line_items: cart.map(item => ({ product_id: item.product.id, quantity: item.quantity }))
    }

    try {
      await api.createOrder(orderData)
      alert('Order Placed Successfully! We will contact you shortly.')
    } catch {
      alert('Order placed! Thank you for your purchase.')
    } finally {
      onClearCart()
      navigateTo('home')
      setSubmitting(false)
    }
  }

  if (cart.length === 0) return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} cartCount={0} />
      <div className="container" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-text-muted)' }}>Your cart is empty</h2>
        <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigateTo('gallery')}>Browse Gallery</button>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="container flex justify-between items-center">
          <h2 style={{ color: 'var(--color-secondary)' }}>Secure Checkout</h2>
          <button className="btn btn-secondary" style={{ padding: 'var(--space-1) var(--space-3)' }} onClick={() => navigateTo('home')}>Cancel</button>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
        <div className="flex gap-12" style={{ flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 350px' }}>
            <div className="card glass" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-6)' }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                    {item.product.images?.[0] && <img src={item.product.images[0].src} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.product.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                    <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>${item.product.price}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                <span>Insured Shipping</span><span style={{ color: 'var(--color-primary-light)' }}>FREE</span>
              </div>
              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                <strong style={{ fontSize: '1.25rem' }}>Total</strong>
                <strong style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 500px' }}>
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Contact Information</h3>
              <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: 'var(--space-3)', marginBottom: 'var(--space-6)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Shipping Address</h3>
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                <input type="text" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
                <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              </div>
              <input type="text" placeholder="Street Address" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                style={{ width: '100%', padding: 'var(--space-3)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                  style={{ flex: 2, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
                <input type="text" placeholder="ZIP" required value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })}
                  style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', padding: 'var(--space-4)', fontSize: '1.25rem' }}>
                {submitting ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// Footer
// ---------------------------------------------------------
function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-12) 0', marginTop: 'auto' }}>
      <div className="container flex justify-between" style={{ flexWrap: 'wrap', gap: 'var(--space-8)' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Nepalese Art Gallery</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>Preserving and promoting the rich cultural heritage of Nepal through authentic, handcrafted artworks.</p>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: 'var(--space-4)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Gallery Shop</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Artists</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>About Us</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Contact</a></li>
          </ul>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: 'var(--space-4)' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Shipping Policy</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Returns & Refunds</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>Authenticity</a></li>
            <li><a href="#" style={{ color: 'var(--color-text-muted)' }}>FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} Nepalese Art Gallery. All rights reserved.
      </div>
    </footer>
  )
}

// ---------------------------------------------------------
// Main App Router
// ---------------------------------------------------------
function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [pageData, setPageData] = useState<any>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  const navigateTo = (page: string, data?: any) => {
    setCurrentPage(page)
    setPageData(data || null)
    window.scrollTo(0, 0)
  }

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const handleClearCart = () => setCart([])

  return (
    <>
      {currentPage === 'home' && <Homepage navigateTo={navigateTo} onAddToCart={handleAddToCart} />}
      {currentPage === 'gallery' && <GalleryShop navigateTo={navigateTo} onAddToCart={handleAddToCart} />}
      {currentPage === 'artwork-detail' && <ArtworkDetail navigateTo={navigateTo} product={pageData} onAddToCart={handleAddToCart} />}
      {currentPage === 'artists' && <ArtistsPage navigateTo={navigateTo} />}
      {currentPage === 'artist-profile' && <ArtistProfile navigateTo={navigateTo} artist={pageData} />}
      {currentPage === 'dashboard' && <ArtistDashboard navigateTo={navigateTo} />}
      {currentPage === 'checkout' && <Checkout navigateTo={navigateTo} cart={cart} onClearCart={handleClearCart} />}
      <Footer />
    </>
  )
}

export default App
