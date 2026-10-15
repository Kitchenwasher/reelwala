import * as esbuild from 'esbuild';

async function build() {
  try {
    // 1. Bundle creators carousel
    await esbuild.build({
      entryPoints: ['src/creators-carousel.jsx'],
      bundle: true,
      outfile: 'site/dist/creators-carousel.bundle.js',
      format: 'esm',
      minify: true,
      sourcemap: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Creators carousel bundled successfully into site/dist/creators-carousel.bundle.js');

    // 2. Bundle hero circular carousel
    await esbuild.build({
      entryPoints: ['src/hero-carousel.jsx'],
      bundle: true,
      outfile: 'site/dist/hero-carousel.bundle.js',
      format: 'esm',
      minify: true,
      sourcemap: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Hero circular carousel bundled successfully into site/dist/hero-carousel.bundle.js');

    // 3. Bundle work drift wall
    await esbuild.build({
      entryPoints: ['src/work-drift-wall.jsx'],
      bundle: true,
      outfile: 'site/dist/work-drift-wall.bundle.js',
      format: 'esm',
      minify: true,
      sourcemap: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Work drift wall bundled successfully into site/dist/work-drift-wall.bundle.js');

    // 4. Bundle TechText logo
    await esbuild.build({
      entryPoints: ['src/logo-tech-text.jsx'],
      bundle: true,
      outfile: 'site/dist/logo-tech-text.bundle.js',
      format: 'esm',
      minify: true,
      sourcemap: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('TechText logo bundled successfully into site/dist/logo-tech-text.bundle.js');

    // 5. Bundle Hero AeroShards
    await esbuild.build({
      entryPoints: ['src/hero-aero-shards.jsx'],
      bundle: true,
      outfile: 'site/dist/hero-aero-shards.bundle.js',
      format: 'esm',
      minify: true,
      sourcemap: true,
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    console.log('Hero AeroShards bundled successfully into site/dist/hero-aero-shards.bundle.js');
  } catch (error) {
    console.error('Bundle failed:', error);
    process.exit(1);
  }
}

build();
