import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { hookLayout, clipFlight } from './edit-hook-layout.mjs';
import './editing-hook.css';

function Artwork({ index }) {
  return <svg viewBox={`${index%2*3} ${Math.floor(index/2)*4} 3 4`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <image href="assets/editing-editorial-story.png" width="6" height="8" preserveAspectRatio="none" />
  </svg>;
}

function EditingHook() {
  const stage = useRef(null), flyers = useRef([]), dot = useRef(null);
  const visible = useRef(false), moving = useRef(true), reduced = useRef(false);
  const geometry = useRef(null), displayed = useRef(3);
  const [layout,setLayout] = useState(null), [screen,setScreen] = useState({previous:3,current:3}), [paused,setPaused] = useState(false);
  useLayoutEffect(() => {
    const measure = () => {
      const box = stage.current.getBoundingClientRect();
      const next = hookLayout(box.width,box.height);
      geometry.current=next;setLayout(next);
    };
    const observer=new ResizeObserver(measure);observer.observe(stage.current);measure();
    return () => observer.disconnect();
  },[]);
  useEffect(() => {
    const query=matchMedia('(prefers-reduced-motion: reduce)');
    const preference=()=>{reduced.current=query.matches;stage.current.dataset.moving=String(moving.current&&!query.matches);};
    query.addEventListener('change',preference);preference();
    const observer=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting;stage.current.dataset.moving=String(entry.isIntersecting&&moving.current&&!reduced.current);});observer.observe(stage.current);
    let frame,last=performance.now(),elapsed=0;
    const animate=now=>{
      const dt=Math.min(now-last,50);last=now;
      if(visible.current&&!document.hidden&&moving.current&&!reduced.current&&geometry.current){
        elapsed+=dt;
        const index=Math.floor(elapsed/2600)%3;
        const phase=(elapsed%2600)/2600;
        const progress=Math.max(0,Math.min(1,(phase-.12)/.72));
        const {sources,reel}=geometry.current;
        const start=sources[index];
        const end={x:reel.x,y:reel.y};
        const position=clipFlight(start,end,progress);
        flyers.current.forEach((card,i)=>{
          if(!card)return;
          const active=i===index;
          card.style.opacity=active?String(Math.min(1,progress/.12)*Math.max(0,(1-progress)/.18)): '0';
          if(active){card.style.left=`${position.x}px`;card.style.top=`${position.y}px`;
            card.style.transform=`translate(-50%,-50%) rotate(${(-8+i*5)*(1-progress)}deg) scale(${1+progress*.35})`;}
        });
        dot.current.setAttribute('cx',String(position.x));dot.current.setAttribute('cy',String(position.y));
        dot.current.style.opacity=progress>0&&progress<1?'1':'0';
        if(phase>.75&&displayed.current!==index){displayed.current=index;setScreen(old=>({previous:old.current,current:index}));}
      }
      frame=requestAnimationFrame(animate);
    };
    frame=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();query.removeEventListener('change',preference);};
  },[]);
  const toggle=()=>{moving.current=!moving.current;setPaused(!moving.current);stage.current.dataset.moving=String(moving.current&&!reduced.current);};
  const boxStyle=box=>({left:box.x,top:box.y,width:box.width,height:box.height});
  return <div className="editing-hook-content">
    <div className="editing-hook-copy">
      <p className="eyebrow">Reel editing</p>
      <h2 id="edit-heading">3–4 clips.<br/><em>One polished reel.</em></h2>
      <p className="editing-hook-description">You shoot. Our editors handle the cut.</p>
      <a className="button" href="edit-reel.html">Choose your clips</a>
    </div>
    <div className="editing-hook-stage" ref={stage} role="group" aria-label="Illustration of three clips coming together into one professionally edited reel">
      {layout&&<>
        <svg className="editing-hook-paths" aria-hidden="true">
          {layout.sources.map((source,i)=>{
            const end={x:layout.reel.x,y:layout.reel.y};
            const bend=(end.x-source.x)*.55;
            return <path key={i} d={`M ${source.x} ${source.y} C ${source.x+bend} ${source.y},${end.x-bend*.4} ${end.y},${end.x} ${end.y}`}/>;
          })}
          <circle ref={dot} r="4" cx="0" cy="0" />
        </svg>
        {layout.sources.map((source,i)=><React.Fragment key={i}>
          <div className={`editing-hook-source source-${i}`} style={boxStyle(source)} aria-hidden="true"><span className="editing-hook-number">0{i+1}</span><Artwork index={i}/></div>
          <div className="editing-hook-flyer" ref={element=>{flyers.current[i]=element;}} style={{width:source.width,height:source.height}} aria-hidden="true"><Artwork index={i}/></div>
        </React.Fragment>)}
        <div className="editing-hook-output" style={boxStyle(layout.reel)} aria-hidden="true">
          <span className="editing-hook-output-label">Your reel</span>
          <Artwork index={screen.previous}/><div className="editing-hook-screen" key={screen.current}><Artwork index={screen.current}/></div>
          <span className="editing-hook-progress"><i key={screen.current}/></span>
        </div>
      </>}
      <button className="editing-hook-pause" type="button" aria-label={paused?'Play animation':'Pause animation'} aria-pressed={paused} onClick={toggle}>{paused?'▶':'Ⅱ'}</button>
    </div>
  </div>;
}
const container=document.getElementById('editing-hook-root');
if(container)createRoot(container).render(<EditingHook/>);
