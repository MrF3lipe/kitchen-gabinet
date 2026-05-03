import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, X, Trash2, Calendar } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { db, useDb, uid } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/pantry")({
  component: PantryPage,
});

const ICONS: Record<string, string> = {
  "Lácteos & Huevos": "🥚",
  "Verduras Frescas": "🥦",
  "Especias Secas": "🌶️",
  "Aceites & Vinagres": "🫒",
  "Granos & Pastas": "🌾",
  "Carnes": "🥩",
  "Pescado": "🐟",
  "Frutas": "🍎",
  "Otros": "🧂",
};

function PantryPage() {
  const t = useT();
  const locale = useLocale();
  const { pantry } = useDb();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [cat, setCat] = useState("Otros");
  const [expires, setExpires] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof pantry>();
    for (const p of pantry) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return Array.from(map.entries());
  }, [pantry]);

  const allCats = Array.from(new Set([...pantry.map((p) => p.category), ...Object.keys(ICONS)]));

  function add() {
    if (!name.trim()) return;
    db.addPantry({
      id: uid(),
      name: name.trim(),
      category: cat,
      available: true,
      expiresAt: expires ? new Date(expires).getTime() : undefined,
    });
    setName(""); setExpires(""); setAdding(false);
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight">{t("myPantry")}</h1>
            <p className="mt-3 max-w-[16rem] text-sm text-on-surface-variant">{t("pantrySubtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="mt-2 flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow"
          >
            <Plus className="h-4 w-4" /> {t("addPantry")}
          </button>
        </header>

        {adding && (
          <div className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full border-b border-outline-variant bg-transparent py-2 outline-none"
            >
              {allCats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Calendar className="h-4 w-4" />
              {t("expiresOn")}:
              <input
                type="date"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="bg-transparent outline-none"
              />
            </label>
            <div className="flex gap-2">
              <button onClick={add} className="flex-1 rounded-full bg-primary py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground">
                {t("confirm")}
              </button>
              <button onClick={() => setAdding(false)} className="rounded-full border border-outline-variant px-4 text-sm">
                {t("cancel")}
              </button>
            </div>
          </div>
        )}

        {grouped.map(([groupName, items]) => (
          <section key={groupName} className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 border-b border-outline-variant pb-2 font-display text-xl font-semibold text-primary">
              <span aria-hidden>{ICONS[groupName] ?? "🧂"}</span>
              {groupName}
            </h2>
            <ul className="divide-y divide-outline-variant/50">
              {items.map((p) => {
                const display = locale === "en" && p.name_en ? p.name_en : p.name;
                const exp = expirationLabel(p.expiresAt, t);
                return (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div className="flex-1">
                      <div className={`text-sm ${p.available ? "" : "text-on-surface-variant line-through"}`}>{display}</div>
                      {exp && <div className={`text-xs ${exp.urgent ? "text-primary" : "text-on-surface-variant"}`}>{exp.text}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={p.available} onCheckedChange={() => db.togglePantry(p.id)} />
                      <button onClick={() => db.deletePantry(p.id)} className="text-on-surface-variant" aria-label="Delete">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

function expirationLabel(ms: number | undefined, t: ReturnType<typeof useT>) {
  if (!ms) return null;
  const days = Math.floor((ms - Date.now()) / 86400000);
  if (days < 0) return { text: t("expired"), urgent: true };
  if (days === 0) return { text: `${t("expiresOn")} ${t("today")}`, urgent: true };
  if (days === 1) return { text: `${t("expiresOn")} ${t("tomorrow")}`, urgent: true };
  return { text: `${days} ${t("daysLeft")}`, urgent: days <= 3 };
}
