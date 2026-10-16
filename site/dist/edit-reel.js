const form=document.getElementById('reel-request-form');
const clips=document.getElementById('request-clips');
const clipStatus=document.getElementById('request-clip-status');
const result=document.getElementById('request-result');
const previews=document.getElementById('request-clip-previews');
const endpoint=window.REEL_WALA_CONFIG?.sheetsEndpoint||'';
let previewUrls=[],furthest=0;

function validateClips(){
  const files=[...clips.files];
  let error='';
  if(files.length<3||files.length>4)error='Choose three or four videos.';
  else if(files.some(file=>!['video/mp4','video/quicktime','video/webm'].includes(file.type)))error='Choose MP4, MOV or WebM videos.';
  else if(files.some(file=>!file.size||file.size>10000000))error='Each clip must be under 10 MB and cannot be empty.';
  else if(files.reduce((total,file)=>total+file.size,0)>25000000)error='Keep all clips under 25 MB combined.';
  clips.setCustomValidity(error);clipStatus.textContent=error||`${files.length} clips selected`;
  return !error;
}

function goStep(index){
  furthest=Math.max(furthest,index);
  document.querySelectorAll('[data-step]').forEach(step=>{step.hidden=Number(step.dataset.step)!==index;});
  document.querySelectorAll('[data-go-step]').forEach(button=>{
    const number=Number(button.dataset.goStep);button.disabled=number>furthest;
    if(number===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  if(index===2){document.getElementById('request-summary').textContent=`${clips.files.length} clips · ${form.elements.style.value} edit`;}
  const heading=form.querySelector(`[data-step="${index}"] legend`);heading.tabIndex=-1;heading.focus({preventScroll:true});
}

function clearPreviews(){previewUrls.forEach(url=>URL.revokeObjectURL(url));previewUrls=[];previews.replaceChildren();}
clips.addEventListener('change',()=>{
  clearPreviews();delete form.dataset.submissionId;
  if(!validateClips())return;
  [...clips.files].forEach(file=>{
    const figure=document.createElement('figure'),video=document.createElement('video'),caption=document.createElement('figcaption');
    const url=URL.createObjectURL(file);previewUrls.push(url);video.src=url;video.controls=true;video.preload='metadata';video.playsInline=true;
    caption.textContent=file.name;figure.append(video,caption);previews.append(figure);
  });
});
document.getElementById('clips-next').addEventListener('click',()=>{if(validateClips())goStep(1);else clips.reportValidity();});
document.getElementById('style-next').addEventListener('click',()=>goStep(2));
document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>goStep(Number(button.dataset.back))));
document.querySelectorAll('[data-go-step]').forEach(button=>button.addEventListener('click',()=>{
  const step=Number(button.dataset.goStep);
  if(step>0&&!validateClips()){goStep(0);clips.reportValidity();return;}goStep(step);
}));
form.addEventListener('input',()=>{delete form.dataset.submissionId;});
window.addEventListener('pagehide',clearPreviews);

function downloadDraft(data,files){
  const lines=['THE REEL WALA — Reel edit request','Draft only. Nothing has been sent.','',`Name: ${data.name}`,`Email: ${data.email}`,`Phone: ${data.phone}`,`Style: ${data.style}`,`Brief: ${data.notes}`,'',...files.map((file,i)=>`Clip ${i+1}: ${file.name}`)];
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='reel-wala-edit-request.txt';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);result.textContent='Draft downloaded. Your videos are still on your device; nothing was sent.';
}

function readFile(file){return new Promise((resolve,reject)=>{
  const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read a clip. Please select it again.'));reader.readAsDataURL(file);
});}

form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!validateClips()){goStep(0);clips.reportValidity();return;}
  if(!form.reportValidity())return;
  const data=Object.fromEntries([...new FormData(form)].filter(([,value])=>typeof value==='string'));
  if(!/^[+0-9()\s-]{7,20}$/.test(data.phone)){result.textContent='Enter a valid phone number.';form.elements.phone.focus();return;}
  const files=[...clips.files];
  if(!endpoint){downloadDraft(data,files);return;}
  const submissionId=form.dataset.submissionId||(form.dataset.submissionId=crypto.randomUUID());
  const fields=[...form.querySelectorAll('input,textarea,button')];const disabled=fields.map(field=>field.disabled);
  fields.forEach(field=>{field.disabled=true;});result.textContent='Sending your clips…';
  let saved=false;
  try{
    const uploads=[];
    for(const file of files)uploads.push({name:file.name,mime:file.type,kind:'video',data:await readFile(file)});
    data.notes=`Style: ${data.style}\n${data.notes||''}`.trim();
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({kind:'edit',submissionId,data,uploads,website:data.website||''}),signal:AbortSignal.timeout(90000)});
    if(!response.ok)throw new Error('Could not confirm delivery. Keep your clips and try again.');
    const payload=await response.json();if(payload.success!==true)throw new Error(payload.error||'Unable to save your request.');
    clearPreviews();form.reset();clips.setCustomValidity('');delete form.dataset.submissionId;clipStatus.textContent='No clips selected';
    result.textContent='Your clips and request are saved. The team will confirm the price and delivery date.';
    furthest=0;saved=true;
  }catch(error){result.textContent=error.name==='TimeoutError'?'Delivery could not be confirmed. Try again with the same details; the submission ID prevents duplicates.':error.message;}
  finally{fields.forEach((field,index)=>{field.disabled=disabled[index];});if(saved)goStep(0);}
});
if(endpoint){document.getElementById('request-submit').textContent='Send clips for editing';document.getElementById('request-mode-note').textContent='Your clips are sent privately to the Reel Wala team. Editing starts after the price and delivery date are confirmed.';}
