'use client';

import { useEffect, useRef, useState } from 'react';
import './PixelCard.css';

const VARIANTS = {
  default: {
    gap: 5,
    speed: 35,
    colors: { dark: ['#f8fafc', '#f1f5f9', '#cbd5e1'], light: ['#18181b', '#52525b', '#a1a1aa'] },
    glow: { dark: '#cbd5e1', light: '#71717a' },
    noFocus: false
  },
  orange: {
    gap: 7,
    speed: 32,
    colors: {
      dark: ['#ff8254', '#f35422', '#ffbe99', '#ffffff'],
      light: ['#e24a18', '#f35422', '#e8a87c', '#c87640']
    },
    glow: { dark: '#f35422', light: '#f35422' },
    noFocus: false
  },
  warm: {
    gap: 8,
    speed: 25,
    colors: {
      dark: ['#eddcc8', '#f35422', '#e88f59', '#ffffff'],
      light: ['#b9774a', '#d9976b', '#f35422', '#7a4e32']
    },
    glow: { dark: '#e88f59', light: '#e88f59' },
    noFocus: false
  },
  blue: {
    gap: 10,
    speed: 25,
    colors: { dark: ['#e0f2fe', '#7dd3fc', '#0ea5e9'], light: ['#0c4a6e', '#0369a1', '#0284c7'] },
    glow: { dark: '#0ea5e9', light: '#0284c7' },
    noFocus: false
  },
  yellow: {
    gap: 3,
    speed: 20,
    colors: { dark: ['#fef08a', '#fde047', '#eab308'], light: ['#713f12', '#a16207', '#ca8a04'] },
    glow: { dark: '#eab308', light: '#ca8a04' },
    noFocus: false
  },
  pink: {
    gap: 6,
    speed: 80,
    colors: { dark: ['#fecdd3', '#fda4af', '#e11d48'], light: ['#831843', '#be123c', '#e11d48'] },
    glow: { dark: '#e11d48', light: '#be123c' },
    noFocus: true
  }
};

