import { useState, useEffect } from 'react'
import './index.css'
import api from './api/woo'

// ---------------------------------------------------------
// Navigation Component
// ---------------------------------------------------------
function Navigation({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')} role="button" tabIndex={0} style={{ outline: 'none' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>A</div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px', color: 'var(--color-text)', cursor: 'pointer' }}>Nepalese Art Gallery</h2>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('gallery'); }} className="text-text">Gallery Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('artist-profile'); }} className="text-text">Artists</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('dashboard'); }} className="text-text">Studio</a>
          <button className="btn btn-primary" style={{ padding: 'var(--space-2) var(--space-4)' }} onClick={() => navigateTo('checkout')}>
            Cart (1)
          </button>
        </div>
      </div>
    </nav>
  )
}

// ---------------------------------------------------------
// 1. Homepage
// ---------------------------------------------------------
function Homepage({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} />
      <header className="flex flex-col items-center justify-center text-center" style={{ minHeight: '70vh', padding: 'var(--space-8) var(--space-4)', backgroundImage: 'radial-gradient(circle at center, var(--color-surface) 0%, var(--color-background) 100%)' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Discover the Soul of Nepal</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '700px', marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
          Hello from Niraj. Explore authentic, handcrafted artworks from master artisans across the Himalayas. From intricate Thangkas to contemporary expressions.
        </p>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={() => navigateTo('gallery')}>Explore Gallery</button>
          <button className="btn btn-secondary" onClick={() => navigateTo('artist-profile')}>Meet the Artists</button>
        </div>
      </header>

      <section className="container" style={{ padding: 'var(--space-16) var(--space-4)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <h2>Featured Masterpieces</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('gallery'); }}>View All &rarr;</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
          {[1, 2, 3].map((item) => (
            <div key={item} className="card">
              <div style={{ height: '300px', backgroundColor: 'var(--color-surface-light)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 'var(--space-2)', right: 'var(--space-2)', backgroundColor: 'var(--color-background)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                  $450
                </div>
              </div>
              <div style={{ padding: 'var(--space-6)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-1)' }}>Thangka</p>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>The Radiant Mandala {item}</h3>
                <p className="text-muted" style={{ marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>By Master Pema Lama</p>
                <button className="btn btn-secondary" style={{ width: '100%', padding: 'var(--space-2)' }} onClick={() => navigateTo('artwork-detail')}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------
// 2. Gallery Shop
// ---------------------------------------------------------
function GalleryShop({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', display: 'flex', gap: 'var(--space-8)' }}>
        {/* Filters */}
        <aside style={{ width: '230px', flexShrink: 0 }}>
          <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Filters</h3>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: '1rem' }}>Category</h4>
            <div className="flex flex-col gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <label><input type="checkbox" defaultChecked /> Thangka</label>
              <label><input type="checkbox" /> Mandala</label>
              <label><input type="checkbox" /> Contemporary</label>
              <label><input type="checkbox" /> Sculptures</label>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: 'var(--space-2)', fontSize: '1rem' }}>Price Range</h4>
            <input type="range" style={{ width: '100%' }} />
            <div className="flex justify-between" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>
        </aside>

        {/* Gallery Grid */}
        <div style={{ flex: 1 }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
            <h1 style={{ fontSize: '2.5rem' }}>Gallery Collection</h1>
            <select style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="card" style={{ cursor: 'pointer' }} onClick={() => navigateTo('artwork-detail')}>
                <div style={{ height: '240px', backgroundColor: 'var(--color-surface-light)' }}></div>
                <div style={{ padding: 'var(--space-4)' }}>
                  <h4 style={{ marginBottom: 'var(--space-1)' }}>Mystic Peaks {item}</h4>
                  <p style={{ color: 'var(--color-primary-light)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Canvas Painting</p>
                  <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>${200 + item * 50}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 3. Artwork Detail
// ---------------------------------------------------------
function ArtworkDetail({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
        <div className="flex" style={{ flexWrap: 'wrap', gap: 'var(--space-16)' }}>
          {/* Image */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ width: '100%', height: '500px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}></div>
          </div>

          {/* Details */}
          <div style={{ flex: '1 1 400px', paddingTop: 'var(--space-4)' }}>
            <p style={{ color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>Traditional Thangka</p>
            <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--space-2)' }}>The Radiant Mandala</h1>

            <div className="flex items-center gap-4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)' }}></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Artist</p>
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('artist-profile'); }} style={{ fontWeight: 'bold' }}>Pema Lama</a>
              </div>
            </div>

            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: 'var(--space-6)' }}>$1,250.00</p>

            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', lineHeight: '1.8' }}>
              A masterfully crafted mandala depicting the cosmos. Painted with natural pigments and 24k gold leaf on cotton canvas. This piece took over 3 months to complete and carries profound spiritual energy.
            </p>

            <button className="btn btn-primary" style={{ width: '100%', padding: 'var(--space-4)', fontSize: '1.25rem', marginBottom: 'var(--space-4)' }} onClick={() => navigateTo('checkout')}>
              Add to Cart
            </button>

            <div className="flex flex-col gap-2" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <p>✓ Authenticity Certificate Included</p>
              <p>✓ Free Worldwide Insured Shipping</p>
              <p>✓ Dimensions: 60cm x 80cm</p>
            </div>
          </div>
        </div>

        {/* Related Artworks */}
        <div style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>More by Pema Lama</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)' }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="card" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo(0, 0)}>
                <div style={{ height: '180px', backgroundColor: 'var(--color-surface-light)' }}></div>
                <div style={{ padding: 'var(--space-3)' }}>
                  <h5 style={{ marginBottom: 'var(--space-1)', fontSize: '1rem' }}>Sacred Mandala {item}</h5>
                  <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>${800 + item * 50}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 4. Artist Profile
// ---------------------------------------------------------
function ArtistProfile({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} />

      {/* Banner */}
      <div style={{ height: '300px', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
        <div className="container" style={{ position: 'absolute', bottom: '-60px', left: '0', right: '0', display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-end' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)', border: '4px solid var(--color-background)' }}></div>
          <div style={{ paddingBottom: 'var(--space-2)' }}>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Pema Lama</h1>
            <p style={{ color: 'var(--color-primary-light)', fontSize: '1.1rem' }}>Master Thangka Painter</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '100px', paddingBottom: 'var(--space-12)' }}>
        <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
          {/* Bio */}
          <div style={{ flex: '1 1 600px' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>About the Artist</h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
              Born in the Solukhumbu region, Pema Lama has dedicated over 40 years to the sacred art of Thangka painting. Training under the guidance of high lamas in monasteries across Nepal and Tibet, his work is renowned for its incredible precision and spiritual depth.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
              "Each stroke is a meditation, a prayer offered to the universe."
            </p>
          </div>

          {/* Stats */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>Artist Highlights</h3>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Artworks</span>
                <strong>42</strong>
              </div>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Exhibitions</span>
                <strong>12</strong>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Experience</span>
                <strong>40+ Years</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <h2 style={{ marginTop: 'var(--space-12)', marginBottom: 'var(--space-6)' }}>Available Works by Pema</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card" style={{ cursor: 'pointer' }} onClick={() => navigateTo('artwork-detail')}>
              <div style={{ height: '250px', backgroundColor: 'var(--color-surface-light)' }}></div>
              <div style={{ padding: 'var(--space-4)' }}>
                <h4>Sacred Geometry {item}</h4>
                <p style={{ color: 'var(--color-secondary)' }}>$900</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 5. Artist Studio Dashboard
// ---------------------------------------------------------
function ArtistDashboard({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      <Navigation navigateTo={navigateTo} />
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-8)' }}>
          <h1>Studio Dashboard</h1>
          <button className="btn btn-primary" onClick={() => navigateTo('upload-artwork')}>+ Upload New Artwork</button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Total Earnings</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>$12,450</h2>
          </div>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-secondary)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Active Artworks</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>14</h2>
          </div>
          <div className="card glass" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-primary-light)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Profile Views</p>
            <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>1.2k</h2>
          </div>
        </div>

        {/* Recent Artworks Table */}
        <div className="card glass" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Your Inventory</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: 'var(--space-2) 0' }}>Artwork</th>
                <th>Price</th>
                <th>Status</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 'var(--space-4) 0', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-sm)' }}></div>
                    <span>Mandala {row}</span>
                  </td>
                  <td>${500 * row}</td>
                  <td><span style={{ padding: '4px 12px', backgroundColor: 'rgba(255,193,7,0.1)', color: 'var(--color-secondary)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>Available</span></td>
                  <td>{100 * row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 6. Upload New Artwork
// ---------------------------------------------------------
function UploadArtwork({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <div className="animate-fade-in">
      <Navigation navigateTo={navigateTo} />
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: 'var(--space-8)' }}>Upload New Artwork</h1>

        <form className="card glass" style={{ padding: 'var(--space-8)' }} onSubmit={(e) => { e.preventDefault(); navigateTo('dashboard'); }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Artwork Title</label>
            <input type="text" placeholder="e.g. Wheel of Life Thangka" style={{ width: '100%', padding: 'var(--space-3)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>High-Res Image</label>
            <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>📁</div>
              <p style={{ color: 'var(--color-primary-light)', fontWeight: 'bold', cursor: 'pointer' }}>Click to upload or drag & drop</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="flex gap-6" style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Price ($)</label>
              <input type="number" placeholder="0.00" style={{ width: '100%', padding: 'var(--space-3)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Medium</label>
              <select style={{ width: '100%', padding: 'var(--space-3)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }}>
                <option>Canvas</option>
                <option>Cotton</option>
                <option>Wood</option>
                <option>Metal</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Description</label>
            <textarea rows={5} placeholder="Describe the story and technique..." style={{ width: '100%', padding: 'var(--space-3)', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }}></textarea>
          </div>

          <div className="flex gap-4 justify-end">
            <button type="button" className="btn btn-secondary" onClick={() => navigateTo('dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish Artwork</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// 7. Checkout
// ---------------------------------------------------------
function Checkout({ navigateTo }: { navigateTo: (page: string) => void }) {
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
          {/* Order Summary */}
          <div style={{ flex: '1 1 350px' }}>
            <div className="card glass" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-6)' }}>Order Summary</h3>
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--color-surface-light)', borderRadius: 'var(--radius-sm)' }}></div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>The Radiant Mandala</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Pema Lama</p>
                  <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)', marginTop: 'var(--space-1)' }}>$1,250.00</p>
                </div>
              </div>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-2)', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>$1,250.00</span>
              </div>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
                <span>Insured Shipping</span>
                <span style={{ color: 'var(--color-primary-light)' }}>FREE</span>
              </div>
              <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <strong style={{ fontSize: '1.25rem' }}>Total</strong>
                <strong style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>$1,250.00</strong>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: '1 1 500px' }}>
            <form onSubmit={(e) => { e.preventDefault(); alert('Order Placed Successfully!'); navigateTo('home'); }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Contact Information</h3>
              <input type="email" placeholder="Email Address" style={{ width: '100%', padding: 'var(--space-3)', marginBottom: 'var(--space-6)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />

              <h3 style={{ marginBottom: 'var(--space-4)' }}>Shipping Address</h3>
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-4)' }}>
                <input type="text" placeholder="First Name" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
                <input type="text" placeholder="Last Name" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              </div>
              <input type="text" placeholder="Street Address" style={{ width: '100%', padding: 'var(--space-3)', marginBottom: 'var(--space-4)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <input type="text" placeholder="City" style={{ flex: 2, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
                <input type="text" placeholder="ZIP" style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 'var(--radius-md)' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 'var(--space-4)', fontSize: '1.25rem' }}>Complete Purchase</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// Footer Component
// ---------------------------------------------------------
function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-12) 0', marginTop: 'auto' }}>
      <div className="container flex justify-between" style={{ flexWrap: 'wrap', gap: 'var(--space-8)' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-secondary)' }}>Nepalese Art Gallery</h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
            Preserving and promoting the rich cultural heritage of Nepal through authentic, handcrafted artworks.
          </p>
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
// Main Router
// ---------------------------------------------------------
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Suppress "never read" warning
  console.log({ products, loading });

  useEffect(() => {
    // Simple test to ensure the API is connected and to resolve unused import warnings
    api.get("products", { per_page: 5 })
      .then((response: any) => { // Added : any here
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error: any) => { // Added : any here
        console.error("WooCommerce Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {currentPage === 'home' && <Homepage navigateTo={setCurrentPage} />}
      {currentPage === 'gallery' && <GalleryShop navigateTo={setCurrentPage} />}
      {currentPage === 'artwork-detail' && <ArtworkDetail navigateTo={setCurrentPage} />}
      {currentPage === 'artist-profile' && <ArtistProfile navigateTo={setCurrentPage} />}
      {currentPage === 'dashboard' && <ArtistDashboard navigateTo={setCurrentPage} />}
      {currentPage === 'upload-artwork' && <UploadArtwork navigateTo={setCurrentPage} />}
      {currentPage === 'checkout' && <Checkout navigateTo={setCurrentPage} />}

      {/* Easter Egg / Previous Phase */}
      {currentPage === 'design-system' && (
        <div style={{ padding: '50px', color: '#fff' }}>Design System is active. <button onClick={() => setCurrentPage('home')}>Home</button></div>
      )}

      <Footer />
    </>
  )
}

export default App
