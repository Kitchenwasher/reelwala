import {readFile,writeFile} from 'node:fs/promises';
import {SERVICE_CATALOGUE,CUSTOMER_WORKFLOW} from '../src/site-content.mjs';

const root=new URL('./dist/',import.meta.url);
const footer=`<footer class="reel-footer" aria-label="The Reel Wala">
  <div class="reel-footer-lead"><div><p class="reel-footer-kicker"><span></span> KEEP THE MOMENT</p><h2>Got a moment?</h2></div><a class="reel-footer-book" href="./#book">Let’s make it a reel<span aria-hidden="true" class="reel-footer-play"></span></a></div>
  <div class="reel-footer-grid">
    <div class="reel-footer-intro"><p>Event reels.<br>Made to be replayed.</p><span>Shot on iPhone 16 or newer.</span><div class="reel-footer-contact"><span>Email coming soon</span><span>hello@thereelwala.example</span></div></div>
    <nav aria-label="Explore"><h3>Explore</h3><a href="./#work">Our services</a><a href="gallery.html">Reel gallery</a><a href="creators.html">Our creators</a><a href="edit-reel.html">Reel editing</a></nav>
    <nav aria-label="The Reel Wala company"><h3>The Reel Wala</h3><a href="about.html">About us</a><a href="become-creator.html" data-creator-portal>Become a creator</a><a href="./#pricing">Packages</a><a href="./#book">Get in touch</a></nav>
    <nav aria-label="Policies"><h3>The details</h3><a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of service</a><a href="booking-policy.html">Booking & cancellations</a><a href="about.html#photo-credits">Photo credits</a></nav>
  </div>
  <a class="reel-footer-brand" href="./" aria-label="The Reel Wala home"><span>THE REEL <span>WALA</span></span><i aria-hidden="true"></i></a>
  <div class="reel-footer-film" aria-hidden="true"><div>${'<i></i>'.repeat(80)}</div></div>
  <div class="reel-footer-bottom"><span>© <span id="year" data-footer-year>2026</span> The Reel Wala</span><span>Life happens. Keep the feeling.</span><a href="#" data-footer-top>Back to top</a></div>
</footer>`;

const pages=[
  {slug:'about',title:'Behind the reels.',label:'About us',intro:'We capture the moments you’re busy living.',sections:[
    ['What we do','Your events, captured in reels. The Reel Wala covers private, corporate, social and cultural occasions, with event shoots on iPhone 16 or newer.'],
    ...SERVICE_CATALOGUE.map(({name,items})=>[name,items.join('; ')+'.']),
    ...CUSTOMER_WORKFLOW,
    ['Packages','Standard includes 4 complimentary colour-graded photos and reel delivery within 24 hours. Extended includes up to 4 hours of shoot time, 7 complimentary colour-graded photos and reel delivery within 24 hours. Extra shoot time is ₹1,000 per hour. Base prices, Premium details and taxes are confirmed with the team before booking.'],
    ['Already have the clips?','Send three or four videos through our reel-editing flow and choose an editing style. An editor handles the cut, colour and music according to the agreed brief.'],
    ['Create with us','Register, attend the workshop, receive shoots and get paid after shoots. Apply with an iPhone 16 or newer, your locality and five of your best photos. Up to two edited videos are optional. Assignments and payment terms are agreed with the team.']
  ]},
  {slug:'privacy',title:'Your moments. Your privacy.',label:'Privacy policy',intro:'What the website handles, and what happens when you share information.',sections:[
    ['Information you choose to share','Booking enquiries ask for contact details, event information and your brief. Creator applications ask for contact details, location, device, portfolio links and selected media. Editing requests ask for contact details, clips and editing preferences. Avoid including sensitive personal information that is not needed for the request.'],
    ['Drafts and online submissions','The forms currently download a draft to your device. Selecting files creates local previews; it does not upload them. A downloaded draft is not a submitted enquiry or a confirmed booking. If online submissions are enabled, the form will identify the sending action and show a result. Submitted information is used to respond to the request, assess an application or arrange the agreed service.'],
    ['Media and service providers','When online submission is enabled, our intake integration stores enquiry details in Google Sheets and uploaded media in private Google Drive folders for the team to handle. Hosting, fonts and image providers also receive technical information needed to deliver their services. Some gallery images load from external image providers.'],
    ['Cookies and technical information','The website’s application code does not set advertising cookies or use local storage for tracking. Your browser still makes requests to the hosting provider, Google Fonts and external image providers, which can receive information such as your IP address and browser details. Their own privacy policies apply to their services.'],
    ['Keeping and removing information','Downloaded drafts remain under your control on your own device. For information you have actually sent to the team, request access, correction or deletion through your confirmed team contact. Some records may need to remain for an active project, dispute or applicable recordkeeping requirement.'],
    ['Privacy contact','Our dedicated contact email is being set up. The address hello@thereelwala.example is a placeholder and does not accept messages. Until a working contact is published, use your existing confirmed team contact for any information you have already shared.']
  ]},
  {slug:'terms',title:'A little clarity. Better reels.',label:'Terms of service',intro:'The essentials for using this website and requesting a service.',sections:[
    ['Enquiries and confirmation','Browsing packages, downloading a draft or sending an enquiry does not confirm a booking. Availability, fees, shoot coverage, deliverables and any payment schedule must be agreed with the team before work begins. The website does not currently collect online payments.'],
    ['Your content','Only share footage, photos, music and portfolio links that you have permission to provide. Arrange appropriate permission from people and venues involved in a shoot. Tell the team about restrictions on filming or sharing before the event.'],
    ['Editing and delivery','Agree the reel length, style, music, delivery time and included revisions in your booking or editing brief. Delivery references on the website describe the offered service; the timing for your specific project is confirmed with the team. Additional changes or coverage may require a revised quote.'],
    ['Portfolio and website images','Service-card stock photos illustrate event categories and are credited on the About page. They are not presented as work from client bookings. Ask the team to confirm any portfolio-use permission for your own footage as part of your project agreement.'],
    ['Using the site','Do not send unlawful content, impersonate someone else, interfere with the website or submit another person’s private information without permission. Creator applications are reviewed and do not guarantee an assignment or income.'],
    ['Questions and changes','Confirm any project-specific terms directly with the team. These website terms may change as the service develops; the terms and quote agreed for your booking remain the reference for that project.']
  ]},
  {slug:'booking-policy',title:'Plan the moment.',label:'Booking & cancellations',intro:'Know what is agreed before your shoot or edit begins.',sections:[
    ['Before you book','Share the event date, location, timings and coverage you need. The team confirms creator availability, the package, deliverables, total quote and any advance payment directly. Keep the written confirmation for your records.'],
    ['Changing a date or cancelling','Contact the team as soon as your plans change. Rescheduling depends on creator availability. Any cancellation charge, refund eligibility, notice period or non-refundable amount must be stated in your written quote before payment; this site does not set a blanket refund percentage.'],
    ['Extra coverage','Longer shoots, extra hours, travel or additional edits need confirmation before they are added. The final agreed quote explains what is included and what costs extra.'],
    ['Editing requests','The team confirms the editing scope, price, delivery time and revision allowance before starting. If you want to stop or change an edit after work has started, contact the team to agree the next step and any applicable charge.'],
    ['Venue access and event changes','Share access restrictions, permissions, venue rules and schedule changes ahead of time. If the event or agreed coverage becomes impossible, contact the team promptly to discuss available alternatives.']
  ]}
];

