# Plan: Kitchen Cabinet → App móvil empaquetada (APK) con mejoras

## 1. Cambios en la app (lo que pediste)

### Despensa (`src/routes/pantry.tsx`, `src/lib/db.ts`, `src/lib/types.ts`)

- **Cantidad por ítem**: añadir `quantity: number` y `unit?: string` (ej: 3 unidades, 500 g, 1 L) en `PantryItem`. La lista deja de ser solo un switch: muestra `−  3 ud  +` con botones de incremento/decremento. `available` se deriva de `quantity > 0`, pero se mantiene un toggle "ocultar" para los que no quieres considerar.
- **Gestionar categorías**: nueva sección "Categorías" arriba con chips editables. Botones para **añadir categoría nueva** (input + emoji opcional) y **eliminar categoría** (con aviso si tiene ítems: mover a "Otros" o borrar). Las categorías dejan de ser fijas y se guardan en el DB local (`categories: PantryCategory[]`).
- **Editar ítem inline**: tocar el nombre lo hace editable; cambiar categoría desde un select.
- **Resumen por categoría**: mostrar contador "(7 ítems)" en cada cabecera y total general arriba.

### Carrito de la compra (`src/routes/shopping.tsx`, `types.ts`)

- Añadir `quantity: number` y `unit?: string` a `ShoppingItem`.
- En la fila: `−  cantidad  +` y selector de unidad (ud / g / kg / ml / L). Al añadir desde una receta, se intenta deducir cantidad del texto del ingrediente.
- Botón "Mover comprados a despensa" que vacía marcados y suma cantidades a la despensa.

### Buscar (`src/routes/search.tsx`)

- **Utensilios en modo OR**: hoy exige que la receta tenga *todos* los seleccionados (`every`). Cambio a `some` → si seleccionas Horno y Batidora, salen recetas que usan horno O batidora (o ambos). Renombro la sección a "Utensilios disponibles" con texto aclaratorio.
- **Modo "puedo cocinarlo aunque me sobren cosas"**: nuevo toggle por defecto activado **"Mostrar lo que puedo hacer ahora"**. Cuando está activo, muestra recetas donde **tengo todos los ingredientes** (faltan 0), independientemente de que tenga otras cosas extra en la despensa. Cuando está apagado, vuelve al ranking actual por % de match.
- Ordenar primero "puedo cocinar ahora" (verde), luego "casi" (faltan 1-2), luego el resto.

## 2. Empaquetado a APK (Capacitor ya está instalado)

Capacitor está configurado (`capacitor.config.ts`, carpeta `android/`). Falta:

- Asegurar que `vite build` produce SPA estático servible (cambiar a modo SPA si la build actual depende del Worker de Cloudflare; las server functions de IA seguirán funcionando solo si hay internet y dejamos un host público — lo dejo opcional con `VITE_API_BASE`).
- Añadir `bun add -D @capacitor/assets` para iconos y splash a partir de un PNG de la carpeta `resources/`.
- Script `scripts/build-apk.ps1` y `build-apk.bat` que hacen:
  ```
  bun install
  bun run build
  npx cap sync android
  cd android && gradlew.bat assembleDebug
  copy app-debug.apk %USERPROFILE%\Desktop\KitchenCabinet.apk
  ```
- Script `install-apk.bat` que detecta `adb` (lo descarga si falta vía platform-tools), activa modo desarrollador automáticamente no se puede — pero sí ejecuta `adb install -r KitchenCabinet.apk` con instrucciones claras al usuario.
- `README-INSTALAR.txt` en español, paso a paso, con requisitos: Android Studio (o solo el JDK 21 + Android command-line tools) y Node/Bun.

**Aviso honesto**: no puedo *generar* el APK desde aquí (el sandbox no tiene Android SDK ni JDK con licencias aceptadas). El ZIP contendrá todo el código + scripts; el APK se compila en tu PC al correr el `.bat`. Es un solo doble-clic una vez instalado el SDK.

### Entrega

- Genero `/mnt/documents/kitchen-cabinet.zip` con el proyecto limpio (sin `node_modules`, `dist`, `.git`).
- Incluye `INSTALAR.bat`, `GENERAR-APK.bat`, `INSTALAR-EN-TELEFONO.bat` y `LEEME.txt`.

## 3. Otras 10 ideas nuevas (elige las que quieras incluir ya o las dejamos para después)

1. **Sustituciones inteligentes**: en una receta, si te falta un ingrediente, sugerir alternativas comunes (mantequilla → aceite, leche → bebida vegetal). Tabla local + IA opcional.
2. **Planificador semanal**: arrastra recetas a un calendario L-D y genera la lista de la compra agregada de toda la semana.
3. **Escáner de código de barras** (Capacitor Barcode Scanner) para añadir productos a la despensa al instante.
4. **Modo "¿qué hay en mi nevera?"**: foto de la nevera → la IA detecta ingredientes y los sugiere para añadir a la despensa.
5. **Conversor de unidades en vivo**: tocar "200 g" y verlo en cups/oz (útil si traduces recetas inglesas).
6. **Modo manos libres** en cocina: control por voz ("siguiente paso", "repetir", "timer 5 minutos").
7. **Importar receta por foto**: hacer foto a una receta de un libro y la IA la transcribe. (Esta no, no quiero IA en mi app)
8. **Coste estimado por receta**: precio aproximado por ingrediente que tú vas afinando.
9. **Notificaciones locales** (Capacitor) para avisar de caducidades en la despensa.
10. **Compartir receta como link efímero**: subir JSON cifrado a un pastebin temporal y dar un link de 24 h, además del QR/PNG actuales.

## Detalles técnicos

- Archivos a tocar: `types.ts`, `db.ts`, `seed.ts` (migrar pantry seed a quantity), `pantry.tsx`, `shopping.tsx`, `search.tsx`, `i18n.ts` (nuevos textos ES/EN).
- Migración suave: al cargar el DB v1, si los items no tienen `quantity`, se asume `1 ud` y `available` se respeta.
- Vite build: verificar que `dist/client` es navegable como SPA (TanStack Start con `prerender` o ajuste a `static`). Si hay rutas dinámicas SSR, configuro fallback a `index.html`.
- Capacitor: `bun add @capacitor/preferences @capacitor/share @capacitor/filesystem` para que export/share funcione nativamente; con fallback web ya existente.

## Lo que NO incluye este plan

- No subo el APK ya compilado (no hay Android SDK en el entorno).
- No publico la app, solo entrego ZIP.
- Las 10 ideas extra son sugerencias: dime cuáles añado ahora (por defecto **no** se incluyen para no inflar el alcance).  
  
has las 9 idieas que me diste, la q dije q no no la hagas. tambien documenta detalladamente todo el proyecto para poder entenderlo a fondo y crea una documentacion y una guia de uso

¿Apruebas? Cuando confirmes, hago los cambios, pruebo que compile y te dejo el `.zip` listo.