const SHAPES = { square: 0, circle: 1, diamond: 2 };
const TRIGGERS = ['hover', 'click', 'always'];
const APPEAR = 0.26;
const EXIT = 0.22;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const easeOutBack = t => {
  const c = 1.9;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

const toList = value =>
  (Array.isArray(value) ? value : String(value ?? '').split(',')).map(color => color.trim()).filter(Boolean);

const toRgb = (() => {
  let context = null;
  return color => {
    if (typeof document === 'undefined') return [255, 255, 255];
    if (!context) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      context = canvas.getContext('2d', { willReadFrequently: true });
    }
    if (!context) return [255, 255, 255];
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
})();

export default function PixelCard({
  variant = 'warm',
  colors,
  gap,
  speed,
  pixelSize = 3,
  shape = 'square',
  origin = 'center',
  revealDuration = 550,
  spotlight = 0.6,
  glow = 0.5,
  glowColor,
  opacity = 1,
  fade = 0,
  trigger = 'hover',
  clickPulse = true,
  intro = true,
  introDelay = 0,
  noFocus,
  theme = 'light',
  radius = 28,
  className = '',
  style,
  children
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const settingsRef = useRef(null);
  const [active, setActive] = useState(false);

  const tone = theme === 'light' ? 'light' : 'dark';
  const preset = VARIANTS[variant] || VARIANTS.warm || VARIANTS.default;
  const palette = colors ? toList(colors) : (preset.colors[tone] || preset.colors.dark);
  const focusOff = noFocus ?? preset.noFocus;

  settingsRef.current = {
    colors: palette.length ? palette : (preset.colors[tone] || preset.colors.dark),
    gap: Math.max(2, Number(gap ?? preset.gap) || preset.gap),
    speed: clamp(Number(speed ?? preset.speed) || 0, 0, 100),
    pixelSize: Math.max(0.5, pixelSize),
    shape: SHAPES[shape] ?? 0,
    origin,
    revealDuration: Math.max(50, revealDuration),
    spotlight: clamp(spotlight, 0, 1),
    glow: clamp(glow, 0, 1),
    glowColor: toRgb(glowColor || (preset.glow[tone] || preset.glow.dark)),
    opacity: clamp(opacity, 0, 1),
    fade: clamp(fade, 0, 1),
    trigger: TRIGGERS.includes(trigger) ? trigger : 'hover',
    clickPulse,
    intro,
    introDelay: Math.max(0, introDelay)
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const state = {
      alive: true,
      raf: 0,
      last: 0,
      time: 0,
      visible: true,
      width: 0,
      height: 0,
      ratio: 1,
      key: '',
      count: 0,
      x: new Float32Array(0),
      y: new Float32Array(0),
      tint: new Uint8Array(0),
      size: new Float32Array(0),
      phase: new Float32Array(0),
      rate: new Float32Array(0),
      jitter: new Float32Array(0),
      presence: new Float32Array(0),
      delay: new Float32Array(0),
      mask: new Float32Array(0),
      maskKey: '',
      mode: '',
      active: false,
      changedAt: 0,
      originX: 0,
      originY: 0,
      maxDistance: 1,
      pointerX: 0,
      pointerY: 0,
      spotX: 0,
      spotY: 0,
      spotVX: 0,
      spotVY: 0,
      spotPower: 0,
      hovering: false,
      pulses: [],
      dt: 1 / 60,
      releaseAt: -1,
      introAt: -1
    };

    const build = () => {
      const s = settingsRef.current;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const key = [width, height, ratio, s.gap, s.pixelSize, s.colors.join(',')].join('|');
      if (key === state.key) return;
      state.key = key;
      state.width = width;
      state.height = height;
      state.ratio = ratio;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const columns = Math.floor((width - 1) / s.gap) + 1;
      const rows = Math.floor((height - 1) / s.gap) + 1;
      const offsetX = (width - (columns - 1) * s.gap) / 2;
      const offsetY = (height - (rows - 1) * s.gap) / 2;
      const count = columns * rows;
      const previous = state.presence;
      state.count = count;
      state.x = new Float32Array(count);
      state.y = new Float32Array(count);
      state.tint = new Uint8Array(count);
      state.size = new Float32Array(count);
      state.phase = new Float32Array(count);
      state.rate = new Float32Array(count);
      state.jitter = new Float32Array(count);
      state.presence = new Float32Array(count);
      state.delay = new Float32Array(count);
      let i = 0;
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          state.x[i] = offsetX + column * s.gap;
          state.y[i] = offsetY + row * s.gap;
          state.tint[i] = Math.floor(Math.random() * s.colors.length);
          state.size[i] = s.pixelSize * (0.35 + Math.random() * 0.65);
          state.phase[i] = Math.random() * Math.PI * 2;
          state.rate[i] = 0.55 + Math.random() * 0.9;
          state.jitter[i] = Math.random();
          if (previous.length) state.presence[i] = previous[Math.min(i, previous.length - 1)];
          i++;
        }
      }
      state.maxDistance = Math.hypot(width, height);
      schedule();
    };

    const schedule = () => {
      const s = settingsRef.current;
      const span = s.revealDuration / 1000;
      let far = 1;
      for (let i = 0; i < state.count; i++) {
        far = Math.max(far, Math.hypot(state.x[i] - state.originX, state.y[i] - state.originY));
      }
      state.maxDistance = far;
      for (let i = 0; i < state.count; i++) {
        const distance = Math.hypot(state.x[i] - state.originX, state.y[i] - state.originY) / far;
        state.delay[i] = state.active
          ? distance * span * 0.82 + state.jitter[i] * span * 0.18
          : (1 - distance) * span * 0.45 + state.jitter[i] * span * 0.1;
      }
    };

    const setActiveState = (value, x, y) => {
      if (state.active === value) return;
      state.active = value;
      state.changedAt = state.time;
      setActive(value);
      if (value) {
        if (typeof x === 'number' && typeof y === 'number') {
          state.originX = x;
          state.originY = y;
        } else {
          setOrigin();
        }
      }
      schedule();
      wake();
    };

    const setOrigin = () => {
      const s = settingsRef.current;
      if (s.origin === 'cursor') {
        state.originX = state.pointerX;
        state.originY = state.pointerY;
      } else if (s.origin === 'top-left') {
        state.originX = 0;
        state.originY = 0;
      } else if (s.origin === 'bottom-right') {
        state.originX = state.width;
        state.originY = state.height;
      } else {
        state.originX = state.width / 2;
        state.originY = state.height / 2;
      }
    };

    const wake = () => {
      if (state.raf || !state.alive || !state.visible) return;
      state.last = performance.now();
      state.raf = requestAnimationFrame(step);
    };

    const addPulse = (x, y) => {
      if (!settingsRef.current.clickPulse) return;
      state.pulses.push({
        x,
        y,
        born: state.time,
        speed: Math.max(state.width, state.height) * 1.35,
        span: 0.7
      });
      wake();
    };

    const drawSquare = (x, y, s) => {
      const half = s / 2;
      ctx.fillRect(x - half, y - half, s, s);
    };

    const drawCircle = (x, y, s) => {
      ctx.beginPath();
      ctx.arc(x, y, s / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawDiamond = (x, y, s) => {
      const half = s * 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y - half);
      ctx.lineTo(x + half, y);
      ctx.lineTo(x, y + half);
      ctx.lineTo(x - half, y);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      const s = settingsRef.current;
      const palette = s.colors.map(color => toRgb(color));
      const [glowR, glowG, glowB] = s.glowColor;
      const drawShape = s.shape === 1 ? drawCircle : s.shape === 2 ? drawDiamond : drawSquare;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(state.ratio, state.ratio);

      for (let i = 0; i < state.count; i++) {
        const p = state.presence[i];
        if (p <= 0.005) continue;
        const x = state.x[i];
        const y = state.y[i];
        const [r, g, b] = palette[state.tint[i] % palette.length];

        // Spotlight proximity
        let spotGain = 0;
        if (s.spotlight > 0 && state.spotPower > 0.01) {
          const d = Math.hypot(x - state.spotX, y - state.spotY);
          spotGain = smoothstep(220, 0, d) * s.spotlight * state.spotPower;
        }

        const size = state.size[i] * p * (1 + spotGain * 0.4);
        const alpha = clamp(p * s.opacity * (0.55 + spotGain * 0.7), 0, 1);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        drawShape(x, y, size);

        if (s.glow > 0 && (spotGain > 0.1 || p > 0.8)) {
          const glowAlpha = clamp(s.glow * 0.25 * (spotGain + p * 0.2), 0, 0.45);
          ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${glowAlpha})`;
          drawShape(x, y, size * 1.8);
        }
      }

      ctx.restore();
    };

    const step = now => {
      state.dt = Math.min((now - state.last) / 1000, 0.1);
      state.last = now;
      state.time += state.dt;

      const s = settingsRef.current;
      const speedScale = (s.speed / 50) || 0.7;

      // Update spot position towards pointer
      if (state.hovering) {
        state.spotX += (state.pointerX - state.spotX) * 0.15;
        state.spotY += (state.pointerY - state.spotY) * 0.15;
        state.spotPower += (1 - state.spotPower) * 0.12;
      } else {
        state.spotPower += (0 - state.spotPower) * 0.08;
      }

      let activePixels = false;
      for (let i = 0; i < state.count; i++) {
        const since = state.time - state.changedAt - state.delay[i];
        const target = state.active ? (since > 0 ? 1 : 0) : 0;
        const stepRate = state.active ? 1 / APPEAR : 1 / EXIT;

        if (state.presence[i] < target) {
          state.presence[i] = Math.min(target, state.presence[i] + state.dt * stepRate * speedScale);
          activePixels = true;
        } else if (state.presence[i] > target) {
          state.presence[i] = Math.max(target, state.presence[i] - state.dt * stepRate * speedScale * 1.2);
          activePixels = true;
        }

        if (state.presence[i] > 0.01) {
          state.phase[i] += state.dt * state.rate[i] * speedScale * 2;
        }
      }

      render();

      if (activePixels || state.hovering || state.spotPower > 0.01 || state.pulses.length > 0) {
        state.raf = requestAnimationFrame(step);
      } else {
        state.raf = 0;
      }
    };

    const onEnter = e => {
      if (reduce || e.pointerType === 'touch') return;
      const rect = container.getBoundingClientRect();
      state.pointerX = e.clientX - rect.left;
      state.pointerY = e.clientY - rect.top;
      state.hovering = true;
      if (settingsRef.current.trigger === 'hover') {
        setActiveState(true, state.pointerX, state.pointerY);
      }
    };

    const onMove = e => {
      if (reduce || e.pointerType === 'touch') return;
      const rect = container.getBoundingClientRect();
      state.pointerX = e.clientX - rect.left;
      state.pointerY = e.clientY - rect.top;
      wake();
    };

    const onLeave = () => {
      state.hovering = false;
      if (settingsRef.current.trigger === 'hover') {
        setActiveState(false);
      }
    };

    const onDown = e => {
      if (reduce) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addPulse(x, y);
      if (settingsRef.current.trigger === 'click') {
        setActiveState(!state.active, x, y);
      }
    };

    const onFocus = () => {
      if (settingsRef.current.trigger !== 'always') {
        setActiveState(true);
      }
    };

    const onBlur = () => {
      if (settingsRef.current.trigger !== 'always') {
        setActiveState(false);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      build();
      render();
    });
    resizeObserver.observe(container);

    const visibility = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) wake();
    });
    visibility.observe(container);

    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointerdown', onDown);

    build();
    if (settingsRef.current.trigger === 'always') {
      setActiveState(true);
    }

    engineRef.current = {
      sync: () => {
        build();
        wake();
      },
      wake,
      onFocus,
      onBlur
    };

    return () => {
      state.alive = false;
      cancelAnimationFrame(state.raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.sync();
  });

  return (
    <article
      ref={containerRef}
      className={`price-card pixel-card ${className}`.trim()}
      data-theme={tone}
      data-active={active || undefined}
      style={{ '--pixel-card-radius': `${radius}px`, ...style }}
      onFocus={focusOff ? undefined : () => engineRef.current?.onFocus()}
      onBlur={focusOff ? undefined : () => engineRef.current?.onBlur()}
      tabIndex={focusOff ? -1 : 0}
    >
      <canvas className="pixel-card-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="pixel-card-content" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', flex: 1, width: '100%' }}>
        {children}
      </div>
    </article>
  );
}
