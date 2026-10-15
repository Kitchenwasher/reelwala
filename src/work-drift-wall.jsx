import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import DriftWall from './components/DriftWall.jsx';

const EDITED_REELS = [
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80&auto=format&fit=crop',
    title: 'Haldi Sunlight & Joy',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps HDR',
    tag: 'Private Celebration',
    category: 'weddings',
    duration: '0:28'
  },
  {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop',
    title: 'Electric Stage Pulse',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Music Festival',
    category: 'festivals',
    duration: '0:35'
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Midnight Toast',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic 24fps',
    tag: 'Celebration',
    category: 'weddings',
    duration: '0:22'
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
    title: 'The First Dance',
    subtitle: 'Shot on iPhone 16 Pro · Dolby Vision',
    tag: 'Wedding Moments',
    category: 'weddings',
    duration: '0:45'
  },
  {
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop',
    title: 'Club Motion & Lasers',
    subtitle: 'Shot on iPhone 16 Pro · Low Light 4K',
    tag: 'Nightlife',
    category: 'nightlife',
    duration: '0:30'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
    title: 'Acoustic Jam Session',
    subtitle: 'Shot on iPhone 16 Pro · Spatial Audio',
    tag: 'Culture & Jam',
    category: 'nightlife',
    duration: '0:40'
  },
  {
    image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Choreography',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps',
    tag: 'Dance Performance',
    category: 'festivals',
    duration: '0:25'
  },
  {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
    title: 'Carnival Confetti Sky',
    subtitle: 'Shot on iPhone 16 Pro · 120fps Slo-Mo',
    tag: 'Festival Energy',
    category: 'festivals',
    duration: '0:32'
  },
  {
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80&auto=format&fit=crop',
    title: 'Midnight Sparklers',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic Mode',
    tag: 'Milestone Toast',
    category: 'weddings',
    duration: '0:20'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
    title: 'Coastal Golden Hour',
    subtitle: 'Shot on iPhone 16 Pro · 4K HDR Graded',
    tag: 'Travel Story',
    category: 'travel',
    duration: '0:38'
  },
  {
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop',
    title: 'Keynote & Stage Momentum',
    subtitle: 'Shot on iPhone 16 Pro · Telephoto 4K',
    tag: 'Corporate Summit',
    category: 'festivals',
    duration: '0:26'
  },
  {
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80&auto=format&fit=crop',
    title: 'Night Market Glow',
    subtitle: 'Shot on iPhone 16 Pro · Night Mode Video',
    tag: 'Street & Beats',
    category: 'nightlife',
    duration: '0:29'
  },
  {
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop',
    title: 'Unfiltered Laughter',
    subtitle: 'Shot on iPhone 16 Pro · 4K 24fps',
    tag: 'Friends Forever',
    category: 'weddings',
    duration: '0:24'
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
    title: 'Festival Flare & Cheers',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Live Event',
    category: 'festivals',
    duration: '0:34'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    title: 'Mountain Sunrise Reel',
    subtitle: 'Shot on iPhone 16 Pro · ProRes Log Graded',
    tag: 'Scenic Adventure',
    category: 'travel',
    duration: '0:42'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Reels', count: 15 },
  { id: 'weddings', label: 'Weddings & Celebrations', count: 5 },
  { id: 'festivals', label: 'Festivals & Stages', count: 5 },
  { id: 'nightlife', label: 'Nightlife & Beats', count: 3 },
  { id: 'travel', label: 'Travel & Scenic', count: 2 }
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

function WorkDriftWallShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeReel, setActiveReel] = useState(null);
  const columns = useResponsiveColumns();

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
          >
            <span>{cat.label}</span>
            <small style={{ opacity: 0.7, marginLeft: '6px' }}>({cat.count})</small>
          </button>
        ))}
      </div>

      {/* Full-Bleed Edge-to-Edge Drift Wall */}
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
          fade={0.6}
          dim={0.82}
          overlayColor="#07060a"
          radius={18}
          onTileClick={handleTileClick}
        />
      </div>

      {/* Luxury Cinematic Tech Badge Strip */}
      <div className="work-meta-strip">
        <div className="work-meta-badge">
          <span className="apple-dot"></span>
          <strong>Shot on iPhone 16 Pro Max</strong>
          <span className="divider">·</span>
          <span>4K 60fps Dolby Vision HDR</span>
          <span className="divider">·</span>
          <span>Mobile Cinematography</span>
          <span className="divider">·</span>
          <span>Color Graded in DaVinci</span>
          <span className="divider">·</span>
          <span className="orange-text">Delivered within 24 Hours</span>
        </div>
      </div>

      {/* Full-Screen Luxury Reel Cinema Theatre Modal */}
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
                <div className="reel-cinema-specs">
                  <span>● 4K 60fps HDR</span>
                  <span>● DaVinci Graded</span>
                  <span>● 24h Express Delivery</span>
                </div>
                <a
                  href="#book"
                  className="reel-cinema-cta"
                  onClick={() => {
                    setActiveReel(null);
                    const occasionSelect = document.querySelector('select[name="occasion"]');
                    if (occasionSelect) {
                      if (activeReel.category === 'weddings') occasionSelect.value = 'Wedding / private celebration';
                      else if (activeReel.category === 'festivals') occasionSelect.value = 'Social / cultural event';
                      else occasionSelect.value = 'Wedding / private celebration';
                    }
                  }}
                >
                  Book a reel like this <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function mount() {
  const rootElement = document.getElementById('work-drift-wall-root');
  if (rootElement && !rootElement._reactRoot) {
    const root = createRoot(rootElement);
    rootElement._reactRoot = root;
    root.render(<WorkDriftWallShowcase />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
