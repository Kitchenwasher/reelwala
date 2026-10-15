const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const endpoint = window.REEL_WALA_CONFIG?.sheetsEndpoint || '';
const mobile = matchMedia('(max-width: 700px)');
const deviceInput = $('#creator-form input[name="device"]');
const deviceSelect = document.createElement('select');
deviceSelect.name = 'device';deviceSelect.required = true;
const modelNames = ['iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max','iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 16e','iPhone 17','iPhone 17 Pro','iPhone 17 Pro Max','iPhone Air','iPhone 17e','iPhone 18 Pro','iPhone 18 Pro Max'];
deviceSelect.append(new Option('Select your iPhone model',''), ...modelNames.map(name=>new Option(name,name)));
deviceInput.replaceWith(deviceSelect);
const uploadFields = document.createElement('div');uploadFields.className='portfolio-uploads full';
uploadFields.innerHTML=`<label>Choose your best 5 photos<input type="file" name="photos" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple required><small>Choose five photos. Preview selection only; files stay on your device.</small></label><label>Choose up to 2 edited videos <span class="optional">(optional)</span><input type="file" name="videos" accept="video/mp4,video/quicktime,video/webm" multiple><small>Optional: select one or two examples of your edits.</small></label>`;
$('#creator-form .form-grid').append(uploadFields);
const photoInput = $('#creator-form input[name="photos"]');const videoInput = $('#creator-form input[name="videos"]');
photoInput.addEventListener('change',()=>photoInput.setCustomValidity(photoInput.files.length === 5?'':'Please choose exactly five photos.'));
videoInput.addEventListener('change',()=>videoInput.setCustomValidity(videoInput.files.length <= 2?'':'Please choose no more than two videos.'));
const imagePath = name => (name && (name.startsWith('http://') || name.startsWith('https://'))) ? name : `assets/${name}.webp`;
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  $('#navigation').classList.toggle('open', open);
});
function closeMenu() {menu.setAttribute('aria-expanded', 'false');menu.setAttribute('aria-label', 'Open menu');$('#navigation').classList.remove('open');}
$$('#navigation a').forEach(a => a.addEventListener('click', closeMenu));
$$('[data-open]').forEach(button => button.addEventListener('click', () => {closeMenu();document.getElementById(button.dataset.open).showModal();}));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if (event.target === dialog) {const rect = dialog.getBoundingClientRect();if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();}});
});
const imageDialog = $('#image-dialog');
function openImage(name, title, category) {
  $('#lightbox-image').src = imagePath(name);
  $('#lightbox-image').alt = title;
  $('#lightbox-title').textContent = title;
  $('#lightbox-category').textContent = category;
  imageDialog.showModal();
}
$$('.work-card').forEach(button => button.addEventListener('click', () => openImage(button.dataset.image,button.dataset.title,button.dataset.category)));
$('#lightbox-book').addEventListener('click', () => imageDialog.close());
let framePending = false;
function renderScroll() {
  framePending = false;
  const hero = $('.hero');const y = scrollY;
  if (!reducedMotion.matches && hero && y < hero.offsetHeight) {
    const p = Math.min(y/hero.offsetHeight,1);
    const gm = $('.gimbal'); if (gm) gm.style.transform = `translateY(${p*35}px) rotate(${p*-8}deg) rotateY(${p*12}deg)`;
    const p1 = $('.photo-one'); if (p1) p1.style.transform = `translateY(${p*-85}px) rotate(${-10+p*5}deg)`;
    const p2 = $('.photo-two'); if (p2) p2.style.transform = `translateY(${p*-45}px) rotate(${9-p*5}deg)`;
    const p3 = $('.photo-three'); if (p3) p3.style.transform = `translateY(${p*-100}px) rotate(${-7+p*4}deg)`;
  }
}
window.addEventListener('scroll',() => {if(!framePending){framePending=true;requestAnimationFrame(renderScroll);}},{passive:true});
window.addEventListener('resize',renderScroll);
renderScroll();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
$$('.work .section-top,.work h2,.work-strip,.price-card,.booking-copy,.creator-banner h2').forEach(element => {element.classList.add('reveal');observer.observe(element);});
const galleryData = [
  {image:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80&auto=format&fit=crop',title:'Sunlit vows & dinner laughter'},
  {image:'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&q=80&auto=format&fit=crop',title:'Celebrating the people behind it'},
  {image:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80&auto=format&fit=crop',title:'The feeling you keep'},
  {image:'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=900&q=80&auto=format&fit=crop',title:'One more song. One more memory.'},
  {image:'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80&auto=format&fit=crop',title:'All your favourite people'}
];
let galleryIndex = 2;
const cardsRoot = $('.replay-cards');
galleryData.forEach((item,i) => {const button = document.createElement('button');button.className='replay-card';button.setAttribute('aria-label',`View ${item.title}`);const img = document.createElement('img');img.src=imagePath(item.image);img.alt=item.title;img.loading='lazy';button.append(img);button.addEventListener('click',() => {if(didDrag)return;if(galleryIndex===i)openImage(item.image,item.title,'THE FEELING, ON REPEAT');else{galleryIndex=i;renderGallery();}});cardsRoot.append(button);});
function renderGallery() {
  $$('.replay-card').forEach((card,i) => {
    let offset = (i-galleryIndex+5)%5;if(offset>2)offset-=5;
    const angle = offset*(mobile.matches?34:31);const rad = angle*Math.PI/180;
    const x = Math.sin(rad)*(mobile.matches?210:$('.replay-stage').clientWidth*.44);
    const scale = 1-Math.abs(offset)*.17;
    card.style.transform=`translateX(${x}px) translateY(${Math.abs(offset)*10}px) rotateY(${-angle*.7}deg) scale(${scale})`;
    card.style.zIndex=String(5-Math.abs(offset));card.style.filter=`saturate(${1-Math.abs(offset)*.12})`;
    card.setAttribute('aria-pressed',String(offset===0));
  });
  $('.replay-caption').textContent=galleryData[galleryIndex].title;
}
function moveGallery(direction){galleryIndex=(galleryIndex+direction+galleryData.length)%galleryData.length;renderGallery();}
$('#replay-prev').addEventListener('click',()=>moveGallery(-1));$('#replay-next').addEventListener('click',()=>moveGallery(1));
const stage=$('.replay-stage');let pointerStart=null,didDrag=false;
stage.addEventListener('pointerdown',event=>{pointerStart={x:event.clientX,y:event.clientY};didDrag=false;});
stage.addEventListener('pointerup',event=>{if(!pointerStart)return;const dx=event.clientX-pointerStart.x;const dy=event.clientY-pointerStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){didDrag=true;moveGallery(dx<0?1:-1);setTimeout(()=>didDrag=false,100);}pointerStart=null;});
stage.addEventListener('pointercancel',()=>pointerStart=null);
stage.addEventListener('dragstart',event=>event.preventDefault());
stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveGallery(event.key==='ArrowRight'?1:-1);}});
window.addEventListener('resize',renderGallery);renderGallery();
// ============================================================================
// Intelligent Self-Building Booking & Creator Selection Controller
// ============================================================================

