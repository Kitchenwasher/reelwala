import React from 'react';
import PixelCard from './PixelCard.jsx';
import './pricing-motion.css';

export default function PricingMotionCard({ className = '', order = 0, featured = false, children }) {
  return (
    <PixelCard
      variant="warm"
      gap={8}
      speed={28}
      pixelSize={3.5}
      spotlight={0.7}
      glow={0.55}
      radius={28}
      theme="light"
      clickPulse={true}
      className={`pricing-motion-card ${className}`.trim()}
      style={{ '--package-order': order }}
    >
      {children}
    </PixelCard>
  );
}
