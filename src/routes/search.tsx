import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Plus, ShoppingCart } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/RecipeCard";
import { db, useDb, uid } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";
import type { Difficulty, Recipe } from "@/lib/types";

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
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(() =>
    pantry
      .filter((p) => p.available)
      .slice(0, 4)
      .map((p) => p.name),
  );
  const [utensils, setUtensils] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const allUtensils = ["Horno", "Licuadora", "Microondas", "Sartén", "Olla"];

  const ingredientPool = pantry.map((p) => p.name);

  const matches = useMemo(() => {
    return recipes
      .map((r) => {
        const have = countMatches(
          r.ingredients.map((i) => i.name),
          selectedIngredients,
        );
        const total = r.ingredients.length;
        const missing = r.ingredients.filter(
          (i) =>
            !selectedIngredients.some((s) =>
              normalize(i.name).includes(normalize(s)),
            ),
        );
        return { r, have, total, missing };
      })
      .filter(({ r }) => {
        const title =
          locale === "en" && r.title_en ? r.title_en : r.title;
        if (q && !normalize(title).includes(normalize(q))) return false;
        if (difficulty && r.difficulty !== difficulty) return false;
        if (
          utensils.length &&
          !utensils.every((u) =>
            r.equipment.some((e) => normalize(e).includes(normalize(u))),
          )
        )
          return false;
        return true;
      })
      .sort((a, b) => b.have / b.total - a.have / a.total);
  }, [recipes, selectedIngredients, q, difficulty, utensils, locale]);

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }

  function addMissingToShopping(
    missing: { name: string }[],
    recipeId: string,
  ) {
    db.addManyShopping(
      missing.map((m) => ({
        id: uid(),
        name: m.name,
        done: false,
        fromRecipeId: recipeId,
      })),
    );
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold leading-tight">
            {t("whatToCook")}
          </h1>
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

        <Section title={t("ingredientsIHave")} icon="🍅">
          <div className="flex flex-wrap gap-2">
            {ingredientPool.map((name) => {
              const active = selectedIngredients.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() =>
                    setSelectedIngredients((arr) => toggle(arr, name))
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {active ? "✓ " : ""}
                  {name}
                </button>
              );
            })}
            <Link
              to="/pantry"
              className="rounded-full border border-dashed border-outline px-3 py-1.5 text-xs font-semibold text-on-surface-variant"
            >
              <Plus className="mr-1 inline h-3 w-3" /> {t("addOther")}
            </Link>
          </div>
        </Section>

        <Section title={t("utensils")} icon="🍳">
          <div className="grid grid-cols-3 gap-2">
            {allUtensils.map((u) => {
              const active = utensils.includes(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUtensils((arr) => toggle(arr, u))}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold transition ${
                    active
                      ? "border-secondary bg-secondary-container text-accent-foreground"
                      : "border-outline-variant bg-card text-on-surface-variant"
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
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-on-surface-variant"
                  }`}
                >
                  {t(d)}
                </button>
              );
            })}
          </div>
        </Section>

        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold">
            {t("suggestionsForYou")}
          </h2>
          <span className="text-xs text-on-surface-variant">
            {matches.length} {t("results")}
          </span>
        </div>

        <div className="space-y-4">
          {matches.map(({ r, have, total, missing }) => {
            const title =
              locale === "en" && r.title_en ? r.title_en : r.title;
            const desc =
              locale === "en" && r.description_en
                ? r.description_en
                : r.description;
            const pct = total ? have / total : 0;
            return (
              <article
                key={r.id}
                className="overflow-hidden rounded-2xl bg-card shadow-sm"
              >
                <Link to="/recipe/$id" params={{ id: r.id }}>
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={r.image}
                      alt={title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="secondary">{t(r.difficulty)}</Badge>
                    <Badge tone="muted">
                      {r.timeMinutes} {t("minutes")}
                    </Badge>
                    <Badge tone={pct >= 0.7 ? "primary" : "muted"}>
                      {t("youHave")} {have}/{total}
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg leading-tight">{title}</h3>
                  <p className="line-clamp-2 text-sm text-on-surface-variant">
                    {desc}
                  </p>
                  {missing.length > 0 && (
                    <div className="rounded-xl bg-surface-container-low p-3 text-xs">
                      <div className="mb-1.5 font-semibold text-on-surface-variant">
                        {t("missing")}:{" "}
                        {missing
                          .map((m) => m.name)
                          .slice(0, 4)
                          .join(", ")}
                        {missing.length > 4 ? "…" : ""}
                      </div>
                      <button
                        type="button"
                        onClick={() => addMissingToShopping(missing, r.id)}
                        className="inline-flex items-center gap-1 font-semibold text-primary"
                      >
                        <ShoppingCart className="h-3 w-3" />{" "}
                        {t("addToShopping")}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
          {matches.length === 0 && (
            <p className="py-8 text-center text-sm text-on-surface-variant">
              {t("noResults")}
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function countMatches(ingredients: string[], pantry: string[]) {
  let n = 0;
  for (const ing of ingredients) {
    if (
      pantry.some(
        (p) =>
          normalize(ing).includes(normalize(p)) ||
          normalize(p).includes(normalize(ing)),
      )
    )
      n++;
  }
  return n;
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
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