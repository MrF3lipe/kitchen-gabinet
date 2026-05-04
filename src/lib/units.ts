/**
 * Conversor de unidades simple (idea #5).
 * Soporta peso (g, kg, oz, lb), volumen (ml, L, tsp, tbsp, cup, fl oz) y conteo (ud).
 * No mezcla tipos: si la unidad de origen y destino son de tipos distintos, devuelve null.
 */

export type AnyUnit =
  | "g" | "kg" | "oz" | "lb"
  | "ml" | "L" | "tsp" | "tbsp" | "cup" | "fl_oz"
  | "ud";

const TO_GRAMS: Partial<Record<AnyUnit, number>> = {
  g: 1, kg: 1000, oz: 28.3495, lb: 453.592,
};

const TO_ML: Partial<Record<AnyUnit, number>> = {
  ml: 1, L: 1000, tsp: 4.92892, tbsp: 14.7868, cup: 240, fl_oz: 29.5735,
};

export function convert(value: number, from: AnyUnit, to: AnyUnit): number | null {
  if (from === to) return value;
  if (from === "ud" || to === "ud") return null;
  if (from in TO_GRAMS && to in TO_GRAMS) {
    return (value * TO_GRAMS[from]!) / TO_GRAMS[to]!;
  }
  if (from in TO_ML && to in TO_ML) {
    return (value * TO_ML[from]!) / TO_ML[to]!;
  }
  return null; // tipos incompatibles
}

export function format(value: number, unit: AnyUnit): string {
  const rounded = value < 1 ? Math.round(value * 100) / 100 : Math.round(value * 10) / 10;
  return `${rounded} ${unit.replace("_", " ")}`;
}

/** Extrae la primera cantidad+unidad de un texto libre (ej: "200 g harina" -> 200, "g"). */
export function parseQuantity(text: string): { value: number; unit: AnyUnit } | null {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(kg|g|oz|lb|ml|l|tsp|tbsp|cup|cups|fl\s?oz|ud|u)\b/i);
  if (!m) return null;
  const value = parseFloat(m[1].replace(",", "."));
  const u = m[2].toLowerCase().replace(/\s/g, "_");
  const map: Record<string, AnyUnit> = {
    kg: "kg", g: "g", oz: "oz", lb: "lb",
    ml: "ml", l: "L", tsp: "tsp", tbsp: "tbsp",
    cup: "cup", cups: "cup", fl_oz: "fl_oz", ud: "ud", u: "ud",
  };
  return map[u] ? { value, unit: map[u] } : null;
}
