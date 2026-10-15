import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import CircularCarousel from './components/CircularCarousel.jsx';

const REEL_MOMENTS = [
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80&auto=format&fit=crop',
    alt: 'Best Friends Laughing Outdoors',
    title: 'Unfiltered Joy',
    subtitle: 'Close Friends'
  },
  {
    src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80&auto=format&fit=crop',
    alt: 'Music Festival Stage & Neon Lights',
    title: 'Neon Pulse',
    subtitle: 'Music Festivals'
  },
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=80&auto=format&fit=crop',
    alt: 'Nightclub & Electric Dance Floor',
    title: 'Midnight Motion',
    subtitle: 'Nightlife & Parties'
  },
  {
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&q=80&auto=format&fit=crop',
    alt: 'Acoustic Jam Session & Friends',
    title: 'Warm Sessions',
    subtitle: 'Living Room Vibe'
  },
  {
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80&auto=format&fit=crop',
    alt: 'Rooftop Birthday Party & Toast',
    title: 'Golden Hour',
    subtitle: 'Celebrations'
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=80&auto=format&fit=crop',
    alt: 'Festival Confetti & Strobe Lights',
    title: 'Electric Carnival',
    subtitle: 'Culture & Crowd'
  },
  {
    src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&q=80&auto=format&fit=crop',
    alt: 'Celebration Sparklers & Toast',
    title: 'Spark & Relive',
    subtitle: 'Milestones'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&auto=format&fit=crop',
    alt: 'Coastal Adventure & Sunset Glow',
    title: 'Chasing Coast',
    subtitle: 'Travel Reels'
  },
  {
    src: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=900&q=80&auto=format&fit=crop',
    alt: 'Rooftop Dance & Sunset Cocktail',
    title: 'Sunset Moves',
    subtitle: 'Dance & Beats'
  },
  {
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=80&auto=format&fit=crop',
    alt: 'Carnival Night Festivities',
    title: 'Night Glow',
    subtitle: 'Festival Energy'
  }
];

function HeroCarouselScene() {
  const [activeItem, setActiveItem] = useState(REEL_MOMENTS[0]);
  const [likeCount, setLikeCount] = useState(342);
  const [liked, setLiked] = useState(true);

  const handleActiveChange = useCallback((index) => {
    if (typeof index === 'number' && REEL_MOMENTS[index]) {
      setActiveItem(REEL_MOMENTS[index]);
    }
  }, []);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(prev => !prev);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="hero-interactive-scene">
      {/* 3D Circular Carousel Ring orbiting smoothly around the handheld phone stand */}
      <div className="hero-circular-carousel-wrapper">
        <CircularCarousel
          items={REEL_MOMENTS}
          preset="orbit"
          tilt={-10}
          cardWidth={115}
          aspectRatio={9 / 16}
          gap={20}
          speed={13}
          autoplay="drift"
          direction="left"
          pauseOnHover={false}
          draggable={true}
          momentum={0.7}
          snap={false}
          intro="none"
          cornerRadius={16}
          depthFade={0.3}
          fadeColor="#f5f1e9"
          captions={false}
          onChange={handleActiveChange}
        />
      </div>

      {/* Floating Instagram-Style Social Reactions */}
      <div className="ig-floating-reactions" aria-hidden="true">
        <div className="ig-badge ig-badge-sound">
          <span>🔊</span>
          <small>Reel sound</small>
        </div>
        <div className="ig-badge ig-badge-heart">
          <span>🤍</span>
        </div>
        <div className="ig-badge ig-badge-sparkles">
          <span>✨</span>
        </div>
        <div className="ig-badge ig-badge-whiteheart">
          <span>🤍</span>
        </div>
      </div>

      {/* The Central Handheld Phone & Gimbal Stand */}
      <div className="hero-gimbal-holder">
        <div className="device-shadow"></div>
        <img
          className="gimbal"
          src="assets/gimbal.png"
          alt="Professional smartphone gimbal camera stand"
          fetchPriority="high"
        />

        {/* Dynamic Screen Overlay on the Gimbal Phone */}
        <div className="phone-screen-glass">
          <img
            key={activeItem.src}
            className="phone-screen-img"
            src={activeItem.src}
            alt={activeItem.title}
          />
          <div className="phone-screen-scrim"></div>
          <div className="phone-dynamic-island"></div>

          {/* Instagram Story / Reel Header UI */}
          <div className="phone-ig-top">
            <div className="phone-ig-progress">
              <span className="active"></span>
              <span></span>
              <span></span>
            </div>
            <div className="phone-ig-author">
              <span className="phone-ig-dot"></span>
              <span className="phone-ig-username">thereelwala</span>
              <span className="phone-ig-badge">PRO</span>
              <span className="phone-ig-time">1h</span>
            </div>
          </div>

          {/* Instagram Story / Reel Bottom Caption & Audio */}
          <div className="phone-ig-bottom">
            <p className="phone-ig-title">{activeItem.title}</p>
            <p className="phone-ig-sub">♫ {activeItem.subtitle} · Original audio</p>
            <div className="phone-ig-actions">
              <button
                type="button"
                className={`phone-ig-heart ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                aria-label="Like this reel"
              >
                {liked ? '❤️' : '🤍'} <span>{likeCount}</span>
              </button>
              <span className="phone-ig-share">↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mount() {
  const root = document.getElementById('hero-carousel-root');
  if (root && !root._reactRoot) {
    const reactRoot = createRoot(root);
    root._reactRoot = reactRoot;
    reactRoot.render(<HeroCarouselScene />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
