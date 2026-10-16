import React from 'react';
import { createRoot } from 'react-dom/client';
import WorkSpotlightCard from './components/WorkSpotlightCard.jsx';
import './our-work.css';

function selectCategory(category){window.dispatchEvent(new CustomEvent('reel-wala:category',{detail:category}));}

function ServiceDetails({items}){
  return <div className="our-work-details"><div><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></div></div>;
}

function ReelEditGraphic(){
  return <div className="our-work-edit-graphic" aria-hidden="true">
    <div className="our-work-edit-frame">{[0,1,2].map(index=><span key={index}><svg viewBox={`${index%2*3} ${Math.floor(index/2)*4} 3 4`} preserveAspectRatio="xMidYMid slice"><image href="assets/editing-editorial-story.png" width="6" height="8" preserveAspectRatio="none"/></svg></span>)}</div>
    <div className="our-work-edit-timeline">
      {[.3,.6,.8,.4,1,.6,.9,.5,.8,.4,.7,.9,.5,.7,.3,.6,.9,.5,.4,.7].map((height,index)=><i key={index} style={{height:`${height*100}%`}}/>)}
      <b/>
    </div>
  </div>;
}

function OurWork(){
  return <div className="our-work-bento">
    <WorkSpotlightCard className="our-work-celebrations" href="#event-reels" onClick={()=>selectCategory('weddings')}>
      <img src="assets/wedding.webp" alt="An Indian couple celebrating their wedding" loading="lazy" width="1536" height="1024" />
      <div className="our-work-card-copy"><h3>Weddings &amp;<br/>celebrations</h3>
        <ServiceDetails items={['Birthdays & anniversaries','Engagements & weddings','Haldi, mehendi & sangeet','Receptions','Private celebrations']}/>
        <span className="our-work-card-action">View reels</span></div>
    </WorkSpotlightCard>
    <WorkSpotlightCard className="our-work-festivals" href="#event-reels" onClick={()=>selectCategory('festivals')}>
      <img src="assets/culture.webp" alt="Friends celebrating at a live festival" loading="lazy" width="1536" height="1024" />
      <div className="our-work-card-copy"><h3>Festivals &amp;<br/>college events</h3>
        <ServiceDetails items={['Holi & Diwali celebrations','Navratri & cultural events','College fests & freshers','Farewells & annual days','Concerts & stage shows']}/>
        <span className="our-work-card-action">View reels</span></div>
    </WorkSpotlightCard>
    <WorkSpotlightCard className="our-work-corporate" href="#event-reels" onClick={()=>selectCategory('corporate')}>
      <img src="assets/corporate.webp" alt="A speaker and team at a corporate event" loading="lazy" width="1536" height="1024" />
      <div className="our-work-card-copy"><h3>Corporate events</h3>
        <ServiceDetails items={['Product launches','Conferences & talks','Team celebrations','Awards nights']}/>
        <span className="our-work-card-action">View reels</span></div>
    </WorkSpotlightCard>
    <WorkSpotlightCard className="our-work-editing" href="edit-reel.html">
      <ReelEditGraphic/>
      <div className="our-work-card-copy"><h3>Reel editing</h3>
        <ServiceDetails items={['3–4 clips into one reel','Colour, music & transitions','Clean, cinematic or high energy']}/>
        <span className="our-work-card-action">Choose your clips</span></div>
    </WorkSpotlightCard>
  </div>;
}
const root=document.getElementById('our-work-root');
if(root)createRoot(root).render(<OurWork/>);
