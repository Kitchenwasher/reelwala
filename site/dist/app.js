const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const endpoint = window.REEL_WALA_CONFIG?.sheetsEndpoint || '';
const header = $('.header');
const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', syncHeader, { passive: true });
window.addEventListener('pageshow', syncHeader);
syncHeader();
const creatorPortalUrl = window.REEL_WALA_CONFIG?.creatorPortalUrl;
if (creatorPortalUrl) {
  try {
    const destination = new URL(creatorPortalUrl, window.location.href);
    if (['https:', 'http:'].includes(destination.protocol)) $$('[data-creator-portal]').forEach(link => { link.href = destination.href; });
  } catch { /* Keep the local creator page when the configured URL is invalid. */ }
}
const imagePath = name => (name && (name.startsWith('http://') || name.startsWith('https://'))) ? name : `assets/${name}.webp`;
const menu = $('.menu-toggle');
if (menu) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const nav = $('#navigation');
    if (nav) nav.classList.toggle('open', open);
  });
}
function closeMenu() {
  if (menu) {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
  }
  const nav = $('#navigation');
  if (nav) nav.classList.remove('open');
}
$$('#navigation a, .nav-left a, .nav-right a').forEach(a => a.addEventListener('click', closeMenu));
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
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
$$('.work .section-top,.work h2,.work-strip,.price-card,.booking-copy,.creator-banner h2').forEach(element => {element.classList.add('reveal');observer.observe(element);});
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
      if (descEl) descEl.textContent = 'We’ll assign an available creator for your event.';
      if (badgeEl) badgeEl.textContent = 'Recommended';
      if (avatarWrap) avatarWrap.innerHTML = `<span class="team-sparkle"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg></span>`;
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
      'Something else': 'Other event'
    };

    const icons = {
      ring: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/></svg>`,
      pkg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
      cam: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`,
      clapper: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8"/><path d="m4 11h16"/><path d="m4 11 1.6-4.8a1 1 0 0 1 .95-.68h10.9a1 1 0 0 1 .95.68L20 11"/></svg>`,
      cal: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
      pin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
    };

    const chips = [
      { icon: icons.ring, text: occasionLabels[this.state.occasion] || this.state.occasion },
      { icon: icons.pkg, text: `${this.state.package} package` },
      { icon: icons.cam, text: this.state.creator ? this.state.creator.name : 'Assigned by the team' }
    ];

    if (this.state.inspiration) {
      chips.push({ icon: icons.clapper, text: `Inspired: ${this.state.inspiration.title}` });
    }

    if (this.state.isDateFlexible) {
      chips.push({ icon: icons.cal, text: 'Timing: Flexible planning' });
    } else if (this.state.date) {
      chips.push({ icon: icons.cal, text: `Date: ${this.state.date}` });
    }

    if (this.state.locality) {
      chips.push({ icon: icons.pin, text: `City: ${this.state.locality}` });
    }

    itemsEl.innerHTML = chips.map(c => `
      <div class="blueprint-chip">
        <span class="bp-icon">${c.icon}</span>
        <span class="bp-text">${c.text}</span>
      </div>
    `).join('');

    if (statusEl) {
      statusEl.textContent = `${chips.length} selections`;
    }
  }
};

window.ReelWalaBooking = ReelWalaBooking;
ReelWalaBooking.init();
const requestedCreatorId = new URLSearchParams(window.location.search).get('creator');
const requestedCreator = CREATORS_LIST.find(creator => creator.id === requestedCreatorId);
if (requestedCreator) ReelWalaBooking.setCreator(requestedCreator);

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
  if (kind === 'Shoot enquiry' && ReelWalaBooking.state.isDateFlexible) {
    data.date = `${data.date || 'TBD'} (Flexible planning)`;
  }

  // Enrich notes with creator, inspiration, and date flexibility
  let enrichedNotes = data.notes || '';
  if (kind === 'Shoot enquiry' && ReelWalaBooking.state.creator) {
    enrichedNotes = `[Director: ${ReelWalaBooking.state.creator.name} (${ReelWalaBooking.state.creator.role} · ${ReelWalaBooking.state.creator.city})]\n` + enrichedNotes;
  }
  if (kind === 'Shoot enquiry' && ReelWalaBooking.state.inspiration) {
    enrichedNotes = `[Inspiration: ${ReelWalaBooking.state.inspiration.title}]\n` + enrichedNotes;
  }
  if (kind === 'Shoot enquiry' && ReelWalaBooking.state.isDateFlexible) {
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
  if (!endpoint) return downloadEnquiry(form, kind === 'booking' ? 'Shoot enquiry' : kind === 'edit' ? 'Reel edit request' : 'Creator application');
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
        if (total > 25000000) throw new Error('Keep all selected files under 25 MB combined.');
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
      : kind === 'edit' ? 'Your clips and request are saved. The team will confirm the price and delivery date.'
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
  $('#booking-form button[type="submit"]').innerHTML = 'Send my enquiry';
  $('#booking-form .form-note').textContent = 'Your details are sent securely to the Reel Wala team. A booking is final only after confirmation.';
}

[$('#booking-form')].forEach(form => {
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
$('#year').textContent=new Date().getFullYear();
