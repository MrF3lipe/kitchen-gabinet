/**
 * Sustituciones culinarias comunes (idea #1).
 * Tabla local — sin IA — fácilmente ampliable.
 * Las claves se normalizan (minúsculas + sin acentos) antes de buscar.
 */

export interface Substitute {
  /** Texto que se mostrará al usuario describiendo la alternativa. */
  label: string;
  /** Notas opcionales (ej. ratio, cuándo aplica). */
  note?: string;
}

const TABLE: Record<string, Substitute[]> = {
  mantequilla: [
    { label: "Aceite de oliva", note: "3/4 de la cantidad" },
    { label: "Margarina", note: "1:1" },
    { label: "Aguacate machacado", note: "1:1, en repostería" },
  ],
  butter: [
    { label: "Olive oil", note: "use 3/4 of the amount" },
    { label: "Margarine", note: "1:1" },
  ],
  leche: [
    { label: "Bebida de avena", note: "1:1" },
    { label: "Bebida de almendra", note: "1:1" },
    { label: "Yogur diluido (50% agua)", note: "1:1" },
  ],
  milk: [
    { label: "Oat milk", note: "1:1" },
    { label: "Almond milk", note: "1:1" },
  ],
  huevo: [
    { label: "1 cda de linaza + 3 cdas agua (reposar 5 min)", note: "por cada huevo" },
    { label: "1/4 taza compota de manzana", note: "en repostería" },
  ],
  egg: [
    { label: "1 tbsp ground flax + 3 tbsp water", note: "per egg" },
    { label: "1/4 cup applesauce", note: "in baking" },
  ],
  azucar: [
    { label: "Miel", note: "3/4 de la cantidad y reduce líquido" },
    { label: "Panela / Azúcar moreno", note: "1:1" },
  ],
  sugar: [
    { label: "Honey", note: "use 3/4 and reduce liquids" },
    { label: "Brown sugar", note: "1:1" },
  ],
  harina: [
    { label: "Harina de avena (avena molida)", note: "1:1" },
    { label: "Harina sin gluten + 1/2 cdita goma xantana", note: "1:1" },
  ],
  flour: [
    { label: "Oat flour (ground oats)", note: "1:1" },
    { label: "Gluten-free flour blend", note: "1:1" },
  ],
  nata: [
    { label: "Leche evaporada", note: "1:1 para salsas" },
    { label: "Yogur griego", note: "salsas frías" },
  ],
  cream: [
    { label: "Evaporated milk", note: "1:1 in sauces" },
    { label: "Greek yogurt", note: "for cold sauces" },
  ],
  cilantro: [{ label: "Perejil + un toque de lima" }],
  perejil: [{ label: "Cilantro" }, { label: "Albahaca" }],
  albahaca: [{ label: "Espinaca + orégano fresco" }],
  basil: [{ label: "Spinach + a pinch of oregano" }],
  limon: [{ label: "Lima", note: "1:1" }, { label: "Vinagre blanco", note: "mitad de cantidad" }],
  lemon: [{ label: "Lime", note: "1:1" }, { label: "White vinegar", note: "half the amount" }],
};

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/** Devuelve sustitutos para un nombre de ingrediente, o array vacío si no hay. */
export function findSubstitutes(name: string): Substitute[] {
  const n = norm(name);
  if (TABLE[n]) return TABLE[n];
  // intentar por contención de palabras (ej "leche entera" -> "leche")
  for (const key of Object.keys(TABLE)) {
    if (n.includes(key)) return TABLE[key];
  }
  return [];
}
