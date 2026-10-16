document.querySelectorAll('[data-footer-year]').forEach(element=>element.textContent=new Date().getFullYear());
document.querySelectorAll('.reel-footer').forEach(footer=>{
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(([entry])=>footer.dataset.active=String(entry.isIntersecting));
    observer.observe(footer);
  }
  footer.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=footer.getBoundingClientRect();
    footer.style.setProperty('--footer-x',`${(event.clientX-rect.left)/rect.width*100}%`);
  });
  footer.querySelector('[data-footer-top]')?.addEventListener('click',event=>{
    event.preventDefault();
    window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
});