const CREATORS_LIST = [
  {
    id: 'aarav-sharma',
    name: 'Aarav Sharma',
    role: 'Lead Reel Director',
    city: 'Mumbai',
    category: 'weddings',
    style: 'Candid Celebrations & Emotional Arcs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'kabir-sen',
    name: 'Kabir Sen',
    role: 'Cinematic Videographer',
    city: 'Delhi NCR',
    category: 'nightlife',
    style: 'Low-Light Neon & High Energy Motion',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'ananya-iyer',
    name: 'Ananya Iyer',
    role: 'Visual Storyteller',
    city: 'Pune',
    category: 'weddings',
    style: 'Aesthetic Rituals & Micro-Expressions',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'rohan-mehta',
    name: 'Rohan Mehta',
    role: 'Gimbal & Motion Artist',
    city: 'Bengaluru',
    category: 'festivals',
    style: 'Dynamic Speed Ramps & Choreography',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'devika-roy',
    name: 'Devika Roy',
    role: 'Colorist & Wedding Reeler',
    city: 'Kolkata',
    category: 'weddings',
    style: 'Warm Film Stock Palettes & Traditional Rites',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'vikram-malhotra',
    name: 'Vikram Malhotra',
    role: 'Festival & Concert Reeler',
    city: 'Goa',
    category: 'festivals',
    style: 'Live Crowd Frenzy & Stage Pyrotechnics',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'meera-nair',
    name: 'Meera Nair',
    role: 'Culture & Lifestyle Reeler',
    city: 'Hyderabad',
    category: 'travel',
    style: 'Sunsets, Food & Candid Street Beats',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80&auto=format&fit=crop'
  },
  {
    id: 'tanya-sengupta',
    name: 'Tanya Sengupta',
    role: 'Fashion & Brand Reeler',
    city: 'Jaipur',
    category: 'nightlife',
    style: 'Editorial Silhouette & Slow-Mo Glamour',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80&auto=format&fit=crop'
  }
];

