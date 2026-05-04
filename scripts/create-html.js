import { writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const clientDir = resolve('dist/client');
const assetsDir = join(clientDir, 'assets');

const files = readdirSync(assetsDir);

// Find entry JS: the largest .js file in assets (always the main bundle)
const jsFiles = files
  .filter(f => f.endsWith('.js') && !f.endsWith('.map'))
  .map(f => ({ name: f, size: statSync(join(assetsDir, f)).size }))
  .sort((a, b) => b.size - a.size);

const entryJs = jsFiles[0]?.name;

// Find CSS file
const cssFile = files.find(f => f.endsWith('.css') && !f.endsWith('.map'));

if (!entryJs) {
  console.error('No entry JS found in dist/client/assets. Run npm run build first.');
  process.exit(1);
}
if (!cssFile) {
  console.error('No CSS file found in dist/client/assets. Run npm run build first.');
  process.exit(1);
}

console.log('Entry JS:', entryJs, '(' + Math.round(jsFiles[0].size / 1024) + ' KB)');
console.log('CSS:', cssFile);

// IMPORTANT FOR CAPACITOR:
// TanStack Start uses hydrateRoot(document, ...) and calls hydrate(router)
// which requires window.$_TSR to exist (normally injected by SSR server).
// With ssr:false, we must initialize it manually before the entry script runs.
//
// The body must be EMPTY so React's hydrateRoot doesn't clear existing content
// (which would cause a blank screen while the router hydrates).

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';

const TSR_INIT = `window.$_TSR=window.$_TSR||{h:function(){},buffer:[],initialized:false,router:{matches:[],dehydratedData:undefined,manifest:undefined,lastMatchId:undefined}};`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kitchen Cabinet \u2014 Recetas y Despensa</title>
  <meta name="description" content="Gestiona tu despensa y descubre recetas con lo que tienes en casa.">
  <meta name="theme-color" content="#9a4028">
  <meta property="og:title" content="Kitchen Cabinet">
  <meta property="og:description" content="Tu cocina, organizada.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary">
  <link rel="stylesheet" href="/assets/${cssFile}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link rel="stylesheet" href="${FONTS_URL}">
  <link rel="manifest" href="/manifest.json">
  <script>${TSR_INIT}</script>
  <script>if('serviceWorker'in navigator){try{navigator.serviceWorker.register('/sw.js')}catch(e){}}</script>
  <script type="module" src="/assets/${entryJs}"></script>
</head>
<body></body>
</html>`;

writeFileSync(join(clientDir, 'index.html'), html);
console.log('index.html generated successfully.');
