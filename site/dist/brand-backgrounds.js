// A single cached SVG motif re-used without extra canvases or stacking contexts.
// Preserve each section's existing gradients and background colour.
const shardSections=[...document.querySelectorAll('main > section:not(.hero), body > footer, .directory-main, .edit-page-main')];
const shardLayers=shardSections.filter(section=>!section.classList.contains('has-brand-shards')).map(section=>{
  const style=getComputedStyle(section);
  return {section,image:style.backgroundImage,size:style.backgroundSize,position:style.backgroundPosition,repeat:style.backgroundRepeat};
});
shardLayers.forEach(({section,image,size,position,repeat},index)=>{
  section.style.setProperty('--brand-original-image',image);
  section.style.setProperty('--brand-original-size',size);
  section.style.setProperty('--brand-original-position',position);
  section.style.setProperty('--brand-original-repeat',repeat);
  section.style.setProperty('--brand-shard-size',`${1050+(index%3)*160}px auto`);
  section.style.setProperty('--brand-shard-position',`${index%2?'right':'left'} ${-(index%4)*110}px`);
  section.classList.add('has-brand-shards');
});
