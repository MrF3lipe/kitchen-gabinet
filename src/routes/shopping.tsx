import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, X, ArrowDownToLine } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Checkbox } from "@/components/ui/checkbox";
import { db, useDb, uid } from "@/lib/db";
import { useT } from "@/lib/i18n";
import type { Unit } from "@/lib/types";

export const Route = createFileRoute("/shopping")({
  component: Shopping,
});

const UNITS: Unit[] = ["ud", "g", "kg", "ml", "L", "tsp", "tbsp", "cup"];

function Shopping() {
  const t = useT();
  const { shopping } = useDb();
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("ud");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    db.addShopping({ id: uid(), name: name.trim(), quantity: qty, unit, done: false });
    setName(""); setQty(1);
  }

  const hasDone = shopping.some((i) => i.done);

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{t("shopping")}</h1>

        <form onSubmit={add} className="space-y-2 rounded-2xl bg-card p-3 shadow-sm">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("addPantry")}
            className="w-full rounded-full border border-outline-variant bg-transparent px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-1 rounded-lg border border-outline-variant px-2">
              <button type="button" onClick={() => setQty(Math.max(0, qty - 1))} className="px-2 text-primary">−</button>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 0)}
                className="w-full bg-transparent py-1 text-center outline-none"
              />
              <button type="button" onClick={() => setQty(qty + 1)} className="px-2 text-primary">+</button>
            </div>
            <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="rounded-lg border border-outline-variant bg-transparent px-2">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <button className="rounded-full bg-primary px-4 text-primary-foreground"><Plus className="h-4 w-4" /></button>
          </div>
        </form>

        <ul className="space-y-2">
          {shopping.map((i) => (
            <li key={i.id} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-sm">
              <Checkbox checked={i.done} onCheckedChange={() => db.toggleShopping(i.id)} />
              <span className={`flex-1 truncate text-sm ${i.done ? "text-on-surface-variant line-through" : ""}`}>
                {i.name}
              </span>
              <div className="flex items-center gap-1 rounded-full bg-surface-container px-1">
                <button
                  onClick={() => db.updateShopping(i.id, { quantity: Math.max(0, i.quantity - 1) })}
                  className="h-6 w-6 text-primary"
                >−</button>
                <span className="min-w-[3rem] text-center text-xs font-bold tabular-nums">{i.quantity} {i.unit}</span>
                <button
                  onClick={() => db.updateShopping(i.id, { quantity: i.quantity + 1 })}
                  className="h-6 w-6 text-primary"
                >+</button>
              </div>
              <select
                value={i.unit}
                onChange={(e) => db.updateShopping(i.id, { unit: e.target.value as Unit })}
                className="rounded border border-outline-variant bg-transparent px-1 py-0.5 text-xs"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button onClick={() => db.deleteShopping(i.id)} className="text-on-surface-variant"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>

        {hasDone && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { db.moveDoneToPantry(); alert(t("movedToPantry")); }}
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground"
            >
              <ArrowDownToLine className="h-4 w-4" /> {t("moveToPantry")}
            </button>
            <button onClick={() => db.clearDoneShopping()} className="text-xs font-semibold text-on-surface-variant">
              <Trash2 className="mr-1 inline h-3 w-3" /> Limpiar completados
            </button>
          </div>
        )}

        {shopping.length === 0 && <p className="py-8 text-center text-sm text-on-surface-variant">{t("nothingYet")}</p>}
      </div>
    </AppShell>
  );
}
