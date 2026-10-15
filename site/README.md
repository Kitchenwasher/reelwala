# The Reel Wala

Buildless responsive website based on the approved Life, on Replay concepts in `../concepts/refined/`.

Run from the repository root: `python -m http.server 4173 --directory site/dist --bind 127.0.0.1`.

## Implemented

Editorial ivory/orange typography, generated transparent gimbal, layered hero photos with scroll tilt/parallax, portrait-to-full-screen photo transition, service previews, pinned Shoot/Edit/Share chapters, draggable and keyboard-accessible orbit gallery, image lightbox, responsive navigation, package selection, booking draft export, creator application and file selection, reduced-motion/mobile alternatives.

## Google Sheets

The live destination sheet has Bookings and Creators tabs. `integrations/README.md` contains the exact link and owner setup. The Apps Script intake and frontend adapter are prepared, but the endpoint is empty until the owner authorizes and deploys it. Forms explicitly download local drafts in the meantime. Hosted Google writes and uploads remain unverified.

## Visual comparison

Reference hero: `../concepts/refined/01-refined-hero.png`.
Reference story/gallery: `../concepts/refined/02-story-and-orbit-gallery.png`.
Reference transitions: `../concepts/refined/03-scroll-motion-storyboard.png`.

Checked at 1440 × 1000 and 390 × 844: palette, serif/italic hierarchy, gimbal with surrounding photo layers, story composition, orbit controls, no horizontal overflow and no broken images. Local screenshots are in ignored `qa/`.

The gimbal is a transparent raster asset with limited perspective tilt, not a full 3D mesh. The immersive section expands a still photograph; actual event footage has not been supplied. Photographs are clearly labelled AI concept imagery; no invented client results or reviews are published. Missing package prices remain enquiry-based.

Checks: `node --check site/dist/app.js` and `node site/integrations/check-intake.mjs`. The intake checks stub Google services and verify validation, formula escaping, payload bounds and duplicate IDs; they do not establish a live Google deployment.
