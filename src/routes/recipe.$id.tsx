import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Clock, Users, Share2, MoreVertical, ChefHat, Trash2, Download, QrCode, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/RecipeCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db, useDb } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/recipe/$id")({
  component: RecipeDetail,
  notFoundComponent: () => (
    <AppShell><div className="p-8 text-center text-on-surface-variant">404</div></AppShell>
  ),
});

function RecipeDetail() {
  const { id } = Route.useParams();
  const t = useT();
  const locale = useLocale();
  const nav = useNavigate();
  const { recipes, favorites } = useDb();
  const recipe = recipes.find((r) => r.id === id);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const [rating, setRating] = useState(recipe?.rating ?? 0);

  if (!recipe) {
    return <AppShell><div className="p-8 text-center">No encontrada</div></AppShell>;
  }

  const isFav = favorites.includes(recipe.id);
  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const desc = locale === "en" && recipe.description_en ? recipe.description_en : recipe.description;
  const ings = locale === "en" && recipe.ingredients_en ? recipe.ingredients_en : recipe.ingredients;
  const equip = locale === "en" && recipe.equipment_en ? recipe.equipment_en : recipe.equipment;
  const steps = locale === "en" && recipe.steps_en ? recipe.steps_en : recipe.steps;

  const factor = servings / recipe.servings;

  function exportJson() {
    const blob = new Blob([JSON.stringify(recipe, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function deleteRecipe() {
    if (confirm(t("deleteConfirm"))) {
      db.deleteRecipe(recipe.id);
      nav({ to: "/" });
    }
  }

  function rate(n: number) {
    setRating(n);
    db.rateRecipe(recipe.id, n);
  }

  return (
    <AppShell showHeader={false}>
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img src={recipe.image} alt={title} className="h-full w-full object-cover" />
        </div>
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
          <Link to="/" className="rounded-full bg-card/90 p-2 shadow"> ← </Link>
          <div className="flex gap-2">
            <Link to="/recipe/$id/share" params={{ id: recipe.id }} className="rounded-full bg-card/90 p-2 shadow">
              <Share2 className="h-4 w-4" />
            </Link>
            <button onClick={() => db.toggleFavorite(recipe.id)} className="rounded-full bg-card/90 p-2 shadow">
              <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full bg-card/90 p-2 shadow">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/recipe/$id/share" params={{ id: recipe.id }}>
                    <Download className="mr-2 h-4 w-4" /> {t("shareAsImage")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportJson}>
                  <Download className="mr-2 h-4 w-4" /> {t("exportJson")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteRecipe} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="-mt-6 space-y-5 rounded-t-3xl bg-background px-4 pt-6 pb-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="secondary">{t(recipe.category)}</Badge>
          <Badge tone="muted">{t(recipe.difficulty)}</Badge>
          <Badge tone="muted"><Clock className="mr-1 inline h-3 w-3" />{recipe.timeMinutes} {t("minutes")}</Badge>
        </div>

        <h1 className="font-display text-4xl font-semibold leading-[1.05]">{title}</h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p>

        {recipe.cookedCount ? (
          <p className="text-xs text-on-surface-variant">{t("cookedTimes", { n: recipe.cookedCount })}</p>
        ) : null}

        <div className="flex items-center justify-between rounded-2xl bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{t("servings")}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setServings(Math.max(1, servings - 1))} className="h-7 w-7 rounded-full bg-surface-container">−</button>
            <span className="w-6 text-center font-semibold">{servings}</span>
            <button onClick={() => setServings(servings + 1)} className="h-7 w-7 rounded-full bg-surface-container">+</button>
          </div>
        </div>

        <section className="rounded-2xl bg-card p-4 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 border-b border-outline-variant pb-2 font-display text-xl font-semibold text-primary">
            📋 {t("ingredients")}
          </h2>
          <ul className="divide-y divide-outline-variant/50">
            {ings.map((i, idx) => (
              <li key={idx} className="flex items-baseline gap-3 py-2 text-sm">
                <span className="font-bold text-primary">{scale(i.quantity, factor)}</span>
                <span>{i.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-primary">
            🔧 {t("tools")}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {equip.map((e) => (
              <div key={e} className="rounded-xl bg-surface-container-low p-3 text-center text-xs font-semibold text-on-surface-variant">
                {e}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
              📖 {t("preparation")}
            </h2>
            <Link
              to="/recipe/$id/cook"
              params={{ id: recipe.id }}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              <ChefHat className="h-3 w-3" /> {t("cookMode")}
            </Link>
          </div>
          <ol className="space-y-4">
            {steps.map((s, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-secondary bg-secondary-container text-xs font-bold text-accent-foreground">
                  {idx + 1}
                </span>
                <p className="flex-1 text-sm leading-relaxed text-on-surface-variant">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-sm">
          <h2 className="mb-2 font-display text-base font-semibold text-on-surface-variant">{t("rate")}</h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => rate(n)}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-outline-variant"}`} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function scale(qty: string | undefined, factor: number): string {
  if (!qty || factor === 1) return qty ?? "";
  const m = qty.match(/^([\d.,/]+)\s*(.*)$/);
  if (!m) return qty;
  const numStr = m[1].replace(",", ".");
  let n: number;
  if (numStr.includes("/")) {
    const [a, b] = numStr.split("/").map(Number);
    n = a / b;
  } else {
    n = parseFloat(numStr);
  }
  if (!Number.isFinite(n)) return qty;
  const scaled = n * factor;
  const rounded = scaled < 1 ? Math.round(scaled * 100) / 100 : Math.round(scaled * 10) / 10;
  return `${rounded}${m[2] ? " " + m[2] : ""}`;
}
