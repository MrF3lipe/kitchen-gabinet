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
<body style="background: #fbf9f8; margin:0; padding:20px; font-family:sans-serif;">
  <!-- Mensaje PRE-React -->
  <div id="preload-msg" style="text-align:center; margin-top:30vh;">
    <h1 style="color:#9a4028;">HTML cargado correctamente ✅</h1>
    <p id="status">Esperando JavaScript...</p>
  </div>

  <div id="root"></div>

  <script type="module" src="assets/${entryJs}"></script>

  <!-- Mensaje POST-React -->
  <script>
    // Si React no reemplaza el mensaje, mostraremos error
    setTimeout(() => {
      if (document.getElementById('preload-msg')?.style.display !== 'none') {
        document.getElementById('status').innerText += ' React no montó 😞';
      }
    }, 4000);
  </script>
</body>
</html>`;

writeFileSync(resolve(clientDir, 'index.html'), html);
console.log(`✅ index.html generado con entry: assets/${entryJs}`);