import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useDb } from "@/lib/db";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
});

function Favorites() {
  const t = useT();
  const { recipes, favorites } = useDb();
  const favs = recipes.filter((r) => favorites.includes(r.id));
  return (
    <AppShell>
      <div className="space-y-4 px-4 pt-4 pb-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{t("favorites")}</h1>
        {favs.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">{t("nothingYet")}</p>
        ) : (
          favs.map((r) => <RecipeCard key={r.id} recipe={r} variant="compact" />)
        )}
      </div>
    </AppShell>
  );
}