const fonts='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Oswald:wght@600&display=swap';
for(const page of pages){
  const credits=page.slug==='about'?`<section id="photo-credits"><h2>Photography credits</h2><p>Service illustrations use licensed photographs by <a href="https://www.pexels.com/photo/smiling-newlywed-couple-16375834/">JeegzArt Photography</a>, <a href="https://unsplash.com/photos/a-large-crowd-of-people-at-a-concert-yleJ_3iLyIs">Tirth Jivani</a> and <a href="https://www.pexels.com/photo/group-of-people-watching-a-speaker-doing-a-presentation-7234414/">Pavel Danilyuk</a>. These photographs illustrate the services offered. The reel-editing artwork is an editorial illustration.</p></section>`:'';
  await writeFile(new URL(page.slug+'.html',root),`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f1e9"><title>${page.label} — The Reel Wala</title><link href="${fonts}" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=22"><link rel="stylesheet" href="typography.css?v=2"><link rel="stylesheet" href="footer.css?v=3"><script src="footer.js?v=1" defer></script><script type="module" src="logo-tech-text.bundle.js?v=8"></script></head><body><a class="skip-link" href="#main">Skip to content</a><header class="info-header"><a class="wordmark" href="./">THE REEL WALA</a><a href="./#book">Book a shoot</a></header><main class="info-page" id="main"><div class="info-page-heading"><p class="eyebrow">${page.label}</p><h1>${page.title}</h1><p>${page.intro}</p>${page.slug==='about'?'':'<span class="info-updated">Updated 16 October 2026</span>'}</div><div class="info-page-body">${page.sections.map(([heading,copy])=>`<section><h2>${heading}</h2><p>${copy}</p></section>`).join('')}${credits}${page.slug==='privacy'?'<section><h2>Provider policies</h2><p><a href="https://policies.google.com/privacy">Google privacy policy</a> · <a href="https://fonts.google.com/faq">Google Fonts FAQ</a> · <a href="https://unsplash.com/privacy">Unsplash privacy policy</a></p></section>':''}<a class="button" href="./#book">Discuss your event</a></div></main>${footer}</body></html>`);
}

for(const name of ['index.html','creators.html','edit-reel.html','gallery.html']){
  const file=new URL(name,root);
  let html=await readFile(file,'utf8');
  html=html.includes('<footer')?html.replace(/<footer\b[\s\S]*?<\/footer>/,footer):html.replace('</body>',footer+'\n</body>');
  html=html.replace(/footer\.css\?v=\d+/g,'footer.css?v=3');
  html=html.replace(/logo-tech-text\.bundle\.js\?v=\d+/g,'logo-tech-text.bundle.js?v=8');
  if(!html.includes('src="logo-tech-text.bundle.js'))html=html.replace('</head>','<script type="module" src="logo-tech-text.bundle.js?v=8"></script></head>');
  if(!html.includes('href="footer.css'))html=html.replace('</head>','<link rel="stylesheet" href="footer.css?v=3"><script src="footer.js?v=1" defer></script></head>');
  await writeFile(file,html);
}
console.log('Branded footer and information pages prepared.');
