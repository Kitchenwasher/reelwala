import React, { useCallback, useState } from 'react';
import CircularCarousel from './components/CircularCarousel.jsx';
import './HeroReelScene.css';

export default function HeroReelScene({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onChange = useCallback(index => {
    if (Number.isInteger(index) && items[index]) setActiveIndex(index);
  }, [items]);
  const active = items[activeIndex];

  return <div className="hero-interactive-scene">
    <div className="hero-circular-carousel-wrapper">
      <CircularCarousel
        items={items} preset="orbit" tilt={-10} cardWidth={115}
        aspectRatio={9 / 16} gap={20} speed={13} autoplay="drift"
        direction="left" pauseOnHover={false} draggable={true}
        momentum={0.7} snap={false} intro="none" cornerRadius={16}
        depthFade={0.3} fadeColor="#f5f1e9" captions={false} onChange={onChange}
      />
    </div>
    <div className="hero-gimbal-holder">
      <div className="device-shadow" />
      <img className="gimbal" src="assets/gimbal.png" alt="Phone mounted on a handheld gimbal" fetchPriority="high" draggable="false" />
      <div className="phone-screen-glass">
        <img key={active.src} className="phone-screen-img" src={active.src} alt={active.alt} draggable="false" />
        <div className="phone-dynamic-island" aria-hidden="true" />
      </div>
    </div>
  </div>;
}
