import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { u as useNavigate } from "./router-B9RXT7T5.js";
import { c as createLucideIcon, u as useT, A as AppShell, b as uid, d as db } from "./AppShell-C8t9H1Vy.js";
import { P as Plus } from "./plus-ClPaT0rG.js";
import { X } from "./x-7rpJjFTk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const CATS = ["breakfast", "lunch", "dinner", "dessert", "snack", "bakery", "drink", "sauce", "salad", "soup"];
function NewRecipe() {
  const t = useT();
  const nav = useNavigate();
  const [photo, setPhoto] = reactExports.useState(null);
  const [title, setTitle] = reactExports.useState("");
  const [time, setTime] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("dinner");
  const [difficulty, setDifficulty] = reactExports.useState("easy");
  const [ingredients, setIngredients] = reactExports.useState([{
    name: "",
    quantity: ""
  }]);
  const [equipment, setEquipment] = reactExports.useState([""]);
  const [instructions, setInstructions] = reactExports.useState("");
  function onPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  }
  function save() {
    if (!title.trim()) return;
    const recipe = {
      id: uid(),
      title: title.trim(),
      description: instructions.split("\n")[0]?.slice(0, 140) ?? "",
      image: photo ?? "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=900&q=70",
      category,
      difficulty,
      timeMinutes: parseInt(time) || 30,
      servings: 4,
      ingredients: ingredients.filter((i) => i.name.trim()),
      equipment: equipment.filter((e) => e.trim()),
      steps: instructions.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    db.addRecipe(recipe);
    nav({
      to: "/recipe/$id",
      params: {
        id: recipe.id
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 px-4 pt-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold tracking-tight", children: t("newRecipe") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-on-surface-variant", children: t("docCreation") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-2xl bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-[16/10] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant overflow-hidden", children: [
        photo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: photo, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-8 w-8 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: t("addPhoto") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", capture: "environment", onChange: onPhoto, className: "hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("recipeTitle"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: t("titlePlaceholder"), className: "w-full border-b border-outline-variant bg-transparent py-2 font-display text-xl outline-none focus:border-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("prepTime"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: time, onChange: (e) => setTime(e.target.value.replace(/\D/g, "")), placeholder: "45", className: "w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("category"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary", children: CATS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: t(c) }, c)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: t("difficulty"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-hidden rounded-full bg-surface-container", children: ["easy", "medium", "hard"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDifficulty(d), className: `flex-1 py-2 text-xs font-bold uppercase tracking-wider ${difficulty === d ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`, children: t(d) }, d)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ListSection, { title: t("ingredients"), items: ingredients, onChange: setIngredients, renderItem: (item, set) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item.quantity ?? "", onChange: (e) => set({
        ...item,
        quantity: e.target.value
      }), placeholder: "2 tazas", className: "w-20 rounded-lg border border-outline-variant bg-card px-2 py-2 text-sm outline-none focus:border-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item.name, onChange: (e) => set({
        ...item,
        name: e.target.value
      }), placeholder: "Harina", className: "flex-1 rounded-lg border border-outline-variant bg-card px-3 py-2 text-sm outline-none focus:border-primary" })
    ] }), newItem: () => ({
      name: "",
      quantity: ""
    }), addLabel: t("addIngredient") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ListSection, { title: t("equipment"), items: equipment, onChange: setEquipment, renderItem: (item, set) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: item, onChange: (e) => set(e.target.value), placeholder: "Bol grande", className: "flex-1 rounded-lg border border-outline-variant bg-card px-3 py-2 text-sm outline-none focus:border-primary" }), newItem: () => "", addLabel: t("addEquipment"), accent: "secondary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold border-b border-outline-variant pb-2", children: t("instructions") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: instructions, onChange: (e) => setInstructions(e.target.value), rows: 8, placeholder: "Paso 1: Precalienta el horno a 180°C...", className: "mt-3 w-full resize-y rounded-xl border border-outline-variant bg-card p-3 text-sm outline-none focus:border-primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: save, className: "sticky bottom-24 mx-auto flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg disabled:opacity-50", disabled: !title.trim(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
      " ",
      t("saveRecipe")
    ] })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold uppercase tracking-wider text-on-surface-variant", children: label }),
    children
  ] });
}
function ListSection({
  title,
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
  accent = "primary"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between border-b border-outline-variant pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange([...items, newItem()]), className: "text-2xl text-on-surface-variant", "aria-label": "Add", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
      items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        renderItem(it, (v) => {
          const next = [...items];
          next[idx] = v;
          onChange(next);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange(items.filter((_, i) => i !== idx)), className: "text-on-surface-variant", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }, idx)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onChange([...items, newItem()]), className: `flex items-center gap-1 text-sm font-semibold ${accent === "primary" ? "text-primary" : "text-secondary"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " ",
        addLabel
      ] })
    ] })
  ] });
}
export {
  NewRecipe as component
};
