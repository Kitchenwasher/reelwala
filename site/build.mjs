import { cp, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

await import('./build-info-pages.mjs');

const bundle = spawnSync(process.execPath, ['scripts/bundle-carousel.mjs'], { stdio: 'inherit' });
if (bundle.status !== 0) {
  process.exit(bundle.status || 1);
}

const output=new URL('../dist/',import.meta.url);
await mkdir(output,{recursive:true});
await cp(new URL('./dist/',import.meta.url),output,{recursive:true});
await import('./build-creator.mjs');
console.log('Static site prepared in dist/.');

