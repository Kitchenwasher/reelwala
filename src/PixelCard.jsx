import React, { useEffect, useRef } from 'react';

/**
 * PixelCard — React Bits (https://www.reactbits.dev/components/pixel-card)
 * A card that fills with twinkling, rippling pixels on hover.
 */

class Pixel {
  constructor(canvas, ctx, x, y, color, speed, size) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (0.2 + Math.random() * 0.8) * (speed / 100);
    this.size = 0;
    this.maxSize = size;
    this.targetSize = size;
    this.minSize = 0;
    this.sizeStep = Math.max(0.2, (0.35 + Math.random() * 0.45) * (speed / 35));
    this.delay = Math.floor(Math.random() * 25);
    this.counter = 0;
    this.isIdle = true;
    this.isComingBack = false;
    this.alpha = 0;
  }

  draw() {
    if (!this.ctx || this.size <= 0) return;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + (this.maxSize - this.size) / 2,
      this.y + (this.maxSize - this.size) / 2,
      this.size,
      this.size
    );
  }

  appear(cursorDist = 9999) {
    this.isIdle = false;

    // Proximity to cursor accelerates twinkle
    if (cursorDist < 120) {
      this.counter += 2;
    }

    if (this.counter < this.delay) {
      this.counter++;
      this.draw();
      return;
    }

    if (!this.isComingBack) {
      this.size += this.sizeStep;
      if (this.size >= this.targetSize) {
        this.size = this.targetSize;
        this.isComingBack = true;
      }
    } else {
      // Gentle twinkle shimmer while hovering
      this.size += (Math.random() - 0.5) * 0.4;
      this.size = Math.max(this.maxSize * 0.35, Math.min(this.maxSize, this.size));
    }

    this.draw();
  }

  disappear() {
    this.isIdle = false;
    this.isComingBack = false;
    this.counter = 0;

    if (this.size > this.minSize) {
      this.size -= this.sizeStep * 1.5;
      if (this.size <= this.minSize) {
        this.size = this.minSize;
        this.isIdle = true;
      }
    } else {
      this.isIdle = true;
    }

    this.draw();
  }
}

export default function PixelCard({
  gap = 10,
  speed = 40,
  colors = '#f5f1e9,#ebd9c1,#fed7aa,#f97316',
  className = '',
  cardStyle = {},
  children
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animRef = useRef(null);
  const isHoveredRef = useRef(false);
  const cursorRef = useRef({ x: -999, y: -999 });

  const getColors = () => (Array.isArray(colors) ? colors : colors.split(','));

  const initPixels = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(rect.width, 100);
    const height = Math.max(rect.height, 100);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    pixelsRef.current = [];
    const colorList = getColors();
    const pixelSize = Math.max(4, gap - 2);

    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const color = colorList[Math.floor(Math.random() * colorList.length)];
        pixelsRef.current.push(new Pixel(canvas, ctx, x, y, color, speed, pixelSize));
      }
    }
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let allIdle = true;
    const isHovered = isHoveredRef.current;
    const cursor = cursorRef.current;

    for (let i = 0; i < pixelsRef.current.length; i++) {
      const p = pixelsRef.current[i];
      if (isHovered) {
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        p.appear(dist);
        allIdle = false;
      } else {
        p.disappear();
        if (!p.isIdle) allIdle = false;
      }
    }

    if (!allIdle || isHovered) {
      animRef.current = requestAnimationFrame(loop);
    }
  };

  const handlePointerEnter = (e) => {
    isHoveredRef.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(loop);
  };

  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    cursorRef.current = { x: -999, y: -999 };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    initPixels();

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => {
        initPixels();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      if (ro) ro.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gap, speed, colors]);

  return (
    <article
      ref={containerRef}
      className={`price-card pixel-card ${className}`}
      style={cardStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        className="pixel-card-canvas"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: 'inherit'
        }}
        aria-hidden="true"
      />
      <div className="pixel-card-content" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
        {children}
      </div>
    </article>
  );
}
