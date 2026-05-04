import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Download, Upload, Heart, ShoppingCart, Moon, Sun, Languages } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { db, useDb } from "@/lib/db";
import { useT, setLocale, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const t = useT();
  const locale = useLocale();
  const { settings } = useDb();
  const fileRef = useRef<HTMLInputElement>(null);

  function exportAll() {
    const blob = new Blob([db.exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kitchen-cabinet-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        db.importAll(reader.result as string);
        alert("OK");
      } catch (err) {
        alert("Archivo inválido");
      }
    };
    reader.readAsText(f);
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{t("settings")}</h1>

        <Section title={t("language")}>
          <div className="flex overflow-hidden rounded-full bg-surface-container">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); db.setSettings({ locale: l }); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${locale === l ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`}
              >
                <Languages className="mr-1 inline h-3 w-3" /> {l === "es" ? "Español" : "English"}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t("theme")}>
          <div className="flex overflow-hidden rounded-full bg-surface-container">
            <button onClick={() => db.setSettings({ theme: "light" })} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${settings.theme === "light" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`}>
              <Sun className="mr-1 inline h-3 w-3" /> {t("light")}
            </button>
            <button onClick={() => db.setSettings({ theme: "dark" })} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${settings.theme === "dark" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`}>
              <Moon className="mr-1 inline h-3 w-3" /> {t("dark")}
            </button>
          </div>
        </Section>

        <Section title={t("backup")}>
          <button onClick={exportAll} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground">
            <Download className="h-4 w-4" /> {t("exportAll")}
          </button>
          <button onClick={() => fileRef.current?.click()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-primary py-3 text-sm font-bold uppercase tracking-wider text-primary">
            <Upload className="h-4 w-4" /> {t("importAll")}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        </Section>

        <div className="grid grid-cols-2 gap-2">
          <Link to="/favorites" className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-sm font-semibold">{t("favorites")}</span>
          </Link>
          <Link to="/shopping" className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="text-sm font-semibold">{t("shopping")}</span>
          </Link>
          <Link to="/plan" className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <span className="text-2xl">📅</span>
            <span className="text-sm font-semibold">{t("weekPlan")}</span>
          </Link>
          <Link to="/tools" className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
            <span className="text-2xl">🧰</span>
            <span className="text-sm font-semibold">Herramientas</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{title}</h2>
      {children}
    </section>
  );
}
