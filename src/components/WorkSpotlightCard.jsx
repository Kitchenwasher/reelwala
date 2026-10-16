/*!
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
import React, { useRef } from 'react';

// Pointer-position spotlight adapted from React Bits' SpotlightCard pattern.
// https://github.com/DavidHDev/react-bits/tree/main/src/content/Components/SpotlightCard
// Copyright (c) 2026 David Haz. See third_party/react-bits-license.txt.
export default function WorkSpotlightCard({children,className='',...props}) {
  const card=useRef(null);
  const move=event=>{
    if(event.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=card.current.getBoundingClientRect();
    const x=event.clientX-box.left,y=event.clientY-box.top;
    card.current.style.setProperty('--spot-x',`${x}px`);
    card.current.style.setProperty('--spot-y',`${y}px`);
    card.current.style.setProperty('--card-rx',`${(y/box.height-.5)*-3}deg`);
    card.current.style.setProperty('--card-ry',`${(x/box.width-.5)*3}deg`);
  };
  const reset=()=>{
    card.current.style.setProperty('--card-rx','0deg');
    card.current.style.setProperty('--card-ry','0deg');
  };
  return <a {...props} className={`our-work-card ${className}`} ref={card} onPointerMove={move} onPointerLeave={reset}>
    {children}
    <span className="our-work-spotlight" aria-hidden="true" />
  </a>;
}
