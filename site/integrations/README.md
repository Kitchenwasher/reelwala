# Google Sheets intake

Prepared destination: https://docs.google.com/spreadsheets/d/1FJgAmUw1CxSokhUSJxPsbE_gmXqvm7t1eesWt4a1qr4/edit

Bookings and Creators have separate headers, with frozen first rows. No customer records or sample submissions were added.

## Connection status

The sheet exists. The public website connection is not deployed. `dist/config.js` intentionally has an empty endpoint, so forms download drafts and never claim to send data.

Sites connector eligibility discovery is unavailable in this session. Native connectors also execute under each visitor's Google connection, rather than silently using the business owner's connection. A standalone owner-deployed Apps Script intake is prepared as an alternative for a customer-facing site. It has not been authorized or deployed and requires the owner's Google account action.

## Owner setup

1. Open the destination sheet and choose Extensions → Apps Script.
2. Paste `Code.gs` into the script editor and save. Its fixed spreadsheet ID points to this destination.
3. Review the code and Google permissions. It appends only to the two fixed tabs, and creates private Drive folders for creator portfolio uploads. It does not expose existing sheet rows or files.
4. Choose Deploy → New deployment → Web app. Execute as yourself and allow Anyone to access the intake. This is a public write-only form endpoint; the spreadsheet itself stays private. Google requires the owner to authorize Sheets and Drive access. Do not bypass a browser security interstitial.
5. Copy the deployed web app URL ending in `/exec`. Add it to `sheetsEndpoint` in `dist/config.js` and republish the site. Never paste OAuth tokens or account credentials into that file.
6. Verify a clearly labelled test booking and test creator application from the hosted site, then confirm their rows and private portfolio links in Sheets. Confirm the browser can read the JSON result across Google's redirect. If cross-origin responses fail, use a same-origin server adapter; do not use `no-cors` or claim an opaque response confirms saving.

Local validation: `node site/integrations/check-intake.mjs`.

The endpoint has field validation, formula-injection escaping, serialized writes, duplicate ID checks, per-email throttling and bounded file sizes/counts. Public intake can still receive spam; assess traffic and add a verified anti-abuse service if needed. Selected files are not uploaded until the visitor submits with a configured endpoint. Files stay private in the owner's Drive. Backend quotas and anonymous access depend on the Google account policy.

Model options were checked against https://support.apple.com/en-in/108044 on October 15, 2026. Deployment workflow: https://developers.google.com/apps-script/guides/web .
