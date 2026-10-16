# Creator page and subdomain

The creator application is a standalone page at `site/dist/become-creator.html`.
All three Be a Creator links on the homepage open it. No application modal remains.

The page has its own CSS and JavaScript and does not depend on the homepage or its React bundles. The application retains the Google intake's required fields, five photos, up to two optional videos, 4 MB/photo, 10 MB/video and 25 MB combined. Selected photos have local previews; unsupported HEIC previews show a file-type placeholder. Successful applications use the existing `creator` intake kind and private Drive uploads.

The Google endpoint is still empty. Applications download a draft with file names until the updated intake is deployed and `sheetsEndpoint` in `site/dist/config.js` is configured. No upload or submission is claimed in preview mode.

## Separate deployment

`npm run build:creator` produces a creator-only site in `dist/creator-portal/` with `index.html`, its CSS/JS, config, local images and the shared shard decoration. The normal main-site build also produces this directory.

For a separate Vercel project from this repository, use build command `npm run build:creator` and output directory `dist/creator-portal`. `vercel.creator.json` records those settings. Attach the chosen creator subdomain to that project once its domain is known; no domain or DNS has been changed here.

Once that deployment is available, set `creatorPortalUrl` in the main site's `site/dist/config.js` to the actual HTTPS subdomain and rebuild the main site. Leave it empty to keep the local creator-page link. Configure `sheetsEndpoint` before building both sites, or set separate values in their deployed config files when needed.

The standalone site serves the creator page at `/`; its internal section links remain on that site. The static assets use relative paths and are included in the creator output.
