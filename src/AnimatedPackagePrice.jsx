import React, {useEffect,useRef,useState} from 'react';
import {formatRupees,priceAtTime} from './package-plans.mjs';

export default function AnimatedPackagePrice({amount}){
  const ref=useRef(null);
  const [value,setValue]=useState(()=>amount===null?null:matchMedia('(prefers-reduced-motion: reduce)').matches?amount:0);
  useEffect(()=>{
    if(amount===null)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,started=false,observer;
    const finish=()=>{cancelAnimationFrame(frame);setValue(amount);};
    const start=()=>{
      if(started)return;
      started=true;
      if(preference.matches){finish();return;}
      const began=performance.now();
      const tick=now=>{
        setValue(priceAtTime(amount,now-began));
        if(now-began<1250)frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    };
    const onPreference=()=>{if(preference.matches)finish();};
    preference.addEventListener('change',onPreference);
    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(([entry])=>{
        if(entry.isIntersecting)start();
        else if(started)finish();
      },{threshold:.4});
      observer.observe(ref.current);
    }else start();
    return ()=>{cancelAnimationFrame(frame);observer?.disconnect();preference.removeEventListener('change',onPreference);};
  },[amount]);
  return <div className="package-price" ref={ref}><span className="package-price-accessible">{amount===null?'Price on enquiry':`Price ${formatRupees(amount)}`}</span><span aria-hidden="true">{amount===null?'Enquire':formatRupees(value)}</span></div>;
}
