import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { db, useDb, uid } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";
import type { MealPlanEntry, MealSlot, Weekday } from "@/lib/types";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
});

const DAYS: { key: Weekday; es: string; en: string }[] = [
  { key: "mon", es: "Lun", en: "Mon" },
  { key: "tue", es: "Mar", en: "Tue" },
  { key: "wed", es: "Mié", en: "Wed" },
  { key: "thu", es: "Jue", en: "Thu" },
  { key: "fri", es: "Vie", en: "Fri" },
  { key: "sat", es: "Sáb", en: "Sat" },
  { key: "sun", es: "Dom", en: "Sun" },
];
const SLOTS: { key: MealSlot; es: string; en: string }[] = [
  { key: "breakfast", es: "Desayuno", en: "Breakfast" },
  { key: "lunch", es: "Almuerzo", en: "Lunch" },
  { key: "dinner", es: "Cena", en: "Dinner" },
];

function mondayOf(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function PlanPage() {
  const t = useT();
  const locale = useLocale();
  const { recipes, mealPlan } = useDb();
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()).toISOString().slice(0, 10));
  const [picker, setPicker] = useState<{ day: Weekday; slot: MealSlot } | null>(null);

  const weekEntries = useMemo(
    () => mealPlan.filter((e) => e.weekStart === weekStart),
    [mealPlan, weekStart],
  );

  function entryFor(day: Weekday, slot: MealSlot): MealPlanEntry | undefined {
    return weekEntries.find((e) => e.day === day && e.slot === slot);
  }

  function shiftWeek(delta: number) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + delta * 7);
    setWeekStart(d.toISOString().slice(0, 10));
  }

  function addAllMissingToShopping() {
    const items: { name: string }[] = [];
    for (const e of weekEntries) {
      const r = recipes.find((x) => x.id === e.recipeId);
      if (!r) continue;
      for (const ing of r.ingredients) items.push({ name: ing.name });
    }
    // dedupe simple por nombre
    const seen = new Set<string>();
    const dedup = items.filter((i) => {
      const k = i.name.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    db.addManyShopping(dedup.map((m) => ({ id: uid(), name: m.name, quantity: 1, unit: "ud", done: false })));
    alert(`+${dedup.length} → ${t("shopping")}`);
  }

  const weekLabel = new Date(weekStart).toLocaleDateString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short" });

  return (
    <AppShell>
      <div className="space-y-4 px-4 pt-4 pb-4">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{t("weekPlan")}</h1>
        </header>

        <div className="flex items-center justify-between rounded-2xl bg-card p-2 shadow-sm">
          <button onClick={() => shiftWeek(-1)} className="rounded-full p-2"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-semibold">{weekLabel}</span>
          <button onClick={() => shiftWeek(1)} className="rounded-full p-2"><ChevronRight className="h-4 w-4" /></button>
        </div>

        <div className="space-y-3">
          {DAYS.map(({ key, es, en }) => (
            <div key={key} className="rounded-2xl bg-card p-3 shadow-sm">
              <h3 className="mb-2 font-display text-lg font-semibold text-primary">{locale === "en" ? en : es}</h3>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map((s) => {
                  const e = entryFor(key, s.key);
                  const r = e ? recipes.find((x) => x.id === e.recipeId) : null;
                  return (
                    <button
                      key={s.key}
                      onClick={() => e ? db.removeMealPlan(e.id) : setPicker({ day: key, slot: s.key })}
                      className={`flex min-h-[70px] flex-col gap-1 rounded-lg border p-2 text-left text-[11px] ${
                        r ? "border-primary/40 bg-primary/5" : "border-dashed border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      <span className="font-bold uppercase tracking-wider">{locale === "en" ? s.en : s.es}</span>
                      {r ? (
                        <span className="line-clamp-2 text-xs leading-tight">{locale === "en" && r.title_en ? r.title_en : r.title}</span>
                      ) : (
                        <span>+ {t("plan")}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {weekEntries.length > 0 && (
          <div className="flex flex-col gap-2">
            <button
              onClick={addAllMissingToShopping}
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              <ShoppingCart className="h-4 w-4" /> + {t("shopping")}
            </button>
            <button
              onClick={() => { if (confirm("?")) db.clearMealPlanWeek(weekStart); }}
              className="flex items-center justify-center gap-2 rounded-full border border-outline-variant py-2 text-xs text-on-surface-variant"
            >
              <Trash2 className="h-3 w-3" /> Vaciar semana
            </button>
          </div>
        )}
      </div>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center" onClick={() => setPicker(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background p-4 sm:rounded-3xl">
            <h2 className="mb-3 font-display text-xl font-semibold">Elige receta</h2>
            <ul className="space-y-2">
              {recipes.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => {
                      db.addMealPlan({ id: uid(), weekStart, day: picker.day, slot: picker.slot, recipeId: r.id });
                      setPicker(null);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-outline-variant p-2 text-left"
                  >
                    <img src={r.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <span className="flex-1 text-sm">{locale === "en" && r.title_en ? r.title_en : r.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}
