import React, {useLayoutEffect,useState} from 'react';
import { createRoot } from 'react-dom/client';
import TechText from './TechText.jsx';

function LogoTechText() {
  return (
    <TechText
      text="THE REEL WALA"
      fontFamily="'Oswald', sans-serif"
      fontWeight={600}
      fontSize={38}
      letterSpacing={-0.03}
      color="#171815"
      accentColor="#f35422"
      align="center"
      reach={100}
      softness={0.7}
      dashLength={3.5}
      dashGap={2}
      strokeWidth={1.5}
      lineStyle="dashed"
      reveal="letter"
      specks={12}
      selection={true}
      labels={true}
      draggable={false}
      bounce={0.4}
      sweep={true}
      speed={1}
      clickKick={true}
      intro="none"
      className="tech-text-navbar-logo"
    />
  );
}

function FooterWala({word}) {
  const [size,setSize]=useState(150);
  useLayoutEffect(()=>{
    const resize=()=>setSize(parseFloat(getComputedStyle(word.closest('.reel-footer-brand')).fontSize));
    const observer=new ResizeObserver(resize);observer.observe(word);resize();
    return ()=>observer.disconnect();
  },[word]);
  return <TechText text="WALA" fontFamily="'Oswald', sans-serif" fontWeight={600}
    fontSize={size} letterSpacing={-0.04} color="#f35422" accentColor="#f35422"
    reach={180} dashLength={4} dashGap={3} strokeWidth={1.5} lineStyle="dashed"
    reveal="letter" specks={12} selection={true} labels={true} draggable={false}
    bounce={0.4} sweep={true} speed={1} clickKick={true} intro="none" />;
}

function mountFooterWala(){
  document.querySelectorAll('.reel-footer-brand>span>span').forEach(word=>{
    if(word.dataset.techMounted)return;
    word.dataset.techMounted='true';
    const fallback=document.createElement('span');fallback.className='footer-wala-fallback';fallback.textContent=word.textContent;
    const host=document.createElement('span');host.className='footer-wala-effect';host.setAttribute('aria-hidden','true');
    word.replaceChildren(fallback,host);word.classList.add('footer-wala-tech');
    createRoot(host).render(<FooterWala word={word}/>);
  });
}

function mountLogo() {
  mountFooterWala();
  const container = document.getElementById('logo-tech-text-root');
  if (container && !container._reactRoot) {
    // Clear fallback static text so React can take over
    container.innerHTML = '';
    const root = createRoot(container);
    container._reactRoot = root;
    root.render(<LogoTechText />);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLogo);
} else {
  mountLogo();
}
