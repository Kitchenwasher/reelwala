const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Every card resolves to the measured phone aperture at distance zero.
// Keep positions in scene-local pixels so responsive resizing cannot detach it.
export function feedPose(distance, screen, sceneWidth) {
  const depth = Math.min(Math.abs(distance), 3);
  const stride = Math.min(sceneWidth * .25, 190);
  const scale = 1 - Math.min(depth, 2) * .10;
  return {
    x: screen.x + distance * stride,
    y: screen.y + Math.sin(Math.min(depth / 3, 1) * Math.PI / 2) * 70,
    width: screen.width * scale,
    height: screen.height * scale,
    rotation: distance * -4,
    opacity: clamp(depth / .28, 0, 1) * (distance < 0 ? .68 : 1),
    radius: Math.max(8, screen.width * .11)
  };
}
