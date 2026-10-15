const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 700px)');
const imagePath = name => `assets/${name}.webp`;
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  $('#navigation').classList.toggle('open', open);
});
function closeMenu() {menu.setAttribute('aria-expanded', 'false');menu.setAttribute('aria-label', 'Open menu');$('#navigation').classList.remove('open');}
$$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
$$('[data-open]').forEach(button => button.addEventListener('click', () => {closeMenu();document.getElementById(button.dataset.open).showModal();}));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if (event.target === dialog) {const rect = dialog.getBoundingClientRect();if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();}});
});
const imageDialog = $('#image-dialog');
function openImage(name, title, category) {
  $('#lightbox-image').src = imagePath(name);
  $('#lightbox-image').alt = title;
  $('#lightbox-title').textContent = title;
  $('#lightbox-category').textContent = category;
  imageDialog.showModal();
}
$$('.work-card').forEach(button => button.addEventListener('click', () => openImage(button.dataset.image,button.dataset.title,button.dataset.category)));
$('#lightbox-book').addEventListener('click', () => imageDialog.close());
const serviceData = [
  {image:'wedding',label:'PRIVATE CELEBRATIONS',detail:'Weddings & receptions · Haldi, Mehendi & Sangeet · Birthdays & anniversaries · Proposals · Baby showers · Naming ceremonies & Annaprashan · Make-up shoots · Graduation days · Pet shoots · New car deliveries · Housewarmings · Family gatherings & home tours'},
  {image:'corporate',label:'CORPORATE MOMENTS',detail:'Team outings, lunches & dinners · Corporate parties · Annual & quarterly meetups · Office celebrations · Company anniversaries · Product & store launches · Sports & corporate tournaments'},
  {image:'culture',label:'CULTURE & COMMUNITY',detail:'Cultural fests & carnivals · Diwali, Holi, Eid, Christmas & Gudi Padwa · Community & society events · Music festivals & concerts · Stand-up comedy · Fashion shows & food festivals'}
];
let currentService = 0;
function setService(index) {
  if (index === currentService) return;
  currentService = index;
  const item = serviceData[index];
  $$('.service-row').forEach((button, i) => {button.classList.toggle('active',i === index);button.setAttribute('aria-pressed',String(i === index));});
  $('#service-image').src = imagePath(item.image);$('#service-image').alt = `${item.label.toLowerCase()} concept preview`;
  $('#service-label').textContent = item.label;$('#service-detail').textContent = item.detail;
}
$('#service-detail').textContent = serviceData[0].detail;
$$('.service-row').forEach(button => {button.addEventListener('click', () => setService(Number(button.dataset.service)));button.addEventListener('pointerenter', event => {if(event.pointerType === 'mouse')setService(Number(button.dataset.service));});});
const storyData = [
  {title:'You live<br><em>the moment.</em>',subtitle:'We catch the<br><em>little things.</em>',copy:'A glance. A laugh. The dance nobody planned. Your reeler is there for it all.',image:'wedding',label:'01 / THE SHOOT'},
  {title:'A little cut.<br><em>A lot of feeling.</em>',subtitle:'Your story.<br><em>Found in the edit.</em>',copy:'The right moments, the right rhythm. We shape your day into something you’ll want to watch again.',image:'corporate',label:'02 / THE EDIT'},
  {title:'The day ends.<br><em>The feeling stays.</em>',subtitle:'Ready to share.<br><em>Ready to relive.</em>',copy:'Your edited reels and photos, delivered within 24 hours through a secure download link.',image:'culture',label:'03 / THE DELIVERY'}
];
let currentStep = -1;
function setStep(index) {
  if (index === currentStep) return;
  currentStep = index;
  const item = storyData[index];
  $('#story-title').innerHTML = item.title;$('#story-subtitle').innerHTML = item.subtitle;$('#story-copy').textContent = item.copy;
  $('#story-image').src = imagePath(item.image);$('#story-image').alt = `${item.label.slice(5).toLowerCase()} — illustrative event moment`;
  $('#story-image-label').textContent = item.label;$('#story-count').textContent = `0${index+1}`;
  $('.story-image-progress>span').style.width = `${(index+1)/3*100}%`;
  $$('.story-steps button').forEach((button,i) => {button.classList.toggle('active',index === i);if(index === i)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
}
setStep(0);
$$('[data-step]').forEach(button => button.addEventListener('click', () => {
  const step = Number(button.dataset.step);
  if (mobile.matches || reducedMotion.matches) return setStep(step);
  const section = $('#story');const available = section.offsetHeight - innerHeight;
  window.scrollTo({top:section.offsetTop + available * ((step+.3)/3),behavior:reducedMotion.matches?'instant':'smooth'});
}));
let framePending = false;
function renderScroll() {
  framePending = false;
  const hero = $('.hero');const y = scrollY;
  if (!reducedMotion.matches && y < hero.offsetHeight) {
    const p = Math.min(y/hero.offsetHeight,1);
    $('.gimbal').style.transform = `translateY(${p*35}px) rotate(${p*-8}deg) rotateY(${p*12}deg)`;
    $('.photo-one').style.transform = `translateY(${p*-85}px) rotate(${-10+p*5}deg)`;
    $('.photo-two').style.transform = `translateY(${p*-45}px) rotate(${9-p*5}deg)`;
    $('.photo-three').style.transform = `translateY(${p*-100}px) rotate(${-7+p*4}deg)`;
  }
  if (!mobile.matches && !reducedMotion.matches) {
    const section = $('#story');const progress = (y-section.offsetTop)/(section.offsetHeight-innerHeight);
    if(progress >= -.15 && progress <= 1.15) setStep(Math.max(0,Math.min(2,Math.floor(progress*3))));
  }
}
window.addEventListener('scroll',() => {if(!framePending){framePending=true;requestAnimationFrame(renderScroll);}},{passive:true});
window.addEventListener('resize',renderScroll);
renderScroll();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
$$('.work .section-top,.work h2,.work-strip,.services h2,.service-layout,.price-card,.booking-copy,.creator-banner h2').forEach(element => {element.classList.add('reveal');observer.observe(element);});
const galleryData = [
  {image:'culture',title:'A room full of energy'},
  {image:'corporate',title:'Celebrating the people behind it'},
  {image:'wedding',title:'The feeling you keep'},
  {image:'culture',title:'One more song. One more memory.'},
  {image:'wedding',title:'All your favourite people'}
];
let galleryIndex = 2;
const cardsRoot = $('.replay-cards');
galleryData.forEach((item,i) => {const button = document.createElement('button');button.className='replay-card';button.setAttribute('aria-label',`View ${item.title}`);const img = document.createElement('img');img.src=imagePath(item.image);img.alt=item.title;img.loading='lazy';button.append(img);button.addEventListener('click',() => {if(didDrag)return;if(galleryIndex===i)openImage(item.image,item.title,'THE FEELING, ON REPEAT');else{galleryIndex=i;renderGallery();}});cardsRoot.append(button);});
function renderGallery() {
  $$('.replay-card').forEach((card,i) => {
    let offset = (i-galleryIndex+5)%5;if(offset>2)offset-=5;
    const angle = offset*(mobile.matches?34:31);const rad = angle*Math.PI/180;
    const x = Math.sin(rad)*(mobile.matches?210:$('.replay-stage').clientWidth*.44);
    const scale = 1-Math.abs(offset)*.17;
    card.style.transform=`translateX(${x}px) translateY(${Math.abs(offset)*10}px) rotateY(${-angle*.7}deg) scale(${scale})`;
    card.style.zIndex=String(5-Math.abs(offset));card.style.filter=`saturate(${1-Math.abs(offset)*.12})`;
    card.setAttribute('aria-pressed',String(offset===0));
  });
  $('.replay-caption').textContent=galleryData[galleryIndex].title;
}
function moveGallery(direction){galleryIndex=(galleryIndex+direction+galleryData.length)%galleryData.length;renderGallery();}
$('#replay-prev').addEventListener('click',()=>moveGallery(-1));$('#replay-next').addEventListener('click',()=>moveGallery(1));
const stage=$('.replay-stage');let pointerStart=null,didDrag=false;
stage.addEventListener('pointerdown',event=>{pointerStart={x:event.clientX,y:event.clientY};didDrag=false;});
stage.addEventListener('pointerup',event=>{if(!pointerStart)return;const dx=event.clientX-pointerStart.x;const dy=event.clientY-pointerStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){didDrag=true;moveGallery(dx<0?1:-1);setTimeout(()=>didDrag=false,100);}pointerStart=null;});
stage.addEventListener('pointercancel',()=>pointerStart=null);
stage.addEventListener('dragstart',event=>event.preventDefault());
stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveGallery(event.key==='ArrowRight'?1:-1);}});
window.addEventListener('resize',renderGallery);renderGallery();
$$('[data-package]').forEach(link=>link.addEventListener('click',()=>{$('#booking-form select[name="package"]').value=link.dataset.package;}));
const dateInput=$('input[name="date"]');const today=new Date();const localDay=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);dateInput.min=localDay;
function downloadEnquiry(form,kind) {
  if(!form.reportValidity())return;
  const data = Object.fromEntries(new FormData(form));
  const lines = [`THE REEL WALA — ${kind}`,'Prepared locally. Not submitted or confirmed.','',...Object.entries(data).map(([key,value])=>`${key}: ${value}`)];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`reel-wala-${kind.toLowerCase().replaceAll(' ','-')}.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('.form-status',form).textContent='Your draft has been downloaded. No information was sent. Keep it ready for the Reel Wala team.';
}
$('#booking-form').addEventListener('submit',event=>{event.preventDefault();downloadEnquiry(event.currentTarget,'Shoot enquiry');});
$('#creator-form').addEventListener('submit',event=>{event.preventDefault();downloadEnquiry(event.currentTarget,'Creator application');});
$('#year').textContent=new Date().getFullYear();
