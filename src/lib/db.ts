import { get, set } from "idb-keyval";
import { useSyncExternalStore } from "react";
import type { PantryItem, Recipe, Settings, ShoppingItem } from "./types";
import { seedRecipes, seedPantry } from "./seed";

interface DBState {
  recipes: Recipe[];
  pantry: PantryItem[];
  shopping: ShoppingItem[];
  favorites: string[];
  settings: Settings;
}

const KEY = "kc:db:v1";

const defaultSettings: Settings = { locale: "es", theme: "light", onboarded: false };

let state: DBState = {
  recipes: [],
  pantry: [],
  shopping: [],
  favorites: [],
  settings: defaultSettings,
};
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function persist() {
  await set(KEY, state);
}

export async function initDb() {
  if (typeof window === "undefined" || loaded) return;
  const stored = await get<DBState>(KEY);
  if (stored && stored.recipes?.length) {
    state = { ...state, ...stored };
  } else {
    state = {
      recipes: seedRecipes(),
      pantry: seedPantry(),
      shopping: [],
      favorites: [],
      settings: defaultSettings,
    };
    await persist();
  }
  // Apply theme
  if (state.settings.theme === "dark") document.documentElement.classList.add("dark");
  loaded = true;
  notify();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}
function getServerSnapshot() {
  return state;
}

export function useDb(): DBState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Mutations
function update(mutator: (s: DBState) => DBState) {
  state = mutator(state);
  notify();
  void persist();
}

export const db = {
  // recipes
  addRecipe(r: Recipe) {
    update((s) => ({ ...s, recipes: [r, ...s.recipes] }));
  },
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
  // favorites
  toggleFavorite(id: string) {
    update((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  },
  // pantry
  addPantry(item: PantryItem) {
    update((s) => ({ ...s, pantry: [...s.pantry, item] }));
  },
  updatePantry(id: string, patch: Partial<PantryItem>) {
    update((s) => ({ ...s, pantry: s.pantry.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  },
  deletePantry(id: string) {
    update((s) => ({ ...s, pantry: s.pantry.filter((p) => p.id !== id) }));
  },
  togglePantry(id: string) {
    update((s) => ({
      ...s,
      pantry: s.pantry.map((p) => (p.id === id ? { ...p, available: !p.available } : p)),
    }));
  },
  // shopping
  addShopping(item: ShoppingItem) {
    update((s) => ({ ...s, shopping: [...s.shopping, item] }));
  },
  addManyShopping(items: ShoppingItem[]) {
    update((s) => ({ ...s, shopping: [...s.shopping, ...items] }));
  },
  toggleShopping(id: string) {
    update((s) => ({
      ...s,
      shopping: s.shopping.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    }));
  },
  deleteShopping(id: string) {
    update((s) => ({ ...s, shopping: s.shopping.filter((i) => i.id !== id) }));
  },
  clearDoneShopping() {
    update((s) => ({ ...s, shopping: s.shopping.filter((i) => !i.done) }));
  },
  // settings
  setSettings(patch: Partial<Settings>) {
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
    if (patch.theme) {
      document.documentElement.classList.toggle("dark", patch.theme === "dark");
    }
  },
  // backup
  exportAll(): string {
    return JSON.stringify(state, null, 2);
  },
  importAll(json: string) {
    const parsed = JSON.parse(json) as DBState;
    update(() => ({ ...parsed }));
    if (parsed.settings?.theme) {
      document.documentElement.classList.toggle("dark", parsed.settings.theme === "dark");
    }
  },
};

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
