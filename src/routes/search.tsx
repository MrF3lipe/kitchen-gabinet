import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Plus, ShoppingCart, ChefHat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/RecipeCard";
import { Switch } from "@/components/ui/switch";
import { db, useDb, uid } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";
import type { Difficulty } from "@/lib/types";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function SearchPage() {
  const t = useT();
  const locale = useLocale();
  const { recipes, pantry } = useDb();
  const [q, setQ] = useState("");
  // Por defecto seleccionamos TODO lo disponible (mejor experiencia "qué puedo cocinar").
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(() =>
    pantry.filter((p) => p.available && p.quantity > 0).map((p) => p.name),
  );
  const [utensils, setUtensils] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [onlyCookable, setOnlyCookable] = useState(true);

  const allUtensils = ["Horno", "Licuadora", "Microondas", "Sartén", "Olla"];
  const ingredientPool = pantry.map((p) => p.name);

  const matches = useMemo(() => {
    return recipes
      .map((r) => {
        const have = countMatches(r.ingredients.map((i) => i.name), selectedIngredients);
        const total = r.ingredients.length;
        const missing = r.ingredients.filter(
          (i) => !selectedIngredients.some((s) => normalize(i.name).includes(normalize(s))),
        );
        return { r, have, total, missing, missCount: missing.length };
      })
      .filter(({ r, missCount }) => {
        const title = locale === "en" && r.title_en ? r.title_en : r.title;
        if (q && !normalize(title).includes(normalize(q))) return false;
        if (difficulty && r.difficulty !== difficulty) return false;
        // Utensilios: modo OR — la receta vale si comparte AL MENOS uno con lo seleccionado.
        // Si no seleccionas nada, no se filtra por utensilio.
        if (utensils.length) {
          const hasAny = utensils.some((u) =>
            r.equipment.some((e) => normalize(e).includes(normalize(u))),
          );
          if (!hasAny) return false;
        }
        // Modo "solo cocinables ahora": faltan 0 ingredientes (sobrar es OK).
        if (onlyCookable && missCount > 0) return false;
        return true;
      })
      .sort((a, b) => {
        // Cocinables primero, luego por menor faltante, luego por mejor ratio.
        if ((a.missCount === 0) !== (b.missCount === 0)) return a.missCount === 0 ? -1 : 1;
        if (a.missCount !== b.missCount) return a.missCount - b.missCount;
        return b.have / b.total - a.have / a.total;
      });
  }, [recipes, selectedIngredients, q, difficulty, utensils, locale, onlyCookable]);

  // Agrupación visual: cocinables / casi (1-2 faltantes) / otras
  const groups = useMemo(() => {
    const cookable = matches.filter((m) => m.missCount === 0);
    const almost = matches.filter((m) => m.missCount > 0 && m.missCount <= 2);
    const others = matches.filter((m) => m.missCount > 2);
    return { cookable, almost, others };
  }, [matches]);

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function addMissingToShopping(missing: { name: string }[], recipeId: string) {
    db.addManyShopping(
      missing.map((m) => ({
        id: uid(),
        name: m.name,
        quantity: 1,
        unit: "ud" as const,
        done: false,
        fromRecipeId: recipeId,
      })),
    );
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold leading-tight">{t("whatToCook")}</h1>
          <label className="flex items-center gap-2 rounded-full border border-outline-variant bg-card px-4 py-3 shadow-sm focus-within:border-primary">
            <SearchIcon className="h-4 w-4 text-primary" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant"
            />
          </label>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ChefHat className="h-4 w-4 text-primary" />
              {t("showOnlyCookable")}
            </div>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              {onlyCookable ? `${groups.cookable.length} ${t("cookable")}` : `${matches.length} ${t("results")}`}
            </p>
          </div>
          <Switch checked={onlyCookable} onCheckedChange={setOnlyCookable} />
        </div>

        <Section title={t("ingredientsIHave")} icon="🍅">
          <div className="flex flex-wrap gap-2">
            {ingredientPool.map((name) => {
              const active = selectedIngredients.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIngredients((arr) => toggle(arr, name))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active ? "border-transparent bg-primary text-primary-foreground" : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {active ? "✓ " : ""}{name}
                </button>
              );
            })}
            <Link to="/pantry" className="rounded-full border border-dashed border-outline px-3 py-1.5 text-xs font-semibold text-on-surface-variant">
              <Plus className="mr-1 inline h-3 w-3" /> {t("addOther")}
            </Link>
          </div>
        </Section>

        <Section title={t("utensilsAvailable")} icon="🍳">
          <p className="mb-2 text-[11px] text-on-surface-variant">{t("utensilsHelp")}</p>
          <div className="grid grid-cols-3 gap-2">
            {allUtensils.map((u) => {
              const active = utensils.includes(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUtensils((arr) => toggle(arr, u))}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                    active ? "border-secondary bg-secondary-container text-accent-foreground" : "border-outline-variant bg-card text-on-surface-variant"
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title={t("difficulty")} icon="">
          <div className="flex overflow-hidden rounded-full bg-surface-container">
            {(["easy", "medium", "hard"] as const).map((d) => {
              const active = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(active ? null : d)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    active ? "bg-primary text-primary-foreground" : "text-on-surface-variant"
                  }`}
                >
                  {t(d)}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Resultados agrupados */}
        {groups.cookable.length > 0 && (
          <ResultGroup
            title={`✅ ${t("cookable")}`}
            list={groups.cookable}
            t={t} locale={locale} addMissingToShopping={addMissingToShopping}
          />
        )}
        {!onlyCookable && groups.almost.length > 0 && (
          <ResultGroup
            title={`🟡 ${t("almost")}`}
            list={groups.almost}
            t={t} locale={locale} addMissingToShopping={addMissingToShopping}
          />
        )}
        {!onlyCookable && groups.others.length > 0 && (
          <ResultGroup
            title={`📚 ${t("others")}`}
            list={groups.others}
            t={t} locale={locale} addMissingToShopping={addMissingToShopping}
          />
        )}
        {matches.length === 0 && (
          <p className="py-8 text-center text-sm text-on-surface-variant">{t("noResults")}</p>
        )}
      </div>
    </AppShell>
  );
}

function ResultGroup({
  title, list, t, locale, addMissingToShopping,
}: {
  title: string;
  list: ReturnType<typeof getMatchesType>;
  t: ReturnType<typeof useT>;
  locale: "es" | "en";
  addMissingToShopping: (missing: { name: string }[], id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold">{title} <span className="text-sm font-normal text-on-surface-variant">({list.length})</span></h2>
      <div className="space-y-3">
        {list.map(({ r, have, total, missing, missCount }) => {
          const title = locale === "en" && r.title_en ? r.title_en : r.title;
          const desc = locale === "en" && r.description_en ? r.description_en : r.description;
          const tone: "primary" | "secondary" | "muted" = missCount === 0 ? "primary" : missCount <= 2 ? "secondary" : "muted";
          return (
            <article key={r.id} className="overflow-hidden rounded-2xl bg-card shadow-sm">
              <Link to="/recipe/$id" params={{ id: r.id }}>
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={r.image} alt={title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </Link>
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="secondary">{t(r.difficulty)}</Badge>
                  <Badge tone="muted">{r.timeMinutes} {t("minutes")}</Badge>
                  <Badge tone={tone}>
                    {missCount === 0 ? t("canCookNow") : `${t("youHave")} ${have}/${total}`}
                  </Badge>
                </div>
                <h3 className="font-display text-lg leading-tight">{title}</h3>
                <p className="line-clamp-2 text-sm text-on-surface-variant">{desc}</p>
                {missing.length > 0 && (
                  <div className="rounded-xl bg-surface-container-low p-3 text-xs">
                    <div className="mb-1.5 font-semibold text-on-surface-variant">
                      {t("missing")}: {missing.map((m) => m.name).slice(0, 4).join(", ")}{missing.length > 4 ? "…" : ""}
                    </div>
                    <button
                      type="button"
                      onClick={() => addMissingToShopping(missing, r.id)}
                      className="inline-flex items-center gap-1 font-semibold text-primary"
                    >
                      <ShoppingCart className="h-3 w-3" /> {t("addToShopping")}
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// Tipo helper
function getMatchesType() {
  return [] as Array<{
    r: import("@/lib/types").Recipe;
    have: number;
    total: number;
    missing: { name: string }[];
    missCount: number;
  }>;
}

function countMatches(ingredients: string[], pantry: string[]) {
  let n = 0;
  for (const ing of ingredients) {
    if (pantry.some((p) => normalize(ing).includes(normalize(p)) || normalize(p).includes(normalize(ing)))) n++;
  }
  return n;
}

function Section({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 font-display text-base font-semibold">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
