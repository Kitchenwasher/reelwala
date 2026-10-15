import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { feedPose } from './hero-reel-layout.mjs';
import './HeroReelScene.css';

const SLOTS = [-2, -1, 0, 1, 2, 3];
const modulo = (value, count) => ((value % count) + count) % count;

export default function HeroReelScene({ items }) {
  const scene = useRef(null);
  const aperture = useRef(null);
  const cards = useRef([]);
  const nextImage = useRef(null);
  const progress = useRef({ value: 0, target: 0, base: 0 });
  const geometry = useRef(null);
  const visible = useRef(true);
  const hovered = useRef(false);
  const drag = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const reduced = useRef(false);
  const current = items[modulo(index, items.length)];
  const next = items[modulo(index + 1, items.length)];

  useLayoutEffect(() => {
    const measure = () => {
      const root = scene.current.getBoundingClientRect();
      const screen = aperture.current.getBoundingClientRect();
      geometry.current = { sceneWidth: root.width, x: screen.left - root.left + screen.width / 2,
        y: screen.top - root.top + screen.height / 2, width: screen.width, height: screen.height };
      scene.current.style.setProperty('--phone-center-x', `${geometry.current.x}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(scene.current);
    observer.observe(aperture.current);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { reduced.current = query.matches; };
    onPreference();query.addEventListener('change', onPreference);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    observer.observe(scene.current);
    let frame, previous = performance.now(), lastValue = NaN, lastGeometry = null;
    const animate = time => {
      const elapsed = Math.min((time - previous) / 1000, .05);previous = time;
      if (visible.current && !document.hidden) {
        const p = progress.current;
        if (!pausedRef.current && !hovered.current && !drag.current && !reduced.current) p.target += elapsed / 6;
        p.value = reduced.current ? p.target : p.value + (p.target - p.value) * (1 - Math.exp(-12 * elapsed));
        const base = Math.floor(p.value);
        if (base !== p.base) { p.base = base;setIndex(base); }
        const fraction = p.value - base;
        const screen = geometry.current;
        if (screen && (Math.abs(p.value - lastValue) > .00001 || !Number.isFinite(lastValue) || screen !== lastGeometry)) {
          lastValue = p.value;lastGeometry = screen;
          cards.current.forEach((card, i) => {
            if (!card) return;
            const pose = feedPose(SLOTS[i] - fraction, screen, screen.sceneWidth);
            card.style.width = `${pose.width}px`;card.style.height = `${pose.height}px`;
            card.style.left = `${pose.x}px`;card.style.top = `${pose.y}px`;
            card.style.transform = `translate(-50%, -50%) rotate(${pose.rotation}deg)`;
            card.style.opacity = String(pose.opacity);
            card.style.borderRadius = `${pose.radius}px`;
            card.style.zIndex = SLOTS[i] > 0 ? '3' : '1';
          });
          // The approaching card and the incoming screen share the same source.
          nextImage.current.style.opacity = String(Math.max(0, (fraction - .68) / .32));
          scene.current.dataset.activeReel = String(modulo(base, items.length));
        }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    const onWheel = event => {
      // Horizontal gestures browse reels; vertical gestures keep scrolling the page.
      if (event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
      event.preventDefault();progress.current.target += (event.deltaX || event.deltaY) / 360;
    };
    scene.current.addEventListener('wheel', onWheel, { passive: false });
    let lastY = window.scrollY;
    const onScroll = () => { const delta = window.scrollY - lastY;lastY = window.scrollY;
      if (visible.current && !reduced.current) progress.current.target += delta / 700; };
    window.addEventListener('scroll', onScroll, { passive: true });
    const root = scene.current;
    return () => { cancelAnimationFrame(frame);observer.disconnect();query.removeEventListener('change', onPreference);
      root.removeEventListener('wheel', onWheel);window.removeEventListener('scroll', onScroll); };
  }, [items.length]);

  const move = direction => { progress.current.target = Math.round(progress.current.target) + direction; };
  const togglePause = () => { pausedRef.current = !pausedRef.current;setPaused(pausedRef.current); };
  return <div className="hero-reel-scene" ref={scene}
    onPointerEnter={() => { hovered.current = true; }} onPointerLeave={() => { hovered.current = false; }}
    onPointerDown={event => {
      if (event.target.closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
      drag.current = { x: event.clientX, y: event.clientY, target: progress.current.target, horizontal: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const start = drag.current;if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (!start.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) start.horizontal = true;
      if (start.horizontal) progress.current.target = start.target - dx / 200;
    }}
    onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
    <div className="hero-reel-feed" aria-hidden="true">
      {SLOTS.map((slot, i) => <div className="hero-feed-card" key={slot} ref={element => { cards.current[i] = element; }}>
        <img src={items[modulo(index + slot, items.length)].src} alt="" draggable="false" />
      </div>)}
    </div>
    <div className="hero-gimbal-holder">
      <div className="device-shadow" />
      <img className="gimbal" src="assets/gimbal.png" alt="Phone mounted on a handheld gimbal" fetchPriority="high" draggable="false" />
      <div className="phone-screen-glass" ref={aperture}>
        <img className="hero-screen-photo" src={current.src} alt={current.alt} draggable="false" />
        <img className="hero-screen-photo hero-screen-next" src={next.src} alt="" aria-hidden="true" ref={nextImage} draggable="false" />
        <div className="phone-dynamic-island" aria-hidden="true" />
      </div>
    </div>
    <div className="hero-reel-controls" role="group" aria-label="Browse event photos">
      <button onClick={() => move(-1)} aria-label="Previous photo">←</button>
      <button onClick={togglePause} aria-label={paused ? 'Play photo carousel' : 'Pause photo carousel'} aria-pressed={paused}>
        {paused ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" /></svg> : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4v12M13 4v12" /></svg>}
      </button>
      <button onClick={() => move(1)} aria-label="Next photo">→</button>
    </div>
  </div>;
}
