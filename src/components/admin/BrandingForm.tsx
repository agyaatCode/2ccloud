"use client";
import { useState } from "react";
import { api } from "@/lib/client";
import { FieldInput } from "@/components/admin/fields";

type B = { logoUrl: string; mobileLogoUrl: string; darkLogoUrl: string; faviconUrl: string };
const F = [
  { name: "logoUrl", label: "Primary logo", help: "Shown in the header on light backgrounds. Image only — no company name text is added next to it." },
  { name: "mobileLogoUrl", label: "Mobile logo", help: "Optional. Used on screens below 1024px; falls back to the primary logo." },
  { name: "darkLogoUrl", label: "Dark logo", help: "Used on dark backgrounds such as the footer. Falls back to the primary logo." },
  { name: "faviconUrl", label: "Favicon", help: "Browser tab icon. SVG, PNG or WEBP recommended." },
] as const;

export function BrandingForm({ initial }: { initial: B }) {
  const [v, setV] = useState<B>(initial);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const r = await api("/api/admin/branding", { method: "PUT", json: v });
    setBusy(false);
    setMsg(r.ok ? { kind: "ok", text: "Branding saved. The new logo is now live across the site." } : { kind: "err", text: r.error || "Save failed." });
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3"><h1 className="text-lg font-bold">Branding</h1><button className="a-btn a-btn-primary ml-auto" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save branding"}</button></div>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="a-card space-y-5 p-5 lg:col-span-3">
          {F.map((f) => (
            <FieldInput key={f.name} idPrefix="brand" f={{ name: f.name, label: f.label, type: "media", mediaKind: "image", help: f.help, required: f.name === "logoUrl" }} value={v[f.name]} onChange={(x) => setV({ ...v, [f.name]: String(x) })} />
          ))}
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="a-card p-4"><p className="a-label">Header preview (light)</p><div className="flex h-20 items-center border border-slate-200 bg-white px-5">{/* eslint-disable-next-line @next/next/no-img-element */}{v.logoUrl ? <img src={v.logoUrl} alt="Primary logo preview" className="h-11 w-auto max-w-[220px] object-contain" /> : <span className="text-slate-400">No logo</span>}</div></div>
          <div className="a-card p-4"><p className="a-label">Footer preview (dark)</p><div className="flex h-20 items-center bg-[#061429] px-5">{/* eslint-disable-next-line @next/next/no-img-element */}{(v.darkLogoUrl || v.logoUrl) ? <img src={v.darkLogoUrl || v.logoUrl} alt="Dark logo preview" className="h-12 w-auto max-w-[240px] object-contain" /> : null}</div></div>
          <div className="a-card flex items-center gap-4 p-4"><div><p className="a-label">Favicon</p>{/* eslint-disable-next-line @next/next/no-img-element */}{(v.faviconUrl || v.logoUrl) ? <img src={v.faviconUrl || v.logoUrl} alt="Favicon preview" className="h-8 w-8 object-contain" /> : null}</div><p className="a-help">Tip: the logo is stored in the database and served by <code>/api/branding</code>. No code changes are needed when you replace it.</p></div>
        </div>
      </div>
    </div>
  );
}
