import { useSyncExternalStore } from "react";
import { get, set } from "idb-keyval";
import type { Locale } from "./types";

const dict = {
  es: {
    appName: "Kitchen Cabinet",
    explorer: "Explorador",
    search: "Buscar",
    newRecipe: "Nueva Receta",
    pantry: "Despensa",
    favorites: "Favoritos",
    shopping: "Lista de compras",
    settings: "Ajustes",
    cookMode: "Modo Cocina",
    whatToCook: "¿Qué cocinamos hoy?",
    searchPlaceholder: "Buscar por nombre, ingredientes o utensilios",
    searchBtn: "Buscar",
    suggestionsForYou: "Sugerencias para ti",
    results: "resultados",
    ingredientsIHave: "Ingredientes que tengo",
    utensils: "Utensilios",
    difficulty: "Dificultad",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    veryEasy: "Muy fácil",
    addOther: "Añadir otro",
    addIngredient: "Añadir Ingrediente",
    addEquipment: "Añadir Equipo",
    addPantry: "Añadir ingrediente",
    myPantry: "Mi Despensa",
    pantrySubtitle: "Gestiona tus ingredientes para saber qué puedes cocinar hoy.",
    ingredients: "Ingredientes",
    equipment: "Equipo",
    instructions: "Instrucciones",
    preparation: "Preparación",
    tools: "Herramientas",
    saveRecipe: "Guardar receta",
    recipeTitle: "Título de la receta",
    titlePlaceholder: "ej. Pasta Carbonara de la Abuela",
    prepTime: "Tiempo de preparación",
    timePlaceholder: "ej. 45 min",
    category: "Categoría",
    selectCategory: "Selecciona una categoría",
    addPhoto: "Añadir foto",
    docCreation: "Documenta tu última creación culinaria.",
    viewRecipe: "Ver Receta",
    featured: "Destacado",
    minutes: "min",
    servings: "porciones",
    youHave: "Tienes",
    of: "de",
    missing: "Faltan",
    addToShopping: "Añadir a la lista",
    online: "Online",
    searchOnline: "Buscar recetas en línea",
    onlinePlaceholder: "ej. risotto de hongos para 4",
    importFromUrl: "Importar desde URL",
    importPlaceholder: "Pega el enlace de una receta",
    import: "Importar",
    saveToLibrary: "Guardar en biblioteca",
    aiAssist: "Asistir con IA",
    aiThinking: "Pensando...",
    share: "Compartir",
    shareAsImage: "Compartir como imagen",
    shareQr: "Código QR",
    exportJson: "Exportar JSON",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar esta receta?",
    backup: "Copia de seguridad",
    exportAll: "Exportar todo",
    importAll: "Importar copia",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    step: "Paso",
    next: "Siguiente",
    previous: "Anterior",
    finish: "Terminar",
    timer: "Temporizador",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    nothingYet: "Aún no hay nada aquí.",
    noResults: "Sin resultados. Prueba con otros filtros.",
    download: "Descargar",
    sources: "Fuentes",
    saved: "Guardado",
    expiresOn: "Caduca",
    today: "hoy",
    tomorrow: "mañana",
    daysLeft: "días",
    expired: "caducado",
    cookedTimes: "Cocinado {n} veces",
    rate: "Tu valoración",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    breakfast: "Desayunos",
    lunch: "Almuerzos",
    dinner: "Cenas",
    dessert: "Postres",
    snack: "Snacks",
    bakery: "Panadería",
    drink: "Bebidas",
    sauce: "Salsas",
    salad: "Ensaladas",
    soup: "Sopas",
    all: "Todo",
  },
  en: {
    appName: "Kitchen Cabinet",
    explorer: "Explorer",
    search: "Search",
    newRecipe: "New Recipe",
    pantry: "Pantry",
    favorites: "Favorites",
    shopping: "Shopping list",
    settings: "Settings",
    cookMode: "Cook Mode",
    whatToCook: "What shall we cook today?",
    searchPlaceholder: "Search by name, ingredients or tools",
    searchBtn: "Search",
    suggestionsForYou: "Suggestions for you",
    results: "results",
    ingredientsIHave: "Ingredients I have",
    utensils: "Utensils",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    veryEasy: "Very easy",
    addOther: "Add other",
    addIngredient: "Add Ingredient",
    addEquipment: "Add Equipment",
    addPantry: "Add ingredient",
    myPantry: "My Pantry",
    pantrySubtitle: "Manage your ingredients to know what you can cook today.",
    ingredients: "Ingredients",
    equipment: "Equipment",
    instructions: "Instructions",
    preparation: "Preparation",
    tools: "Tools",
    saveRecipe: "Save recipe",
    recipeTitle: "Recipe title",
    titlePlaceholder: "e.g. Grandma's Sunday Roast",
    prepTime: "Prep & cook time",
    timePlaceholder: "e.g. 45 min",
    category: "Category",
    selectCategory: "Select a category",
    addPhoto: "Add recipe photo",
    docCreation: "Document your latest culinary creation.",
    viewRecipe: "View Recipe",
    featured: "Featured",
    minutes: "min",
    servings: "servings",
    youHave: "You have",
    of: "of",
    missing: "Missing",
    addToShopping: "Add to shopping",
    online: "Online",
    searchOnline: "Search recipes online",
    onlinePlaceholder: "e.g. mushroom risotto for 4",
    importFromUrl: "Import from URL",
    importPlaceholder: "Paste a recipe link",
    import: "Import",
    saveToLibrary: "Save to library",
    aiAssist: "AI assist",
    aiThinking: "Thinking...",
    share: "Share",
    shareAsImage: "Share as image",
    shareQr: "QR code",
    exportJson: "Export JSON",
    delete: "Delete",
    deleteConfirm: "Delete this recipe?",
    backup: "Backup",
    exportAll: "Export everything",
    importAll: "Import backup",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    step: "Step",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    timer: "Timer",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    nothingYet: "Nothing here yet.",
    noResults: "No results. Try different filters.",
    download: "Download",
    sources: "Sources",
    saved: "Saved",
    expiresOn: "Expires",
    today: "today",
    tomorrow: "tomorrow",
    daysLeft: "days",
    expired: "expired",
    cookedTimes: "Cooked {n} times",
    rate: "Your rating",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    dessert: "Desserts",
    snack: "Snacks",
    bakery: "Bakery",
    drink: "Drinks",
    sauce: "Sauces",
    salad: "Salads",
    soup: "Soups",
    all: "All",
  },
} as const;

export type TKey = keyof (typeof dict)["es"];

const LOCALE_KEY = "kc:locale";
let current: Locale = "es";
const listeners = new Set<() => void>();

export async function initLocale() {
  if (typeof window === "undefined") return;
  const stored = (await get<Locale>(LOCALE_KEY)) ?? "es";
  current = stored;
  document.documentElement.lang = current;
  listeners.forEach((l) => l());
}

export function setLocale(loc: Locale) {
  current = loc;
  if (typeof document !== "undefined") document.documentElement.lang = loc;
  void set(LOCALE_KEY, loc);
  listeners.forEach((l) => l());
}

export function getLocale(): Locale {
  return current;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => "es" as Locale,
  );
}

export function t(key: TKey, locale: Locale = current, vars?: Record<string, string | number>): string {
  let value: string = (dict[locale] as Record<string, string>)[key] ?? (dict.es as Record<string, string>)[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) value = value.replace(`{${k}}`, String(vars[k]));
  return value;
}

export function useT() {
  const locale = useLocale();
  return (key: TKey, vars?: Record<string, string | number>) => t(key, locale, vars);
}
