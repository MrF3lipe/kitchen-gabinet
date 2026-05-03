import { Link } from "@tanstack/react-router";
import { Clock, Heart } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { useT, useLocale } from "@/lib/i18n";
import { db, useDb } from "@/lib/db";

export function RecipeCard({ recipe, variant = "large" }: { recipe: Recipe; variant?: "large" | "compact" }) {
  const t = useT();
  const locale = useLocale();
  const { favorites } = useDb();
  const isFav = favorites.includes(recipe.id);

  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const desc = locale === "en" && recipe.description_en ? recipe.description_en : recipe.description;

  if (variant === "compact") {
    return (
      <Link to="/recipe/$id" params={{ id: recipe.id }} className="block">
        <article className="overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.99]">
          <div className="aspect-[16/10] overflow-hidden bg-muted">
            <img src={recipe.image} alt={title} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-2 p-4">
            {recipe.featured && (
              <span className="inline-block rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                {t("featured")}
              </span>
            )}
            <h3 className="font-display text-xl leading-tight">{title}</h3>
            <p className="line-clamp-2 text-sm text-on-surface-variant">{desc}</p>
            <div className="flex items-center gap-1.5 pt-1 text-sm text-on-surface-variant">
              <Clock className="h-4 w-4" />
              <span>{recipe.timeMinutes} {t("minutes")}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-2xl bg-card shadow-sm">
      <Link to="/recipe/$id" params={{ id: recipe.id }} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <img src={recipe.image} alt={title} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </Link>
      <button
        type="button"
        onClick={() => db.toggleFavorite(recipe.id)}
        className="absolute right-3 top-3 rounded-full bg-card/95 p-2 shadow"
        aria-label="Favorite"
      >
        <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-on-surface-variant"}`} />
      </button>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="secondary">{t(difficultyKey(recipe.difficulty))}</Badge>
          <Badge tone="muted">
            <Clock className="mr-1 inline h-3 w-3" />
            {recipe.timeMinutes} {t("minutes")}
          </Badge>
        </div>
        <h3 className="font-display text-xl leading-tight">{title}</h3>
        <p className="line-clamp-2 text-sm text-on-surface-variant">{desc}</p>
        <Link
          to="/recipe/$id"
          params={{ id: recipe.id }}
          className="block w-full rounded-full border border-outline-variant py-2.5 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant transition hover:border-primary hover:text-primary"
        >
          {t("viewRecipe")}
        </Link>
      </div>
    </article>
  );
}

function difficultyKey(d: Recipe["difficulty"]) {
  return d === "easy" ? ("easy" as const) : d === "medium" ? ("medium" as const) : ("hard" as const);
}

export function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "primary" | "secondary" | "muted" }) {
  const cls =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "secondary"
      ? "bg-secondary-container text-accent-foreground"
      : "bg-surface-container text-on-surface-variant";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}
