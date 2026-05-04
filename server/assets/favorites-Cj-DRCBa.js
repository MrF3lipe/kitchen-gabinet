import { U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { u as useT, a as useDb, A as AppShell } from "./AppShell-C8t9H1Vy.js";
import { R as RecipeCard } from "./RecipeCard-BBV79pYk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-B9RXT7T5.js";
import "./heart-SpEnJ-ME.js";
function Favorites() {
  const t = useT();
  const {
    recipes,
    favorites
  } = useDb();
  const favs = recipes.filter((r) => favorites.includes(r.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 px-4 pt-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold tracking-tight", children: t("favorites") }),
    favs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-on-surface-variant", children: t("nothingYet") }) : favs.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecipeCard, { recipe: r, variant: "compact" }, r.id))
  ] }) });
}
export {
  Favorites as component
};
