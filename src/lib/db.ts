import { get, set } from "idb-keyval";
import { useSyncExternalStore } from "react";
import type {
  MealPlanEntry,
  NotificationsConfig,
  PantryCategory,
  PantryItem,
  Recipe,
  Settings,
  ShoppingItem,
  Unit,
} from "./types";
import { seedRecipes, seedPantry, seedPantryCategories } from "./seed";

interface DBState {
  recipes: Recipe[];
  pantry: PantryItem[];
  pantryCategories: PantryCategory[];
  shopping: ShoppingItem[];
  favorites: string[];
  settings: Settings;
  mealPlan: MealPlanEntry[];
  notifications: NotificationsConfig;
  /** versión de esquema, para migraciones suaves */
  schemaVersion: number;
}

const KEY = "kc:db:v1";
const SCHEMA_VERSION = 2;

const defaultSettings: Settings = { locale: "es", theme: "light", onboarded: false, currency: "€" };
const defaultNotifications: NotificationsConfig = { expiryEnabled: true, expiryDaysBefore: 2 };

let state: DBState = {
  recipes: [],
  pantry: [],
  pantryCategories: [],
  shopping: [],
  favorites: [],
  settings: defaultSettings,
  mealPlan: [],
  notifications: defaultNotifications,
  schemaVersion: SCHEMA_VERSION,
};
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function persist() {
  await set(KEY, state);
}

/** Migración suave de v1 -> v2 (ítems sin quantity/unit). */
function migrate(stored: Partial<DBState> & { recipes?: Recipe[] }): DBState {
  const sv = stored.schemaVersion ?? 1;
  const pantry = (stored.pantry ?? []).map((p) => ({
    ...p,
    quantity: typeof (p as PantryItem).quantity === "number" ? (p as PantryItem).quantity : (p.available ? 1 : 0),
    unit: ((p as PantryItem).unit ?? "ud") as Unit,
  })) as PantryItem[];
  const shopping = (stored.shopping ?? []).map((s) => ({
    ...s,
    quantity: typeof (s as ShoppingItem).quantity === "number" ? (s as ShoppingItem).quantity : 1,
    unit: ((s as ShoppingItem).unit ?? "ud") as Unit,
  })) as ShoppingItem[];
  const pantryCategories =
    stored.pantryCategories && stored.pantryCategories.length
      ? stored.pantryCategories
      : seedPantryCategories();
  return {
    recipes: stored.recipes ?? [],
    pantry,
    pantryCategories,
    shopping,
    favorites: stored.favorites ?? [],
    settings: { ...defaultSettings, ...(stored.settings ?? {}) },
    mealPlan: stored.mealPlan ?? [],
    notifications: { ...defaultNotifications, ...(stored.notifications ?? {}) },
    schemaVersion: SCHEMA_VERSION,
  };
}

