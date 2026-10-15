import React from 'react';
import { createRoot } from 'react-dom/client';
import HeroReelScene from './HeroReelScene.jsx';

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


function mount() {
  const container = document.getElementById('hero-carousel-root');
  if (container && !container._reactRoot) {
    container._reactRoot = createRoot(container);
    container._reactRoot.render(<HeroReelScene items={REEL_MOMENTS} />);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
