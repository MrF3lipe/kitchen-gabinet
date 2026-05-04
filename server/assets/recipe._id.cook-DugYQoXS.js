import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { c as Route, u as useNavigate, L as Link } from "./router-B9RXT7T5.js";
import { c as createLucideIcon, u as useT, e as useLocale, a as useDb, A as AppShell, d as db } from "./AppShell-C8t9H1Vy.js";
import { A as ArrowLeft } from "./arrow-left-Dap58hQF.js";
import { C as Check } from "./check-Dowc9Jbt.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$4 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$4);
const __iconNode$3 = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
];
const Pause = createLucideIcon("pause", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function CookMode() {
  const {
    id
  } = Route.useParams();
  const t = useT();
  const locale = useLocale();
  const nav = useNavigate();
  const {
    recipes
  } = useDb();
  const recipeMaybe = recipes.find((r) => r.id === id);
  const recipe = recipeMaybe;
  const [step, setStep] = reactExports.useState(0);
  const wakeLockRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const nav2 = navigator;
    if (nav2.wakeLock?.request) {
      nav2.wakeLock.request("screen").then((lock) => {
        wakeLockRef.current = lock;
      }).catch(() => {
      });
    }
    return () => {
      const lock = wakeLockRef.current;
      if (lock?.release) lock.release();
    };
  }, []);
  if (!recipeMaybe) return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: "404" }) });
  const steps = locale === "en" && recipe.steps_en ? recipe.steps_en : recipe.steps;
  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const current = steps[step];
  const minutes = extractMinutes(current);
  function finish() {
    db.incrementCooked(recipe.id);
    nav({
      to: "/recipe/$id",
      params: {
        id: recipe.id
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { showHeader: false, showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-outline-variant px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recipe/$id", params: {
        id: recipe.id
      }, className: "text-on-surface-variant", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold uppercase tracking-wider text-on-surface-variant", children: [
        t("step"),
        " ",
        step + 1,
        " / ",
        steps.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-surface-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary transition-all", style: {
      width: `${(step + 1) / steps.length * 100}%`
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-on-surface-variant", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 font-display text-3xl leading-snug", children: current }),
      minutes && /* @__PURE__ */ jsxRuntimeExports.jsx(CookTimer, { minutes })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex items-center gap-3 border-t border-outline-variant p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStep(Math.max(0, step - 1)), disabled: step === 0, className: "flex-1 rounded-full border border-outline-variant py-3 text-sm font-bold uppercase tracking-wider disabled:opacity-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 inline h-4 w-4" }),
        " ",
        t("previous")
      ] }),
      step < steps.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStep(step + 1), className: "flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground", children: [
        t("next"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 inline h-4 w-4" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: finish, className: "flex-1 rounded-full bg-secondary py-3 text-sm font-bold uppercase tracking-wider text-secondary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 inline h-4 w-4" }),
        " ",
        t("finish")
      ] })
    ] })
  ] }) });
}
function extractMinutes(text) {
  if (!text) return null;
  const re = /(\d+)\s*(minutos?|minutes?|min|m)\b/i;
  const m = text.match(re);
  if (!m) return null;
  const n = parseInt(m[1]);
  return n > 0 && n <= 240 ? n : null;
}
function CookTimer({
  minutes
}) {
  const t = useT();
  const [remaining, setRemaining] = reactExports.useState(minutes * 60);
  const [running, setRunning] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            try {
              new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play().catch(() => {
              });
            } catch {
            }
            return 0;
          }
          return r - 1;
        });
      }, 1e3);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl bg-card p-6 text-center shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4" }),
      " ",
      t("timer")
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-3 font-display text-5xl font-semibold tabular-nums", children: [
      mm,
      ":",
      ss
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setRunning(!running), className: "rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground", children: [
        running ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "inline h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "inline h-4 w-4" }),
        " ",
        running ? t("pause") : t("start")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setRunning(false);
        setRemaining(minutes * 60);
      }, className: "rounded-full border border-outline-variant px-5 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "inline h-4 w-4" }),
        " ",
        t("reset")
      ] })
    ] })
  ] });
}
export {
  CookMode as component
};