export async function initDb() {
  if (typeof window === "undefined" || loaded) return;
  const stored = await get<Partial<DBState>>(KEY);
  if (stored && stored.recipes && stored.recipes.length) {
    state = migrate(stored);
  } else {
    state = {
      recipes: seedRecipes(),
      pantry: seedPantry(),
      pantryCategories: seedPantryCategories(),
      shopping: [],
      favorites: [],
      settings: defaultSettings,
      mealPlan: [],
      notifications: defaultNotifications,
      schemaVersion: SCHEMA_VERSION,
    };
  }
  await persist();
  if (state.settings.theme === "dark") document.documentElement.classList.add("dark");
  loaded = true;
  notify();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() { return state; }
function getServerSnapshot() { return state; }

export function useDb(): DBState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function update(mutator: (s: DBState) => DBState) {
  state = mutator(state);
  notify();
  void persist();
}

export const db = {
  // recipes
  addRecipe(r: Recipe) { update((s) => ({ ...s, recipes: [r, ...s.recipes] })); },
  updateRecipe(id: string, patch: Partial<Recipe>) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r)),
    }));
  },
  deleteRecipe(id: string) {
    update((s) => ({
      ...s,
      recipes: s.recipes.filter((r) => r.id !== id),
      favorites: s.favorites.filter((f) => f !== id),
      mealPlan: s.mealPlan.filter((m) => m.recipeId !== id),
    }));
  },
  incrementCooked(id: string) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map((r) =>
        r.id === id ? { ...r, cookedCount: (r.cookedCount ?? 0) + 1, updatedAt: Date.now() } : r,
      ),
    }));
  },
  rateRecipe(id: string, rating: number) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map((r) => (r.id === id ? { ...r, rating, updatedAt: Date.now() } : r)),
    }));
  },
  toggleFavorite(id: string) {
    update((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  },

  // pantry items
  addPantry(item: PantryItem) { update((s) => ({ ...s, pantry: [...s.pantry, item] })); },
  updatePantry(id: string, patch: Partial<PantryItem>) {
    update((s) => ({ ...s, pantry: s.pantry.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
  deletePantry(id: string) { update((s) => ({ ...s, pantry: s.pantry.filter((p) => p.id !== id) })); },
  togglePantry(id: string) {
    update((s) => ({
      ...s,
      pantry: s.pantry.map((p) => (p.id === id ? { ...p, available: !p.available } : p)),
    }));
  },
  /** Suma o resta cantidad. Si llega a 0, mantiene el ítem pero `available=false`. */
  adjustPantry(id: string, delta: number) {
    update((s) => ({
      ...s,
      pantry: s.pantry.map((p) => {
        if (p.id !== id) return p;
        const q = Math.max(0, Math.round((p.quantity + delta) * 100) / 100);
        return { ...p, quantity: q, available: q > 0 };
      }),
    }));
  },
  setPantryQuantity(id: string, quantity: number) {
    update((s) => ({
      ...s,
      pantry: s.pantry.map((p) => (p.id === id ? { ...p, quantity, available: quantity > 0 } : p)),
    }));
  },

  // pantry categories
  addPantryCategory(cat: PantryCategory) {
    update((s) => ({ ...s, pantryCategories: [...s.pantryCategories, cat] }));
  },
  updatePantryCategory(id: string, patch: Partial<PantryCategory>) {
    update((s) => {
      const old = s.pantryCategories.find((c) => c.id === id);
      const next = s.pantryCategories.map((c) => (c.id === id ? { ...c, ...patch } : c));
      // si cambia el nombre, propagar a items
      const pantry =
        old && patch.name && patch.name !== old.name
          ? s.pantry.map((p) => (p.category === old.name ? { ...p, category: patch.name! } : p))
          : s.pantry;
      return { ...s, pantryCategories: next, pantry };
    });
  },
  /** Elimina categoría. Los ítems se mueven a `moveTo` o se borran si no se indica. */
  deletePantryCategory(id: string, moveTo?: string) {
    update((s) => {
      const cat = s.pantryCategories.find((c) => c.id === id);
      if (!cat) return s;
      const pantry = moveTo
        ? s.pantry.map((p) => (p.category === cat.name ? { ...p, category: moveTo } : p))
        : s.pantry.filter((p) => p.category !== cat.name);
      return { ...s, pantryCategories: s.pantryCategories.filter((c) => c.id !== id), pantry };
    });
  },

  // shopping
  addShopping(item: ShoppingItem) { update((s) => ({ ...s, shopping: [...s.shopping, item] })); },
  addManyShopping(items: ShoppingItem[]) { update((s) => ({ ...s, shopping: [...s.shopping, ...items] })); },
  toggleShopping(id: string) {
    update((s) => ({ ...s, shopping: s.shopping.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) }));
  },
  updateShopping(id: string, patch: Partial<ShoppingItem>) {
    update((s) => ({ ...s, shopping: s.shopping.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  },
  deleteShopping(id: string) { update((s) => ({ ...s, shopping: s.shopping.filter((i) => i.id !== id) })); },
  clearDoneShopping() { update((s) => ({ ...s, shopping: s.shopping.filter((i) => !i.done) })); },
  /** Mueve los ítems comprados a la despensa, sumando cantidades cuando coincida nombre+unidad. */
  moveDoneToPantry(defaultCategory = "Otros") {
    update((s) => {
      const done = s.shopping.filter((i) => i.done);
      let pantry = [...s.pantry];
      for (const item of done) {
        const ix = pantry.findIndex(
          (p) => p.name.toLowerCase() === item.name.toLowerCase() && p.unit === item.unit,
        );
        if (ix >= 0) {
          const cur = pantry[ix];
          pantry[ix] = { ...cur, quantity: cur.quantity + item.quantity, available: true };
        } else {
          pantry.push({
            id: uid(),
            name: item.name,
            category: defaultCategory,
            quantity: item.quantity,
            unit: item.unit,
            available: true,
          });
        }
      }
      return { ...s, pantry, shopping: s.shopping.filter((i) => !i.done) };
    });
  },

  // meal plan
  addMealPlan(entry: MealPlanEntry) { update((s) => ({ ...s, mealPlan: [...s.mealPlan, entry] })); },
  removeMealPlan(id: string) { update((s) => ({ ...s, mealPlan: s.mealPlan.filter((m) => m.id !== id) })); },
  clearMealPlanWeek(weekStart: string) {
    update((s) => ({ ...s, mealPlan: s.mealPlan.filter((m) => m.weekStart !== weekStart) }));
  },

  // notifications config
  setNotifications(patch: Partial<NotificationsConfig>) {
    update((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }));
  },

  // settings
  setSettings(patch: Partial<Settings>) {
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
    if (patch.theme) document.documentElement.classList.toggle("dark", patch.theme === "dark");
  },

  // backup
  exportAll(): string { return JSON.stringify(state, null, 2); },
  importAll(json: string) {
    const parsed = JSON.parse(json) as Partial<DBState>;
    update(() => migrate(parsed));
    if (parsed.settings?.theme) {
      document.documentElement.classList.toggle("dark", parsed.settings.theme === "dark");
    }
  },
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
