# Kitchen Cabinet — Plan de construcción

App móvil tipo PWA para gestionar despensa, descubrir y crear recetas. Sin cuentas: todo se guarda en el teléfono. Bilingüe (ES/EN). Fiel al diseño Heirloom Modern que enviaste.

## Stack

- **React 19 + TanStack Start + Vite + Tailwind v4** con tokens del `DESIGN.md` (terracota `#9a4028`, oliva `#56642b`, fondo `#fbf9f8`).
- **Newsreader** (titulares serif) + **Plus Jakarta Sans** (UI) desde Google Fonts.
- **shadcn/ui** ya instalado, re-skinneado.
- **Almacenamiento local:** IndexedDB vía `idb-keyval` (recetas, despensa, favoritos, historial). Nada sale del teléfono salvo que el usuario lo decida.
- **PWA instalable** (manifest + icono) — se añade a pantalla de inicio y se siente como app nativa. Te aviso: las features PWA solo funcionan en la versión publicada, no en el editor.
- **i18n** ligero con un diccionario propio (ES por defecto, toggle a EN).
- **Export como imagen:** `html-to-image` para renderizar la receta a PNG y descargarla / compartirla con la Web Share API.
- **Búsqueda online de recetas:** Lovable AI Gateway (Gemini con grounding) — el usuario escribe "pasta con espinacas" y la IA devuelve recetas reales con fuentes citadas, importables a su biblioteca local con un toque.
- **Importar receta desde URL:** pegar enlace → la IA extrae título, ingredientes, pasos y los guarda local.

## Pantallas y navegación

Bottom nav fijo con 4 secciones (igual al diseño): **Explorer · Search · New Recipe · Pantry**, más detalle de receta y modo cocina.

```text
/                   Explorer  (feed con chips Desayunos/Almuerzos/Postres)
/search             Search    (filtros por ingredientes de la despensa, utensilios, dificultad)
/search/online      Búsqueda online con IA (nuevo)
/new                New Recipe (formulario)
/pantry             Mi Despensa (categorías + toggles)
/recipe/$id         Detalle de receta
/recipe/$id/cook    Modo cocina (pantalla siempre encendida, pasos grandes, timers)
/recipe/$id/share   Vista exportable a PNG
/favorites          Favoritos
/shopping           Lista de compras
/settings           Idioma, tema, exportar/importar todo (JSON backup)
```

## Funcionalidad por pantalla

**Explorer** — hero "¿Qué cocinamos hoy?", buscador, chips de categoría con colores del diseño, feed de cards grandes con foto, tiempo y badge "Destacado".

**Search** — buscador + secciones colapsables: *Ingredientes que tengo* (chips terracota seleccionables tomados de la despensa), *Utensilios* (horno/licuadora/microondas con icono), *Dificultad* (Fácil/Medio/Difícil). Resultados con badge **"Tienes 8/10 ingredientes"** y lista de los que faltan, con botón para añadirlos a la lista de compras.

**Search Online (nuevo)** — campo de búsqueda en lenguaje natural, IA devuelve 5 recetas con fuentes; cada una tiene botón "Guardar en mi biblioteca".

**New Recipe** — foto (cámara o galería, se guarda como blob local), título, tiempo, categoría, ingredientes y equipo dinámicos, instrucciones. Botón **"Asistir con IA"** que rellena ingredientes/pasos a partir del título.

**Pantry** — categorías (Lácteos, Verduras, Especias…) con switches verdes; los apagados se tachan. Botón "Añadir ingrediente". **Caducidad opcional** por ítem con avisos suaves ("usa el tomate antes del viernes").

**Detalle de receta** — header con foto, badges (categoría, dificultad, tiempo), ingredientes con cantidades, herramientas, pasos numerados con foto, **slider de porciones** que recalcula cantidades, botón rojo **"Modo Cocina"**, corazón para favoritos, menú "..." con: Compartir como imagen, Exportar JSON, Eliminar.

**Modo cocina** — pantalla siempre encendida (Wake Lock API), un paso a la vez, fuente grande, **timers integrados** detectados automáticamente en el texto ("reposar 30 minutos" → botón timer).

**Compartir como imagen** — plantilla bonita estilo postal (1080×1350, formato Instagram). Opciones: una imagen completa o varias (carrusel: portada + ingredientes + pasos). Descarga local o Web Share.

**Settings** — toggle ES/EN, claro/oscuro, **Exportar todo a JSON** (backup completo) e **Importar JSON** (restaurar en otro teléfono).

## Semilla inicial

~20 recetas en español curadas (las del diseño: Sopa de Tomate Rostizado, Caprese, Salsa Base, Pan de Masa Madre, Pizza Margarita, Avena, Pasta al Pesto, Delicia de Capas, etc.) con sus traducciones al inglés, fotos libres de derechos, tiempos, ingredientes y pasos.

## Sugerencias extra que encajan con tu enfoque local

1. **Backup automático a archivo descargable** cada N cambios (recordatorio amable).
2. **Modo "vaciar despensa"** — la IA sugiere qué cocinar con lo que está a punto de caducar.
3. **QR de receta** — además del PNG, generar QR que codifique la receta en JSON (compartir entre teléfonos sin internet, escaneando).
4. **Historial "Cocinado X veces"** y rating personal de 1–5.
5. **Filtros dietéticos** (vegetariano, sin gluten, sin lactosa) calculados de los ingredientes.
6. **Etiquetas/colecciones** propias ("Rápidas entre semana", "Para invitados").
7. **Tema oscuro** completo usando los tokens dark del DESIGN.md.

## Detalles técnicos

- Tokens del DESIGN.md mapeados en `src/styles.css` como `--color-primary` etc. y fuentes cargadas en `__root.tsx`.
- Capa de datos `src/lib/db.ts` con tipos `Recipe`, `PantryItem`, `Category` y helpers CRUD sobre IndexedDB; hook `useDb()` con suscripción reactiva.
- Server functions solo para la IA (búsqueda online, asistir receta, importar URL) — el resto es 100% cliente.
- Wake Lock, Web Share, File System Access con fallbacks (descarga normal si no están disponibles).
- Sin login, sin base de datos, sin Cloud — la IA es lo único que toca el servidor.

## Lo que queda fuera de v1

- Sincronización entre dispositivos (se cubre con export/import JSON manual).
- Notificaciones push de caducidad (las alertas son in-app).
- Comunidad / recetas compartidas públicas.

Cuando apruebes, lo construyo de una sola vez y lo dejas funcionando en el preview móvil.