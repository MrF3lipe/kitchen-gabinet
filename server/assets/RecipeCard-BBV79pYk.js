import { U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { L as Link } from "./router-B9RXT7T5.js";
import { c as createLucideIcon, u as useT, e as useLocale, a as useDb, d as db } from "./AppShell-C8t9H1Vy.js";
import { H as Heart } from "./heart-SpEnJ-ME.js";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function RecipeCard({ recipe, variant = "large" }) {
  const t = useT();
  const locale = useLocale();
  const { favorites } = useDb();
  const isFav = favorites.includes(recipe.id);
  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const desc = locale === "en" && recipe.description_en ? recipe.description_en : recipe.description;
  if (variant === "compact") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recipe/$id", params: { id: recipe.id }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.99]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: recipe.image, alt: title, loading: "lazy", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4", children: [
        recipe.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-semibold text-accent-foreground", children: t("featured") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl leading-tight", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-sm text-on-surface-variant", children: desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-1 text-sm text-on-surface-variant", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            recipe.timeMinutes,
            " ",
            t("minutes")
          ] })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "relative overflow-hidden rounded-2xl bg-card shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recipe/$id", params: { id: recipe.id }, className: "block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] overflow-hidden bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: recipe.image, alt: title, loading: "lazy", className: "h-full w-full object-cover" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => db.toggleFavorite(recipe.id),
        className: "absolute right-3 top-3 rounded-full bg-card/95 p-2 shadow",
        "aria-label": "Favorite",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-on-surface-variant"}` })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { tone: "secondary", children: t(difficultyKey(recipe.difficulty)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { tone: "muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-1 inline h-3 w-3" }),
          recipe.timeMinutes,
          " ",
          t("minutes")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl leading-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-sm text-on-surface-variant", children: desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/recipe/$id",
          params: { id: recipe.id },
          className: "block w-full rounded-full border border-outline-variant py-2.5 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant transition hover:border-primary hover:text-primary",
          children: t("viewRecipe")
        }
      )
    ] })
  ] });
}
function difficultyKey(d) {
  return d === "easy" ? "easy" : d === "medium" ? "medium" : "hard";
}
function Badge({ children, tone = "muted" }) {
  const cls = tone === "primary" ? "bg-primary text-primary-foreground" : tone === "secondary" ? "bg-secondary-container text-accent-foreground" : "bg-surface-container text-on-surface-variant";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`, children });
}
export {
  Badge as B,
  Clock as C,
  RecipeCard as R
};
