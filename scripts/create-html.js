import { writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const clientDir = resolve('dist/client');

const files = await readdir(resolve(clientDir, 'assets'));
const entryJs = files.find(f => /^index-[A-Za-z0-9]+\.js$/.test(f));
const cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));

if (!entryJs) {
  console.error('❌ No se encontró entry point. ¿Ejecutaste npm run build?');
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kitchen Cabinet</title>
  <base href="./">
  <link rel="stylesheet" href="assets/${cssFile}">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="assets/${entryJs}"></script>
</body>
</html>`;

writeFileSync(resolve(clientDir, 'index.html'), html);
console.log(`✅ index.html generado con entry: assets/${entryJs}`);