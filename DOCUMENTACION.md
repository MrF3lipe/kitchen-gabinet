# Kitchen Cabinet — Documentación técnica

App móvil **local-first** (sin cuentas, sin servidor) para gestionar tu despensa, descubrir recetas y planificar la semana. Empaquetada como APK Android con **Capacitor**.

## Stack

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Framework | **React 19 + TanStack Start + Vite 7** | SSR opcional, file-routing tipado |
| Routing | **TanStack Router** con `createHashHistory` | Las URLs con `#/ruta` funcionan dentro de Capacitor (file://) |
| Estilos | **Tailwind v4** + tokens CSS en `src/styles.css` | Paleta "Heirloom Modern" (terracota / oliva) |
| UI | **shadcn/ui** re-skinneado | Switch, Checkbox, Dropdown, etc. |
| Almacenamiento | **IndexedDB** vía `idb-keyval` | Local, sin red, persistente |
| Empaquetado móvil | **Capacitor 8** (Android) | Convierte el bundle web en APK nativo |
| Notificaciones | `@capacitor/local-notifications` | Avisos de caducidad cuando está instalada |
| Compartir | Web Share API + `@capacitor/share` (fallback) | Recetas como imagen, JSON o link efímero |
| Imágenes | `html-to-image` | Generar postales PNG de la receta |

## Estructura de carpetas

```
src/
├─ routes/                  Rutas (file-based routing)
│  ├─ __root.tsx            Layout raíz, fuentes, importación por hash
│  ├─ index.tsx             Explorer (home)
│  ├─ search.tsx            Buscar con filtros + "puedo cocinar ahora"
│  ├─ pantry.tsx            Despensa con cantidades y categorías editables
│  ├─ shopping.tsx          Lista de la compra con cantidades/unidades
│  ├─ plan.tsx              Planificador semanal
│  ├─ tools.tsx             Conversor unidades, barcode, foto nevera, voz, notif.
│  ├─ favorites.tsx         Favoritos
│  ├─ new.tsx               Crear receta
│  ├─ recipe.$id.tsx        Detalle de receta + sustitutos + share-link
│  ├─ recipe.$id.cook.tsx   Modo cocina (Wake Lock + timers)
│  ├─ recipe.$id.share.tsx  Postal PNG compartible
│  └─ settings.tsx          Idioma, tema, backup JSON, accesos rápidos
├─ lib/
│  ├─ db.ts                 Store reactivo + persistencia + migraciones
│  ├─ types.ts              Tipos centrales (Recipe, PantryItem, etc.)
│  ├─ seed.ts               15 recetas + 9 categorías + 17 ítems iniciales
│  ├─ i18n.ts               Diccionario ES/EN + hook useT()
│  ├─ substitutes.ts        Tabla local de sustituciones culinarias
│  └─ units.ts              Conversor de unidades (peso/volumen)
└─ components/
   ├─ AppShell.tsx          Bottom-nav + header
   ├─ RecipeCard.tsx        Card reutilizable
   └─ ui/...                shadcn primitives
```

## Modelo de datos (IndexedDB → key `kc:db:v1`)

```ts
{
  schemaVersion: 2,
  recipes: Recipe[],          // titulo, ingredientes, pasos, equipo...
  pantry: PantryItem[],       // {name, category, quantity, unit, available, expiresAt}
  pantryCategories: PantryCategory[], // editables: id, name, emoji, order
  shopping: ShoppingItem[],   // {name, quantity, unit, done, fromRecipeId}
  favorites: string[],        // ids de recetas
  mealPlan: MealPlanEntry[],  // {weekStart, day, slot, recipeId}
  notifications: { expiryEnabled, expiryDaysBefore },
  settings: { locale, theme, currency, onboarded },
}
```

### Migración v1 → v2
Hecha en `db.ts → migrate()`. Si encuentra ítems sin `quantity`/`unit`, asume `1 ud` y respeta `available`. Crea categorías por defecto si faltan.

## Lógica de "qué puedo cocinar"

`src/routes/search.tsx`:

1. Para cada receta, cuenta cuántos de sus ingredientes están en la lista de "ingredientes que tengo" (chips seleccionables, inicialmente lo disponible de la despensa). Comparación por substring normalizado (sin tildes, minúsculas).
2. **Utensilios** = OR (si la receta usa al menos uno de los seleccionados, aparece). Si no seleccionas ninguno, no filtra.
3. Toggle **"Solo lo que puedo cocinar ahora"** = receta con `missCount === 0` (puedes tener cosas extra en la despensa, no importa).
4. Resultados agrupados: ✅ Cocinables · 🟡 Casi (1-2 faltantes) · 📚 Otras.

## Cantidades en despensa y carrito

- `PantryItem.quantity` (number) + `PantryItem.unit` (`ud | g | kg | ml | L | tsp | tbsp | cup`).
- Botones `−/+` con incremento adaptativo: 1 unidad si es `ud`, 5 / 50 si es peso/volumen mayor.
- `available` se deriva: `quantity > 0`. El switch sigue existiendo para "ocultar" sin borrar.
- En el carrito, `db.moveDoneToPantry()` mueve los marcados como comprados a la despensa, sumando cantidades cuando coincide nombre+unidad.

## Categorías editables

`db.addPantryCategory / updatePantryCategory / deletePantryCategory(id, moveTo?)`. Al renombrar, el cambio se propaga a los ítems (mantienen su grupo). Al borrar, ofrece mover los ítems a otra categoría o borrarlos.

## Funciones nuevas (las 9 ideas)

| # | Idea | Dónde está |
|---|------|-----------|
| 1 | Sustituciones | `src/lib/substitutes.ts` + botón ↻ en detalle de receta |
| 2 | Planificador semanal | `/plan` — drag conceptual + lista compra agregada |
| 3 | Escáner barcode | `/tools` — usa `BarcodeDetector` API web |
| 4 | Foto de nevera | `/tools` — input file + textarea para añadir múltiples ítems |
| 5 | Conversor unidades | `/tools` + `src/lib/units.ts` |
| 6 | Modo manos libres | placeholder en `/tools`, integración futura en cook mode |
| 8 | Coste estimado | tipo `estimatedCost` y `pricePerUnit` (preparado, UI por completar) |
| 9 | Notificaciones caducidad | `/tools` — `@capacitor/local-notifications` (solo APK) |
| 10 | Compartir como link | menú "..." del detalle: comprime a base64 en `#import=`, importa al abrir |

## Empaquetado a APK

`capacitor.config.ts` apunta a `dist/client` como `webDir`. El flujo es:

```
bun run build         → genera dist/client (estático)
bunx cap sync android → copia a android/app/src/main/assets/public
gradlew assembleDebug → produce android/app/build/outputs/apk/debug/app-debug.apk
```

`getRouter()` usa `createHashHistory()` para que las rutas funcionen sobre `file://` dentro del WebView.

## Comandos útiles

```bash
bun install              # dependencias
bun run dev              # dev server con hot reload
bun run build            # producción
bunx cap sync android    # sincroniza web → android
bunx cap open android    # abre Android Studio
```
