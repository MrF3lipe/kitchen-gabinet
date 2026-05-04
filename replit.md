# Kitchen Cabinet

A recipe and pantry management app built with React, TanStack Start, and TailwindCSS. Designed originally as a Capacitor mobile app (with Android support), now running as a web app in Replit.

## Architecture

- **Framework**: TanStack Start (SSR-off) + TanStack Router with hash history (client-side)
- **Build tool**: Vite via `@lovable.dev/vite-tanstack-config`
- **Styling**: TailwindCSS v4 + Radix UI components (shadcn/ui pattern)
- **State**: TanStack Query + IndexedDB (`idb-keyval`) for local persistence
- **Language**: TypeScript

## Project Structure

```
src/
  routes/         # TanStack Router file-based routes
  components/     # Shared UI components (AppShell, RecipeCard, shadcn/ui)
  hooks/          # Custom React hooks
  assets/         # Static assets
  router.tsx      # Router config (hash history client-side, memory on server)
  styles.css      # Global styles
server/           # TanStack Start server entry
public/           # Public static files
android/          # Capacitor Android project
```

## Key Configuration

- **Port**: 5000 (Replit webview)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Routing**: Hash-based (for Capacitor compatibility; server uses memory history to avoid SSR errors)
- **Deployment**: Static site — build output in `dist/client`

## Dev Command

```bash
npm run dev
```

## Build Command

```bash
npm run build
```

## Notes

- The app uses hash routing (`/#/route`) for Capacitor mobile compatibility
- Server-side rendering uses memory history to avoid `window` not defined errors
- All data is stored locally in IndexedDB (no backend required)
