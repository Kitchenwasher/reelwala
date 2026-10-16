import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

class Element {
  constructor(){this.attributes={};this.children=[];this.focusCount=0;this.tagName='INPUT';this.name='email';this.type='email';this.willValidate=true;this.validity={valid:false,valueMissing:true};}
  setAttribute(key,value){this.attributes[key]=value;}
  getAttribute(key){return this.attributes[key]||null;}
  removeAttribute(key){delete this.attributes[key];}
  append(...children){this.children.push(...children);}
  insertAdjacentElement(position,node){assert.equal(position,'afterend');this.error=node;}
  remove(){this.removed=true;}
  focus(){this.focusCount++;}
}
const handlers={};
const document={createElement:()=>new Element(),addEventListener:(name,fn)=>handlers[name]=fn};
const window={};
vm.runInNewContext(readFileSync(new URL('./dist/form-validation.js',import.meta.url),'utf8'),{document,window,WeakMap,queueMicrotask});
const {report,clear}=window.ReelWalaValidation;
const email=new Element();email.setAttribute('aria-describedby','email-hint');
assert.equal(report(email),false);assert.equal(email.focusCount,1);
assert.equal(email.error.children[1].textContent,'Enter your email address.');
assert.equal(email.getAttribute('aria-invalid'),'true');
assert(email.getAttribute('aria-describedby').includes('email-hint'));
const sameError=email.error;
email.validity={valid:false,typeMismatch:true};report(email);
assert.equal(email.error,sameError,'reuse one message per field');
assert.match(email.error.children[1].textContent,/valid email address/);
email.validity={valid:true};handlers.input({target:email});await Promise.resolve();
assert.equal(email.getAttribute('aria-invalid'),null);assert.equal(email.getAttribute('aria-describedby'),'email-hint');assert.equal(sameError.removed,true);
const upload=new Element();upload.type='file';upload.validity={valid:false,customError:true};upload.validationMessage='Choose three or four videos.';
assert.equal(report(upload),false);assert.equal(upload.error.children[1].textContent,upload.validationMessage);
upload.willValidate=false;assert.equal(report(upload),true);assert.equal(upload.getAttribute('aria-invalid'),null);
const first=new Element(),second=new Element();const form={tagName:'FORM',querySelectorAll:()=>[first,second]};
assert.equal(report(form),false);assert.equal(first.focusCount,1);assert.equal(second.focusCount,0);
assert.equal(second.getAttribute('aria-invalid'),'true');
let prevented=false;handlers.invalid({target:first,preventDefault(){prevented=true;}});assert(prevented,'native bubble is cancelled');
clear(first);clear(second);assert.equal(report(null),false);
console.log('Inline validation checks passed: messages, focus, custom upload errors, error removal and accessible descriptions.');
