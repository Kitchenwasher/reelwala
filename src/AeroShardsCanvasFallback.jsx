import React, { useEffect, useRef } from 'react';

/**
 * AeroShardsCanvasFallback
 * Ultra-high-fidelity 3D crystalline shard simulation fallback for browsers
 * where WebGPU is unsupported or disabled.
 * Faithfully mirrors React Bits AeroShards (https://www.reactbits.dev/backgrounds/aero-shards):
 * - 3D parametric S-curve ribbon flow of geometric crystalline shards
 * - Warm orange color palette (#f97316, #ea580c, #fdba74)
 * - 3D tumble rotation with facet normal lighting and specular sheen
 * - Plus coordinate markers ('+') at multiple depths
 * - Atmospheric volumetric glow
 * - Mouse parallax tilt and interactive click pulse wave
 * - Retina 60fps canvas rendering
 */

// Shard 3D geometric archetypes (local vertices [x, y, z])
const SHARD_ARCHETYPES = [
  // 0: Sharp elongated triangle
  [
    [-0.55, -1.0, 0.05],
    [0.6, -0.2, -0.1],
    [-0.1, 0.9, 0.15]
  ],
  // 1: Asymmetric faceted kite / quad
  [
    [-0.7, -0.4, 0.1],
    [0.1, -1.0, -0.15],
    [0.75, -0.1, 0.12],
    [0.2, 0.95, -0.05],
    [-0.4, 0.6, 0.08]
  ],
  // 2: Wide crystalline plate
  [
    [-0.85, -0.6, -0.1],
    [0.8, -0.7, 0.15],
    [0.55, 0.75, -0.08],
    [-0.7, 0.8, 0.12]
  ],
  // 3: Sleek dagger shard
  [
    [-0.25, -1.1, 0.18],
    [0.35, -0.5, -0.12],
    [0.15, 1.1, 0.08],
    [-0.35, 0.4, -0.06]
  ],
  // 4: Wedge chip
  [
    [-0.65, -0.75, 0.1],
    [0.7, -0.35, -0.15],
    [0.35, 0.85, 0.12],
    [-0.5, 0.5, -0.08]
  ],
  // 5: Hexagonal facet shard
  [
    [-0.5, -0.8, 0.12],
    [0.4, -0.85, -0.1],
    [0.75, 0.0, 0.14],
    [0.35, 0.8, -0.12],
    [-0.45, 0.75, 0.08],
    [-0.7, -0.05, -0.1]
  ]
];

// Helper: 3D vector cross product
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

// Helper: Normalize 3D vector
function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

