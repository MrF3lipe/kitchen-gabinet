import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Checkbox } from "@/components/ui/checkbox";
import { db, useDb, uid } from "@/lib/db";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/shopping")({
  component: Shopping,
});

function Shopping() {
  const t = useT();
  const { shopping } = useDb();
  const [name, setName] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    db.addShopping({ id: uid(), name: name.trim(), done: false });
    setName("");
  }

  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{t("shopping")}</h1>
        <form onSubmit={add} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="..."
            className="flex-1 rounded-full border border-outline-variant bg-card px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button className="rounded-full bg-primary px-4 text-primary-foreground"><Plus className="h-4 w-4" /></button>
        </form>
        <ul className="space-y-2">
          {shopping.map((i) => (
            <li key={i.id} className="flex items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-sm">
              <Checkbox checked={i.done} onCheckedChange={() => db.toggleShopping(i.id)} />
              <span className={`flex-1 text-sm ${i.done ? "text-on-surface-variant line-through" : ""}`}>{i.name}</span>
              <button onClick={() => db.deleteShopping(i.id)} className="text-on-surface-variant"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
        {shopping.some((i) => i.done) && (
          <button onClick={() => db.clearDoneShopping()} className="text-xs font-semibold text-primary">
            <Trash2 className="mr-1 inline h-3 w-3" /> Limpiar completados
          </button>
        )}
        {shopping.length === 0 && <p className="py-8 text-center text-sm text-on-surface-variant">{t("nothingYet")}</p>}
      </div>
    </AppShell>
  );
}
