'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

const DEFAULT_ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80&auto=format&fit=crop',
    title: 'Haldi Sunlight & Joy',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps HDR',
    tag: 'Private Celebration'
  },
  {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop',
    title: 'Electric Stage Pulse',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Music Festival'
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Midnight Toast',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic 24fps',
    tag: 'Celebration'
  },
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
    title: 'The First Dance',
    subtitle: 'Shot on iPhone 16 Pro · Dolby Vision',
    tag: 'Wedding Reel'
  },
  {
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop',
    title: 'Club Motion & Lasers',
    subtitle: 'Shot on iPhone 16 Pro · Low Light 4K',
    tag: 'Nightlife'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
    title: 'Acoustic Jam Session',
    subtitle: 'Shot on iPhone 16 Pro · Spatial Audio',
    tag: 'Culture & Jam'
  },
  {
    image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80&auto=format&fit=crop',
    title: 'Rooftop Choreography',
    subtitle: 'Shot on iPhone 16 Pro · 4K 60fps',
    tag: 'Dance Performance'
  },
  {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
    title: 'Carnival Confetti Sky',
    subtitle: 'Shot on iPhone 16 Pro · 120fps Slo-Mo',
    tag: 'Festival Energy'
  },
  {
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80&auto=format&fit=crop',
    title: 'Midnight Sparklers',
    subtitle: 'Shot on iPhone 16 Pro · Cinematic Mode',
    tag: 'Milestone Toast'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
    title: 'Coastal Golden Hour',
    subtitle: 'Shot on iPhone 16 Pro · 4K HDR Graded',
    tag: 'Travel Story'
  },
  {
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop',
    title: 'Keynote & Stage Momentum',
    subtitle: 'Shot on iPhone 16 Pro · Telephoto 4K',
    tag: 'Corporate Summit'
  },
  {
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80&auto=format&fit=crop',
    title: 'Night Market Glow',
    subtitle: 'Shot on iPhone 16 Pro · Night Mode Video',
    tag: 'Street & Beats'
  },
  {
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop',
    title: 'Unfiltered Laughter',
    subtitle: 'Shot on iPhone 16 Pro · 4K 24fps',
    tag: 'Friends Forever'
  },
  {
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
    title: 'Festival Flare & Cheers',
    subtitle: 'Shot on iPhone 16 Pro · Action Mode',
    tag: 'Live Event'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    title: 'Mountain Sunrise Reel',
    subtitle: 'Shot on iPhone 16 Pro · ProRes Log Graded',
    tag: 'Scenic Adventure'
  }
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 270,
  gap = 18,
  radius = 16,
  tilt = 12,
  turn = -12,
  roll = 0,
  perspective = 1300,
  depth = 100,
  speed = 36,
  direction = 'up',
  variance = 0.45,
  parallax = 0.5,
  pauseOnHover = false,
  lift = 54,
  fade = 0.5,
  dim = 0.72,
  grayscale = false,
  overlayColor = '#120f18',
  className = '',
  style,
  onTileClick
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useLayoutEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
    trackRefs.current.forEach((track,c)=>{
      if(track)track.style.transform = `translate3d(0, ${-offsetsRef.current[c]}px, 0)`;
    });
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.16) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  // Position the wall before its first paint, even without pointer movement.
  useLayoutEffect(() => {
    applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
  }, [applyPlaneTransform]);

  useEffect(() => {
    let isVisible = true;
    let animId = null;

    const animate = ts => {
      if (!isVisible || document.hidden) {
        animId = null;
        lastTsRef.current = null;
        return;
      }
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      const prevX = pointerDampedRef.current.x;
      const prevY = pointerDampedRef.current.y;
      pointerDampedRef.current.x += (targetX - prevX) * damp;
      pointerDampedRef.current.y += (targetY - prevY) * damp;
      if (Math.abs(pointerDampedRef.current.x - prevX) > 0.001 || Math.abs(pointerDampedRef.current.y - prevY) > 0.001) {
        applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      }

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      animId = requestAnimationFrame(animate);
      rafRef.current = animId;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !document.hidden) {
          lastTsRef.current = null;
          if (!animId) {
            animId = requestAnimationFrame(animate);
            rafRef.current = animId;
          }
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
            rafRef.current = null;
          }
        }
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) io.observe(containerRef.current);

    const onVisibility = () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
          rafRef.current = null;
        }
      } else if (isVisible && !animId) {
        lastTsRef.current = null;
        animId = requestAnimationFrame(animate);
        rafRef.current = animId;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    animId = requestAnimationFrame(animate);
    rafRef.current = animId;

    return () => {
      if (animId) cancelAnimationFrame(animId);
      rafRef.current = null;
      lastTsRef.current = null;
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
  }, []);

  const handlePointerMove = useCallback(
    e => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const tile = e.target && e.target.closest ? e.target.closest('[data-tile-id]') : null;
      if (!tile) {
        hoveredColRef.current = -1;
        return;
      }
      hoveredColRef.current = Number(tile.dataset.col);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item, id, colIndex) => {
    const inner = (
      <span className="drift-wall__inner">
        <img src={item.image} alt={item.title ?? ''} loading="lazy" decoding="async" draggable={false} />
        <span className="drift-wall__overlay" aria-hidden="true" />
        
        {/* Play Icon Badge */}
        <span className="drift-wall__play-icon" aria-hidden="true">▶</span>

        {/* Top Tag */}
        {item.tag && (
          <span className="drift-wall__tag-badge">
            <span className="drift-wall__tag-dot"></span>
            {item.tag}
          </span>
        )}

        {/* Bottom Reel Caption & Shot on iPhone label */}
        <span className="drift-wall__info">
          <span className="drift-wall__title">{item.title}</span>
          <span className="drift-wall__subtitle">{item.subtitle || 'Shot on iPhone 16 Pro · 4K HDR'}</span>
        </span>
      </span>
    );

    const commonProps = {
      className: 'drift-wall__tile',
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
      onClick: () => onTileClick?.(item)
    };

    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'Reel showcase'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting showcase of edited reels"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)} role="presentation">
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
