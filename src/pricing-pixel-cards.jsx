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
        gap={22}
        speed={18}
        colors="#f5eee4,#e9d7c2,#edc4a6"
        className="price-card-pixel-standard"
      >
        <h3>Standard</h3>
        <p>Short event coverage with one creator.</p>
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
        gap={22}
        speed={18}
        colors="#f5eee4,#e9d7c2,#edc4a6"
        className="featured price-card-pixel-extended"
      >
        <h3>Extended</h3>
        <p>Up to four hours of event coverage.</p>
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
        gap={22}
        speed={18}
        colors="#f5eee4,#e9d7c2,#edc4a6"
        className="price-card-pixel-custom"
      >
        <h3>Your way</h3>
        <p>Ask us about longer or multi-day shoots.</p>
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
