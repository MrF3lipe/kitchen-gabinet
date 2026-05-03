import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Globe, Sparkles, Plus, LinkIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/RecipeCard";
import { db, uid } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";
import { aiSearchRecipes, aiImportFromUrl } from "@/server/ai.functions";
import type { Recipe } from "@/lib/types";

export const Route = createFileRoute("/search/online")({
  component: OnlineSearch,
});

function OnlineSearch() {
  const t = useT();
  const locale = useLocale();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyUrl, setBusyUrl] = useState(false);
  const [results, setResults] = useState<Awaited<ReturnType<typeof aiSearchRecipes>>["recipes"]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true); setErr(null);
    try {
      const data = await aiSearchRecipes({ data: { query: q, locale } });
      setResults(data.recipes);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  function save(r: typeof results[number]) {
    const recipe: Recipe = {
      id: uid(),
      title: r.title,
      description: r.description ?? "",
      image: `https://source.unsplash.com/featured/?${encodeURIComponent(r.title)},food`,
      category: (r.category as Recipe["category"]) ?? "dinner",
      difficulty: r.difficulty ?? "easy",
      timeMinutes: r.timeMinutes ?? 30,
      servings: 4,
      ingredients: r.ingredients ?? [],
      equipment: r.equipment ?? [],
      steps: r.steps ?? (r.instructions ? r.instructions.split(/\n+/) : []),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.addRecipe(recipe);
    nav({ to: "/recipe/$id", params: { id: recipe.id } });
  }

  async function importUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setBusyUrl(true); setErr(null);
    try {
      const r = await aiImportFromUrl({ data: { url } });
      save({ ...r, instructions: undefined } as never);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusyUrl(false);
    }
  }

  return (
    <AppShell showHeader={false}>
      <header className="flex items-center justify-between border-b border-outline-variant bg-background px-4 py-3">
        <Link to="/search"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="font-display text-lg font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" /> {t("online")}
        </h1>
        <div className="w-5" />
      </header>

      <div className="space-y-5 p-4">
        <form onSubmit={search} className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t("searchOnline")}</label>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("onlinePlaceholder")}
              className="flex-1 rounded-full border border-outline-variant bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button disabled={busy || !q.trim()} className="rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-50">
              {busy ? "..." : <Sparkles className="h-4 w-4" />}
            </button>
          </div>
        </form>

        <form onSubmit={importUrl} className="space-y-2 rounded-2xl bg-card p-4 shadow-sm">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <LinkIcon className="h-3 w-3" /> {t("importFromUrl")}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("importPlaceholder")}
              className="flex-1 rounded-lg border border-outline-variant bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button disabled={busyUrl || !url.trim()} className="rounded-lg bg-secondary px-4 text-xs font-bold uppercase tracking-wider text-secondary-foreground disabled:opacity-50">
              {busyUrl ? "..." : t("import")}
            </button>
          </div>
        </form>

        {err && <p className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">{err}</p>}

        <div className="space-y-3">
          {results.map((r, idx) => (
            <article key={idx} className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="secondary">{t(((r.category as never) ?? "dinner"))}</Badge>
                <Badge tone="muted">{r.timeMinutes ?? "—"} {t("minutes")}</Badge>
                <Badge tone="muted">{t(r.difficulty ?? "easy")}</Badge>
              </div>
              <h3 className="font-display text-lg leading-tight">{r.title}</h3>
              <p className="text-sm text-on-surface-variant">{r.description}</p>
              <button
                onClick={() => save(r)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground"
              >
                <Plus className="h-4 w-4" /> {t("saveToLibrary")}
              </button>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
