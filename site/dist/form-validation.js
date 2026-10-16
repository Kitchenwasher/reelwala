(() => {
  const errors=new WeakMap();
  let sequence=0;
  const missing={name:'Enter your name.',email:'Enter your email address.',phone:'Enter your phone number.',locality:'Enter your city or locality.',device:'Choose your iPhone model.','date-picker-input':'Choose an event date.'};
  function message(field){
    const state=field.validity;
    if(state.customError)return field.validationMessage;
    if(state.valueMissing)return missing[field.name]||missing[field.id]||'Please complete this field.';
    if(state.typeMismatch&&field.type==='email')return 'Enter a valid email address, like you@example.com.';
    if(state.typeMismatch&&field.type==='url')return 'Enter a complete link, starting with https://.';
    if(state.patternMismatch&&field.type==='tel')return 'Enter a valid phone number, including the country code if needed.';
    if(state.rangeUnderflow&&field.type==='date')return 'Choose today or a later event date.';
    if(state.badInput&&field.type==='date')return 'Enter a complete event date.';
    if(state.tooLong)return `Keep this to ${field.maxLength} characters or fewer.`;
    if(state.tooShort)return `Use at least ${field.minLength} characters.`;
    return field.validationMessage||'Check this field and try again.';
  }
  function clear(field){
    const error=errors.get(field);
    if(!error)return;
    error.node.remove();
    const description=(field.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==error.node.id).join(' ');
    if(description)field.setAttribute('aria-describedby',description);else field.removeAttribute('aria-describedby');
    field.removeAttribute('aria-invalid');
    errors.delete(field);
  }
  function show(field){
    let error=errors.get(field);
    if(!error){
      const node=document.createElement('span'),icon=document.createElement('span'),copy=document.createElement('span');
      node.id=`reel-field-error-${++sequence}`;node.className='field-error-message';node.setAttribute('role','alert');
      icon.className='field-error-icon';icon.textContent='!';icon.setAttribute('aria-hidden','true');
      node.append(icon,copy);
      field.insertAdjacentElement('afterend',node);
      const description=field.getAttribute('aria-describedby');
      field.setAttribute('aria-describedby',[description,node.id].filter(Boolean).join(' '));
      error={node,copy};errors.set(field,error);
    }
    error.copy.textContent=message(field);
    field.setAttribute('aria-invalid','true');
  }
  function report(target){
    if(!target)return false;
    const fields=target.tagName==='FORM'?[...target.querySelectorAll('input,select,textarea')]:[target];
    let first=null;
    for(const field of fields){
      if(!field.willValidate||field.validity.valid){clear(field);continue;}
      show(field);first??=field;
    }
    first?.focus();
    return !first;
  }
  // Cancel native bubbles, including checks made by existing custom file validators.
  document.addEventListener('invalid',event=>{event.preventDefault();show(event.target);},true);
  for(const type of ['input','change'])document.addEventListener(type,event=>{
    const field=event.target;
    if(!errors.has(field))return;
    queueMicrotask(()=>{if(!field.willValidate||field.validity.valid)clear(field);else show(field);});
  });
  document.addEventListener('reset',event=>event.target.querySelectorAll('input,select,textarea').forEach(clear),true);
  window.ReelWalaValidation={report,clear};
})();
