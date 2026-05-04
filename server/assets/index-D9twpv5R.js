import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { u as useT, e as useLocale, a as useDb, A as AppShell, S as Search } from "./AppShell-C8t9H1Vy.js";
import { R as RecipeCard } from "./RecipeCard-BBV79pYk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-B9RXT7T5.js";
import "./heart-SpEnJ-ME.js";
const CHIPS = [{
  key: "breakfast",
  tone: "secondary"
}, {
  key: "lunch",
  tone: "primary"
}, {
  key: "dinner",
  tone: "muted"
}, {
  key: "dessert",
  tone: "muted"
}, {
  key: "snack",
  tone: "muted"
}];
function Index() {
  const t = useT();
  const locale = useLocale();
  const {
    recipes
  } = useDb();
  const [filter, setFilter] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const filtered = recipes.filter((r) => {
    const matchCat = filter === "all" || r.category === filter;
    const title = locale === "en" && r.title_en ? r.title_en : r.title;
    const matchQ = !q || title.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-4 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold leading-[1.05] tracking-tight", children: t("whatToCook") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 rounded-full border border-outline-variant bg-card px-4 py-3 shadow-sm focus-within:border-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: t("searchPlaceholder"), className: "flex-1 bg-transparent text-sm outline-none placeholder:text-on-surface-variant" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: filter === "all", onClick: () => setFilter("all"), tone: "muted", children: t("all") }),
      CHIPS.map(({
        key,
        tone
      }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: filter === key, onClick: () => setFilter(key), tone, children: t(key) }, key))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 pb-4", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-on-surface-variant", children: t("noResults") }) : filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecipeCard, { recipe: r, variant: "compact" }, r.id)) })
  ] }) });
}
function Chip({
  children,
  active,
  onClick,
  tone
}) {
  const base = "shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition";
  const activeCls = tone === "primary" ? "bg-primary text-primary-foreground" : tone === "secondary" ? "bg-secondary-container text-accent-foreground" : "bg-foreground text-background";
  const idle = "bg-surface-container text-on-surface-variant";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: `${base} ${active ? activeCls : idle}`, children });
}
export {
  Index as component
};
