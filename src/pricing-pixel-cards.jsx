import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import PricingMotionCard from './PricingMotionCard.jsx';
import AnimatedPackagePrice from './AnimatedPackagePrice.jsx';
import {PACKAGE_PLANS} from './package-plans.mjs';

function PricingPackages(){
  const [family,setFamily]=useState('standard');
  const plans=PACKAGE_PLANS.filter(plan=>plan.family===family);
  function select(plan){
    const booking=window.ReelWalaBooking;
    if(!booking)return;
    booking.setPackage(plan.bookingPackage);
    booking.state.plan={name:plan.name,family:plan.family,price:plan.price};
    const field=document.getElementById('field-plan');
    if(field)field.value=`${plan.family==='standard'?'Standard':'Select'} · ${plan.name} (sample price ₹${plan.price.toLocaleString('en-IN')})`;
    booking.renderBlueprint();
  }
  return <div className="packages-showcase" data-family={family}>
    <div className="package-family-tabs" role="tablist" aria-label="Package collection">
      {['standard','select'].map(name=><button type="button" key={name} id={`package-tab-${name}`} role="tab" aria-selected={family===name} aria-controls="package-collection" tabIndex={family===name?0:-1}
        onClick={()=>setFamily(name)} onKeyDown={event=>{
          if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
            event.preventDefault();const next=event.key==='Home'?'standard':event.key==='End'?'select':name==='standard'?'select':'standard';
            setFamily(next);document.getElementById(`package-tab-${next}`)?.focus();
          }
        }}><span>{name==='standard'?'Standard packages':'Select packages'}</span><small>{name==='standard'?'03':'04'}</small></button>)}
    </div>
    <p className="package-demo-note">Sample plans & prices · final coverage, rates and taxes to be confirmed.</p>
    <div className="price-grid package-collection" id="package-collection" role="tabpanel" aria-labelledby={`package-tab-${family}`}>
      {plans.map((plan,index)=><PricingMotionCard key={plan.id} order={index} className={plan.featured?'featured':''}>
        <div className="package-intro"><div className="package-card-top"><span>{family==='standard'?'EVENT SHOOT':'CELEBRATION COVERAGE'}</span><span>{String(index+1).padStart(2,'0')}</span></div>
          <h3>{plan.name}</h3><AnimatedPackagePrice amount={plan.price}/><p>{plan.description}</p>
        </div>
        <a className={`button ${plan.featured?'':'outline'}`} href="#book" data-package={plan.bookingPackage} onClick={()=>select(plan)}>Check availability</a>
        <div className="package-inclusions"><p>What’s included</p><ul>{plan.features.map(feature=><li key={feature}>{feature}</li>)}</ul></div>
      </PricingMotionCard>)}
    </div>
  </div>;
}
const container=document.getElementById('pricing-pixel-cards-root');
if(container&&!container._reactRoot){container._reactRoot=createRoot(container);container._reactRoot.render(<PricingPackages/>);}