const ReelWalaBooking = {
  state: {
    occasion: 'Wedding / private celebration',
    package: 'Standard',
    creator: null,
    inspiration: null,
    isDateFlexible: false,
    date: '',
    locality: ''
  },

  init() {
    this.setupDateLogic();
    this.setupOccasionChips();
    this.setupPackagePills();
    this.setupCreatorPicker();
    this.setupCityChips();
    this.setupNotesAccordion();
    this.setupPricingListeners();
    this.renderBlueprint();
  },

  setupDateLogic() {
    const dateInput = $('#date-picker-input');
    const hiddenDate = $('#field-date');
    const today = new Date();
    const localDay = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (dateInput) {
      dateInput.min = localDay;
      dateInput.addEventListener('change', () => {
        if (!this.state.isDateFlexible) {
          if (hiddenDate) hiddenDate.value = dateInput.value;
          this.state.date = dateInput.value;
          this.renderBlueprint();
        }
      });
    }

    const flexToggle = $('#date-flex-toggle');
    const flexNotice = $('#flex-date-notice');
    if (flexToggle) {
      flexToggle.addEventListener('click', () => {
        this.state.isDateFlexible = !this.state.isDateFlexible;
        flexToggle.classList.toggle('active', this.state.isDateFlexible);
        flexToggle.setAttribute('aria-pressed', String(this.state.isDateFlexible));
        if (flexNotice) flexNotice.style.display = this.state.isDateFlexible ? 'block' : 'none';

        if (this.state.isDateFlexible) {
          if (dateInput) {
            dateInput.required = false;
            dateInput.disabled = true;
            dateInput.style.opacity = '0.5';
          }
          const future = new Date(today.getTime() + 30 * 86400000);
          const fallbackDate = future.toISOString().slice(0, 10);
          if (hiddenDate) hiddenDate.value = fallbackDate;
          this.state.date = 'Flexible planning';
        } else {
          if (dateInput) {
            dateInput.disabled = false;
            dateInput.style.opacity = '1';
            dateInput.required = true;
            if (hiddenDate) hiddenDate.value = dateInput.value;
            this.state.date = dateInput.value;
          }
        }
        this.renderBlueprint();
      });
    }
  },

  setupOccasionChips() {
    const chips = $$('.occasion-chip');
    const hiddenOccasion = $('#field-occasion');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.dataset.occasion;
        if (hiddenOccasion) hiddenOccasion.value = val;
        this.state.occasion = val;
        this.renderBlueprint();
      });
    });
  },

  setOccasion(occasionValue) {
    this.state.occasion = occasionValue;
    const hiddenOccasion = $('#field-occasion');
    if (hiddenOccasion) hiddenOccasion.value = occasionValue;
    $$('.occasion-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.occasion === occasionValue);
    });
    this.renderBlueprint();
  },

  setupPackagePills() {
    const pills = $$('.package-pill');
    const hiddenPackage = $('#field-package');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const pkg = pill.dataset.pkg;
        if (hiddenPackage) hiddenPackage.value = pkg;
        this.state.package = pkg;
        this.renderBlueprint();
      });
    });
  },

  setPackage(pkgValue) {
    this.state.package = pkgValue;
    const hiddenPackage = $('#field-package');
    if (hiddenPackage) hiddenPackage.value = pkgValue;
    $$('.package-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.pkg === pkgValue);
    });
    this.renderBlueprint();
  },

  setupCreatorPicker() {
    const pickerDialog = $('#creator-picker-dialog');
    const grid = $('#picker-creators-grid');
    const openBtn = $('#open-creator-picker');
    const changeTrigger = $('#creator-change-trigger');
    const teamMatchCard = $('#picker-choose-team-match');

    const renderGrid = (filter = 'all') => {
      if (!grid) return;
      const filtered = filter === 'all'
        ? CREATORS_LIST
        : CREATORS_LIST.filter(c => c.category === filter);

      grid.innerHTML = filtered.map(c => {
        const isSelected = this.state.creator && this.state.creator.id === c.id;
        return `
          <div class="picker-creator-card ${isSelected ? 'selected' : ''}" data-id="${c.id}">
            <div class="p-card-top">
              <div class="p-card-avatar"><img src="${c.avatar}" alt="${c.name}" loading="lazy"></div>
              <div class="p-card-meta">
                <strong>${c.name}</strong>
                <span>${c.role} · ${c.city}</span>
              </div>
            </div>
            <p class="p-card-desc">Signature: ${c.style}</p>
            <button type="button" class="picker-select-btn ${isSelected ? 'active-state' : ''}" data-select-id="${c.id}">
              ${isSelected ? 'Selected ✓' : 'Select Director'}
            </button>
          </div>
        `;
      }).join('');

      $$('.picker-select-btn', grid).forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const creator = CREATORS_LIST.find(c => c.id === btn.dataset.selectId);
          if (creator) this.setCreator(creator);
          if (pickerDialog) pickerDialog.close();
        });
      });

      $$('.picker-creator-card', grid).forEach(card => {
        card.addEventListener('click', () => {
          const creator = CREATORS_LIST.find(c => c.id === card.dataset.id);
          if (creator) this.setCreator(creator);
          if (pickerDialog) pickerDialog.close();
        });
      });
    };

    renderGrid('all');

    $$('.picker-filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.picker-filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGrid(btn.dataset.filter);
      });
    });

    if (openBtn && pickerDialog) openBtn.addEventListener('click', () => { renderGrid('all'); pickerDialog.showModal(); });
    if (changeTrigger && pickerDialog) changeTrigger.addEventListener('click', () => { renderGrid('all'); pickerDialog.showModal(); });

    if (teamMatchCard) {
      teamMatchCard.addEventListener('click', () => {
        this.setCreator(null);
        if (pickerDialog) pickerDialog.close();
      });
    }
  },

  setCreator(creatorObj) {
    this.state.creator = creatorObj;
    const nameEl = $('#creator-card-name');
    const descEl = $('#creator-card-desc');
    const badgeEl = $('#creator-badge');
    const avatarWrap = $('#creator-avatar-wrap');
    const hiddenCreator = $('#field-creator');

    if (creatorObj) {
      if (nameEl) nameEl.textContent = creatorObj.name;
      if (descEl) descEl.textContent = `${creatorObj.role} · ${creatorObj.city} (${creatorObj.style})`;
      if (badgeEl) badgeEl.textContent = 'Director Chosen';
      if (avatarWrap) avatarWrap.innerHTML = `<img src="${creatorObj.avatar}" alt="${creatorObj.name}">`;
      if (hiddenCreator) hiddenCreator.value = `${creatorObj.name} (${creatorObj.role} · ${creatorObj.city})`;
    } else {
      if (nameEl) nameEl.textContent = 'The Reel Wala Team Match';
      if (descEl) descEl.textContent = 'We pair you with the best available director for your occasion & city.';
      if (badgeEl) badgeEl.textContent = 'Recommended';
      if (avatarWrap) avatarWrap.innerHTML = `<span class="team-sparkle">✨</span>`;
      if (hiddenCreator) hiddenCreator.value = 'The Reel Wala Team Match';
    }
    this.renderBlueprint();
  },

  setInspiration(reelObj) {
    this.state.inspiration = reelObj;
    const banner = $('#inspiration-banner');
    const thumb = $('#inspiration-img');
    const title = $('#inspiration-title');
    const subtitle = $('#inspiration-subtitle');
    const hiddenInspiration = $('#field-inspiration');

    if (reelObj && banner) {
      if (thumb) thumb.src = reelObj.image || '';
      if (title) title.textContent = reelObj.title || 'Inspiration Reel';
      if (subtitle) subtitle.textContent = reelObj.subtitle || (reelObj.tag ? `Tag: ${reelObj.tag}` : '');
      if (hiddenInspiration) hiddenInspiration.value = `${reelObj.title} (${reelObj.subtitle || ''})`;
      banner.style.display = 'flex';
      if (reelObj.occasion) this.setOccasion(reelObj.occasion);
    } else if (banner) {
      banner.style.display = 'none';
      if (hiddenInspiration) hiddenInspiration.value = '';
    }
    this.renderBlueprint();
  },

  setupCityChips() {
    const localityInput = $('#input-locality');
    $$('.city-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (localityInput) {
          localityInput.value = chip.dataset.city;
          this.state.locality = chip.dataset.city;
          this.renderBlueprint();
        }
      });
    });
    if (localityInput) {
      localityInput.addEventListener('input', () => {
        this.state.locality = localityInput.value;
        this.renderBlueprint();
      });
    }
  },

  setupNotesAccordion() {
    const trigger = $('#notes-trigger');
    const content = $('#notes-content');
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        const ch = $('.chevron', trigger);
        if (ch) ch.textContent = isOpen ? '▾' : '▴';
      });
    }

    const clearInsp = $('#inspiration-clear');
    if (clearInsp) {
      clearInsp.addEventListener('click', () => {
        this.setInspiration(null);
      });
    }
  },

  setupPricingListeners() {
    $$('[data-package]').forEach(link => {
      link.addEventListener('click', () => {
        this.setPackage(link.dataset.package);
      });
    });
  },

  renderBlueprint() {
    const itemsEl = $('#blueprint-items');
    const statusEl = $('#blueprint-status');
    if (!itemsEl) return;

    const occasionLabels = {
      'Wedding / private celebration': 'Wedding & Celebration',
      'Social / cultural event': 'Festival & Concert',
      'Corporate event': 'Corporate Event',
      'Something else': 'Bespoke Celebration'
    };

    const chips = [
      { icon: '💍', text: occasionLabels[this.state.occasion] || this.state.occasion },
      { icon: '📦', text: `${this.state.package} Tier` },
      { icon: '🎥', text: this.state.creator ? this.state.creator.name : 'Team Match (Best Fit)' }
    ];

    if (this.state.inspiration) {
      chips.push({ icon: '🎬', text: `Inspired: ${this.state.inspiration.title}` });
    }

    if (this.state.isDateFlexible) {
      chips.push({ icon: '🗓️', text: 'Timing: Flexible planning' });
    } else if (this.state.date) {
      chips.push({ icon: '🗓️', text: `Date: ${this.state.date}` });
    }

    if (this.state.locality) {
      chips.push({ icon: '📍', text: `City: ${this.state.locality}` });
    }

    itemsEl.innerHTML = chips.map(c => `
      <div class="blueprint-chip">
        <span class="bp-icon">${c.icon}</span>
        <span class="bp-text">${c.text}</span>
      </div>
    `).join('');

    if (statusEl) {
      statusEl.textContent = `${chips.length} preferences active`;
    }
  }
};

