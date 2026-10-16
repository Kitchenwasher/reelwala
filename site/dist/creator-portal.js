const application=document.getElementById('creator-application-form');
const photos=document.getElementById('creator-photos'),videos=document.getElementById('creator-videos');
const photoStatus=document.getElementById('creator-photo-status'),videoStatus=document.getElementById('creator-video-status');
const previews=document.getElementById('creator-photo-previews'),result=document.getElementById('creator-result');
const endpoint=window.REEL_WALA_CONFIG?.sheetsEndpoint||'';
const modelNames=['iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 16e','iPhone 17','iPhone 17 Pro','iPhone 17 Pro Max','iPhone Air','iPhone 17e','iPhone 18 Pro','iPhone 18 Pro Max'];
application.elements.device.append(...modelNames.map(name=>new Option(name,name)));
const allowedPhotos=['image/jpeg','image/png','image/webp','image/heic','image/heif'];
const allowedVideos=['video/mp4','video/quicktime','video/webm'];
const mimeFor=file=>file.type||({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',heic:'image/heic',heif:'image/heif',mp4:'video/mp4',mov:'video/quicktime',webm:'video/webm'}[file.name.split('.').pop().toLowerCase()]||'');
let currentStep=0,furthest=0,previewUrls=[];

function validateDetails(){
  const fields=application.querySelectorAll('[data-creator-step="0"] input,[data-creator-step="0"] select');
  application.elements.name.setCustomValidity(application.elements.name.value.trim()?'':'Enter your full name.');
  application.elements.locality.setCustomValidity(application.elements.locality.value.trim()?'':'Enter your city or locality.');
  application.elements.phone.setCustomValidity(/^[+0-9()\s-]{7,20}$/.test(application.elements.phone.value)?'':'Enter a valid phone number.');
  return [...fields].every(field=>field.checkValidity());
}

function validatePortfolio(){
  const selectedPhotos=[...photos.files],selectedVideos=[...videos.files];
  let photoError='',videoError='';
  if(selectedPhotos.length!==5)photoError='Choose exactly five photos.';
  else if(selectedPhotos.some(file=>!allowedPhotos.includes(mimeFor(file))))photoError='Choose JPG, PNG, WebP, HEIC or HEIF photos.';
  else if(selectedPhotos.some(file=>!file.size||file.size>4000000))photoError='Photos must be under 4 MB each and cannot be empty.';
  if(selectedVideos.length>2)videoError='Choose no more than two edited videos.';
  else if(selectedVideos.some(file=>!allowedVideos.includes(mimeFor(file))))videoError='Choose MP4, MOV or WebM videos.';
  else if(selectedVideos.some(file=>!file.size||file.size>10000000))videoError='Videos must be under 10 MB each and cannot be empty.';
  if([...selectedPhotos,...selectedVideos].reduce((total,file)=>total+file.size,0)>25000000)photoError='Keep all selected files under 25 MB combined.';
  photos.setCustomValidity(photoError);videos.setCustomValidity(videoError);
  photoStatus.textContent=photoError||`${selectedPhotos.length} photos selected`;
  videoStatus.textContent=videoError||(selectedVideos.length?`${selectedVideos.length} videos selected`:'No videos selected');
  const portfolio=application.elements.portfolio;
  portfolio.setCustomValidity(portfolio.value&&!/^https?:\/\//i.test(portfolio.value)?'Use an http or https portfolio link.':'');
  return !photoError&&!videoError&&portfolio.checkValidity();
}

function renderReview(){
  const values=new FormData(application);
  const rows=[['Name',values.get('name')],['Email',values.get('email')],['Phone',values.get('phone')],['Location',values.get('locality')],['Device',values.get('device')],['Photos',[...photos.files].map(file=>file.name).join(', ')],['Videos',videos.files.length?[...videos.files].map(file=>file.name).join(', '):'None selected'],['Portfolio',values.get('portfolio')||'Not added']];
  const review=document.getElementById('creator-review');review.replaceChildren();
  rows.forEach(([label,value])=>{const row=document.createElement('div'),term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=value;row.append(term,description);review.append(row);});
}

function goStep(index){
  currentStep=index;furthest=Math.max(furthest,index);
  document.querySelectorAll('[data-creator-step]').forEach(step=>{step.hidden=Number(step.dataset.creatorStep)!==index;});
  document.querySelectorAll('[data-creator-go]').forEach(button=>{const number=Number(button.dataset.creatorGo);button.disabled=number>furthest;if(number===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
  if(index===2)renderReview();
  const heading=application.querySelector(`[data-creator-step="${index}"] legend`);heading.tabIndex=-1;heading.focus({preventScroll:true});
}

function advance(index){
  if(index>0&&!validateDetails()){goStep(0);window.ReelWalaValidation.report(application.querySelector('[data-creator-step="0"] :invalid'));return;}
  if(index>1&&!validatePortfolio()){goStep(1);window.ReelWalaValidation.report(application.querySelector('[data-creator-step="1"] :invalid'));return;}
  goStep(index);
}
document.getElementById('creator-details-next').addEventListener('click',()=>advance(1));
document.getElementById('creator-portfolio-next').addEventListener('click',()=>advance(2));
document.querySelectorAll('[data-creator-go]').forEach(button=>button.addEventListener('click',()=>advance(Number(button.dataset.creatorGo))));
document.querySelectorAll('[data-creator-back]').forEach(button=>button.addEventListener('click',()=>goStep(Number(button.dataset.creatorBack))));
application.addEventListener('keydown',event=>{if(event.key==='Enter'&&currentStep<2&&event.target.tagName!=='BUTTON'){event.preventDefault();advance(currentStep+1);}});
application.addEventListener('input',event=>{delete application.dataset.submissionId;if(event.target.setCustomValidity)event.target.setCustomValidity('');});

function clearPreviews(){previewUrls.forEach(url=>URL.revokeObjectURL(url));previewUrls=[];previews.replaceChildren();}
function renderPhotoPreviews(){
  clearPreviews();[...photos.files].slice(0,5).forEach(file=>{
    const figure=document.createElement('figure'),image=document.createElement('img'),caption=document.createElement('figcaption');
    image.src=URL.createObjectURL(file);previewUrls.push(image.src);image.alt=file.name;caption.textContent=file.name;
    image.onerror=()=>{const fallback=document.createElement('span');fallback.className='creator-photo-placeholder';fallback.textContent=file.name.split('.').pop().toUpperCase();image.replaceWith(fallback);};
    figure.append(image,caption);previews.append(figure);
  });
}
photos.addEventListener('change',()=>{delete application.dataset.submissionId;validatePortfolio();renderPhotoPreviews();});
videos.addEventListener('change',()=>{delete application.dataset.submissionId;validatePortfolio();});

function downloadDraft(data){
  const lines=['THE REEL WALA — Creator application','Draft only. Not submitted. Files remain on your device.','',...Object.entries(data).filter(([key])=>key!=='website').map(([key,value])=>`${key}: ${value}`),'',...[...photos.files].map(file=>`Photo: ${file.name}`),...[...videos.files].map(file=>`Video: ${file.name}`)];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='reel-wala-creator-application.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  result.textContent='Your application draft is downloaded. Nothing was sent; portfolio files remain on your device.';
}
const readFile=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read a portfolio file. Please select it again.'));reader.readAsDataURL(file);});
application.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!validateDetails()){advance(1);return;}if(!validatePortfolio()){advance(2);return;}
  const data=Object.fromEntries([...new FormData(application)].filter(([,value])=>typeof value==='string'));
  if(!endpoint){downloadDraft(data);return;}
  const submissionId=application.dataset.submissionId||(application.dataset.submissionId=crypto.randomUUID());
  const fields=[...document.querySelectorAll('.creator-application input,.creator-application select,.creator-application button')],disabled=fields.map(field=>field.disabled);
  fields.forEach(field=>{field.disabled=true;});result.textContent='Sending your application and portfolio…';let saved=false;
  try{
    const uploads=[];
    for(const [kind,files] of [['photo',photos.files],['video',videos.files]])for(const file of files)uploads.push({name:file.name,mime:mimeFor(file),kind,data:await readFile(file)});
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({kind:'creator',submissionId,data,uploads,website:data.website||''}),signal:AbortSignal.timeout(90000)});
    if(!response.ok)throw new Error('Could not confirm delivery. Keep your details and try again.');
    const payload=await response.json();if(payload.success!==true)throw new Error(payload.error||'Unable to save your application.');
    application.reset();clearPreviews();delete application.dataset.submissionId;photos.setCustomValidity('');videos.setCustomValidity('');photoStatus.textContent='No photos selected';videoStatus.textContent='No videos selected';
    result.textContent='Your application and portfolio are saved. The team will review your work and contact you about the next step.';furthest=0;saved=true;
  }catch(error){result.textContent=error.name==='TimeoutError'?'Delivery could not be confirmed. Try again with the same details; the submission ID prevents duplicates.':error.message;}
  finally{fields.forEach((field,index)=>{field.disabled=disabled[index];});if(saved)goStep(0);}
});
if(endpoint){document.getElementById('creator-submit').textContent='Send application';document.getElementById('creator-mode-note').textContent='Your application and portfolio files are sent privately to the Reel Wala team for review.';}
const scene=document.querySelector('.creator-hero-scene');let sceneVisible=false;
const updateScene=()=>scene.classList.toggle('is-visible',sceneVisible&&!document.hidden);
const sceneObserver=new IntersectionObserver(([entry])=>{sceneVisible=entry.isIntersecting;updateScene();});sceneObserver.observe(scene);
document.addEventListener('visibilitychange',updateScene);
window.addEventListener('pagehide',()=>{clearPreviews();sceneObserver.disconnect();});
window.addEventListener('pageshow',event=>{if(event.persisted){renderPhotoPreviews();sceneObserver.observe(scene);}});
document.getElementById('creator-year').textContent=new Date().getFullYear();
