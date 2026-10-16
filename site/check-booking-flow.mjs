import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise navigation and submission without opening a browser.
class Element {
  constructor(){this.hidden=false;this.dataset={};this.style={};this.attributes={};this.handlers={};this.textContent='';this.value='';this.disabled=false;this.valid=true;this.reported=0;this.classList={contains:()=>false};}
  setAttribute(key,value){this.attributes[key]=value;}
  removeAttribute(key){delete this.attributes[key];}
  addEventListener(type,handler,capture){(this.handlers[type]??=[]).push({handler,capture});}
  fire(type){for(const {handler} of this.handlers[type]||[])handler();}
  focus(){}
  checkValidity(){return this.valid;}
  reportValidity(){this.reported++;return this.valid;}
}
const date=new Element(),city=new Element(),name=new Element(),email=new Element(),phone=new Element();
date.valid=city.valid=name.valid=email.valid=phone.valid=false;
const panels=[[date,city],[],[name,email,phone]].map(fields=>{const element=new Element();element.querySelectorAll=()=>fields;return element;});
const tabs=[0,1,2].map(index=>{const element=new Element();element.dataset.bookingGoto=String(index);return element;});
const nodes=Object.fromEntries(['#booking-next','#booking-back','.form-submit-area','#booking-step-title','#booking-step-help','#booking-step-count','#booking-progress-fill','#booking-review-line'].map(key=>[key,new Element()]));
const form=new Element();
form.querySelector=selector=>nodes[selector]||null;
form.querySelectorAll=selector=>selector==='[data-booking-panel]'?panels:[];
const document={querySelector:()=>form,querySelectorAll:()=>tabs,addEventListener:()=>{}};
vm.runInNewContext(readFileSync(new URL('./dist/booking-flow.js',import.meta.url),'utf8'),{document,window:{ReelWalaValidation:{report:field=>field.reportValidity()},ReelWalaBooking:{state:{occasion:'Wedding / private celebration',package:'Extended',date:'',locality:''}}},Intl,Date});
const next=()=>nodes['#booking-next'].fire('click');
assert.deepEqual(panels.map(panel=>panel.hidden),[false,true,true]);
next();assert.equal(form.dataset.step,'0');assert.equal(date.reported,1);
date.valid=true;next();assert.equal(form.dataset.step,'0');assert.equal(city.reported,1);
city.valid=true;next();assert.equal(form.dataset.step,'1');
next();assert.equal(form.dataset.step,'2');assert.equal(nodes['.form-submit-area'].hidden,false);
assert.equal(nodes['#booking-next'].hidden,true);
const submit=()=>{const event={prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};form.handlers.submit[0].handler(event);return event;};
assert.equal(submit().prevented,true);assert.equal(name.reported,1);
name.valid=email.valid=phone.valid=true;name.value='Asha';email.value='asha@example.com';
assert.equal(submit().prevented,false,'valid final submit reaches the existing intake handler');
nodes['#booking-back'].fire('click');assert.equal(form.dataset.step,'1');
assert.equal(name.value,'Asha');assert.equal(email.value,'asha@example.com');
tabs[0].fire('click');assert.equal(form.dataset.step,'0');
assert.equal(submit().prevented,true,'Enter on an earlier step must not submit');assert.equal(form.dataset.step,'1');
next();date.valid=false;
assert.equal(submit().prevented,true);assert.equal(form.dataset.step,'0','earlier invalid fields become visible before reporting');
assert.equal(date.disabled,false);assert.equal(name.disabled,false,'hidden steps stay in FormData');
const html=readFileSync(new URL('./dist/index.html',import.meta.url),'utf8');
for(const field of ['occasion','package','date','creator','inspiration','name','phone','email','locality','notes'])assert(html.includes(`name="${field}"`),field);
assert(html.includes('id="inspiration-banner" hidden'));
assert(!html.includes('id="inspiration-img" src=""'));
assert.equal((html.match(/data-booking-panel="/g)||[]).length,3);
console.log('Booking flow checks passed: validation, step navigation, retained fields, final submit and empty inspiration.');
