import test from 'node:test';
import assert from 'node:assert/strict';
import {PACKAGE_PLANS,formatRupees,priceAtTime} from './package-plans.mjs';

test('collections retain three Standard and four Premium slots',()=>{
  assert.equal(PACKAGE_PLANS.filter(plan=>plan.family==='standard').length,3);
  assert.equal(PACKAGE_PLANS.filter(plan=>plan.family==='select').length,4);
  assert.equal(new Set(PACKAGE_PLANS.map(plan=>plan.id)).size,7);
  for(const plan of PACKAGE_PLANS)assert(['Standard','Extended','Custom / Premium'].includes(plan.bookingPackage));
});
test('price counters start at zero, rise monotonically and land on the exact price',()=>{
  for(const {price} of PACKAGE_PLANS.filter(plan=>plan.price!==null)){
    assert.equal(priceAtTime(price,0),0);
    assert.equal(priceAtTime(price,-20),0);
    let previous=0;
    for(let time=0;time<=1400;time+=16){
      const value=priceAtTime(price,time);
      assert(value>=previous&&value<=price);
      previous=value;
    }
    assert.equal(priceAtTime(price,1250),price);
    assert.equal(priceAtTime(price,5000),price);
  }
});
test('prices use Indian currency grouping',()=>{
  assert.equal(formatRupees(0),'₹0');
  assert.equal(formatRupees(39999),'₹39,999');
  assert.equal(formatRupees(125000),'₹1,25,000');
});

test('written notes control coverage and unknown prices stay on enquiry',()=>{
  const standard=PACKAGE_PLANS.find(plan=>plan.name==='Standard');
  const extended=PACKAGE_PLANS.find(plan=>plan.name==='Extended');
  assert.equal(standard.price,null);
  assert(standard.features.includes('4 complimentary colour-graded photos'));
  assert.equal(extended.price,null);
  assert(extended.features.includes('Up to 4 hours of shoot time'));
  assert(extended.features.includes('7 complimentary colour-graded photos'));
  for(const plan of [standard,extended])assert(plan.features.includes('Reel delivery within 24 hours'));
  assert.deepEqual(PACKAGE_PLANS.filter(plan=>plan.price!==null).map(plan=>[plan.id,plan.price]),[['extra-hour',1000]]);
  for(const plan of PACKAGE_PLANS.filter(plan=>plan.family==='select')){
    assert.equal(plan.price,null);assert.equal(plan.pending,true);
    assert(plan.features.every(feature=>!/\d/.test(feature)));
  }
  assert.equal(priceAtTime(null,500),null);
  assert.equal(formatRupees(null),'On enquiry');
});
