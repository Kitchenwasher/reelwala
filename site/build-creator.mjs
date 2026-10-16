import {cp,mkdir} from 'node:fs/promises';

// Independent static output for a creator-only Vercel project/subdomain.
const source=new URL('./dist/',import.meta.url);
const output=new URL('../dist/creator-portal/',import.meta.url);
await mkdir(new URL('./assets/',output),{recursive:true});
await cp(new URL('become-creator.html',source),new URL('index.html',output));
for(const file of ['creator-portal.css','typography.css','form-validation.css','form-validation.js','creator-portal.js','config.js','brand-backgrounds.css','brand-backgrounds.js'])await cp(new URL(file,source),new URL(file,output));
for(const file of ['wedding.webp','culture.webp','gimbal.png','brand-shards.svg'])await cp(new URL('assets/'+file,source),new URL('assets/'+file,output));
console.log('Standalone creator page prepared in dist/creator-portal/.');
