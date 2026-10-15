import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import FlexCarousel from './components/FlexCarousel.jsx';

const CREATOR_ITEMS = [
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Aarav Sharma',
    title: 'Aarav Sharma',
    subtitle: 'Lead Reel Director · Mumbai'
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Kabir Sen',
    title: 'Kabir Sen',
    subtitle: 'Cinematic Videographer · Delhi NCR'
  },
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Ananya Iyer',
    title: 'Ananya Iyer',
    subtitle: 'Visual Storyteller · Pune'
  },
  {
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Rohan Mehta',
    title: 'Rohan Mehta',
    subtitle: 'Gimbal & Motion Artist · Bengaluru'
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Devika Roy',
    title: 'Devika Roy',
    subtitle: 'Colorist & Wedding Reeler · Kolkata'
  },
  {
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Vikram Malhotra',
    title: 'Vikram Malhotra',
    subtitle: 'Festival & Concert Reeler · Goa'
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Meera Nair',
    title: 'Meera Nair',
    subtitle: 'Culture & Lifestyle Reeler · Hyderabad'
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80&auto=format&fit=crop',
    alt: 'Creator Tanya Sengupta',
    title: 'Tanya Sengupta',
    subtitle: 'Fashion & Brand Reeler · Jaipur'
  }
];

function CreatorsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCreator = CREATOR_ITEMS[activeIndex] || CREATOR_ITEMS[0];

  return (
    <div className="creators-showcase-wrapper">
      <div className="creators-carousel-container" style={{ width: '100%', height: '560px', position: 'relative' }}>
        <FlexCarousel
          items={CREATOR_ITEMS}
          preset="liquid"
          fit="natural"
          intro="rise"
          cardHeight={0.52}
          gap={14}
          radius={12}
          squeeze={0.25}
          focusOnClick
          captions
          onSelect={(index) => setActiveIndex(index)}
        />
      </div>

      <div className="creators-dock">
        <div className="creators-dock-left">
          <span className="creators-dock-tag">Featured Director</span>
          <strong className="creators-dock-name">{activeCreator.title}</strong>
          <span className="creators-dock-sub">{activeCreator.subtitle}</span>
        </div>
        <a
          href="#book"
          className="button small"
          onClick={() => {
            if (window.ReelWalaBooking) {
              window.ReelWalaBooking.setCreator({
                id: activeCreator.title.toLowerCase().replace(/\s+/g, '-'),
                name: activeCreator.title,
                role: activeCreator.subtitle.split(' · ')[0],
                city: activeCreator.subtitle.split(' · ')[1] || '',
                avatar: activeCreator.src
              });
            }
          }}
        >
          Book with {activeCreator.title.split(' ')[0]} <span>↗</span>
        </a>
      </div>

      <div className="creators-hint">
        <span>↔ Drag, swipe or use mouse wheel to explore creators · Click any card to focus</span>
      </div>
    </div>
  );
}

function mount() {
  const rootElement = document.getElementById('creators-carousel-root');
  if (rootElement && !rootElement._reactRoot) {
    const root = createRoot(rootElement);
    rootElement._reactRoot = root;
    root.render(<CreatorsShowcase />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
