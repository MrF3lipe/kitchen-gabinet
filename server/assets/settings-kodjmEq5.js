import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { L as Link } from "./router-B9RXT7T5.js";
import { c as createLucideIcon, u as useT, e as useLocale, a as useDb, A as AppShell, s as setLocale, d as db } from "./AppShell-C8t9H1Vy.js";
import { D as Download } from "./download-D0prWcNi.js";
import { H as Heart } from "./heart-SpEnJ-ME.js";
import { S as ShoppingCart } from "./shopping-cart-Dnd7onwp.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$3 = [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }]
];
const Languages = createLucideIcon("languages", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function SettingsPage() {
  const t = useT();
  const locale = useLocale();
  const {
    settings
  } = useDb();
  const fileRef = reactExports.useRef(null);
  function exportAll() {
    const blob = new Blob([db.exportAll()], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kitchen-cabinet-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function onImport(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        db.importAll(reader.result);
        alert("OK");
      } catch (err) {
        alert("Archivo inválido");
      }
    };
    reader.readAsText(f);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 px-4 pt-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-semibold tracking-tight", children: t("settings") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("language"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-hidden rounded-full bg-surface-container", children: ["es", "en"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      setLocale(l);
      db.setSettings({
        locale: l
      });
    }, className: `flex-1 py-2 text-xs font-bold uppercase tracking-wider ${locale === l ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { className: "mr-1 inline h-3 w-3" }),
      " ",
      l === "es" ? "Español" : "English"
    ] }, l)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t("theme"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex overflow-hidden rounded-full bg-surface-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => db.setSettings({
        theme: "light"
      }), className: `flex-1 py-2 text-xs font-bold uppercase tracking-wider ${settings.theme === "light" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "mr-1 inline h-3 w-3" }),
        " ",
        t("light")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => db.setSettings({
        theme: "dark"
      }), className: `flex-1 py-2 text-xs font-bold uppercase tracking-wider ${settings.theme === "dark" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "mr-1 inline h-3 w-3" }),
        " ",
        t("dark")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: t("backup"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportAll, className: "flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " ",
        t("exportAll")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileRef.current?.click(), className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-primary py-3 text-sm font-bold uppercase tracking-wider text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
        " ",
        t("importAll")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "application/json", onChange: onImport, className: "hidden" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/favorites", className: "flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: t("favorites") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shopping", className: "flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: t("shopping") })
      ] })
    ] })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card p-4 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant", children: title }),
    children
  ] });
}
export {
  SettingsPage as component
};
