import React from 'react';
import { createRoot } from 'react-dom/client';
import TechText from './TechText.jsx';

function LogoTechText() {
  return (
    <TechText
      text="THE REEL WALA"
      fontFamily="'Oswald', sans-serif"
      fontWeight={600}
      fontSize={38}
      letterSpacing={-0.03}
      color="#171815"
      accentColor="#f35422"
      align="center"
      reach={100}
      softness={0.7}
      dashLength={3.5}
      dashGap={2}
      strokeWidth={1.5}
      lineStyle="dashed"
      reveal="letter"
      specks={12}
      selection={true}
      labels={true}
      draggable={false}
      bounce={0.4}
      sweep={true}
      speed={1}
      clickKick={true}
      intro="none"
      className="tech-text-navbar-logo"
    />
  );
}

function mountLogo() {
  const container = document.getElementById('logo-tech-text-root');
  if (container && !container._reactRoot) {
    // Clear fallback static text so React can take over
    container.innerHTML = '';
    const root = createRoot(container);
    container._reactRoot = root;
    root.render(<LogoTechText />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLogo);
} else {
  mountLogo();
}
