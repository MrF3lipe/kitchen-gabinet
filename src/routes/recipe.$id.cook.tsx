import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { db, useDb } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/recipe/$id/cook")({
  component: CookMode,
});

function CookMode() {
  const { id } = Route.useParams();
  const t = useT();
  const locale = useLocale();
  const nav = useNavigate();
  const { recipes } = useDb();
  const recipeMaybe = recipes.find((r) => r.id === id);
  const recipe = recipeMaybe!;
  const [step, setStep] = useState(0);
  const wakeLockRef = useRef<unknown>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: string) => Promise<unknown> } };
    if (nav.wakeLock?.request) {
      nav.wakeLock.request("screen").then((lock) => {
        wakeLockRef.current = lock;
      }).catch(() => {});
    }
    return () => {
      const lock = wakeLockRef.current as { release?: () => void } | null;
      if (lock?.release) lock.release();
    };
  }, []);

  if (!recipeMaybe) return <AppShell><div className="p-8">404</div></AppShell>;

  const steps = locale === "en" && recipe.steps_en ? recipe.steps_en : recipe.steps;
  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const current = steps[step];
  const minutes = extractMinutes(current);

  function finish() {
    db.incrementCooked(recipe.id);
    nav({ to: "/recipe/$id", params: { id: recipe.id } });
  }

  return (
    <AppShell showHeader={false} showNav={false}>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="flex items-center justify-between border-b border-outline-variant px-4 py-3">
          <Link to="/recipe/$id" params={{ id: recipe.id }} className="text-on-surface-variant">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {t("step")} {step + 1} / {steps.length}
          </div>
          <div className="w-5" />
        </header>

        <div className="h-1 w-full bg-surface-container">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <p className="font-display text-lg text-on-surface-variant">{title}</p>
          <p className="mt-6 font-display text-3xl leading-snug">{current}</p>
          {minutes && <CookTimer minutes={minutes} />}
        </div>

        <footer className="flex items-center gap-3 border-t border-outline-variant p-4">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex-1 rounded-full border border-outline-variant py-3 text-sm font-bold uppercase tracking-wider disabled:opacity-40"
          >
            <ArrowLeft className="mr-1 inline h-4 w-4" /> {t("previous")}
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >
              {t("next")} <ArrowRight className="ml-1 inline h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 rounded-full bg-secondary py-3 text-sm font-bold uppercase tracking-wider text-secondary-foreground"
            >
              <Check className="mr-1 inline h-4 w-4" /> {t("finish")}
            </button>
          )}
        </footer>
      </div>
    </AppShell>
  );
}

function extractMinutes(text: string | undefined): number | null {
  if (!text) return null;
  const re = /(\d+)\s*(minutos?|minutes?|min|m)\b/i;
  const m = text.match(re);
  if (!m) return null;
  const n = parseInt(m[1]);
  return n > 0 && n <= 240 ? n : null;
}

function CookTimer({ minutes }: { minutes: number }) {
  const t = useT();
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            try { new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play().catch(() => {}); } catch {}
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mt-8 rounded-2xl bg-card p-6 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        <Timer className="h-4 w-4" /> {t("timer")}
      </div>
      <div className="my-3 font-display text-5xl font-semibold tabular-nums">{mm}:{ss}</div>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning(!running)} className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          {running ? <Pause className="inline h-4 w-4" /> : <Play className="inline h-4 w-4" />} {running ? t("pause") : t("start")}
        </button>
        <button onClick={() => { setRunning(false); setRemaining(minutes * 60); }} className="rounded-full border border-outline-variant px-5 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <RotateCcw className="inline h-4 w-4" /> {t("reset")}
        </button>
      </div>
    </div>
  );
}
