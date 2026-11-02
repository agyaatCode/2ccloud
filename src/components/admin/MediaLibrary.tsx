"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client";
import { fmtSize, Thumb, type MediaItem } from "@/components/admin/fields";

export function MediaLibrary() {
  const [rows, setRows] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [sel, setSel] = useState<MediaItem | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState({ url: "", kind: "image", title: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await api<{ rows: MediaItem[]; total: number }>(`/api/admin/media?limit=24&page=${page}&q=${encodeURIComponent(q)}${kind ? `&kind=${kind}` : ""}`);
    if (r.ok) { setRows(r.rows as MediaItem[]); setTotal(r.total as number); }
  }, [page, q, kind]);
  useEffect(() => { const t = setTimeout(load, 180); return () => clearTimeout(t); }, [load]);

  async function upload(files: FileList) {
    setBusy(true);
    setMsg(null);
    let ok = 0;
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.set("file", f);
      const r = await api("/api/admin/upload", { form: fd });
      if (r.ok) ok++;
      else setMsg({ kind: "err", text: `${f.name}: ${r.error}` });
    }
    setBusy(false);
    if (ok) setMsg({ kind: "ok", text: `${ok} file${ok > 1 ? "s" : ""} uploaded.` });
    load();
  }
  async function addUrl() {
    const r = await api("/api/admin/media", { json: url });
    if (!r.ok) return setMsg({ kind: "err", text: r.error || "Could not add URL." });
    setUrl({ url: "", kind: url.kind, title: "" });
    setMsg({ kind: "ok", text: "URL added to the library." });
    load();
  }
  async function saveSel() {
    if (!sel) return;
    const r = await api(`/api/admin/media/${sel.id}`, { method: "PATCH", json: { title: sel.title, altText: sel.altText } });
    setMsg(r.ok ? { kind: "ok", text: "Saved." } : { kind: "err", text: r.error || "Save failed." });
    load();
  }
  async function del() {
    if (!sel || !confirm("Delete this media item? Pages still using the URL will show a missing image.")) return;
    const r = await api(`/api/admin/media/${sel.id}`, { method: "DELETE" });
    if (r.ok) { setSel(null); setMsg({ kind: "ok", text: "Deleted." }); load(); } else setMsg({ kind: "err", text: r.error || "Delete failed." });
  }
  const pages = Math.max(1, Math.ceil(total / 24));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">Media library</h1><span className="a-pill">{total}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <input className="a-input !w-52" placeholder="Search…" aria-label="Search media" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <select className="a-input !w-32" aria-label="Type" value={kind} onChange={(e) => { setKind(e.target.value); setPage(1); }}><option value="">All types</option><option value="image">Images</option><option value="video">Videos</option><option value="pdf">PDFs</option></select>
          <input ref={fileRef} type="file" hidden multiple accept=".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm,.pdf" onChange={(e) => e.target.files && upload(e.target.files)} />
          <button className="a-btn a-btn-primary" disabled={busy} onClick={() => fileRef.current?.click()}>{busy ? "Uploading…" : "Upload files"}</button>
        </div>
      </div>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
      <div className="a-card mb-4 flex flex-wrap items-end gap-2 p-3">
        <div className="min-w-[240px] flex-1"><label className="a-label" htmlFor="m-url">Add by URL</label><input id="m-url" className="a-input" placeholder="https://…/image.jpg or video.mp4" value={url.url} onChange={(e) => setUrl({ ...url, url: e.target.value })} /></div>
        <div><label className="a-label" htmlFor="m-kind">Type</label><select id="m-kind" className="a-input" value={url.kind} onChange={(e) => setUrl({ ...url, kind: e.target.value })}><option>image</option><option>video</option><option>pdf</option></select></div>
        <div><label className="a-label" htmlFor="m-title">Title</label><input id="m-title" className="a-input" value={url.title} onChange={(e) => setUrl({ ...url, title: e.target.value })} /></div>
        <button className="a-btn" onClick={addUrl} disabled={!url.url}>Add URL</button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {rows.map((m) => (
              <li key={m.id}>
                <button onClick={() => setSel(m)} className={`a-card block w-full overflow-hidden text-left ${sel?.id === m.id ? "!border-[#1f73c8] ring-2 ring-[#1f73c8]/30" : ""}`}>
                  <Thumb item={m} className="h-28 w-full" />
                  <span className="block truncate px-2.5 pt-2 text-[12.5px] font-semibold">{m.title || "Untitled"}</span>
                  <span className="block px-2.5 pb-2 text-[11px] text-slate-500">{m.kind} · {m.source}{m.size ? ` · ${fmtSize(m.size)}` : ""}</span>
                </button>
              </li>
            ))}
          </ul>
          {rows.length === 0 && <p className="py-12 text-center text-slate-500">No media found.</p>}
          {pages > 1 && <div className="mt-4 flex items-center justify-between text-[13px]"><span className="text-slate-500">Page {page} of {pages}</span><div className="flex gap-2"><button className="a-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="a-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div></div>}
        </div>
        <aside aria-label="Media details" className="a-card h-fit p-4 lg:sticky lg:top-4">
          {!sel ? <p className="text-slate-500">Select an item to preview and edit it.</p> : (
            <div className="space-y-3">
              {sel.kind === "video" ? <video src={sel.url} controls muted className="w-full rounded bg-black" /> : sel.kind === "pdf" ? <a href={sel.url} target="_blank" rel="noreferrer" className="a-btn w-full">Open PDF ↗</a> : <Thumb item={sel} className="max-h-48 w-full rounded" />}
              <div><label className="a-label" htmlFor="s-title">Title</label><input id="s-title" className="a-input" value={sel.title} onChange={(e) => setSel({ ...sel, title: e.target.value })} /></div>
              <div><label className="a-label" htmlFor="s-alt">Alt text</label><input id="s-alt" className="a-input" value={sel.altText} onChange={(e) => setSel({ ...sel, altText: e.target.value })} /></div>
              <div><label className="a-label" htmlFor="s-url">URL</label><div className="flex gap-2"><input id="s-url" readOnly className="a-input" value={sel.url} /><button className="a-btn" onClick={() => { navigator.clipboard?.writeText(new URL(sel.url, location.origin).href); setMsg({ kind: "ok", text: "URL copied." }); }}>Copy</button></div></div>
              <div className="flex gap-2"><button className="a-btn a-btn-primary flex-1" onClick={saveSel}>Save</button><button className="a-btn a-btn-danger" onClick={del}>Delete</button></div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
