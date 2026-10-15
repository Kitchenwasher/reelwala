import React from 'react';
import { createRoot } from 'react-dom/client';
import AeroShards from './AeroShards.jsx';

function HeroAeroShards() {
  const handleError = (error) => {
    console.warn('AeroShards WebGPU fallback:', error?.message || error);
    const el = document.getElementById('hero-aero-shards-root');
    if (el) el.style.display = 'none';
  };

  return (
    <AeroShards
      shardColor="#f97316"
      accentColor="#f97316"
      backgroundColor="transparent"
      lightMode={true}
      placement="full"
      material="glass"
      count={1200}
      shardSize={1.1}
      spread={1}
      twist={1}
      billow={1}
      speed={0.8}
      scale={1}
      depthOfField={0.75}
      glow={0.35}
      grain={0.03}
      vignette={0.15}
      intro={true}
      mouseInteraction={true}
      mouseStrength={0.5}
      markers="plus"
      pulseOnClick={true}
      holdToGather={true}
      parallax={0.4}
      onError={handleError}
      className="hero-aero-shards-canvas-container"
    />
  );
}

function mount() {
  const container = document.getElementById('hero-aero-shards-root');
  if (container && !container._reactRoot) {
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      const root = createRoot(container);
      container._reactRoot = root;
      root.render(<HeroAeroShards />);
    } else {
      console.info('WebGPU not supported on this device/browser; maintaining standard hero visual.');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
