import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import CircularCarousel from './components/CircularCarousel.jsx';
import './HeroReelScene.css';

export default function HeroReelScene({ items }) {
  const scene = useRef(null);
  const phone = useRef(null);
  useLayoutEffect(() => {
    const align = () => {
      const root = scene.current.getBoundingClientRect();
      const screen = phone.current.getBoundingClientRect();
      scene.current.style.setProperty('--orbit-x', `${screen.left - root.left + screen.width / 2}px`);
      scene.current.style.setProperty('--orbit-y', `${screen.top - root.top + screen.height / 2}px`);
    };
    const observer = new ResizeObserver(align);
    observer.observe(scene.current);
    observer.observe(phone.current);
    align();
    return () => observer.disconnect();
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const onChange = useCallback(index => {
    if (Number.isInteger(index) && items[index]) setActiveIndex(index);
  }, [items]);
  const active = items[activeIndex];

  return <div className="hero-interactive-scene" ref={scene}>
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
      <div className="phone-screen-glass" ref={phone}>
        <img key={active.src} className="phone-screen-img" src={active.src} alt={active.alt} draggable="false" />
        <div className="phone-dynamic-island" aria-hidden="true" />
      </div>
    </div>
  </div>;
}
