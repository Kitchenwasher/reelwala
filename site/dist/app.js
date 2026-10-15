const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const endpoint = window.REEL_WALA_CONFIG?.sheetsEndpoint || '';
const mobile = matchMedia('(max-width: 700px)');
const immersive = document.createElement('section');
immersive.className = 'immersive';
immersive.id = 'experience';
immersive.setAttribute('aria-label', 'Step into the moment');
immersive.innerHTML = `<div class="immersive-sticky"><div class="immersive-backdrop"><span>Step into<br><em>the feeling.</em></span></div><div class="reel-window"><img src="assets/wedding.webp" alt="A wedding moment expands from a portrait frame as you scroll" loading="lazy"><div class="reel-overlay"><p class="eyebrow">A MOMENT CAN TAKE YOU RIGHT BACK.</p><h2>Be there.<br><em>All over again.</em></h2><a class="button light" href="#work">Discover the moments <span>↓</span></a></div><span class="phone-island" aria-hidden="true"></span></div><p class="immersive-prompt">SCROLL INTO THE MOMENT ↓</p></div>`;
$('#work').before(immersive);
const deviceInput = $('#creator-form input[name="device"]');
const deviceSelect = document.createElement('select');
deviceSelect.name = 'device';deviceSelect.required = true;
const modelNames = ['iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 16e','iPhone 17','iPhone 17 Pro','iPhone 17 Pro Max','iPhone Air','iPhone 17e','iPhone 18 Pro','iPhone 18 Pro Max'];
deviceSelect.append(new Option('Select your iPhone model',''), ...modelNames.map(name=>new Option(name,name)));
deviceInput.replaceWith(deviceSelect);
const uploadFields = document.createElement('div');uploadFields.className='portfolio-uploads full';
uploadFields.innerHTML=`<label>Choose your best 5 photos<input type="file" name="photos" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple required><small>Choose five photos. Preview selection only; files stay on your device.</small></label><label>Choose up to 2 edited videos <span class="optional">(optional)</span><input type="file" name="videos" accept="video/mp4,video/quicktime,video/webm" multiple><small>Optional: select one or two examples of your edits.</small></label>`;
$('#creator-form .form-grid').append(uploadFields);
const photoInput = $('#creator-form input[name="photos"]');const videoInput = $('#creator-form input[name="videos"]');
photoInput.addEventListener('change',()=>photoInput.setCustomValidity(photoInput.files.length === 5?'':'Please choose exactly five photos.'));
videoInput.addEventListener('change',()=>videoInput.setCustomValidity(videoInput.files.length <= 2?'':'Please choose no more than two videos.'));
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
let currentStep = -1;
function setStep(index) {
  if (index === currentStep) return;
  currentStep = index;
  $$('.story-title').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.toggle('prev', i < index);
  });
  $$('.story-content-panel').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.toggle('prev', i < index);
  });
  $$('.story-slide').forEach((el, i) => {
    el.classList.toggle('active', i === index);
    el.classList.toggle('prev', i < index);
  });
  $$('.story-steps button').forEach((button, i) => {
    const isActive = i === index;
    button.classList.toggle('active', isActive);
    if (isActive) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  const countEl = $('#story-count');
  if (countEl) countEl.textContent = `0${index + 1}`;
}
setStep(0);
$$('[data-step]').forEach(button => button.addEventListener('click', () => {
  const step = Number(button.dataset.step);
  if (mobile.matches || reducedMotion.matches) return setStep(step);
  const section = $('#story');
  const available = section.offsetHeight - innerHeight;
  window.scrollTo({top: section.offsetTop + available * ((step + 0.5) / 3), behavior: 'smooth'});
}));
let framePending = false;
function renderScroll() {
  framePending = false;
  const hero = $('.hero');const y = scrollY;
  if (!mobile.matches && !reducedMotion.matches) {
    const start = immersive.offsetTop;
    const range = immersive.offsetHeight-innerHeight;
    const p = Math.max(0,Math.min(1,(y-start)/range));
    const smooth = p*p*(3-2*p);
    const frame = $('.reel-window');
    if (frame) {
      frame.style.width = `${26+74*smooth}%`;
      frame.style.height = `${76+24*smooth}%`;
      frame.style.borderRadius = `${38*(1-smooth)}px`;
      frame.style.borderWidth = `${8*(1-smooth)}px`;
    }
    const pi = $('.phone-island'); if (pi) pi.style.opacity=String(Math.max(0,1-p*3));
    const ro = $('.reel-overlay'); if (ro) ro.style.opacity=String(Math.max(0,(p-.35)/.65));
    const ip = $('.immersive-prompt'); if (ip) ip.style.opacity=String(1-p);
  }
  if (!reducedMotion.matches && y < hero.offsetHeight) {
    const p = Math.min(y/hero.offsetHeight,1);
    const gm = $('.gimbal'); if (gm) gm.style.transform = `translateY(${p*35}px) rotate(${p*-8}deg) rotateY(${p*12}deg)`;
    const p1 = $('.photo-one'); if (p1) p1.style.transform = `translateY(${p*-85}px) rotate(${-10+p*5}deg)`;
    const p2 = $('.photo-two'); if (p2) p2.style.transform = `translateY(${p*-45}px) rotate(${9-p*5}deg)`;
    const p3 = $('.photo-three'); if (p3) p3.style.transform = `translateY(${p*-100}px) rotate(${-7+p*4}deg)`;
  }
  if (!mobile.matches && !reducedMotion.matches) {
    const section = $('#story');
    const available = section.offsetHeight - innerHeight;
    const progress = Math.max(0, Math.min(1, (y - section.offsetTop) / available));
    if (y >= section.offsetTop - innerHeight * 0.5 && y <= section.offsetTop + section.offsetHeight) {
      const progressBar = $('.story-image-progress>span');
      if (progressBar) progressBar.style.width = `${progress * 100}%`;
      const heading = $('.story-heading');
      const right = $('.story-right');
      if (heading) heading.style.transform = `translateY(${(progress - 0.5) * -22}px)`;
      if (right) right.style.transform = `translateY(${(progress - 0.5) * 18}px)`;
      const activeSlideImg = $('.story-slide.active img');
      if (activeSlideImg) {
        const stepProgress = (progress * 3) % 1;
        const drift = (stepProgress - 0.5) * -16;
        activeSlideImg.style.setProperty('--slide-drift', `${drift}px`);
      }
      let step = 0;
      if (progress >= 0.67) step = 2;
      else if (progress >= 0.33) step = 1;
      setStep(step);
    }
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
  const data = {};
  for(const [key,value] of new FormData(form)) {
    if(value instanceof File) {if(value.name)data[key]=data[key]?`${data[key]}, ${value.name}`:value.name;}
    else data[key]=value;
  }
  const lines = [`THE REEL WALA — ${kind}`,'Prepared locally. Not submitted or confirmed.','',...Object.entries(data).map(([key,value])=>`${key}: ${value}`)];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`reel-wala-${kind.toLowerCase().replaceAll(' ','-')}.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('.form-status',form).textContent='Your draft has been downloaded. No information was sent. Keep it ready for the Reel Wala team.';
}
async function sendEnquiry(form,kind) {
  if(!endpoint)return downloadEnquiry(form,kind==='booking'?'Shoot enquiry':'Creator application');
  if(!form.reportValidity())return;
  const button=$('button[type="submit"]',form);if(button.disabled)return;
  const status=$('.form-status',form);const data={};const uploads=[];
  const submissionId=form.dataset.submissionId||(form.dataset.submissionId=crypto.randomUUID());
  button.disabled=true;status.textContent='Sending your details…';
  try{
    let total=0;
    for(const [key,value] of new FormData(form)){
      if(value instanceof File){
        if(!value.name)continue;
        const fileKind=key==='photos'?'photo':'video';const limit=fileKind==='photo'?4000000:10000000;
        if(value.size>limit)throw new Error('Photos must be under 4 MB and videos under 10 MB.');
        total+=value.size;if(total>25000000)throw new Error('Keep portfolio files under 25 MB combined.');
        const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read a selected file.'));reader.readAsDataURL(value);});
        uploads.push({name:value.name,mime:value.type,data:base64,kind:fileKind});
      }else data[key]=value;
    }
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({kind,submissionId,data,uploads,website:data.website||''}),signal:AbortSignal.timeout(90000)});
    if(!response.ok)throw new Error('Could not confirm delivery. Keep your details and try again.');
    const result=await response.json();if(result.success!==true)throw new Error(result.error||'Unable to save your request.');
    status.textContent=kind==='booking'?'Your enquiry is saved. The team will follow up to confirm your shoot.':'Your application is saved. The team will be in touch about the next step.';
    form.reset();delete form.dataset.submissionId;
  }catch(error){status.textContent=error.name==='TimeoutError'?'Delivery could not be confirmed. Try again with the same details; the submission ID prevents duplicates.':error.message;}
  finally{button.disabled=false;}
}
if(endpoint){
  $('#booking-form button[type="submit"]').innerHTML='Send my enquiry <span>↗</span>';
  $('#creator-form button[type="submit"]').innerHTML='Send my application <span>↗</span>';
  $('#booking-form .form-note').textContent='Your details are sent securely to the Reel Wala team. A booking is final only after confirmation.';
  $('#creator-form .form-note').textContent='Your application and selected portfolio files are sent to the Reel Wala team for review.';
  $$('.portfolio-uploads small').forEach((small,i)=>small.textContent=i===0?'Five photos, up to 4 MB each.':'Optional: up to two videos, 10 MB each. All files combined: 25 MB maximum.');
}
[$('#booking-form'),$('#creator-form')].forEach(form=>{
  const trap=document.createElement('input');trap.name='website';trap.tabIndex=-1;trap.autocomplete='off';trap.className='honeypot';trap.setAttribute('aria-hidden','true');form.append(trap);
  form.addEventListener('input',()=>{delete form.dataset.submissionId;});
});
$('#booking-form').addEventListener('submit',event=>{event.preventDefault();sendEnquiry(event.currentTarget,'booking');});
$('#creator-form').addEventListener('submit',event=>{event.preventDefault();sendEnquiry(event.currentTarget,'creator');});
$('#year').textContent=new Date().getFullYear();
