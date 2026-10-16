export function hookLayout(width, height) {
  const cardWidth = width * .19;
  const sources = [[.15,.21],[.34,.48],[.16,.79]].map(([x,y]) => ({x:x*width,y:y*height,width:cardWidth,height:cardWidth*16/9}));
  const reel = { x:width*.77,y:height*.49,width:width*.37,height:width*.37*16/9 };
  return { sources, reel };
}

export function clipFlight(start, end, progress) {
  const p = Math.max(0,Math.min(1,progress));
  const q = 1-p;
  const bend = (end.x-start.x)*.55;
  return {
    x:q*q*q*start.x+3*q*q*p*(start.x+bend)+3*q*p*p*(end.x-bend*.4)+p*p*p*end.x,
    y:q*q*q*start.y+3*q*q*p*start.y+3*q*p*p*end.y+p*p*p*end.y
  };
}
