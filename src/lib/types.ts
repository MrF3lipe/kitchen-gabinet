export type Difficulty = "easy" | "medium" | "hard";
export type Category =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack"
  | "bakery"
  | "drink"
  | "sauce"
  | "salad"
  | "soup";

export type Unit = "ud" | "g" | "kg" | "ml" | "L" | "tsp" | "tbsp" | "cup";

export interface Ingredient {
  name: string;
  quantity?: string; // e.g. "500g", "2 cups"
}

export interface Recipe {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image: string;
  category: Category;
  difficulty: Difficulty;
  timeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  ingredients_en?: Ingredient[];
  equipment: string[];
  equipment_en?: string[];
  steps: string[];
  steps_en?: string[];
  featured?: boolean;
  source?: string;
  cookedCount?: number;
  rating?: number;
  estimatedCost?: number; // total estimado en moneda local (idea #8)
  tags?: string[]; // colecciones / planificador
  createdAt: number;
  updatedAt: number;
}

export interface PantryCategory {
  id: string;
  name: string;
  name_en?: string;
  emoji?: string;
  order: number;
}

export interface PantryItem {
  id: string;
  name: string;
  name_en?: string;
  category: string; // referencia a PantryCategory.name (string libre para retro-compat)
  quantity: number; // cantidad numérica
  unit: Unit; // unidad
  available: boolean; // si está oculto/visible para sugerencias
  expiresAt?: number;
  pricePerUnit?: number; // idea #8
  barcode?: string; // idea #3
}

export interface ShoppingItem {
  id: string;
  name: string;
  done: boolean;
  quantity: number;
  unit: Unit;
  fromRecipeId?: string;
  estimatedPrice?: number;
}

export type Locale = "es" | "en";
export type Theme = "light" | "dark";

export interface Settings {
  locale: Locale;
  theme: Theme;
  onboarded: boolean;
  currency?: string; // ej. "€", "$"
}

// === Idea #2: Planificador semanal ===
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type MealSlot = "breakfast" | "lunch" | "dinner";
export interface MealPlanEntry {
  id: string;
  weekStart: string; // YYYY-MM-DD del lunes
  day: Weekday;
  slot: MealSlot;
  recipeId: string;
}

// === Idea #9: Notificaciones locales (config) ===
export interface NotificationsConfig {
  expiryEnabled: boolean;
  expiryDaysBefore: number; // ej 2
}
