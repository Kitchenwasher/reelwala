import test from 'node:test';
import assert from 'node:assert/strict';
import {PACKAGE_PLANS,formatRupees,priceAtTime} from './package-plans.mjs';

test('preview collections contain three Standard and four Select plans',()=>{
  assert.equal(PACKAGE_PLANS.filter(plan=>plan.family==='standard').length,3);
  assert.equal(PACKAGE_PLANS.filter(plan=>plan.family==='select').length,4);
  assert.equal(new Set(PACKAGE_PLANS.map(plan=>plan.id)).size,7);
  for(const plan of PACKAGE_PLANS)assert(['Standard','Extended','Custom / Premium'].includes(plan.bookingPackage));
});
test('price counters start at zero, rise monotonically and land on the exact price',()=>{
  for(const {price} of PACKAGE_PLANS){
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
