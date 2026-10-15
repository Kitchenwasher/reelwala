import test from 'node:test';
import assert from 'node:assert/strict';
import { feedPose } from './hero-reel-layout.mjs';

test('photos dock at the measured phone screen on desktop and mobile', () => {
  for (const sceneWidth of [320, 768, 1100]) {
    const screen = { x: sceneWidth * .45, y: 160, width: 100, height: 215 };
    const docked = feedPose(0, screen, sceneWidth);
    assert.equal(docked.x, screen.x);
    assert.equal(docked.y, screen.y);
    assert.equal(docked.width, screen.width);
    assert.equal(docked.height, screen.height);
    assert.equal(Math.abs(docked.rotation), 0);
    for (const distance of [-2, -.5, .01, .5, 3]) {
      const pose = feedPose(distance, screen, sceneWidth);
      assert.ok(Math.abs(pose.width / pose.height - screen.width / screen.height) < 1e-10);
      assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
      assert.equal(Math.sign(pose.x - screen.x), Math.sign(distance));
    }
  }
});
