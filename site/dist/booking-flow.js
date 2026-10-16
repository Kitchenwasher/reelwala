(() => {
  const form=document.querySelector('#booking-form');
  if(!form)return;
  const panels=[...form.querySelectorAll('[data-booking-panel]')];
  const tabs=[...document.querySelectorAll('[data-booking-goto]')];
  const headings=['What’s the occasion?','Make it your kind of shoot.','Where can we reach you?'];
  const help=['Choose the event, then tell us when and where.','Choose your coverage. Pick a creator, or leave the match to us.','Check your plan and leave your contact details.'];
  const next=form.querySelector('#booking-next');
  const back=form.querySelector('#booking-back');
  const submit=form.querySelector('.form-submit-area');
  let current=0;

  const firstInvalid=panel=>[...panel.querySelectorAll('input,select,textarea')].find(field=>!field.disabled&&!field.checkValidity());
  function show(step,focus=true){
    current=step;
    panels.forEach((panel,index)=>panel.hidden=index!==step);
    tabs.forEach((tab,index)=>{
      if(index===step)tab.setAttribute('aria-current','step');else tab.removeAttribute('aria-current');
      tab.dataset.complete=String(index<step);
    });
    form.querySelector('#booking-step-title').textContent=headings[step];
    form.querySelector('#booking-step-help').textContent=help[step];
    form.querySelector('#booking-step-count').textContent=`STEP 0${step+1} / 03`;
    form.querySelector('#booking-progress-fill').style.width=`${(step+1)/3*100}%`;
    next.hidden=step===2;
    next.textContent=step===0?'Choose coverage':'Add your details';
    back.hidden=step===0;
    submit.hidden=step!==2;
    form.dataset.step=String(step);
    if(focus)form.querySelector('#booking-step-title').focus({preventScroll:true});
    syncChoices();
  }
  function navigate(target){
    if(target>current){
      for(let index=current;index<target;index++){
        const invalid=firstInvalid(panels[index]);
        if(invalid){show(index,false);window.ReelWalaValidation.report(invalid);return;}
      }
    }
    show(target);
  }
  function syncChoices(){
    form.querySelectorAll('.occasion-chip,.package-pill').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
    const state=window.ReelWalaBooking?.state;
    if(!state)return;
    const occasion=form.querySelector('.occasion-chip.active .chip-title')?.textContent||state.occasion;
    const date=state.isDateFlexible?'Flexible date':state.date?new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(new Date(state.date+'T12:00:00')):'Date to choose';
    form.querySelector('#booking-review-line').textContent=[occasion,state.plan?`${state.plan.family==='standard'?'Standard':'Select'} · ${state.plan.name} (sample)`:state.package,date,state.locality||'City to choose'].join(' · ');
  }
  next.addEventListener('click',()=>navigate(Math.min(2,current+1)));
  back.addEventListener('click',()=>navigate(Math.max(0,current-1)));
  tabs.forEach(tab=>tab.addEventListener('click',()=>navigate(Number(tab.dataset.bookingGoto))));
  document.addEventListener('reel-wala:booking-change',syncChoices);
  form.addEventListener('submit',event=>{
    if(current<2){event.preventDefault();event.stopImmediatePropagation();navigate(current+1);return;}
    for(let index=0;index<panels.length;index++){
      const invalid=firstInvalid(panels[index]);
      if(invalid){event.preventDefault();event.stopImmediatePropagation();show(index,false);window.ReelWalaValidation.report(invalid);return;}
    }
  },true);
  form.querySelector('#booking-step-count').setAttribute('aria-live','polite');
  form.setAttribute('aria-labelledby','booking-step-title');
  show(0,false);
})();
