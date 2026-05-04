import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { L as Link } from "./router-B9RXT7T5.js";
import { u as useT, e as useLocale, a as useDb, A as AppShell, S as Search, d as db, b as uid } from "./AppShell-C8t9H1Vy.js";
import { B as Badge } from "./RecipeCard-BBV79pYk.js";
import { P as Plus } from "./plus-ClPaT0rG.js";
import { S as ShoppingCart } from "./shopping-cart-Dnd7onwp.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./heart-SpEnJ-ME.js";
function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function SearchPage() {
  const t = useT();
  const locale = useLocale();
  const {
    recipes,
    pantry
  } = useDb();
  const [q, setQ] = reactExports.useState("");
  const [selectedIngredients, setSelectedIngredients] = reactExports.useState(() => pantry.filter((p) => p.available).slice(0, 4).map((p) => p.name));
  const [utensils, setUtensils] = reactExports.useState([]);
  const [difficulty, setDifficulty] = reactExports.useState(null);
  const allUtensils = ["Horno", "Licuadora", "Microondas", "Sartén", "Olla"];
  const ingredientPool = pantry.map((p) => p.name);
  const matches = reactExports.useMemo(() => {
    return recipes.map((r) => {
      const have = countMatches(r.ingredients.map((i) => i.name), selectedIngredients);
      const total = r.ingredients.length;
      const missing = r.ingredients.filter((i) => !selectedIngredients.some((s) => normalize(i.name).includes(normalize(s))));
      return {
        r,
        have,
        total,
        missing
      };
    }).filter(({
      r
    }) => {
      const title = locale === "en" && r.title_en ? r.title_en : r.title;
      if (q && !normalize(title).includes(normalize(q))) return false;
      if (difficulty && r.difficulty !== difficulty) return false;
      if (utensils.length && !utensils.every((u) => r.equipment.some((e) => normalize(e).includes(normalize(u))))) return false;
      return true;
    }).sort((a, b) => b.have / b.total - a.have / a.total);
  }, [recipes, selectedIngredients, q, difficulty, utensils, locale]);
  function toggle(arr, v) {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  }
  function addMissingToShopping(missing, recipeId) {
    db.addManyShopping(missing.map((m) => ({
      id: uid(),
      name: m.name,
      done: false,
      fromRecipeId: recipeId
    })));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 px-4 pt-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold leading-tight", children: t("whatToCook") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 rounded-full border border-outline-variant bg-card px-4 py-3 shadow-sm focus-within:border-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: t("searchPlaceholder"), className: "flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("ingredientsIHave"), icon: "🍅", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      ingredientPool.map((name) => {
        const active = selectedIngredients.includes(name);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setSelectedIngredients((arr) => toggle(arr, name)), className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-transparent bg-primary text-primary-foreground" : "border-outline-variant text-on-surface-variant"}`, children: [
          active ? "✓ " : "",
          name
        ] }, name);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pantry", className: "rounded-full border border-dashed border-outline px-3 py-1.5 text-xs font-semibold text-on-surface-variant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 inline h-3 w-3" }),
        " ",
        t("addOther")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("utensils"), icon: "🍳", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: allUtensils.map((u) => {
      const active = utensils.includes(u);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setUtensils((arr) => toggle(arr, u)), className: `rounded-xl border p-3 text-center text-xs font-semibold transition ${active ? "border-secondary bg-secondary-container text-accent-foreground" : "border-outline-variant bg-card text-on-surface-variant"}`, children: u }, u);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("difficulty"), icon: "", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-hidden rounded-full bg-surface-container", children: ["easy", "medium", "hard"].map((d) => {
      const active = difficulty === d;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDifficulty(active ? null : d), className: `flex-1 py-2 text-xs font-bold uppercase tracking-wider transition ${active ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`, children: t(d) }, d);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: t("suggestionsForYou") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-on-surface-variant", children: [
        matches.length,
        " ",
        t("results")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      matches.map(({
        r,
        have,
        total,
        missing
      }) => {
        const title = locale === "en" && r.title_en ? r.title_en : r.title;
        const desc = locale === "en" && r.description_en ? r.description_en : r.description;
        const pct = total ? have / total : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "overflow-hidden rounded-2xl bg-card shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recipe/$id", params: {
            id: r.id
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.image, alt: title, className: "h-full w-full object-cover", loading: "lazy" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "secondary", children: t(r.difficulty) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "muted", children: [
                r.timeMinutes,
                " ",
                t("minutes")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: pct >= 0.7 ? "primary" : "muted", children: [
                t("youHave"),
                " ",
                have,
                "/",
                total
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg leading-tight", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-sm text-on-surface-variant", children: desc }),
            missing.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-surface-container-low p-3 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 font-semibold text-on-surface-variant", children: [
                t("missing"),
                ":",
                " ",
                missing.map((m) => m.name).slice(0, 4).join(", "),
                missing.length > 4 ? "…" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => addMissingToShopping(missing, r.id), className: "inline-flex items-center gap-1 font-semibold text-primary", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3" }),
                " ",
                t("addToShopping")
              ] })
            ] })
          ] })
        ] }, r.id);
      }),
      matches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-on-surface-variant", children: t("noResults") })
    ] })
  ] }) });
}
function countMatches(ingredients, pantry) {
  let n = 0;
  for (const ing of ingredients) {
    if (pantry.some((p) => normalize(ing).includes(normalize(p)) || normalize(p).includes(normalize(ing)))) n++;
  }
  return n;
}
function Section({
  title,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card p-4 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-2 border-b border-outline-variant pb-2 font-display text-base font-semibold", children: [
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: icon }),
      title
    ] }),
    children
  ] });
}
export {
  SearchPage as component
};
