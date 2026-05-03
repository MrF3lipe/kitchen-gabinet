import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecipeCard } from "@/components/RecipeCard";
import { useDb } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";
import type { Category } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: Index,
});

const CHIPS: { key: Category; tone: "primary" | "secondary" | "muted" }[] = [
  { key: "breakfast", tone: "secondary" },
  { key: "lunch", tone: "primary" },
  { key: "dinner", tone: "muted" },
  { key: "dessert", tone: "muted" },
  { key: "snack", tone: "muted" },
];

function Index() {
  const t = useT();
  const locale = useLocale();
  const { recipes } = useDb();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [q, setQ] = useState("");

  const filtered = recipes.filter((r) => {
    const matchCat = filter === "all" || r.category === filter;
    const title = locale === "en" && r.title_en ? r.title_en : r.title;
    const matchQ = !q || title.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <AppShell>
      <div className="space-y-6 px-4 pt-4">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight">
          {t("whatToCook")}
        </h1>

        <label className="flex items-center gap-2 rounded-full border border-outline-variant bg-card px-4 py-3 shadow-sm focus-within:border-primary">
          <Search className="h-4 w-4 text-primary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant"
          />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
          <Chip active={filter === "all"} onClick={() => setFilter("all")} tone="muted">
            {t("all")}
          </Chip>
          {CHIPS.map(({ key, tone }) => (
            <Chip key={key} active={filter === key} onClick={() => setFilter(key)} tone={tone}>
              {t(key)}
            </Chip>
          ))}
        </div>

        <div className="space-y-4 pb-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">{t("noResults")}</p>
          ) : (
            filtered.map((r) => <RecipeCard key={r.id} recipe={r} variant="compact" />)
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Chip({
  children,
  active,
  onClick,
  tone,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tone: "primary" | "secondary" | "muted";
}) {
  const base = "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition";
  const activeCls =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : tone === "secondary"
      ? "bg-secondary-container text-accent-foreground"
      : "bg-foreground text-background";
  const idle = "bg-surface-container text-on-surface-variant";
  return (
    <button type="button" onClick={onClick} className={`${base} ${active ? activeCls : idle}`}>
      {children}
    </button>
  );
}
