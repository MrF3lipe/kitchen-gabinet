import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readdir } from 'node:fs/promises';

const clientDir = resolve('dist/client');
const manifestPath = join(clientDir, '.vite', 'manifest.json');
let entryFile = '';

// Intentar leer el manifiesto de Vite (SPA)
try {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  entryFile = manifest['index.html']?.file || '';
} catch {}

// Si no hay manifiesto, buscar el index-*.js principal
if (!entryFile) {
  try {
    const assetsDir = join(clientDir, 'assets');
    const files = await readdir(assetsDir);
    const indexJs = files.find(f => /^index-[A-Za-z0-9]+\.js$/.test(f));
    if (indexJs) entryFile = `assets/${indexJs}`;
  } catch {}
}

// Buscar el CSS principal automáticamente
let cssFile = 'assets/styles-DY7zZa-L.css'; // fallback
try {
  const files = await readdir(join(clientDir, 'assets'));
  const css = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));
  if (css) cssFile = `assets/${css}`;
} catch {}

if (!entryFile) {
  console.error('❌ No se encontró entry point. ¿Ejecutaste npm run build?');
  process.exit(1);
}

// HTML con prueba visual
const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kitchen Cabinet</title>
  <base href="./">
  <link rel="stylesheet" href="${cssFile}">
</head>
<body style="background: #fbf9f8; font-family: sans-serif; margin: 0; padding: 20px;">
  <div id="root">
    <!-- Test visual: si ves esto, el HTML cargó -->
    <h1 style="color: #9a4028; text-align: center; margin-top: 50vh;">Cargando...</h1>
  </div>
  <script type="module" src="${entryFile}"></script>
</body>
</html>`;

writeFileSync(join(clientDir, 'index.html'), html);
console.log(`✅ index.html generado con entry: ${entryFile}`);