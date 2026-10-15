import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EVENT_ATLAS, EVENT_CATEGORIES, INDIA_EVENTS } from './india-events.mjs';
import './IndiaEventGallery.css';

function EventPhoto({ event }) {
  const x = (event.cell % 4) * 3;
  const y = Math.floor(event.cell / 4) * 4;
  return <svg className="india-event-photo" viewBox={`${x} ${y} 3 4`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${event.title} event inspiration`}>
    <image href={EVENT_ATLAS} width="12" height="8" preserveAspectRatio="none" />
  </svg>;
}

function WorkEventGallery() {
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const filtered = INDIA_EVENTS.filter(event => category === 'all' || event.category === category);
  useEffect(() => {
    if (selected && !dialog.current.open) dialog.current.showModal();
    if (!selected && dialog.current.open) dialog.current.close();
  }, [selected]);
  const card = event => <button className="india-event-card" key={event.id} type="button" onClick={() => setSelected(event)} aria-label={`View ${event.title.toLowerCase()} event inspiration`}>
    <EventPhoto event={event} />
    <span className="india-event-label">{event.title}</span>
  </button>;
  const columns = [[0], [1], [2, 5], [3, 6], [4], [7]];
  return <>
    <div className="india-event-filters" role="group" aria-label="Filter event reels">
      {EVENT_CATEGORIES.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} aria-controls="india-event-gallery" onClick={() => setCategory(item.id)}>{item.label}</button>)}
    </div>
    <div className={`india-event-gallery${category === 'all' ? '' : ' is-filtered'}`} id="india-event-gallery">
      {category === 'all' ? columns.map((indices, index) => <div className="india-event-column" key={index}>{indices.map(i => card(INDIA_EVENTS[i]))}</div>) : filtered.map(card)}
    </div>
    <span className="sr-only" role="status">{filtered.length} event examples</span>
    <dialog className="india-event-dialog" ref={dialog} onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) { const box = dialog.current.getBoundingClientRect();if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setSelected(null); } }} aria-labelledby="event-preview-heading">
      {selected && <>
        <button className="india-event-dialog-close" aria-label="Close event preview" onClick={() => setSelected(null)}>×</button>
        <EventPhoto event={selected} />
        <div className="india-event-dialog-info">
          <h3 id="event-preview-heading">{selected.title}</h3>
          <p>Generated event inspiration</p>
          <a className="button" href="#book" onClick={() => {
            const occasion = selected.category === 'corporate' ? 'Corporate event' : ['birthdays','weddings'].includes(selected.category) ? 'Wedding / private celebration' : 'Social / cultural event';
            window.ReelWalaBooking?.setInspiration({title:selected.title,subtitle:'Event inspiration',category:selected.category,occasion});
            setSelected(null);
          }}>Plan a shoot</a>
        </div>
      </>}
    </dialog>
  </>;
}

function mount() {
  const container = document.getElementById('work-drift-wall-root');
  if (container && !container._reactRoot) {
    container._reactRoot = createRoot(container);
    container._reactRoot.render(<WorkEventGallery />);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
