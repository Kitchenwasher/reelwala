import React from 'react';
import { createRoot } from 'react-dom/client';
import PixelCard from './PixelCard.jsx';

function PricingPixelCards() {
  const handleSelectPackage = (pkgName) => {
    if (typeof window !== 'undefined' && window.ReelWalaBooking?.setPackage) {
      window.ReelWalaBooking.setPackage(pkgName);
    }
  };

  return (
    <>
      {/* 1. Standard Card */}
      <PixelCard
        gap={11}
        speed={45}
        colors="#fdfbf7,#f5eee3,#fed7aa,#f97316"
        className="price-card-pixel-standard"
      >
        <span className="eyebrow card-eyebrow">THE QUICK MOMENT</span>
        <h3>Standard</h3>
        <p>Focused content for the moments you can’t wait to share.</p>
        <ul>
          <li>4 complimentary color-graded photos</li>
          <li>Edited reel delivery within 24 hours</li>
          <li>A dedicated reel creator</li>
        </ul>
        <a
          className="button outline"
          href="#book"
          data-package="Standard"
          onClick={() => handleSelectPackage('Standard')}
        >
          Enquire about Standard <span>↗</span>
        </a>
      </PixelCard>

      {/* 2. Extended Card (Featured) */}
      <PixelCard
        gap={10}
        speed={55}
        colors="#ffedd5,#fed7aa,#fb923c,#f35422,#ea580c"
        className="featured price-card-pixel-extended"
      >
        <span className="eyebrow card-eyebrow featured-eyebrow">STAY A LITTLE LONGER</span>
        <h3>Extended</h3>
        <p>More time to capture the atmosphere, the people, and the details.</p>
        <ul>
          <li>Up to 4 hours of shoot time</li>
          <li>7 complimentary color-graded photos</li>
          <li>Edited reel delivery within 24 hours</li>
        </ul>
        <a
          className="button"
          href="#book"
          data-package="Extended"
          onClick={() => handleSelectPackage('Extended')}
        >
          Enquire about Extended <span>↗</span>
        </a>
      </PixelCard>

      {/* 3. Your Way / Custom Card */}
      <PixelCard
        gap={11}
        speed={45}
        colors="#fdfbf7,#f5eee3,#fed7aa,#f97316"
        className="price-card-pixel-custom"
      >
        <span className="eyebrow card-eyebrow">SOMETHING A LITTLE EXTRA</span>
        <h3>Your way</h3>
        <p>A bigger celebration or a different idea? Tell us what you have in mind.</p>
        <ul>
          <li>Discuss Premium coverage</li>
          <li>Extra shoot hour: ₹1,000</li>
          <li>Final scope and quote before booking</li>
        </ul>
        <a
          className="button outline"
          href="#book"
          data-package="Custom / Premium"
          onClick={() => handleSelectPackage('Custom / Premium')}
        >
          Let’s talk details <span>↗</span>
        </a>
      </PixelCard>
    </>
  );
}

function mount() {
  const container = document.getElementById('pricing-pixel-cards-root');
  if (container && !container._reactRoot) {
    const root = createRoot(container);
    container._reactRoot = root;
    root.render(<PricingPixelCards />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
