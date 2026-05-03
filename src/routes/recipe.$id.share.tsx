import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import QRCode from "qrcode";
import { ArrowLeft, Download, QrCode as QrIcon, Share2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useDb } from "@/lib/db";
import { useT, useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/recipe/$id/share")({
  component: SharePage,
});

function SharePage() {
  const { id } = Route.useParams();
  const t = useT();
  const locale = useLocale();
  const { recipes } = useDb();
  const recipe = recipes.find((r) => r.id === id);
  const cardRef = useRef<HTMLDivElement>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [tab, setTab] = useState<"image" | "qr">("image");

  useEffect(() => {
    if (!recipe || tab !== "qr") return;
    const minimal = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      timeMinutes: recipe.timeMinutes,
    };
    QRCode.toDataURL(JSON.stringify(minimal), { width: 320, margin: 2 }).then(setQr).catch(() => {});
  }, [recipe, tab]);

  if (!recipe) return <AppShell><div className="p-8">404</div></AppShell>;

  const title = locale === "en" && recipe.title_en ? recipe.title_en : recipe.title;
  const ings = locale === "en" && recipe.ingredients_en ? recipe.ingredients_en : recipe.ingredients;
  const steps = locale === "en" && recipe.steps_en ? recipe.steps_en : recipe.steps;

  async function download() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  }

  async function share() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${title}.png`, { type: "image/png" });
    const nav = navigator as Navigator & { share?: (data: { files?: File[]; title?: string }) => Promise<void>; canShare?: (d: { files: File[] }) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title });
    } else {
      download();
    }
  }

  return (
    <AppShell showHeader={false}>
      <header className="flex items-center justify-between border-b border-outline-variant bg-background px-4 py-3">
        <Link to="/recipe/$id" params={{ id: recipe.id }}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-lg font-semibold">{t("share")}</h1>
        <div className="w-5" />
      </header>

      <div className="space-y-4 p-4">
        <div className="flex overflow-hidden rounded-full bg-surface-container">
          <button onClick={() => setTab("image")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${tab === "image" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`}>
            <Download className="mr-1 inline h-3 w-3" /> {t("shareAsImage")}
          </button>
          <button onClick={() => setTab("qr")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider ${tab === "qr" ? "bg-primary text-primary-foreground" : "text-on-surface-variant"}`}>
            <QrIcon className="mr-1 inline h-3 w-3" /> {t("shareQr")}
          </button>
        </div>

        {tab === "image" ? (
          <>
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <div ref={cardRef} className="bg-[#fbf9f8] p-6" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                <img src={recipe.image} alt="" crossOrigin="anonymous" className="aspect-[4/3] w-full rounded-xl object-cover" />
                <div className="mt-4 flex gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <span className="rounded-full bg-[#d6e7a1] px-2 py-1 text-[#5a682f]">{t(recipe.category)}</span>
                  <span className="rounded-full bg-[#f0eded] px-2 py-1 text-[#56423d]">{recipe.timeMinutes} {t("minutes")}</span>
                </div>
                <h2 style={{ fontFamily: "Newsreader, serif" }} className="mt-3 text-2xl font-semibold leading-tight text-[#1b1c1c]">{title}</h2>
                <h3 style={{ fontFamily: "Newsreader, serif" }} className="mt-4 border-b border-[#dcc0ba] pb-1 text-base font-semibold text-[#9a4028]">{t("ingredients")}</h3>
                <ul className="mt-2 space-y-1 text-xs text-[#1b1c1c]">
                  {ings.map((i, idx) => (
                    <li key={idx}><b className="text-[#9a4028]">{i.quantity}</b> {i.name}</li>
                  ))}
                </ul>
                <h3 style={{ fontFamily: "Newsreader, serif" }} className="mt-4 border-b border-[#dcc0ba] pb-1 text-base font-semibold text-[#9a4028]">{t("preparation")}</h3>
                <ol className="mt-2 space-y-2 text-xs text-[#56423d]">
                  {steps.map((s, idx) => (
                    <li key={idx}><b className="text-[#1b1c1c]">{idx + 1}.</b> {s}</li>
                  ))}
                </ol>
                <div className="mt-5 border-t border-[#dcc0ba] pt-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#9a4028]">
                  Kitchen Cabinet
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={download} className="flex-1 rounded-full bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground">
                <Download className="mr-1 inline h-4 w-4" /> {t("download")}
              </button>
              <button onClick={share} className="flex-1 rounded-full border border-primary py-3 text-sm font-bold uppercase tracking-wider text-primary">
                <Share2 className="mr-1 inline h-4 w-4" /> {t("share")}
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
            {qr ? <img src={qr} alt="QR" className="mx-auto" /> : <p className="text-sm text-on-surface-variant">…</p>}
            <p className="mt-3 text-xs text-on-surface-variant">Escanea con otro teléfono para importar la receta sin internet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
