import test from 'node:test';
import assert from 'node:assert/strict';
import { hookLayout, clipFlight } from './edit-hook-layout.mjs';

test('clip flights meet the reel on mobile and desktop without leaving the scene',()=>{
  for(const width of [280,640,950]){
    const height=width*7/8;
    const {sources,reel}=hookLayout(width,height);
    assert.ok(reel.x+reel.width/2<=width);
    assert.ok(reel.y-reel.height/2>=0);
    assert.ok(reel.y+reel.height/2<=height);
    for(const source of sources){
      assert.deepEqual(clipFlight(source,reel,0),{x:source.x,y:source.y});
      assert.deepEqual(clipFlight(source,reel,1),{x:reel.x,y:reel.y});
      let lastX=source.x;
      for(let i=0;i<=20;i++){
        const at=clipFlight(source,reel,i/20);
        assert.ok(at.x>=lastX-1e-8&&at.x<=width);
        assert.ok(at.y>=0&&at.y<=height);lastX=at.x;
      }
    }
  }
});
