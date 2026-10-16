// Generates high-definition vector badge and strap textures for the 3D Lanyard component.

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapLines(text, maxChars = 46) {
  const words = (text || '').split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function generateBadgeFrontSvg(plan) {
  const isPremium = plan.family === 'select';
  const priceDisplay = plan.price !== null
    ? `₹${plan.price.toLocaleString('en-IN')}`
    : 'On Enquiry';
  const subtitle = plan.subtitle || (plan.addon ? 'Add-On Hour' : isPremium ? 'Premium Bespoke' : `${plan.name} Tier`);
  const tagLines = wrapLines(plan.description, 48);

  const barcodeBars = Array.from({ length: 38 }, (_, i) => {
    const x = 180 + i * 18;
    const w = ((i * 7 + 3) % 5 === 0) ? 6 : ((i * 3) % 2 === 0) ? 3 : 2;
    return `<rect x="${x}" y="1260" width="${w}" height="48" fill="#a69485" opacity="${i % 9 === 0 ? 0.3 : 0.85}" />`;
  }).join('');

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1440" width="1024" height="1440">
  <defs>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1b18" />
      <stop offset="45%" stop-color="#181513" />
      <stop offset="100%" stop-color="#12100e" />
    </linearGradient>
    <linearGradient id="accentOrange" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff7a45" />
      <stop offset="100%" stop-color="#f35422" />
    </linearGradient>
    <linearGradient id="goldChip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eed18a" />
      <stop offset="50%" stop-color="#c99e46" />
      <stop offset="100%" stop-color="#8f6c26" />
    </linearGradient>
    <linearGradient id="glassBox" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f35422" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#f35422" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1440" rx="46" fill="url(#cardGrad)" />
  <rect width="1024" height="1440" rx="46" fill="url(#glow)" />

  <!-- Outer & Inner Pass Borders -->
  <rect x="24" y="24" width="976" height="1392" rx="36" fill="none" stroke="#e88f59" stroke-width="2" stroke-opacity="0.35" />
  <rect x="36" y="36" width="952" height="1368" rx="28" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.08" />

  <!-- Top Reinforced Clip Slot Outline (Safe Area for 3D Torus Eyelet) -->
  <rect x="382" y="70" width="260" height="66" rx="22" fill="#141210" stroke="#4a3e35" stroke-width="3" />
  <circle cx="360" cy="103" r="7" fill="#4a3e35" />
  <circle cx="664" cy="103" r="7" fill="#4a3e35" />

  <!-- Official Brand Header -->
  <g transform="translate(0, 175)">
    <!-- Camera Icon Mark -->
    <rect x="424" y="0" width="46" height="34" rx="8" fill="url(#accentOrange)" />
    <polygon points="447,2 457,2 461,8 443,8" fill="#ff9e75" />
    <circle cx="447" cy="17" r="10" fill="#ffffff" />
    <circle cx="447" cy="17" r="5" fill="#f35422" />

    <text x="512" y="65" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="34" letter-spacing="7">THE REEL WALA</text>
    <rect x="342" y="86" width="340" height="28" rx="14" fill="#f35422" fill-opacity="0.18" stroke="#f35422" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="512" y="105" text-anchor="middle" fill="#ff7a45" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" letter-spacing="3.5">OFFICIAL SHOOT ACCESS PASS</text>
  </g>

  <!-- Security Smart Chip & Foil Emblem -->
  <g transform="translate(90, 335)">
    <rect x="0" y="0" width="96" height="74" rx="12" fill="url(#goldChip)" stroke="#59441a" stroke-width="2" />
    <line x1="0" y1="37" x2="96" y2="37" stroke="#59441a" stroke-width="2" />
    <line x1="48" y1="0" x2="48" y2="74" stroke="#59441a" stroke-width="2" />
    <circle cx="48" cy="37" r="16" fill="none" stroke="#59441a" stroke-width="2" />
  </g>

  <g transform="translate(830, 372)">
    <circle cx="0" cy="0" r="42" fill="#201b17" stroke="#e8a87c" stroke-width="2" stroke-dasharray="4 3" />
    <circle cx="0" cy="0" r="34" fill="none" stroke="#ff7a45" stroke-width="1.5" />
    <text x="0" y="-4" text-anchor="middle" fill="#ffaa7a" font-family="system-ui, sans-serif" font-weight="800" font-size="12" letter-spacing="1">4K HDR</text>
    <text x="0" y="12" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="700" font-size="9" letter-spacing="1">VERIFIED</text>
  </g>

  <!-- Plan Badge / Subtitle -->
  <g transform="translate(0, 465)">
    <text x="512" y="0" text-anchor="middle" fill="#e8a87c" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" letter-spacing="5">${escapeXml(subtitle.toUpperCase())}</text>
    <line x1="380" y1="18" x2="644" y2="18" stroke="#e8a87c" stroke-width="1.5" stroke-opacity="0.4" />
  </g>

  <!-- Huge Bold Price -->
  <g transform="translate(0, 580)">
    <text x="512" y="0" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="96" letter-spacing="-3">${escapeXml(priceDisplay)}</text>
    <text x="512" y="44" text-anchor="middle" fill="#a99584" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18" letter-spacing="2.5">${plan.price ? '+ 18% GST • EXPRESS 24H DELIVERY' : 'CUSTOM PRODUCTION ON ENQUIRY'}</text>
  </g>

  <!-- Description Glass Box -->
  <g transform="translate(90, 670)">
    <rect x="0" y="0" width="844" height="120" rx="20" fill="url(#glassBox)" stroke="#ffffff" stroke-width="1" stroke-opacity="0.12" />
    ${tagLines.map((line, i) => `
      <text x="422" y="${55 + i * 32 - (tagLines.length > 1 ? 14 : 0)}" text-anchor="middle" fill="#f8ede2" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" font-style="italic">"${escapeXml(line)}"</text>
    `).join('')}
  </g>

  <!-- 4 Feature Pills / Spec Badges -->
  <g transform="translate(90, 830)">
    <g transform="translate(0, 0)">
      <rect width="404" height="80" rx="16" fill="#221d19" stroke="#483d34" stroke-width="1.5" />
      <circle cx="44" cy="40" r="18" fill="#f35422" fill-opacity="0.25" />
      <text x="44" y="46" text-anchor="middle" fill="#ff7a45" font-size="18">⏱</text>
      <text x="80" y="36" fill="#a69485" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">SHOOT TIME</text>
      <text x="80" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="700">${plan.id === 'extended' ? 'Up to 4 Hours' : plan.id === 'essential' ? 'Up to 1 Hour' : plan.addon ? '+1 Extra Hour' : 'Custom Hours'}</text>
    </g>

    <g transform="translate(440, 0)">
      <rect width="404" height="80" rx="16" fill="#221d19" stroke="#483d34" stroke-width="1.5" />
      <circle cx="44" cy="40" r="18" fill="#f35422" fill-opacity="0.25" />
      <text x="44" y="46" text-anchor="middle" fill="#ff7a45" font-size="18">🎬</text>
      <text x="80" y="36" fill="#a69485" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">DELIVERABLES</text>
      <text x="80" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="700">${plan.id === 'extended' ? '2 Edited 4K Reels' : plan.id === 'essential' ? '1 Edited 4K Reel' : plan.addon ? '1 Extra Reel OR 1 Hr' : 'Tailored Scope'}</text>
    </g>

    <g transform="translate(0, 100)">
      <rect width="404" height="80" rx="16" fill="#221d19" stroke="#483d34" stroke-width="1.5" />
      <circle cx="44" cy="40" r="18" fill="#f35422" fill-opacity="0.25" />
      <text x="44" y="46" text-anchor="middle" fill="#ff7a45" font-size="18">📸</text>
      <text x="80" y="36" fill="#a69485" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">GRADED PHOTOS</text>
      <text x="80" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="700">${plan.id === 'extended' ? '7 Colour-Graded Pics' : plan.id === 'essential' ? '4 Colour-Graded Pics' : plan.addon ? 'Extra Coverage' : 'High-Res Stills'}</text>
    </g>

    <g transform="translate(440, 100)">
      <rect width="404" height="80" rx="16" fill="#221d19" stroke="#483d34" stroke-width="1.5" />
      <circle cx="44" cy="40" r="18" fill="#f35422" fill-opacity="0.25" />
      <text x="44" y="46" text-anchor="middle" fill="#ff7a45" font-size="18">⚡</text>
      <text x="80" y="36" fill="#a69485" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">SPEED</text>
      <text x="80" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="700">Within 24 Hours Delivery</text>
    </g>
  </g>

  <!-- Hardware Certification & Locality Stamp -->
  <g transform="translate(90, 1060)">
    <rect width="844" height="96" rx="18" fill="#1b1714" stroke="#e88f59" stroke-opacity="0.35" stroke-width="1.5" />
    <text x="40" y="42" fill="#ff9e75" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="2">📱 SHOT ON LATEST iPHONES</text>
    <text x="40" y="68" fill="#ded4ca" font-family="system-ui, sans-serif" font-size="15" font-weight="500">iPhone 15 &amp; Above • 4K 60fps HDR • Trained &amp; Certified Creator</text>
    <circle cx="780" cy="48" r="24" fill="#f35422" fill-opacity="0.2" />
    <text x="780" y="55" text-anchor="middle" fill="#ff7a45" font-size="20">✓</text>
  </g>

  <!-- Barcode & Interactive Flip Hint -->
  <g transform="translate(90, 1195)">
    <text x="422" y="20" text-anchor="middle" fill="#ff7a45" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="15" letter-spacing="3.5">↻ TAP OR CLICK CARD TO FLIP</text>
    <text x="422" y="44" text-anchor="middle" fill="#a69485" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="12" letter-spacing="2">PASS ID: RW-2026-${escapeXml(plan.id.toUpperCase())} • PUN/BOM</text>
    <g transform="translate(0, 10)">
      ${barcodeBars}
    </g>
  </g>
</svg>
`)}`;
}

export function generateBadgeBackSvg(plan) {
  const isPremium = plan.family === 'select';
  const priceDisplay = plan.price !== null
    ? `₹${plan.price.toLocaleString('en-IN')}`
    : 'On Enquiry';
  const features = plan.features || [];

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1440" width="1024" height="1440">
  <defs>
    <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#191614" />
      <stop offset="50%" stop-color="#141210" />
      <stop offset="100%" stop-color="#0f0e0d" />
    </linearGradient>
    <linearGradient id="accentOrange" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff7a45" />
      <stop offset="100%" stop-color="#f35422" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1024" height="1440" rx="46" fill="url(#backGrad)" />
  <rect x="24" y="24" width="976" height="1392" rx="36" fill="none" stroke="#e88f59" stroke-width="2" stroke-opacity="0.35" />
  <rect x="36" y="36" width="952" height="1368" rx="28" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.08" />

  <!-- Safe Area Slot Clearance -->
  <rect x="382" y="70" width="260" height="66" rx="22" fill="#141210" stroke="#4a3e35" stroke-width="3" />
  <circle cx="360" cy="103" r="7" fill="#4a3e35" />
  <circle cx="664" cy="103" r="7" fill="#4a3e35" />

  <!-- Back Header -->
  <g transform="translate(0, 185)">
    <text x="512" y="0" text-anchor="middle" fill="#ff7a45" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" letter-spacing="4">THE REEL WALA GUARANTEE</text>
    <text x="512" y="45" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="36" letter-spacing="2">WHAT’S INCLUDED IN THIS PASS</text>
    <text x="512" y="80" text-anchor="middle" fill="#a99584" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="18">${escapeXml(plan.name)} Tier • ${escapeXml(priceDisplay)}</text>
    <line x1="160" y1="105" x2="864" y2="105" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" />
  </g>

  <!-- Inclusions Checklist -->
  <g transform="translate(110, 335)">
    ${features.map((feat, i) => `
      <g transform="translate(0, ${i * 88})">
        <rect width="804" height="70" rx="16" fill="#1f1b17" stroke="#3d332b" stroke-width="1.2" />
        <circle cx="38" cy="35" r="17" fill="#f35422" fill-opacity="0.2" stroke="#f35422" stroke-width="1.5" />
        <text x="38" y="42" text-anchor="middle" fill="#ff7a45" font-family="system-ui, sans-serif" font-weight="800" font-size="16">✓</text>
        <text x="76" y="42" fill="#f6efe7" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20">${escapeXml(feat)}</text>
      </g>
    `).join('')}
  </g>

  <!-- Service Guarantee Box -->
  <g transform="translate(110, 930)">
    <rect width="804" height="150" rx="20" fill="#251f1a" stroke="#f35422" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="40" y="44" fill="#ff7a45" font-family="system-ui, sans-serif" font-weight="700" font-size="15" letter-spacing="2">★ 100% QUALITY COMMITMENT</text>
    <text x="40" y="78" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="600" font-size="18">Every shoot is handled by trained, certified reel creators.</text>
    <text x="40" y="112" fill="#a69485" font-family="system-ui, sans-serif" font-size="16">Edited reels and colour-graded photos delivered within 24 hours.</text>
  </g>

  <!-- QR Booking Portal Indicator -->
  <g transform="translate(110, 1130)">
    <!-- Simulated QR Graphic -->
    <rect x="0" y="0" width="130" height="130" rx="14" fill="#ffffff" />
    <rect x="14" y="14" width="34" height="34" fill="#141210" />
    <rect x="22" y="22" width="18" height="18" fill="#ffffff" />
    <rect x="82" y="14" width="34" height="34" fill="#141210" />
    <rect x="90" y="22" width="18" height="18" fill="#ffffff" />
    <rect x="14" y="82" width="34" height="34" fill="#141210" />
    <rect x="22" y="90" width="18" height="18" fill="#ffffff" />
    <rect x="58" y="58" width="16" height="16" fill="#f35422" />
    <rect x="78" y="78" width="22" height="14" fill="#141210" />
    <rect x="54" y="24" width="14" height="14" fill="#141210" />
    <rect x="54" y="92" width="18" height="18" fill="#141210" />

    <text x="160" y="44" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="24">READY TO BOOK THIS PASS?</text>
    <text x="160" y="76" fill="#ded4ca" font-family="system-ui, sans-serif" font-size="17">Select this plan below or scroll to the booking section.</text>
    <text x="160" y="110" fill="#ff7a45" font-family="system-ui, sans-serif" font-weight="700" font-size="16" letter-spacing="1">THEREELWALA.COM • PUNE &amp; MUMBAI</text>
  </g>

  <!-- Bottom Flip Hint -->
  <g transform="translate(0, 1340)">
    <text x="512" y="0" text-anchor="middle" fill="#ff7a45" font-family="system-ui, sans-serif" font-weight="700" font-size="15" letter-spacing="3.5">↻ TAP OR CLICK CARD TO FLIP FRONT</text>
  </g>
</svg>
`)}`;
}

export function generateStrapSvg() {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 1024" width="192" height="1024">
  <defs>
    <linearGradient id="strapBase" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#141211" />
      <stop offset="20%" stop-color="#24201c" />
      <stop offset="50%" stop-color="#2b2622" />
      <stop offset="80%" stop-color="#24201c" />
      <stop offset="100%" stop-color="#141211" />
    </linearGradient>
  </defs>

  <!-- Woven Strap Webbing -->
  <rect width="192" height="1024" fill="url(#strapBase)" />

  <!-- Orange High-Contrast Edge Stitching -->
  <line x1="18" y1="0" x2="18" y2="1024" stroke="#f35422" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.9" />
  <line x1="174" y1="0" x2="174" y2="1024" stroke="#f35422" stroke-width="4" stroke-dasharray="8 6" stroke-opacity="0.9" />

  <!-- Gold/Copper Fine Accent Threads -->
  <line x1="30" y1="0" x2="30" y2="1024" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.3" />
  <line x1="162" y1="0" x2="162" y2="1024" stroke="#d4af37" stroke-width="1.5" stroke-opacity="0.3" />

  <!-- Vertical Woven Typography Repeating -->
  <g transform="translate(96, 512) rotate(-90)">
    <text x="0" y="8" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="28" letter-spacing="9">THE REEL WALA  ★  SHOOT ACCESS  ★  OFFICIAL PASS  ★  THE REEL WALA  ★  SHOOT ACCESS</text>
  </g>
</svg>
`)}`;
}
