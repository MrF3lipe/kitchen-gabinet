import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kitchen Cabinet — Recetas y Despensa" },
      {
        name: "description",
        content:
          "Gestiona tu despensa y descubre recetas con lo que tienes en casa.",
      },
      { name: "theme-color", content: "#9a4028" },
      { property: "og:title", content: "Kitchen Cabinet" },
      { property: "og:description", content: "Tu cocina, organizada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$_TSR=window.$_TSR||{h:function(){},buffer:[],initialized:false,router:{matches:[],dehydratedData:undefined,manifest:undefined,lastMatchId:undefined}};`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker'in navigator){try{navigator.serviceWorker.register('/sw.js')}catch(e){}}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Importación de receta desde hash (#import=base64) — idea #10
  if (typeof window !== "undefined" && window.location.hash.startsWith("#import=")) {
    try {
      const b64 = window.location.hash.slice("#import=".length);
      const json = decodeURIComponent(escape(atob(b64)));
      const recipe = JSON.parse(json);
      import("@/lib/db").then(({ db, uid }) => {
        db.addRecipe({ ...recipe, id: uid(), createdAt: Date.now(), updatedAt: Date.now() });
        window.location.hash = "";
        alert("Receta importada ✓");
      });
    } catch (e) { console.error(e); }
  }
  return <Outlet />;
}