window.ReelWalaBooking = ReelWalaBooking;
ReelWalaBooking.init();

function downloadEnquiry(form, kind) {
  if (!form.reportValidity()) return;
  const data = {};
  for (const [key, value] of new FormData(form)) {
    if (value instanceof File) {
      if (value.name) data[key] = data[key] ? `${data[key]}, ${value.name}` : value.name;
    } else {
      data[key] = value;
    }
  }

  // Ensure date has a value if flexible was selected
  if (kind === 'booking' && ReelWalaBooking.state.isDateFlexible) {
    data.date = `${data.date || 'TBD'} (Flexible planning)`;
  }

  // Enrich notes with creator, inspiration, and date flexibility
  let enrichedNotes = data.notes || '';
  if (ReelWalaBooking.state.creator) {
    enrichedNotes = `[Director: ${ReelWalaBooking.state.creator.name} (${ReelWalaBooking.state.creator.role} · ${ReelWalaBooking.state.creator.city})]\n` + enrichedNotes;
  }
  if (ReelWalaBooking.state.inspiration) {
    enrichedNotes = `[Inspiration: ${ReelWalaBooking.state.inspiration.title}]\n` + enrichedNotes;
  }
  if (ReelWalaBooking.state.isDateFlexible) {
    enrichedNotes = `[Timing: Date is flexible / planning ahead]\n` + enrichedNotes;
  }
  data.notes = enrichedNotes.trim();

  const lines = [
    `THE REEL WALA — ${kind}`,
    'Prepared locally. Not submitted or confirmed.',
    '',
    ...Object.entries(data).map(([key, value]) => `${key}: ${value}`)
  ];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `reel-wala-${kind.toLowerCase().replaceAll(' ', '-')}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('.form-status', form).textContent = 'Your draft has been downloaded. No information was sent. Keep it ready for the Reel Wala team.';
}

async function sendEnquiry(form, kind) {
  if (!endpoint) return downloadEnquiry(form, kind === 'booking' ? 'Shoot enquiry' : 'Creator application');
  if (!form.reportValidity()) return;
  const button = $('button[type="submit"]', form);
  if (button.disabled) return;
  const status = $('.form-status', form);
  const data = {};
  const uploads = [];
  const submissionId = form.dataset.submissionId || (form.dataset.submissionId = crypto.randomUUID());
  button.disabled = true;
  status.textContent = 'Sending your details…';

  try {
    let total = 0;
    // Prepare enriched notes before creating FormData
    if (kind === 'booking') {
      const notesField = $('#input-notes');
      if (notesField) {
        let prefix = '';
        if (ReelWalaBooking.state.creator) {
          prefix += `[Director: ${ReelWalaBooking.state.creator.name} (${ReelWalaBooking.state.creator.role} · ${ReelWalaBooking.state.creator.city})] `;
        }
        if (ReelWalaBooking.state.inspiration) {
          prefix += `[Inspiration: ${ReelWalaBooking.state.inspiration.title}] `;
        }
        if (ReelWalaBooking.state.isDateFlexible) {
          prefix += `[Date flexible] `;
        }
        if (prefix && !notesField.value.startsWith('[')) {
          notesField.value = `${prefix}\n${notesField.value}`.trim();
        }
      }
    }

    for (const [key, value] of new FormData(form)) {
      if (value instanceof File) {
        if (!value.name) continue;
        const fileKind = key === 'photos' ? 'photo' : 'video';
        const limit = fileKind === 'photo' ? 4000000 : 10000000;
        if (value.size > limit) throw new Error('Photos must be under 4 MB and videos under 10 MB.');
        total += value.size;
        if (total > 25000000) throw new Error('Keep portfolio files under 25 MB combined.');
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Unable to read a selected file.'));
          reader.readAsDataURL(value);
        });
        uploads.push({ name: value.name, mime: value.type, data: base64, kind: fileKind });
      } else {
        data[key] = value;
      }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ kind, submissionId, data, uploads, website: data.website || '' }),
      signal: AbortSignal.timeout(90000)
    });
    if (!response.ok) throw new Error('Could not confirm delivery. Keep your details and try again.');
    const result = await response.json();
    if (result.success !== true) throw new Error(result.error || 'Unable to save your request.');
    status.textContent = kind === 'booking'
      ? 'Your enquiry is saved. The team will follow up to confirm your shoot.'
      : 'Your application is saved. The team will be in touch about the next step.';
    form.reset();
    delete form.dataset.submissionId;
  } catch (error) {
    status.textContent = error.name === 'TimeoutError'
      ? 'Delivery could not be confirmed. Try again with the same details; the submission ID prevents duplicates.'
      : error.message;
  } finally {
    button.disabled = false;
  }
}

if (endpoint) {
  $('#booking-form button[type="submit"]').innerHTML = 'Send my enquiry <span>↗</span>';
  $('#creator-form button[type="submit"]').innerHTML = 'Send my application <span>↗</span>';
  $('#booking-form .form-note').textContent = 'Your details are sent securely to the Reel Wala team. A booking is final only after confirmation.';
  $('#creator-form .form-note').textContent = 'Your application and selected portfolio files are sent to the Reel Wala team for review.';
  $$('.portfolio-uploads small').forEach((small, i) => small.textContent = i === 0 ? 'Five photos, up to 4 MB each.' : 'Optional: up to two videos, 10 MB each. All files combined: 25 MB maximum.');
}

[$('#booking-form'), $('#creator-form')].forEach(form => {
  if (!form) return;
  const trap = document.createElement('input');
  trap.name = 'website';
  trap.tabIndex = -1;
  trap.autocomplete = 'off';
  trap.className = 'honeypot';
  trap.setAttribute('aria-hidden', 'true');
  form.append(trap);
  form.addEventListener('input', () => { delete form.dataset.submissionId; });
});

const bForm = $('#booking-form');
if (bForm) bForm.addEventListener('submit', event => { event.preventDefault(); sendEnquiry(event.currentTarget, 'booking'); });
const cForm = $('#creator-form');
if (cForm) cForm.addEventListener('submit', event => { event.preventDefault(); sendEnquiry(event.currentTarget, 'creator'); });
$('#year').textContent=new Date().getFullYear();
