import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AeroShards from './AeroShards.jsx';
import AeroShardsCanvasFallback from './AeroShardsCanvasFallback.jsx';

function HeroAeroShards() {
  const [engine, setEngine] = useState('detecting');

  useEffect(() => {
    let cancelled = false;

    async function probeWebGPU() {
      if (typeof navigator === 'undefined' || !navigator.gpu) {
        if (!cancelled) setEngine('fallback');
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (!adapter) {
          if (!cancelled) setEngine('fallback');
          return;
        }

        const device = await adapter.requestDevice();
        if (!device) {
          if (!cancelled) setEngine('fallback');
          return;
        }

        // Clean up probe device
        device.destroy();
        if (!cancelled) setEngine('webgpu');
      } catch (err) {
        console.info('WebGPU probe unavailable; activating AeroShardsCanvasFallback:', err?.message || err);
        if (!cancelled) setEngine('fallback');
      }
    }

    probeWebGPU();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleWebGPUError = (error) => {
    console.warn('AeroShards WebGPU runtime error; smoothly switching to Canvas 3D fallback:', error?.message || error);
    setEngine('fallback');
  };

  if (engine === 'webgpu') {
    return (
      <AeroShards
        shardColor="#f97316"
        accentColor="#f97316"
        backgroundColor="transparent"
        lightMode={false}
        placement="full"
        material="glass"
        count={1100}
        shardSize={1.25}
        spread={1}
        twist={1}
        billow={1}
        speed={0.85}
        scale={1.2}
        depthOfField={0.75}
        glow={1.4}
        grain={0.03}
        vignette={0.15}
        intro={true}
        mouseInteraction={true}
        mouseStrength={0.5}
        markers="plus"
        pulseOnClick={true}
        holdToGather={true}
        parallax={0.4}
        onError={handleWebGPUError}
        className="hero-aero-shards-canvas-container"
      />
    );
  }

  // Render high-fidelity 3D Canvas fallback (runs immediately while detecting or in fallback)
  return (
    <AeroShardsCanvasFallback
      shardColor="#f97316"
      accentColor="#f97316"
      count={380}
      speed={0.85}
      shardSize={1.25}
      markers="plus"
      mouseInteraction={true}
      pulseOnClick={true}
      className="hero-aero-shards-canvas-container"
    />
  );
}

function mount() {
  const container = document.getElementById('hero-aero-shards-root');
  if (container && !container._reactRoot) {
    container.style.display = 'block';
    const root = createRoot(container);
    container._reactRoot = root;
    root.render(<HeroAeroShards />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
