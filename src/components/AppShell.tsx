import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Search, PlusCircle, Refrigerator, Heart, ShoppingCart, Settings as SettingsIcon, User } from "lucide-react";
import { initDb } from "@/lib/db";
import { initLocale, useT } from "@/lib/i18n";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNav?: boolean;
}

export function AppShell({ children, title, showHeader = true, showNav = true }: AppShellProps) {
  const t = useT();

  useEffect(() => {
    void initLocale();
    void initDb();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {showHeader && <AppHeader title={title} />}
      <main className={`flex-1 ${showNav ? "pb-24" : ""}`}>{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}

function AppHeader({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/settings" className="rounded-full p-2 text-primary transition hover:bg-surface-container">
          <SettingsIcon className="h-5 w-5" />
        </Link>
        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {title ?? "Kitchen Cabinet"}
        </Link>
        <Link to="/favorites" className="rounded-full p-2 text-primary transition hover:bg-surface-container">
          <User className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}

function BottomNav() {
  const t = useT();
  const { pathname } = useLocation();

  const items = [
    { to: "/", label: t("explorer"), icon: Compass, match: (p: string) => p === "/" },
    { to: "/search", label: t("search"), icon: Search, match: (p: string) => p.startsWith("/search") },
    { to: "/new", label: t("newRecipe"), icon: PlusCircle, match: (p: string) => p.startsWith("/new") },
    { to: "/pantry", label: t("pantry"), icon: Refrigerator, match: (p: string) => p.startsWith("/pantry") },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition ${
                  active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <Icon className={`h-6 w-6 ${active ? "fill-primary/10" : ""}`} strokeWidth={active ? 2.4 : 1.8} />
                <span className={active ? "font-semibold" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
