import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import DriftWall from './components/DriftWall.jsx';

const EDITED_REELS = [
  {
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80&auto=format&fit=crop',
    title: 'Haldi Petals & Laughter',
    subtitle: 'Event photo preview',
    tag: 'Haldi Ceremony',
    category: 'weddings',
    duration: '0:28'
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
    title: 'The First Dance',
    subtitle: 'Event photo preview',
    tag: 'First Dance',
    category: 'weddings',
    duration: '0:45'
  },
  {
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80&auto=format&fit=crop',
    title: 'Champagne & Toasts',
    subtitle: 'Event photo preview',
    tag: 'Reception Toast',
    category: 'weddings',
    duration: '0:22'
  },
  {
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80&auto=format&fit=crop',
    title: 'Mehendi Beats & Henna',
    subtitle: 'Event photo preview',
    tag: 'Mehendi Night',
    category: 'weddings',
    duration: '0:31'
  },
  {
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80&auto=format&fit=crop',
    title: 'Sangeet Night Energy',
    subtitle: 'Event photo preview',
    tag: 'Sangeet Dance',
    category: 'weddings',
    duration: '0:36'
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
    title: 'Festival Flare & Cheers',
    subtitle: 'Event photo preview',
    tag: 'Live Festival',
    category: 'festivals',
    duration: '0:34'
  },
  {
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop',
    title: 'Keynote & Stage Momentum',
    subtitle: 'Event photo preview',
    tag: 'Global Summit',
    category: 'corporate',
    duration: '0:26'
  },
  {
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80&auto=format&fit=crop',
    title: 'Sunburn Arena Beats',
    subtitle: 'Event photo preview',
    tag: 'Arena Concert',
    category: 'festivals',
    duration: '0:38'
  },
  {
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80&auto=format&fit=crop',
    title: 'Gulal & Colors of Spring',
    subtitle: 'Event photo preview',
    tag: 'Holi Festival',
    category: 'festivals',
    duration: '0:30'
  },
  {
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80&auto=format&fit=crop',
    title: 'Campus Fest Headline',
    subtitle: 'Event photo preview',
    tag: 'Cultural Fest',
    category: 'festivals',
    duration: '0:27'
  },
  {
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&q=80&auto=format&fit=crop',
    title: 'Drop The Beat',
    subtitle: 'Event photo preview',
    tag: 'DJ Showcase',
    category: 'nightlife',
    duration: '0:33'
  },
  {
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80&auto=format&fit=crop',
    title: 'Midnight Velvet Lounge',
    subtitle: 'Event photo preview',
    tag: 'Cocktail Club',
    category: 'nightlife',
    duration: '0:29'
  },
  {
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80&auto=format&fit=crop',
    title: 'Rhythm & Brass Sessions',
    subtitle: 'Event photo preview',
    tag: 'Live Club',
    category: 'nightlife',
    duration: '0:35'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    title: 'Himalayan Ridge Sunrise',
    subtitle: 'Event photo preview',
    tag: 'Scenic Adventure',
    category: 'travel',
    duration: '0:42'
  },
  {
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80&auto=format&fit=crop',
    title: 'Dunes of Thar Golden Glow',
    subtitle: 'Event photo preview',
    tag: 'Desert Expedition',
    category: 'travel',
    duration: '0:40'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Reels' },
  { id: 'weddings', label: 'Weddings & Celebrations' },
  { id: 'festivals', label: 'Festivals & Stages' },
  { id: 'corporate', label: 'Corporate Events' },
  { id: 'nightlife', label: 'Nightlife & Beats' },
  { id: 'travel', label: 'Travel & Scenic' }
];

function useResponsiveColumns() {
  const [cols, setCols] = useState(6);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(3);
      else if (w < 1050) setCols(5);
      else if (w < 1500) setCols(6);
      else setCols(7);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return cols;
}

function WorkDriftWallShowcase({ gallery = false }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeReel, setActiveReel] = useState(null);
  const columns = useResponsiveColumns();

  useEffect(() => {
    if (gallery) return;
    const requested = new URLSearchParams(window.location.search).get('reel');
    const reel = EDITED_REELS.find(item => item.title === requested);
    if (reel) window.ReelWalaBooking?.setInspiration({ ...reel, occasion: occasionForReel(reel) });
  }, [gallery]);

  useEffect(() => {
    const selectCategory = event => {
      if (CATEGORIES.some(category => category.id === event.detail)) setActiveCategory(event.detail);
    };
    window.addEventListener('reel-wala:category', selectCategory);
    return () => window.removeEventListener('reel-wala:category', selectCategory);
  }, []);

  const filteredReels = useMemo(() => {
    if (activeCategory === 'all') return EDITED_REELS;
    const filtered = EDITED_REELS.filter(r => r.category === activeCategory);
    return filtered.length ? filtered : EDITED_REELS;
  }, [activeCategory]);

  const handleTileClick = useCallback((item) => {
    setActiveReel(item);
  }, []);

  // Close cinema modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveReel(null);
    };
    if (activeReel) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeReel]);

  return (
    <div className="work-drift-wall-wrapper">
      {/* Category Filter Chips Bar */}
      <div className="work-filter-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`work-filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            type="button"
            aria-pressed={activeCategory === cat.id}
          >
            <span>{cat.label}</span>
            <small style={{ opacity: 0.7, marginLeft: '6px' }}>({cat.id === 'all' ? EDITED_REELS.length : EDITED_REELS.filter(reel => reel.category === cat.id).length})</small>
          </button>
        ))}
      </div>

      {gallery ? <>
        <p className="gallery-result-count" role="status">{filteredReels.length} {filteredReels.length === 1 ? 'reel' : 'reels'}</p>
        <div className="reels-gallery-grid">
          {filteredReels.map(item => <button type="button" className="reels-gallery-card" key={item.title} onClick={() => handleTileClick(item)} aria-label={`View ${item.title}`}>
            <img src={item.image} alt="" loading="lazy" width="600" height="800" />
            <span className="reels-gallery-tag">{item.tag}</span>
            <span className="reels-gallery-caption"><strong>{item.title}</strong><span>{item.subtitle}</span></span>
          </button>)}
        </div>
      </> :
      <div className="work-drift-wall-container">
        <DriftWall
          items={filteredReels}
          columns={columns}
          tileWidth={210}
          tileHeight={295}
          gap={18}
          tilt={12}
          turn={-12}
          roll={0}
          perspective={1400}
          depth={95}
          speed={32}
          direction="up"
          variance={0.45}
          parallax={0.55}
          pauseOnHover={false}
          lift={56}
          fade={0.12}
          dim={1}
          overlayColor="#07060a"
          radius={18}
          onTileClick={handleTileClick}
        />
      </div>}

      {/* Event preview */}
      {activeReel && (
        <div className="reel-cinema-overlay" onClick={() => setActiveReel(null)} role="dialog" aria-modal="true" aria-label={activeReel.title}>
          <div className="reel-cinema-card" onClick={e => e.stopPropagation()}>
            <button className="reel-cinema-close" onClick={() => setActiveReel(null)} aria-label="Close cinema preview">✕</button>
            
            {/* Ambient Background Glow */}
            <div className="reel-cinema-glow" style={{ backgroundImage: `url(${activeReel.image})` }}></div>

            {/* Vertical Phone Screen Theatre Frame */}
            <div className="reel-cinema-viewport">
              <img src={activeReel.image} alt={activeReel.title} className="reel-cinema-media" />
              <div className="reel-cinema-scrim"></div>

              {/* Status Bar */}
              <div className="reel-cinema-status-bar">
                <span>09:41</span>
                <div className="reel-cinema-island"></div>
                <span>5G ●</span>
              </div>

              {/* Progress Bar */}
              <div className="reel-cinema-progress">
                <div className="reel-cinema-bar"></div>
              </div>

              {/* Category Tag */}
              <div className="reel-cinema-badge">
                <span className="dot"></span>
                <span>{activeReel.tag}</span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="reel-cinema-center-action">
                <div className="reel-cinema-play-btn" aria-hidden="true">▶</div>
              </div>

              {/* Reel Bottom Meta */}
              <div className="reel-cinema-info">
                <h3>{activeReel.title}</h3>
                <p className="reel-cinema-tech">{activeReel.subtitle}</p>
                <a
                  href={gallery ? `./?reel=${encodeURIComponent(activeReel.title)}#book` : '#book'}
                  className="reel-cinema-cta"
                  onClick={() => {
                    const occasionVal = occasionForReel(activeReel);

                    window.ReelWalaBooking?.setInspiration({
                      title: activeReel.title,
                      subtitle: activeReel.subtitle,
                      tag: activeReel.tag,
                      category: activeReel.category,
                      image: activeReel.image,
                      occasion: occasionVal
                    });
                    setActiveReel(null);
                  }}
                >
                  Book a reel like this
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function occasionForReel(reel) {
  if (reel.category === 'weddings') return 'Wedding / private celebration';
  if (reel.category === 'corporate') return 'Corporate event';
  if (['festivals', 'nightlife'].includes(reel.category)) return 'Social / cultural event';
  return 'Something else';
}

function mount() {
  const rootElement = document.getElementById('work-drift-wall-root') || document.getElementById('reels-gallery-root');
  if (rootElement && !rootElement._reactRoot) {
    const root = createRoot(rootElement);
    rootElement._reactRoot = root;
    root.render(<WorkDriftWallShowcase gallery={rootElement.id === 'reels-gallery-root'} />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
