import React from 'react';
import { createRoot } from 'react-dom/client';
import HeroReelScene from './HeroReelScene.jsx';

const REEL_MOMENTS = [
  {
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80&auto=format&fit=crop',
    alt: 'Joyful Haldi Ceremony with Marigold Petals',
    title: 'Haldi Celebration',
    subtitle: 'Wedding Ceremony'
  },
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop',
    alt: 'Romantic Couple First Dance under Fairy Lights',
    title: 'The First Dance',
    subtitle: 'Reception Night'
  },
  {
    src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80&auto=format&fit=crop',
    alt: 'Vibrant Sangeet Dance Performance',
    title: 'Sangeet Energy',
    subtitle: 'Dance & Music'
  },
  {
    src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format&fit=crop',
    alt: 'Bridal Henna & Mehendi Celebration',
    title: 'Mehendi Beats',
    subtitle: 'Wedding Festivities'
  },
  {
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80&auto=format&fit=crop',
    alt: 'Golden Hour Champagne Toast Celebration',
    title: 'Golden Hour Toasts',
    subtitle: 'Cocktail Reception'
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80&auto=format&fit=crop',
    alt: 'Live Concert & Festival Sparklers Crowd',
    title: 'Live Festival Energy',
    subtitle: 'Concerts & Events'
  },
  {
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80&auto=format&fit=crop',
    alt: 'Keynote Speaker on Modern Conference Stage',
    title: 'Keynote Momentum',
    subtitle: 'Corporate Summit'
  },
  {
    src: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=900&q=80&auto=format&fit=crop',
    alt: 'Joyful Holi Color Powder Festival Celebration',
    title: 'Festival of Colors',
    subtitle: 'Cultural Festivities'
  },
  {
    src: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=900&q=80&auto=format&fit=crop',
    alt: 'Nightclub & DJ Showcase Celebration',
    title: 'Midnight Beats',
    subtitle: 'Afterparty & Nightlife'
  },
  {
    src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=900&q=80&auto=format&fit=crop',
    alt: 'Arena Live Stage & Crowd Celebration',
    title: 'Arena Lights',
    subtitle: 'Live Shows'
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
