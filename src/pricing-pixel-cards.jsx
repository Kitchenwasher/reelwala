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
    booking.setPackage(plan.addon?booking.state.package:plan.bookingPackage);
    booking.state.plan={name:plan.name,family:plan.family,price:plan.price,pending:!!plan.pending,addon:!!plan.addon};
    const field=document.getElementById('field-plan');
    if(field)field.value=`${plan.family==='standard'?'Standard':'Premium'} · ${plan.name}${plan.price===null?' (price on enquiry)':` (${plan.price.toLocaleString('en-IN')} rupees${plan.addon?' per extra hour':''})`}${plan.pending?' · details to be confirmed':''}`;
    booking.renderBlueprint();
  }

  return <div className="packages-showcase" data-family={family}>
    <div className="package-family-tabs" role="tablist" aria-label="Package collection">
      {['standard','select'].map(name=><button
        type="button"
        key={name}
        id={`package-tab-${name}`}
        role="tab"
        aria-selected={family===name}
        aria-controls="package-collection"
        tabIndex={family===name?0:-1}
        onClick={()=>setFamily(name)}
        onKeyDown={event=>{
          if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
            event.preventDefault();
            const next=event.key==='Home'?'standard':event.key==='End'?'select':name==='standard'?'select':'standard';
            setFamily(next);
            document.getElementById(`package-tab-${next}`)?.focus();
          }
        }}
      >
        <span>{name==='standard'?'Standard packages':'Premium packages'}</span>
      </button>)}
    </div>

    <div className="price-grid package-collection" id="package-collection" role="tabpanel" aria-labelledby={`package-tab-${family}`}>
      {plans.map((plan,index)=><PricingMotionCard
        key={plan.id}
        order={index}
        featured={false}
        className=""
      >
        <div className="package-intro">
          <div className="package-card-top">
            <span>{plan.addon?'PER EXTRA SHOOT HOUR':family==='standard'?'STANDARD COVERAGE':'PREMIUM · DETAILS ON ENQUIRY'}</span>
            <span>{String(index+1).padStart(2,'0')}</span>
          </div>
          <h3>{plan.subtitle ? `${plan.name} (${plan.subtitle})` : plan.name}</h3>
          <AnimatedPackagePrice amount={plan.price}/>
          <p>{plan.description}</p>
        </div>
        <a
          className="button"
          href="#book"
          data-package={plan.bookingPackage}
          onClick={()=>select(plan)}
        >
          {plan.addon?'Add an hour':'Check availability'}
        </a>
        <div className="package-inclusions">
          <p>What’s included</p>
          <ul>{plan.features.map(feature=><li key={feature}>{feature}</li>)}</ul>
        </div>
      </PricingMotionCard>)}
    </div>
  </div>;
}

const container=document.getElementById('pricing-pixel-cards-root');
if(container&&!container._reactRoot){container._reactRoot=createRoot(container);container._reactRoot.render(<PricingPackages/>);}
