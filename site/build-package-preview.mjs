import {readFile,writeFile} from 'node:fs/promises';
import {PACKAGE_PLANS,formatRupees} from '../src/package-plans.mjs';

// Keep a readable, accurate fallback before React loads or when scripts are disabled.
const file=new URL('./dist/index.html',import.meta.url);
let html=await readFile(file,'utf8');
const start=html.indexOf('<div class="pricing-showcase-root" id="pricing-pixel-cards-root">');
const end=html.indexOf('<section class="booking ',start);
if(start<0||end<0)throw new Error('Pricing preview container not found.');
const fallback=['standard','select'].map(family=>`<section class="packages-showcase" data-family="${family}"><h3>${family==='standard'?'Standard packages':'Premium packages'}</h3><div class="price-grid">${PACKAGE_PLANS.filter(plan=>plan.family===family).map(plan=>`<article class="price-card pixel-card pricing-motion-card ${plan.featured?'featured':''}"><div class="pixel-card-content"><div class="package-intro"><h3>${plan.name}</h3><div class="package-price">${plan.price===null?'Enquire':formatRupees(plan.price)}</div><p>${plan.description}</p></div><a class="button" href="#book" data-package="${plan.bookingPackage}">${plan.addon?'Add an hour':'Check availability'}</a><div class="package-inclusions"><p>What’s included</p><ul>${plan.features.map(feature=>`<li>${feature}</li>`).join('')}</ul></div></div></article>`).join('')}</div></section>`).join('');
html=html.slice(0,start)+`<div class="pricing-showcase-root" id="pricing-pixel-cards-root">${fallback}</div></section>\n`+html.slice(end);
await writeFile(file,html);
console.log('Package information prepared from written service requirements.');
