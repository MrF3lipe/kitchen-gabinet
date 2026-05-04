import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, ScanBarcode, Mic, Calculator, Bell, Calendar, ChefHat } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { db, useDb, uid } from "@/lib/db";
import { useT } from "@/lib/i18n";
import { convert, type AnyUnit } from "@/lib/units";
import type { Unit } from "@/lib/types";

export const Route = createFileRoute("/tools")({
  component: ToolsPage,
});

function ToolsPage() {
  const t = useT();
  return (
    <AppShell>
      <div className="space-y-5 px-4 pt-4 pb-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Herramientas</h1>

        <Link to="/plan" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
          <Calendar className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <div className="font-semibold">{t("weekPlan")}</div>
            <div className="text-xs text-on-surface-variant">Organiza tu semana y genera lista de la compra.</div>
          </div>
        </Link>

        <UnitsCard t={t} />
        <BarcodeCard t={t} />
        <FridgePhotoCard t={t} />
        <VoiceCard t={t} />
        <NotificationsCard t={t} />
      </div>
    </AppShell>
  );
}

function UnitsCard({ t }: { t: ReturnType<typeof useT> }) {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<AnyUnit>("cup");
  const [to, setTo] = useState<AnyUnit>("ml");
  const result = convert(value, from, to);
  const units: AnyUnit[] = ["g", "kg", "oz", "lb", "ml", "L", "tsp", "tbsp", "cup", "fl_oz"];

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        <Calculator className="h-4 w-4 text-primary" /> {t("convertUnits")}
      </h2>
      <div className="grid grid-cols-3 gap-2">
        <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} className="rounded border border-outline-variant bg-transparent px-2 py-1 text-sm" />
        <select value={from} onChange={(e) => setFrom(e.target.value as AnyUnit)} className="rounded border border-outline-variant bg-transparent px-2 py-1 text-sm">
          {units.map((u) => <option key={u} value={u}>{u.replace("_", " ")}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value as AnyUnit)} className="rounded border border-outline-variant bg-transparent px-2 py-1 text-sm">
          {units.map((u) => <option key={u} value={u}>{u.replace("_", " ")}</option>)}
        </select>
      </div>
      <p className="mt-3 text-center font-display text-xl">
        = {result === null ? "—" : `${Math.round(result * 100) / 100} ${to.replace("_", " ")}`}
      </p>
    </section>
  );
}

function BarcodeCard({ t }: { t: ReturnType<typeof useT> }) {
  const [code, setCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  async function startScan() {
    const w = window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => { detect: (s: HTMLVideoElement) => Promise<{ rawValue: string }[]> } };
    if (!w.BarcodeDetector) {
      alert("Tu navegador no soporta el escáner. Usa el campo manual.");
      return;
    }
    setScanning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
    const detector = new w.BarcodeDetector!({ formats: ["ean_13", "ean_8", "qr_code", "code_128"] });
    const tick = async () => {
      if (!scanning || !videoRef.current) return;
      try {
        const codes = await detector.detect(videoRef.current);
        if (codes[0]) {
          setCode(codes[0].rawValue);
          stream.getTracks().forEach((tr) => tr.stop());
          setScanning(false);
          return;
        }
      } catch {}
      requestAnimationFrame(tick);
    };
    tick();
  }

  function addToPantry() {
    if (!code.trim()) return;
    db.addPantry({
      id: uid(),
      name: `Producto ${code.slice(0, 6)}`,
      category: "Otros",
      quantity: 1,
      unit: "ud",
      available: true,
      barcode: code,
    });
    alert("✓");
    setCode("");
  }

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        <ScanBarcode className="h-4 w-4 text-primary" /> {t("barcodeAdd")}
      </h2>
      {scanning && <video ref={videoRef} className="mb-2 w-full rounded" muted playsInline />}
      <div className="flex gap-2">
        <button onClick={startScan} className="rounded-full border border-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Escanear
        </button>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código" className="flex-1 rounded border border-outline-variant bg-transparent px-2 py-1 text-sm" />
        <button onClick={addToPantry} className="rounded-full bg-primary px-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">+</button>
      </div>
      <p className="mt-2 text-[11px] text-on-surface-variant">Funciona en navegadores modernos (Chrome / Edge en Android). En iOS usa el campo manual.</p>
    </section>
  );
}

function FridgePhotoCard({ t }: { t: ReturnType<typeof useT> }) {
  const [items, setItems] = useState("");
  function addAll() {
    const list = items.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    list.forEach((name) => db.addPantry({
      id: uid(), name, category: "Otros", quantity: 1, unit: "ud", available: true,
    }));
    alert(`+${list.length}`);
    setItems("");
  }
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        <Camera className="h-4 w-4 text-primary" /> {t("fridgePhoto")}
      </h2>
      <p className="mb-2 text-xs text-on-surface-variant">
        Haz una foto a tu nevera y escribe (o pega) lo que veas, separado por comas o líneas. Se añaden todos a la despensa.
      </p>
      <input type="file" accept="image/*" capture="environment" className="mb-2 text-xs" />
      <textarea value={items} onChange={(e) => setItems(e.target.value)} rows={3} placeholder="tomate, leche, queso..." className="w-full rounded border border-outline-variant bg-transparent p-2 text-sm" />
      <button onClick={addAll} className="mt-2 w-full rounded-full bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">Añadir todos</button>
    </section>
  );
}

function VoiceCard({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        <Mic className="h-4 w-4 text-primary" /> {t("voiceMode")}
      </h2>
      <p className="text-xs text-on-surface-variant">
        Disponible en <strong>Modo Cocina</strong>. Cuando estés cocinando, pulsa el botón del micrófono. {t("voiceHelp")}
      </p>
    </section>
  );
}

function NotificationsCard({ t }: { t: ReturnType<typeof useT> }) {
  const { notifications, pantry } = useDb();
  const [enabled, setEnabled] = useState(notifications.expiryEnabled);
  const [days, setDays] = useState(notifications.expiryDaysBefore);

  useEffect(() => { db.setNotifications({ expiryEnabled: enabled, expiryDaysBefore: days }); }, [enabled, days]);

  async function testNotification() {
    try {
      const mod = await import("@capacitor/local-notifications");
      const { LocalNotifications } = mod;
      await LocalNotifications.requestPermissions();
      const expiringSoon = pantry.filter((p) => p.expiresAt && p.expiresAt - Date.now() < days * 86400000 && p.expiresAt > Date.now());
      const at = new Date(Date.now() + 5000);
      await LocalNotifications.schedule({
        notifications: [{
          id: Date.now() % 100000,
          title: "Kitchen Cabinet",
          body: expiringSoon.length
            ? `${expiringSoon.length} ítems caducan pronto: ${expiringSoon.slice(0, 3).map((p) => p.name).join(", ")}`
            : "No hay ítems próximos a caducar.",
          schedule: { at },
        }],
      });
      alert("Notificación programada en 5s");
    } catch (e) {
      alert("Las notificaciones nativas solo funcionan en la app instalada (APK).");
    }
  }

  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
        <Bell className="h-4 w-4 text-primary" /> {t("notifications")}
      </h2>
      <label className="flex items-center justify-between text-sm">
        {t("notifyExpiry")}
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      </label>
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="number" min={1} max={14} value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} className="w-16 rounded border border-outline-variant bg-transparent px-2 py-1" />
        {t("daysBefore")}
      </label>
      <button onClick={testNotification} className="mt-3 w-full rounded-full border border-primary py-2 text-xs font-bold uppercase tracking-wider text-primary">
        Probar
      </button>
    </section>
  );
}
