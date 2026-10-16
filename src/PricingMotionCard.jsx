import React, { useEffect, useRef } from 'react';
import './pricing-motion.css';

export default function PricingMotionCard({ className = '', order = 0, children }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.IntersectionObserver) return;
    card.dataset.arrival = 'waiting';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      card.dataset.arrival = 'entered';
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const followPointer = event => {
    if (event.pointerType === 'touch' || !matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--package-x', `${x * 100}%`);
    card.style.setProperty('--package-y', `${y * 100}%`);
    card.style.setProperty('--package-rx', `${(0.5 - y) * 1.4}deg`);
    card.style.setProperty('--package-ry', `${(x - 0.5) * 1.4}deg`);
    card.style.setProperty('--package-angle', `${Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI + 90}deg`);
  };

  return <article ref={cardRef} className={`price-card pixel-card pricing-motion-card ${className}`}
    style={{ '--package-order': order }} onPointerMove={followPointer}
    onPointerLeave={() => {
      cardRef.current.style.setProperty('--package-rx', '0deg');
      cardRef.current.style.setProperty('--package-ry', '0deg');
    }}>
    <div className="pixel-card-content">{children}</div>
  </article>;
}
