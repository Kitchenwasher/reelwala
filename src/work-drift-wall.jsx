import React from 'react';
import { createRoot } from 'react-dom/client';
import DriftWall from './components/DriftWall.jsx';

const EDITED_REELS = [
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80&auto=format&fit=crop',
    title: 'Haldi Sunlight & Joy',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps HDR',
    tag: 'Private Celebration'
  },
  {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop',
    title: 'Electric Stage Pulse',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Music Festival'
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Midnight Toast',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic 24fps',
    tag: 'Celebration'
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
    title: 'The First Dance',
    subtitle: 'Shot on iPhone 16 Pro · Dolby Vision',
    tag: 'Wedding Moments'
  },
  {
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop',
    title: 'Club Motion & Lasers',
    subtitle: 'Shot on iPhone 16 Pro · Low Light 4K',
    tag: 'Nightlife'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
    title: 'Acoustic Jam Session',
    subtitle: 'Shot on iPhone 16 Pro · Spatial Audio',
    tag: 'Culture & Jam'
  },
  {
    image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Choreography',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps',
    tag: 'Dance Performance'
  },
  {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
    title: 'Carnival Confetti Sky',
    subtitle: 'Shot on iPhone 16 Pro · 120fps Slo-Mo',
    tag: 'Festival Energy'
  },
  {
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80&auto=format&fit=crop',
    title: 'Midnight Sparklers',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic Mode',
    tag: 'Milestone Toast'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
    title: 'Coastal Golden Hour',
    subtitle: 'Shot on iPhone 16 Pro · 4K HDR Graded',
    tag: 'Travel Story'
  },
  {
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop',
    title: 'Keynote & Stage Momentum',
    subtitle: 'Shot on iPhone 16 Pro · Telephoto 4K',
    tag: 'Corporate Summit'
  },
  {
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80&auto=format&fit=crop',
    title: 'Night Market Glow',
    subtitle: 'Shot on iPhone 16 Pro · Night Mode Video',
    tag: 'Street & Beats'
  },
  {
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop',
    title: 'Unfiltered Laughter',
    subtitle: 'Shot on iPhone 16 Pro · 4K 24fps',
    tag: 'Friends Forever'
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
    title: 'Festival Flare & Cheers',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Live Event'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    title: 'Mountain Sunrise Reel',
    subtitle: 'Shot on iPhone 16 Pro · ProRes Log Graded',
    tag: 'Scenic Adventure'
  }
];

function WorkDriftWallShowcase() {
  const handleTileClick = (item) => {
    // Open existing site lightbox dialog if present
    const dialog = document.getElementById('image-dialog');
    const img = document.getElementById('lightbox-image');
    const title = document.getElementById('lightbox-title');
    const cat = document.getElementById('lightbox-category');
    if (dialog && img && title) {
      img.src = item.image;
      title.textContent = item.title;
      if (cat) cat.textContent = `${item.tag} · ${item.subtitle}`;
      dialog.showModal();
    }
  };

  return (
    <div className="work-drift-wall-wrapper">
      <div className="work-drift-wall-container" style={{ width: '100%', height: '620px', position: 'relative' }}>
        <DriftWall
          items={EDITED_REELS}
          columns={5}
          tileWidth={195}
          tileHeight={275}
          gap={18}
          tilt={12}
          turn={-12}
          roll={0}
          perspective={1300}
          depth={90}
          speed={34}
          direction="up"
          variance={0.45}
          parallax={0.5}
          pauseOnHover={false}
          lift={54}
          fade={0.55}
          dim={0.78}
          overlayColor="#0f0d14"
          radius={16}
          onTileClick={handleTileClick}
        />
      </div>

      {/* Editorial Tech Badge Bar below the Drift Wall */}
      <div className="work-meta-strip">
        <div className="work-meta-badge">
          <span className="apple-dot"></span>
          <strong>Shot on iPhone 16 Pro Max</strong>
          <span className="divider">·</span>
          <span>4K 60fps Dolby Vision HDR</span>
          <span className="divider">·</span>
          <span>Mobile Cinematography</span>
          <span className="divider">·</span>
          <span className="orange-text">Delivered within 24 Hours</span>
        </div>
      </div>
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
