import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI, extractJson } from "./ai.server";

const RecipeShape = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeMinutes: z.number().optional(),
  ingredients: z.array(z.object({ name: z.string(), quantity: z.string().optional() })).optional(),
  equipment: z.array(z.string()).optional(),
  instructions: z.string().optional(),
  steps: z.array(z.string()).optional(),
});

export const aiAssistRecipe = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ title: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const text = await callAI({
      system:
        "Eres un chef. Devuelves SIEMPRE JSON válido con la receta solicitada. No incluyas explicaciones ni markdown.",
      responseJson: true,
      prompt: `Crea una receta para: "${data.title}". Responde JSON con: title, description (1 frase), category (uno de: breakfast, lunch, dinner, dessert, snack, bakery, drink, sauce, salad, soup), difficulty (easy|medium|hard), timeMinutes (número), ingredients (array de {name, quantity}), equipment (array de strings), instructions (string con pasos separados por \\n).`,
    });
    return RecipeShape.parse(extractJson(text));
  });

export const aiSearchRecipes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ query: z.string().min(1), locale: z.enum(["es", "en"]).default("es") }).parse(d))
  .handler(async ({ data }) => {
    const lang = data.locale === "es" ? "español" : "English";
    const text = await callAI({
      system: `Eres un experto en cocina mundial. Devuelves SOLO JSON. Idioma: ${lang}.`,
      responseJson: true,
      prompt: `Sugiere 5 recetas para la búsqueda: "${data.query}". Responde JSON con la forma: { "recipes": [ { "title": string, "description": string (1 frase), "category": "breakfast"|"lunch"|"dinner"|"dessert"|"snack"|"bakery"|"drink"|"sauce"|"salad"|"soup", "difficulty": "easy"|"medium"|"hard", "timeMinutes": number, "ingredients": [{"name": string, "quantity": string}], "equipment": [string], "steps": [string] } ] }`,
    });
    const parsed = extractJson<{ recipes: unknown[] }>(text);
    return {
      recipes: z.array(RecipeShape).parse(parsed.recipes),
    };
  });

export const aiImportFromUrl = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }) => {
    const html = await fetch(data.url).then((r) => r.text()).catch(() => "");
    const text = await callAI({
      system: "Extraes recetas de páginas web. Devuelves SOLO JSON válido.",
      responseJson: true,
      prompt: `Extrae la receta de este contenido HTML (puede estar en cualquier idioma, mantén el original). URL: ${data.url}\n\nHTML (primeros 12000 caracteres):\n${html.slice(0, 12000)}\n\nResponde JSON con: title, description, category (breakfast|lunch|dinner|dessert|snack|bakery|drink|sauce|salad|soup), difficulty (easy|medium|hard), timeMinutes (número), ingredients ([{name, quantity}]), equipment ([string]), steps ([string]).`,
    });
    return RecipeShape.parse(extractJson(text));
  });