export default function AeroShardsCanvasFallback({
  shardColor = '#f97316',
  accentColor = '#f97316',
  count = 380,
  speed = 0.85,
  shardSize = 1.25,
  markers = 'plus',
  mouseInteraction = true,
  pulseOnClick = true,
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = null;
    let lastTime = performance.now();

    // Mouse & Camera state
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false
    };

    // Click pulse shockwaves
    const pulses = [];

    // Parametric ribbon backbone function in 3D:
    // u ranges from 0 to 1
    function getRibbonPoint(u, w, h) {
      // Elegant sweeping S-curve matching React Bits demo
      const x = (u - 0.5) * 1.75 * w + Math.sin(u * Math.PI * 2.1) * 0.18 * w;
      const y = Math.cos(u * Math.PI * 1.85) * 0.34 * h + (0.5 - u) * 0.15 * h;
      const z = 480 + Math.sin(u * Math.PI * 2.8) * 160;
      return { x, y, z };
    }

    // Initialize Shards
    const shards = [];
    const shardCount = Math.min(count, 480);

    for (let i = 0; i < shardCount; i++) {
      const u = Math.random();
      // Perpendicular Gaussian-like spread from ribbon center
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadDist = Math.pow(Math.random(), 1.7) * 190;
      const zOffset = (Math.random() - 0.5) * 280;

      const archetypeIndex = Math.floor(Math.random() * SHARD_ARCHETYPES.length);
      const baseVertices = SHARD_ARCHETYPES[archetypeIndex];

      // Base shard physical dimensions (px)
      const baseScale = (14 + Math.random() * 26) * shardSize;
      const aspectX = 0.75 + Math.random() * 0.65;
      const aspectY = 0.8 + Math.random() * 0.7;

      shards.push({
        u,
        driftSpeed: (0.028 + Math.random() * 0.038) * speed,
        spreadAngle,
        spreadDist,
        zOffset,
        archetype: baseVertices,
        scaleX: baseScale * aspectX,
        scaleY: baseScale * aspectY,
        scaleZ: baseScale * 0.6,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 1.4,
        vRotY: (Math.random() - 0.5) * 1.4,
        vRotZ: (Math.random() - 0.5) * 1.2,
        opacity: 0.35 + Math.random() * 0.6,
        colorVariant: Math.random(), // blend between #f97316 and #fb923c
        pulseDispX: 0,
        pulseDispY: 0,
        pulseDispZ: 0
      });
    }

    // Initialize Plus Markers ('+')
    const markerCount = 38;
    const plusMarkers = [];
    for (let i = 0; i < markerCount; i++) {
      plusMarkers.push({
        u: Math.random(),
        driftSpeed: (0.015 + Math.random() * 0.02) * speed,
        offsetX: (Math.random() - 0.5) * 1.6,
        offsetY: (Math.random() - 0.5) * 0.85,
        z: 320 + Math.random() * 420,
        size: 7 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.2 + Math.random() * 1.5
      });
    }

    // Resize handling
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 320);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateSize();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', updateSize);
    }

    // Mouse & Touch listeners (on window so pointer-events: none on container doesn't block interaction)
    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      // Check if within reasonably close range of hero section
      if (e.clientY >= rect.top - 100 && e.clientY <= rect.bottom + 100) {
        const normX = ((e.clientX - rect.left) / width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / height) * 2 - 1;
        mouse.targetX = Math.max(-1, Math.min(1, normX));
        mouse.targetY = Math.max(-1, Math.min(1, normY));
        mouse.active = true;
      }
    };

    const onPointerDown = (e) => {
      if (!pulseOnClick) return;
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        // Only trigger pulse if not clicking a link or button
        const target = e.target;
        if (target && (target.closest('a') || target.closest('button') || target.closest('input'))) {
          return;
        }
        pulses.push({
          x: e.clientX - rect.left - width / 2,
          y: e.clientY - rect.top - height / 2,
          radius: 0,
          maxRadius: Math.max(width, height) * 0.75,
          speed: 650, // px per second
          strength: 1.0
        });
      }
    };

    if (mouseInteraction) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown, { passive: true });
    }

    // Key Light direction in 3D
    const KEY_LIGHT = normalize([0.45, -0.65, 0.75]);
    const CAMERA_FOV = 620;

    // Render loop
    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 3D Camera target with smooth parallax
      const camX = mouse.x * 55;
      const camY = mouse.y * 42;
      const camZ = 0;

      // Update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += p.speed * dt;
        p.strength = Math.max(0, 1 - p.radius / p.maxRadius);
        if (p.strength <= 0.01) {
          pulses.splice(i, 1);
        }
      }

      // Clear canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set scale for HiDPI
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw subtle warm atmospheric radial glow along the crystal stream
      const glowCx = width * 0.58 + mouse.x * 30;
      const glowCy = height * 0.44 + mouse.y * 25;
      const glowRadius = Math.max(width, height) * 0.45;
      const radialGlow = ctx.createRadialGradient(glowCx, glowCy, 40, glowCx, glowCy, glowRadius);
      radialGlow.addColorStop(0, 'rgba(249, 115, 22, 0.14)');
      radialGlow.addColorStop(0.45, 'rgba(234, 88, 12, 0.06)');
      radialGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Render items container for depth sorting
      const renderQueue = [];

      // Update & project Shards
      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];

        // Advance along ribbon
        s.u += s.driftSpeed * dt;
        if (s.u > 1) {
          s.u -= 1;
          s.spreadAngle = Math.random() * Math.PI * 2;
        }

        // Tumble rotation
        s.rotX += s.vRotX * dt;
        s.rotY += s.vRotY * dt;
        s.rotZ += s.vRotZ * dt;

        // Base 3D position along ribbon
        const ribbonPt = getRibbonPoint(s.u, width, height);
        let worldX = ribbonPt.x + Math.cos(s.spreadAngle) * s.spreadDist;
        let worldY = ribbonPt.y + Math.sin(s.spreadAngle) * s.spreadDist;
        let worldZ = ribbonPt.z + s.zOffset;

        // Apply pulse shockwave impulse
        s.pulseDispX *= 0.92;
        s.pulseDispY *= 0.92;
        s.pulseDispZ *= 0.92;

        for (let pIdx = 0; pIdx < pulses.length; pIdx++) {
          const p = pulses[pIdx];
          const dx = worldX - p.x;
          const dy = worldY - p.y;
          const dist = Math.hypot(dx, dy);
          const diff = Math.abs(dist - p.radius);
          if (diff < 90) {
            const push = (1 - diff / 90) * p.strength * 18;
            const angle = Math.atan2(dy, dx);
            s.pulseDispX += Math.cos(angle) * push;
            s.pulseDispY += Math.sin(angle) * push;
            s.pulseDispZ -= push * 2;
            s.vRotX += (Math.random() - 0.5) * push * 0.1;
            s.vRotY += (Math.random() - 0.5) * push * 0.1;
          }
        }

        worldX += s.pulseDispX;
        worldY += s.pulseDispY;
        worldZ += s.pulseDispZ;

        // Relative to camera
        const relX = worldX - camX;
        const relY = worldY - camY;
        const relZ = worldZ - camZ;

        if (relZ <= 50) continue; // Behind camera

        const projScale = CAMERA_FOV / relZ;
        const screenX = relX * projScale + width / 2;
        const screenY = relY * projScale + height / 2;

        // Frustum culling with generous margin
        if (screenX < -120 || screenX > width + 120 || screenY < -120 || screenY > height + 120) {
          continue;
        }

        // 3D Rotation Matrix Components
        const cx = Math.cos(s.rotX), sx = Math.sin(s.rotX);
        const cy = Math.cos(s.rotY), sy = Math.sin(s.rotY);
        const cz = Math.cos(s.rotZ), sz = Math.sin(s.rotZ);

        // Transform vertices to 3D and project to 2D
        const projectedVertices = [];
        const local3D = [];

        for (let vIdx = 0; vIdx < s.archetype.length; vIdx++) {
          const v = s.archetype[vIdx];
          // Scale local vertex
          const lx = v[0] * s.scaleX;
          const ly = v[1] * s.scaleY;
          const lz = v[2] * s.scaleZ;

          // Yaw (Y)
          let x1 = lx * cy + lz * sy;
          let y1 = ly;
          let z1 = -lx * sy + lz * cy;

          // Pitch (X)
          let x2 = x1;
          let y2 = y1 * cx - z1 * sx;
          let z2 = y1 * sx + z1 * cx;

          // Roll (Z)
          let x3 = x2 * cz - y2 * sz;
          let y3 = x2 * sz + y2 * cz;
          let z3 = z2;

          local3D.push([x3, y3, z3]);

          // Project vertex
          const vxWorld = relX + x3;
          const vyWorld = relY + y3;
          const vScale = CAMERA_FOV / (relZ + z3);

          projectedVertices.push([
            vxWorld * vScale + width / 2,
            vyWorld * vScale + height / 2
          ]);
        }

        // Calculate Face Normal in 3D
        const edge1 = [
          local3D[1][0] - local3D[0][0],
          local3D[1][1] - local3D[0][1],
          local3D[1][2] - local3D[0][2]
        ];
        const edge2 = [
          local3D[2][0] - local3D[0][0],
          local3D[2][1] - local3D[0][1],
          local3D[2][2] - local3D[0][2]
        ];
        const norm = normalize(cross(edge1, edge2));

        // Lighting calculation
        const dotLight = Math.max(0.12, norm[0] * KEY_LIGHT[0] + norm[1] * KEY_LIGHT[1] + norm[2] * KEY_LIGHT[2]);
        // Specular glint
        const viewDir = [0, 0, 1];
        const halfVec = normalize([KEY_LIGHT[0] + viewDir[0], KEY_LIGHT[1] + viewDir[1], KEY_LIGHT[2] + viewDir[2]]);
        const dotSpec = Math.max(0, norm[0] * halfVec[0] + norm[1] * halfVec[1] + norm[2] * halfVec[2]);
        const specular = Math.pow(dotSpec, 14) * 0.65;

        renderQueue.push({
          type: 'shard',
          depth: relZ,
          screenX,
          screenY,
          vertices: projectedVertices,
          dotLight,
          specular,
          scale: projScale,
          opacity: s.opacity,
          colorVariant: s.colorVariant
        });
      }

      // Update & project Plus Markers ('+')
      if (markers === 'plus') {
        for (let i = 0; i < plusMarkers.length; i++) {
          const m = plusMarkers[i];
          m.u += m.driftSpeed * dt;
          if (m.u > 1) m.u -= 1;

          const ribbonPt = getRibbonPoint(m.u, width, height);
          const worldX = ribbonPt.x + m.offsetX * width * 0.45;
          const worldY = ribbonPt.y + m.offsetY * height * 0.45;
          const worldZ = m.z;

          const relX = worldX - camX;
          const relY = worldY - camY;
          const relZ = worldZ - camZ;

          if (relZ <= 50) continue;

          const projScale = CAMERA_FOV / relZ;
          const screenX = relX * projScale + width / 2;
          const screenY = relY * projScale + height / 2;

          if (screenX < -30 || screenX > width + 30 || screenY < -30 || screenY > height + 30) {
            continue;
          }

          const pulseAlpha = 0.35 + Math.sin(now * 0.002 * m.pulseSpeed + m.phase) * 0.25;

          renderQueue.push({
            type: 'marker',
            depth: relZ,
            screenX,
            screenY,
            size: m.size * projScale * 1.1,
            alpha: Math.max(0.1, Math.min(0.85, pulseAlpha))
          });
        }
      }

      // Sort by depth (back to front) for accurate painter's algorithm
      renderQueue.sort((a, b) => b.depth - a.depth);

      // Render all items
      for (let i = 0; i < renderQueue.length; i++) {
        const item = renderQueue[i];

        if (item.type === 'marker') {
          // Render Plus Marker ('+')
          const half = Math.max(3.5, item.size * 0.5);
          ctx.beginPath();
          ctx.moveTo(item.screenX - half, item.screenY);
          ctx.lineTo(item.screenX + half, item.screenY);
          ctx.moveTo(item.screenX, item.screenY - half);
          ctx.lineTo(item.screenX, item.screenY + half);
          ctx.strokeStyle = `rgba(249, 115, 22, ${item.alpha})`;
          ctx.lineWidth = Math.max(1, 1.3 * (CAMERA_FOV / item.depth));
          ctx.stroke();
        } else if (item.type === 'shard') {
          const verts = item.vertices;
          if (verts.length < 3) continue;

          ctx.beginPath();
          ctx.moveTo(verts[0][0], verts[0][1]);
          for (let v = 1; v < verts.length; v++) {
            ctx.lineTo(verts[v][0], verts[v][1]);
          }
          ctx.closePath();

          // Calculate dynamic facet gradient
          const minX = Math.min(...verts.map(v => v[0]));
          const maxX = Math.max(...verts.map(v => v[0]));
          const minY = Math.min(...verts.map(v => v[1]));
          const maxY = Math.max(...verts.map(v => v[1]));

          const grad = ctx.createLinearGradient(minX, minY, maxX, maxY);

          // Rich warm orange colors with specular highlights
          const intensity = Math.min(1, item.dotLight + item.specular);
          const alphaBase = Math.min(0.9, item.opacity * (0.55 + intensity * 0.45));

          if (item.colorVariant > 0.5) {
            // Luminous golden-amber / orange
            grad.addColorStop(0, `rgba(254, 186, 116, ${Math.min(1, alphaBase * 1.1)})`);
            grad.addColorStop(0.5, `rgba(249, 115, 22, ${alphaBase})`);
            grad.addColorStop(1, `rgba(217, 70, 239, 0.12)`);
          } else {
            // Vivid punchy warm orange
            grad.addColorStop(0, `rgba(251, 146, 60, ${Math.min(1, alphaBase * 1.1)})`);
            grad.addColorStop(0.65, `rgba(249, 115, 22, ${alphaBase})`);
            grad.addColorStop(1, `rgba(194, 65, 12, ${alphaBase * 0.85})`);
          }

          ctx.fillStyle = grad;
          ctx.fill();

          // Crisp crystalline facet edge border
          const strokeAlpha = Math.min(1, alphaBase * 1.35 + 0.15);
          ctx.strokeStyle = `rgba(249, 115, 22, ${strokeAlpha})`;
          ctx.lineWidth = Math.max(0.75, Math.min(1.6, 1.1 * item.scale));
          ctx.stroke();

          // Specular glint glisten on highlighted shards
          if (item.specular > 0.28) {
            ctx.beginPath();
            ctx.moveTo(verts[0][0], verts[0][1]);
            ctx.lineTo(verts[1][0], verts[1][1]);
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.85, item.specular)})`;
            ctx.lineWidth = Math.max(1, 1.4 * item.scale);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
      if (mouseInteraction) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerDown);
      }
    };
  }, [shardColor, accentColor, count, speed, shardSize, markers, mouseInteraction, pulseOnClick]);

  return (
    <div
      ref={containerRef}
      className={`hero-aero-shards-fallback-wrap ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
