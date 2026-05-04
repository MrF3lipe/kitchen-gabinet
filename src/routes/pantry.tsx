import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, X, Calendar, Pencil, Settings as Cog, Trash2, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Switch } from "@/components/ui/switch";
import { db, useDb, uid } from "@/lib/db";
import { useT, useLocale, type TKey } from "@/lib/i18n";
import type { PantryCategory, PantryItem, Unit } from "@/lib/types";

export const Route = createFileRoute("/pantry")({
  component: PantryPage,
});

const UNITS: Unit[] = ["ud", "g", "kg", "ml", "L", "tsp", "tbsp", "cup"];

function PantryPage() {
  const t = useT();
  const locale = useLocale();
  const { pantry, pantryCategories } = useDb();
  const [adding, setAdding] = useState(false);
  const [managingCats, setManagingCats] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // form de añadir ítem
  const defaultCat = pantryCategories[0]?.name ?? "Otros";
  const [name, setName] = useState("");
  const [cat, setCat] = useState(defaultCat);
  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("ud");
  const [expires, setExpires] = useState("");

  const grouped = useMemo(() => {
    const cats = [...pantryCategories].sort((a, b) => a.order - b.order);
    const map = new Map<string, PantryItem[]>();
    for (const c of cats) map.set(c.name, []);
    for (const p of pantry) {
      if (!map.has(p.category)) map.set(p.category, []);
      map.get(p.category)!.push(p);
    }
    return Array.from(map.entries()).map(([name, items]) => ({
      cat: cats.find((c) => c.name === name) ?? {
        id: name, name, emoji: "🧂", order: 99,
      } as PantryCategory,
      items,
    }));
  }, [pantry, pantryCategories]);

  function add() {
    if (!name.trim()) return;
    db.addPantry({
      id: uid(),
      name: name.trim(),
      category: cat,
      quantity: qty,
      unit,
      available: qty > 0,
      expiresAt: expires ? new Date(expires).getTime() : undefined,
    });
    setName(""); setQty(1); setExpires(""); setAdding(false);
  }

  const totalAvailable = pantry.filter((p) => p.available).length;

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight">{t("myPantry")}</h1>
            <p className="mt-3 max-w-[16rem] text-sm text-on-surface-variant">{t("pantrySubtitle")}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary">
              {totalAvailable} / {pantry.length} {t("items")}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow"
            >
              <Plus className="h-4 w-4" /> {t("addPantry")}
            </button>
            <button
              type="button"
              onClick={() => setManagingCats(true)}
              className="flex shrink-0 items-center justify-center gap-1 rounded-full border border-outline-variant px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              <Cog className="h-3 w-3" /> {t("manageCategories")}
            </button>
          </div>
        </header>

        {adding && (
          <div className="space-y-3 rounded-2xl bg-card p-4 shadow-sm">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("addPantry")}
              className="w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary"
            />
            <div className="grid grid-cols-3 gap-2">
              <label className="col-span-1 flex items-center gap-1 rounded-lg border border-outline-variant px-2 py-1">
                <button onClick={() => setQty(Math.max(0, qty - 1))} className="px-1 text-primary">−</button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-center outline-none"
                />
                <button onClick={() => setQty(qty + 1)} className="px-1 text-primary">+</button>
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="rounded-lg border border-outline-variant bg-transparent px-2 py-2">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-outline-variant bg-transparent px-2 py-2">
                {pantryCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
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

        {grouped.map(({ cat: c, items }) => {
          const displayName = locale === "en" && c.name_en ? c.name_en : c.name;
          return (
            <section key={c.id} className="rounded-2xl bg-card p-4 shadow-sm">
              <h2 className="mb-2 flex items-center justify-between gap-2 border-b border-outline-variant pb-2">
                <span className="flex items-center gap-2 font-display text-xl font-semibold text-primary">
                  <span aria-hidden>{c.emoji ?? "🧂"}</span>
                  {displayName}
                </span>
                <span className="text-xs font-bold text-on-surface-variant">{items.length} {t("items")}</span>
              </h2>
              {items.length === 0 ? (
                <p className="py-3 text-center text-xs text-on-surface-variant">{t("nothingYet")}</p>
              ) : (
                <ul className="divide-y divide-outline-variant/50">
                  {items.map((p) => (
                    <PantryRow
                      key={p.id}
                      item={p}
                      isEditing={editId === p.id}
                      onEdit={() => setEditId(editId === p.id ? null : p.id)}
                      categories={pantryCategories}
                      locale={locale}
                      t={t}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {managingCats && (
        <CategoryManager onClose={() => setManagingCats(false)} t={t} locale={locale} />
      )}
    </AppShell>
  );
}

function PantryRow({
  item, isEditing, onEdit, categories, locale, t,
}: {
  item: PantryItem;
  isEditing: boolean;
  onEdit: () => void;
  categories: PantryCategory[];
  locale: "es" | "en";
  t: (k: TKey, vars?: Record<string, string | number>) => string;
}) {
  const display = locale === "en" && item.name_en ? item.name_en : item.name;
  const exp = expirationLabel(item.expiresAt, t);

  return (
    <li className="py-2.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <div className={`truncate text-sm ${item.available ? "" : "text-on-surface-variant line-through"}`}>{display}</div>
          {exp && (
            <div className={`flex items-center gap-1 text-xs ${exp.urgent ? "text-primary" : "text-on-surface-variant"}`}>
              {exp.urgent && <AlertTriangle className="h-3 w-3" />}
              {exp.text}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-surface-container px-1">
          <button
            onClick={() => db.adjustPantry(item.id, item.unit === "ud" ? -1 : item.quantity > 100 ? -50 : item.quantity > 10 ? -5 : -1)}
            className="h-7 w-7 rounded-full text-primary"
            aria-label="−"
          >−</button>
          <span className="min-w-[3.5rem] text-center text-xs font-bold tabular-nums">
            {item.quantity} {item.unit}
          </span>
          <button
            onClick={() => db.adjustPantry(item.id, item.unit === "ud" ? 1 : item.quantity >= 100 ? 50 : item.quantity >= 10 ? 5 : 1)}
            className="h-7 w-7 rounded-full text-primary"
            aria-label="+"
          >+</button>
        </div>
        <Switch checked={item.available} onCheckedChange={() => db.togglePantry(item.id)} />
        <button onClick={onEdit} className="text-on-surface-variant" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => db.deletePantry(item.id)} className="text-on-surface-variant" aria-label="Delete">
          <X className="h-4 w-4" />
        </button>
      </div>
      {isEditing && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-surface-container-low p-2">
          <input
            value={item.name}
            onChange={(e) => db.updatePantry(item.id, { name: e.target.value })}
            className="rounded border border-outline-variant bg-transparent px-2 py-1 text-xs outline-none"
          />
          <select
            value={item.category}
            onChange={(e) => db.updatePantry(item.id, { category: e.target.value })}
            className="rounded border border-outline-variant bg-transparent px-2 py-1 text-xs outline-none"
          >
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input
            type="date"
            value={item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : ""}
            onChange={(e) => db.updatePantry(item.id, { expiresAt: e.target.value ? new Date(e.target.value).getTime() : undefined })}
            className="rounded border border-outline-variant bg-transparent px-2 py-1 text-xs outline-none"
          />
          <select
            value={item.unit}
            onChange={(e) => db.updatePantry(item.id, { unit: e.target.value as Unit })}
            className="rounded border border-outline-variant bg-transparent px-2 py-1 text-xs outline-none"
          >
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      )}
    </li>
  );
}

function CategoryManager({
  onClose, t, locale,
}: {
  onClose: () => void;
  t: (k: TKey) => string;
  locale: "es" | "en";
}) {
  const { pantryCategories, pantry } = useDb();
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("");

  function add() {
    if (!newName.trim()) return;
    db.addPantryCategory({
      id: uid(),
      name: newName.trim(),
      emoji: newEmoji.trim() || "🧂",
      order: (pantryCategories.at(-1)?.order ?? 0) + 1,
    });
    setNewName(""); setNewEmoji("");
  }

  function remove(c: PantryCategory) {
    if (pantryCategories.length <= 1) {
      alert(t("cantDeleteLast"));
      return;
    }
    const itemsHere = pantry.filter((p) => p.category === c.name).length;
    if (itemsHere === 0) {
      db.deletePantryCategory(c.id);
      return;
    }
    const moveTo = pantryCategories.find((x) => x.id !== c.id)?.name;
    const action = confirm(`${itemsHere} ${t("items")}.\nOK = ${t("moveItemsTo")} ${moveTo}\nCancel = ${t("deleteItemsToo")}`);
    db.deletePantryCategory(c.id, action ? moveTo : undefined);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">{t("manageCategories")}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4 flex gap-2 rounded-2xl bg-card p-3 shadow-sm">
          <input
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            placeholder="🥑"
            maxLength={2}
            className="w-12 rounded border border-outline-variant bg-transparent px-2 py-1 text-center"
          />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("categoryName")}
            className="flex-1 rounded border border-outline-variant bg-transparent px-2 py-1 outline-none"
          />
          <button onClick={add} className="rounded-full bg-primary px-3 text-primary-foreground"><Plus className="h-4 w-4" /></button>
        </div>

        <ul className="space-y-2">
          {pantryCategories.map((c) => {
            const count = pantry.filter((p) => p.category === c.name).length;
            return (
              <li key={c.id} className="flex items-center gap-2 rounded-xl bg-card p-3 shadow-sm">
                <input
                  value={c.emoji ?? ""}
                  onChange={(e) => db.updatePantryCategory(c.id, { emoji: e.target.value })}
                  maxLength={2}
                  className="w-10 rounded border border-outline-variant bg-transparent px-1 text-center"
                />
                <input
                  value={locale === "en" && c.name_en ? c.name_en : c.name}
                  onChange={(e) => db.updatePantryCategory(c.id, locale === "en" ? { name_en: e.target.value } : { name: e.target.value })}
                  className="flex-1 rounded border border-outline-variant bg-transparent px-2 py-1 outline-none"
                />
                <span className="text-xs text-on-surface-variant">{count}</span>
                <button onClick={() => remove(c)} className="text-on-surface-variant"><Trash2 className="h-4 w-4" /></button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function expirationLabel(ms: number | undefined, t: (k: TKey) => string) {
  if (!ms) return null;
  const days = Math.floor((ms - Date.now()) / 86400000);
  if (days < 0) return { text: t("expired"), urgent: true };
  if (days === 0) return { text: `${t("expiresOn")} ${t("today")}`, urgent: true };
  if (days === 1) return { text: `${t("expiresOn")} ${t("tomorrow")}`, urgent: true };
  return { text: `${days} ${t("daysLeft")}`, urgent: days <= 3 };
}
