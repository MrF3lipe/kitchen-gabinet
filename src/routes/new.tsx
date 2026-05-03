import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Plus, X, Save, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { db, uid } from "@/lib/db";
import { useT } from "@/lib/i18n";
import type { Category, Difficulty, Ingredient, Recipe } from "@/lib/types";
import { aiAssistRecipe } from "@/server/ai.functions";

export const Route = createFileRoute("/new")({
  component: NewRecipe,
});

const CATS: Category[] = ["breakfast", "lunch", "dinner", "dessert", "snack", "bakery", "drink", "sauce", "salad", "soup"];

function NewRecipe() {
  const t = useT();
  const nav = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<Category>("dinner");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "" }]);
  const [equipment, setEquipment] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  }

  async function aiAssist() {
    if (!title.trim()) return;
    setAiBusy(true);
    try {
      const data = await aiAssistRecipe({ data: { title } });
      if (data.ingredients) setIngredients(data.ingredients);
      if (data.equipment) setEquipment(data.equipment);
      if (data.instructions) setInstructions(data.instructions);
      if (data.timeMinutes) setTime(String(data.timeMinutes));
      if (data.category) setCategory(data.category as Category);
    } catch (err) {
      console.error(err);
    } finally {
      setAiBusy(false);
    }
  }

  function save() {
    if (!title.trim()) return;
    const recipe: Recipe = {
      id: uid(),
      title: title.trim(),
      description: instructions.split("\n")[0]?.slice(0, 140) ?? "",
      image: photo ?? "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=900&q=70",
      category,
      difficulty,
      timeMinutes: parseInt(time) || 30,
      servings: 4,
      ingredients: ingredients.filter((i) => i.name.trim()),
      equipment: equipment.filter((e) => e.trim()),
      steps: instructions.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.addRecipe(recipe);
    nav({ to: "/recipe/$id", params: { id: recipe.id } });
  }

  return (
    <AppShell>
      <div className="space-y-6 px-4 pt-4 pb-4">
        <header>
          <h1 className="font-display text-4xl font-semibold tracking-tight">{t("newRecipe")}</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{t("docCreation")}</p>
        </header>

        <div className="space-y-4 rounded-2xl bg-card p-4 shadow-sm">
          <label className="flex aspect-[16/10] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant overflow-hidden">
            {photo ? (
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">{t("addPhoto")}</span>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
          </label>

          <Field label={t("recipeTitle")}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="w-full border-b border-outline-variant bg-transparent py-2 font-display text-xl outline-none focus:border-primary"
            />
          </Field>

          <Field label={t("prepTime")}>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value.replace(/\D/g, ""))}
              placeholder="45"
              className="w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary"
            />
          </Field>

          <Field label={t("category")}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>{t(c)}</option>
              ))}
            </select>
          </Field>

          <Field label={t("difficulty")}>
            <div className="flex overflow-hidden rounded-full bg-surface-container">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${
                    difficulty === d ? "bg-primary text-primary-foreground" : "text-on-surface-variant"
                  }`}
                >
                  {t(d)}
                </button>
              ))}
            </div>
          </Field>

          <button
            type="button"
            onClick={aiAssist}
            disabled={!title.trim() || aiBusy}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-primary py-2.5 text-sm font-semibold text-primary disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {aiBusy ? t("aiThinking") : t("aiAssist")}
          </button>
        </div>

        <ListSection
          title={t("ingredients")}
          items={ingredients}
          onChange={setIngredients}
          renderItem={(item, set) => (
            <div className="flex flex-1 gap-2">
              <input
                value={item.quantity ?? ""}
                onChange={(e) => set({ ...item, quantity: e.target.value })}
                placeholder="2 tazas"
                className="w-20 rounded-lg border border-outline-variant bg-card px-2 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                value={item.name}
                onChange={(e) => set({ ...item, name: e.target.value })}
                placeholder="Harina"
                className="flex-1 rounded-lg border border-outline-variant bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          )}
          newItem={() => ({ name: "", quantity: "" })}
          addLabel={t("addIngredient")}
        />

        <ListSection
          title={t("equipment")}
          items={equipment}
          onChange={setEquipment}
          renderItem={(item, set) => (
            <input
              value={item}
              onChange={(e) => set(e.target.value)}
              placeholder="Bol grande"
              className="flex-1 rounded-lg border border-outline-variant bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
          newItem={() => ""}
          addLabel={t("addEquipment")}
          accent="secondary"
        />

        <section>
          <h2 className="font-display text-2xl font-semibold border-b border-outline-variant pb-2">
            {t("instructions")}
          </h2>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            placeholder="Paso 1: Precalienta el horno a 180°C..."
            className="mt-3 w-full resize-y rounded-xl border border-outline-variant bg-card p-3 text-sm outline-none focus:border-primary"
          />
        </section>

        <button
          type="button"
          onClick={save}
          className="sticky bottom-24 mx-auto flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg disabled:opacity-50"
          disabled={!title.trim()}
        >
          <Save className="h-4 w-4" /> {t("saveRecipe")}
        </button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</div>
      {children}
    </div>
  );
}

function ListSection<T>({
  title,
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
  accent = "primary",
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, set: (v: T) => void) => React.ReactNode;
  newItem: () => T;
  addLabel: string;
  accent?: "primary" | "secondary";
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-outline-variant pb-2">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="text-2xl text-on-surface-variant"
          aria-label="Add"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {renderItem(it, (v) => {
              const next = [...items];
              next[idx] = v;
              onChange(next);
            })}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="text-on-surface-variant"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className={`flex items-center gap-1 text-sm font-semibold ${accent === "primary" ? "text-primary" : "text-secondary"}`}
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>
    </section>
  );
}
