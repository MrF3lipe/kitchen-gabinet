import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { c as createLucideIcon, u as useT, e as useLocale, a as useDb, A as AppShell, d as db, b as uid } from "./AppShell-C8t9H1Vy.js";
import { a as useComposedRefs, u as useControllableState, P as Primitive, c as composeEventHandlers, b as useSize, d as createContextScope, e as cn } from "./utils-Ck6P9FCv.js";
import { u as usePrevious } from "./index-sFWfc8xn.js";
import { P as Plus } from "./plus-ClPaT0rG.js";
import { X } from "./x-7rpJjFTk.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-B9RXT7T5.js";
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
const ICONS = {
  "Lácteos & Huevos": "🥚",
  "Verduras Frescas": "🥦",
  "Especias Secas": "🌶️",
  "Aceites & Vinagres": "🫒",
  "Granos & Pastas": "🌾",
  "Carnes": "🥩",
  "Pescado": "🐟",
  "Frutas": "🍎",
  "Otros": "🧂"
};
function PantryPage() {
  const t = useT();
  const locale = useLocale();
  const {
    pantry
  } = useDb();
  const [adding, setAdding] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("Otros");
  const [expires, setExpires] = reactExports.useState("");
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const p of pantry) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return Array.from(map.entries());
  }, [pantry]);
  const allCats = Array.from(/* @__PURE__ */ new Set([...pantry.map((p) => p.category), ...Object.keys(ICONS)]));
  function add() {
    if (!name.trim()) return;
    db.addPantry({
      id: uid(),
      name: name.trim(),
      category: cat,
      available: true,
      expiresAt: expires ? new Date(expires).getTime() : void 0
    });
    setName("");
    setExpires("");
    setAdding(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 px-4 pt-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl font-semibold leading-[0.95] tracking-tight", children: t("myPantry") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-[16rem] text-sm text-on-surface-variant", children: t("pantrySubtitle") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setAdding((v) => !v), className: "mt-2 flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " ",
        t("addPantry")
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-2xl bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Nombre", className: "w-full border-b border-outline-variant bg-transparent py-2 outline-none focus:border-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "w-full border-b border-outline-variant bg-transparent py-2 outline-none", children: allCats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-on-surface-variant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
        t("expiresOn"),
        ":",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: expires, onChange: (e) => setExpires(e.target.value), className: "bg-transparent outline-none" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: add, className: "flex-1 rounded-full bg-primary py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground", children: t("confirm") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAdding(false), className: "rounded-full border border-outline-variant px-4 text-sm", children: t("cancel") })
      ] })
    ] }),
    grouped.map(([groupName, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 flex items-center gap-2 border-b border-outline-variant pb-2 font-display text-xl font-semibold text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: ICONS[groupName] ?? "🧂" }),
        groupName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-outline-variant/50", children: items.map((p) => {
        const display = locale === "en" && p.name_en ? p.name_en : p.name;
        const exp = expirationLabel(p.expiresAt, t);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${p.available ? "" : "text-on-surface-variant line-through"}`, children: display }),
            exp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs ${exp.urgent ? "text-primary" : "text-on-surface-variant"}`, children: exp.text })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: p.available, onCheckedChange: () => db.togglePantry(p.id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => db.deletePantry(p.id), className: "text-on-surface-variant", "aria-label": "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] })
        ] }, p.id);
      }) })
    ] }, groupName))
  ] }) });
}
function expirationLabel(ms, t) {
  if (!ms) return null;
  const days = Math.floor((ms - Date.now()) / 864e5);
  if (days < 0) return {
    text: t("expired"),
    urgent: true
  };
  if (days === 0) return {
    text: `${t("expiresOn")} ${t("today")}`,
    urgent: true
  };
  if (days === 1) return {
    text: `${t("expiresOn")} ${t("tomorrow")}`,
    urgent: true
  };
  return {
    text: `${days} ${t("daysLeft")}`,
    urgent: days <= 3
  };
}
export {
  PantryPage as component
};
