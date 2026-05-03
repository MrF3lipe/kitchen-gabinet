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
  image: string; // URL or data URL
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
  source?: string; // URL if imported
  cookedCount?: number;
  rating?: number;
  createdAt: number;
  updatedAt: number;
}

export interface PantryItem {
  id: string;
  name: string;
  name_en?: string;
  category: string; // free-form group: "Lácteos", etc.
  available: boolean;
  expiresAt?: number; // ms epoch
}

export interface ShoppingItem {
  id: string;
  name: string;
  done: boolean;
  fromRecipeId?: string;
}

export type Locale = "es" | "en";
export type Theme = "light" | "dark";

export interface Settings {
  locale: Locale;
  theme: Theme;
  onboarded: boolean;
}
