# Website information update plan

## Source and boundaries

- Source: [THE REEL WALA](https://docs.google.com/document/d/1S4ZpStAzM6lu6pgp6NGMvPW65jO-2WmPbBSp-hxkHlc), revision `AHj4eMTIbK_QrgOLrZcJQWxWCM_NBbEwQYAX9xeyIh7SSth9-9pzxaPzP7qoY09mm1Uv0GrmKxUBaok7x4QNlemx2xANcBjowJUtPVGZsP4`, read 16 October 2026.
- Pushed existing version first: `26e10cd` on master.
- User explicitly chose **written notes over conflicting screenshots**.
- Update information only. Preserve current layouts, CSS, fonts, imagery, background shapes, animations, components and routes.
- The Google Doc remains unchanged. Keep [source-document.md](source-document.md) as the read-only content snapshot.

## Decisions before implementation

| Area | Information to update | Boundary |
| --- | --- | --- |
| Services | Private Events, Corporate Events, Social / Cultural Events | Compact summaries in existing cards; full catalogue in existing About-page sections. Keep the previously requested editing card because omission is not an explicit removal request. |
| Standard | Quick, focused content; 4 complimentary colour-graded photos; reel delivery within 24 hours | Base price is not supplied in writing. Do not use screenshot's 5 photos or invent reel counts. |
| Extended | Up to 4 hours; 7 complimentary colour-graded photos; reel delivery within 24 hours | Base price on enquiry. Do not use screenshot's 3 hours or promise raw footage. |
| Extra hour | ₹1,000 per additional shoot hour | Keep number animation for this confirmed amount. Not ₹1,250 and not an extra reel. |
| Premium | Customer-facing collection name becomes Premium; remove dummy fees and invented quantities | Keep existing four slots/layout, marking names/details awaiting confirmation rather than inventing event counts or benefits. |
| Customer workflow | Booking → Reeler assigned → Delivery within 24 hours via secure download link | Update existing booking copy and About sections; the form navigation still describes questions, not fulfilment stages. No instant-booking claims. |
| Creator journey | Register → Attend workshop → Receive shoots → Get paid after shoots | Update existing four cards only. |
| Creator application | Locality placeholder: Type your area, e.g. Viman Nagar. Best 5 photos required. Up to 2 edited videos optional. | Keep existing form layout and iPhone 16+ minimum: notes say models above iPhone 15, consistent with earlier user instruction. Do not add gender from reference screenshot. |
| Testimonials | Await real approved quotes/names/ratings | Do not fabricate reviews or introduce a new frontend section. |
| Operational truth | Preserve accurate downloadable-draft and unconfirmed-booking messaging | A secure-link delivery offer is not a claim that its backend or intake is already deployed. |
| Existing extras | Keep gallery, editing page, creator directory, policies, footer and all interactions | Change conflicting text only; do not remove features merely omitted from the Doc. |

## Full service catalogue

### Private Events

- Weddings & receptions.
- Mehendi, sangeet, haldi and make-up shoots.
- Birthdays & anniversaries; birthday parties & graduation days.
- New car delivery.
- Baby showers, naming ceremonies & Annaprashan.
- Proposals & pre-wedding shoots.
- Pet shoots.
- Housewarming.
- Family gatherings & home tours.

### Corporate Events

- Team outings, lunches & dinners.
- Corporate parties.
- Annual & quarterly meetups.
- Office celebrations.
- Company anniversaries.
- Product and store launches.
- Sports & corporate tournaments.

### Social / Cultural Events

- Cultural fests & carnivals.
- Diwali, Holi, Eid, Christmas, Gudi Padwa and other festivals.
- Community / society events.
- Music festivals & concerts.
- Stand-up comedy shows.
- Fashion shows & food festivals.

## Execution sequence

1. Commit this plan before any site content edits.
2. Update service summaries and About catalogue using existing markup.
3. Replace invented package details with written facts; show unknown prices on enquiry. Keep existing counter animation and package layout.
4. Synchronize booking option labels, live summary and enquiry exports while preserving backend enum compatibility.
5. Update creator journey, requirements, locality and FAQs.
6. Rebuild generated pages/bundles, audit stale unsupported claims, and run content and existing tests.
7. Verify source CSS and visual assets are unchanged, then commit the completed information update separately. Do not push the new update until requested.

## Awaiting business information

- Standard and Extended base prices and GST treatment.
- Actual names, inclusions and prices for four Premium plans.
- Approved testimonials and display consent.
- Live contact email, intake deployment and delivery integration remain separate setup work.

## Verification record

Implementation had not started when this plan was created. Append results after the update.

