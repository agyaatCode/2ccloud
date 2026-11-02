"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { HERO_FIELDS } from "@/lib/admin/defs";
import { rgba } from "@/lib/util";
import { FieldInput } from "@/components/admin/fields";

type Sec = { key: string; eyebrow: string; title: string; body: string; imageUrl: string; videoUrl: string; buttonText: string; buttonUrl: string; itemsText: string; isActive: boolean };

function Preview({ p }: { p: Record<string, unknown> }) {
  const img = String(p.heroType === "video" ? p.heroPosterUrl || p.heroImageUrl : p.heroImageUrl || "");
  const o = Number(p.heroOverlayOpacity ?? 78) / 100;
  const c = String(p.heroOverlayColor || "#0A1F44");
  const dir = p.heroAlign === "right" ? 270 : 90;
  return (
    <div className="relative h-44 overflow-hidden rounded border border-slate-300 bg-slate-800" aria-label="Hero preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: String(p.heroPosDesktop || "center") }} />}
      <div className="absolute inset-0" style={{ background: p.heroAlign === "center" ? rgba(c, o * 0.8) : `linear-gradient(${dir}deg, ${rgba(c, o)}, ${rgba(c, o * 0.82)} 42%, ${rgba(c, o * 0.26)})` }} />
      <div className={`absolute inset-0 flex flex-col justify-center gap-1 p-5 text-white ${p.heroAlign === "center" ? "items-center text-center" : p.heroAlign === "right" ? "items-end text-right" : ""}`}>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-sky-300">{String(p.heroEyebrow || "")}</span>
        <span className="max-w-sm text-[17px] font-semibold leading-tight">{String(p.heroTitle || "Hero title")}</span>
        <span className="max-w-xs text-[10px] text-white/80">{String(p.heroDescription || "").slice(0, 110)}</span>
        {p.heroPrimaryText ? <span className="mt-1.5 w-fit rounded-sm bg-[#1f73c8] px-2.5 py-1 text-[10px] font-semibold">{String(p.heroPrimaryText)}</span> : null}
      </div>
    </div>
  );
}

export function PageEditor({ slug }: { slug: string }) {
  const [page, setPage] = useState<Record<string, unknown> | null>(null);
  const [secs, setSecs] = useState<Sec[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [openSec, setOpenSec] = useState<string | null>(null);

  useEffect(() => {
    api<{ page: Record<string, unknown>; sections: Sec[] }>(`/api/admin/pages/${slug}`).then((r) => {
      if (r.ok) { setPage(r.page as Record<string, unknown>); setSecs(r.sections as Sec[]); }
      else setMsg({ kind: "err", text: r.error || "Could not load page." });
    });
  }, [slug]);

  async function save() {
    setSaving(true);
    setMsg(null);
    const r = await api(`/api/admin/pages/${slug}`, { method: "PUT", json: { page, sections: secs } });
    setSaving(false);
    setMsg(r.ok ? { kind: "ok", text: "Saved. Changes are live on the website." } : { kind: "err", text: r.error || "Save failed." });
  }
  if (!page) return <p className="text-slate-500">{msg?.text ?? "Loading…"}</p>;
  const set = (k: string, v: unknown) => setPage((p) => ({ ...p!, [k]: v }));
  const setSec = (key: string, k: keyof Sec, v: unknown) => setSecs((s) => s.map((x) => (x.key === key ? { ...x, [k]: v } : x)));
  const groups = ["Hero", "Hero media", "Hero style"];
  const url = slug === "home" ? "/" : `/${slug}`;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">Page: {String(page.title)}</h1>
        <a href={url} target="_blank" rel="noreferrer" className="a-btn">Open page ↗</a>
        <button className="a-btn a-btn-primary ml-auto" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </div>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}

      <div className="a-card mb-6 p-5">
        <h2 className="mb-1 text-sm font-bold">Hero settings</h2>
        <p className="a-help mb-4">Controls the full-width hero at the top of this page: image or video, overlay, alignment, height and focal position.</p>
        <Preview p={page} />
        {groups.map((g) => (
          <div key={g} className="mt-5">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{g}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {HERO_FIELDS.filter((f) => f.group === g).map((f) => (
                <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
                  <FieldInput f={f} idPrefix="hero" value={page[f.name]} onChange={(v) => set(f.name, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {secs.length > 0 && (
        <div className="a-card p-5">
          <h2 className="mb-1 text-sm font-bold">Page sections</h2>
          <p className="a-help mb-4">Edit the text, images and buttons for each section. For list-style sections, enter one item per line as “Title | Description”.</p>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {secs.map((s) => (
              <div key={s.key}>
                <button type="button" className="flex w-full items-center justify-between py-3 text-left" aria-expanded={openSec === s.key} onClick={() => setOpenSec(openSec === s.key ? null : s.key)}>
                  <span><span className="font-semibold capitalize">{s.key}</span><span className="ml-3 text-[12px] text-slate-500">{s.title.slice(0, 70)}</span></span>
                  <span className="text-slate-400">{openSec === s.key ? "−" : "+"}</span>
                </button>
                {openSec === s.key && (
                  <div className="grid gap-4 pb-5 md:grid-cols-2">
                    {([["eyebrow", "Eyebrow"], ["title", "Title"], ["buttonText", "Button text"], ["buttonUrl", "Button URL"]] as const).map(([k, l]) => (
                      <div key={k}><label className="a-label" htmlFor={`${s.key}-${k}`}>{l}</label><input id={`${s.key}-${k}`} className="a-input" value={s[k]} onChange={(e) => setSec(s.key, k, e.target.value)} /></div>
                    ))}
                    <div className="md:col-span-2"><label className="a-label" htmlFor={`${s.key}-body`}>Body</label><textarea id={`${s.key}-body`} className="a-input" rows={4} value={s.body} onChange={(e) => setSec(s.key, "body", e.target.value)} /></div>
                    <div className="md:col-span-2"><FieldInput f={{ name: "imageUrl", label: "Image", type: "media", mediaKind: "image" }} idPrefix={s.key} value={s.imageUrl} onChange={(v) => setSec(s.key, "imageUrl", v)} /></div>
                    <div className="md:col-span-2"><label className="a-label" htmlFor={`${s.key}-items`}>List items (Title | Description, one per line)</label><textarea id={`${s.key}-items`} className="a-input" rows={4} value={s.itemsText} onChange={(e) => setSec(s.key, "itemsText", e.target.value)} /></div>
                    <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" className="accent-[#0f5cab]" checked={s.isActive} onChange={(e) => setSec(s.key, "isActive", e.target.checked)} /> Section active</label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
