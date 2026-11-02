// // // "use client";
// // // import { useCallback, useEffect, useRef, useState } from "react";
// // // import { api } from "@/lib/client";
// // // import type { FieldDef, Opt } from "@/lib/admin/defs";

// // // export type MediaItem = { id: number; title: string; altText: string; kind: string; source: string; url: string; mimeType: string; size: number; createdAt?: string };

// // // const isVideoUrl = (u: string) => /\.(mp4|webm)(\?|$)/i.test(u);
// // // export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// // // export function Thumb({ item, className = "" }: { item: Pick<MediaItem, "kind" | "url" | "title">; className?: string }) {
// // //   if (item.kind === "video" || isVideoUrl(item.url))
// // //     return <div className={`flex items-center justify-center bg-slate-800 text-[11px] font-semibold text-white ${className}`}>▶ VIDEO</div>;
// // //   if (item.kind === "pdf") return <div className={`flex items-center justify-center bg-red-50 text-[11px] font-bold text-red-700 ${className}`}>PDF</div>;
// // //   // eslint-disable-next-line @next/next/no-img-element
// // //   return <img src={item.url} alt={item.title} loading="lazy" className={`object-cover ${className}`} />;
// // // }

// // // export function MediaPicker({ kind, onPick, onClose }: { kind?: "image" | "video"; onPick: (url: string) => void; onClose: () => void }) {
// // //   const [q, setQ] = useState("");
// // //   const [rows, setRows] = useState<MediaItem[]>([]);
// // //   const [page, setPage] = useState(1);
// // //   const [total, setTotal] = useState(0);
// // //   const load = useCallback(async (p: number, term: string, replace: boolean) => {
// // //     const r = await api<{ rows: MediaItem[]; total: number }>(`/api/admin/media?limit=24&page=${p}&q=${encodeURIComponent(term)}${kind ? `&kind=${kind}` : ""}`);
// // //     if (r.ok) {
// // //       setRows((prev) => (replace ? (r.rows as MediaItem[]) : [...prev, ...(r.rows as MediaItem[])]));
// // //       setTotal(r.total as number);
// // //     }
// // //   }, [kind]);
// // //   useEffect(() => {
// // //     const t = setTimeout(() => { setPage(1); load(1, q, true); }, 200);
// // //     return () => clearTimeout(t);
// // //   }, [q, load]);
// // //   useEffect(() => {
// // //     const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
// // //     window.addEventListener("keydown", k);
// // //     return () => window.removeEventListener("keydown", k);
// // //   }, [onClose]);
// // //   return (
// // //     <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Media library">
// // //       <div className="a-card flex max-h-[88vh] w-full max-w-4xl flex-col">
// // //         <div className="flex items-center gap-3 border-b border-slate-200 p-3">
// // //           <h3 className="text-sm font-bold">Choose from media library</h3>
// // //           <input autoFocus className="a-input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search media" />
// // //           <button type="button" className="a-btn ml-auto" onClick={onClose}>Close</button>
// // //         </div>
// // //         <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
// // //           {rows.map((m) => (
// // //             <button type="button" key={m.id} onClick={() => onPick(m.url)} className="group overflow-hidden rounded border border-slate-200 text-left hover:border-brand-500">
// // //               <Thumb item={m} className="h-24 w-full" />
// // //               <span className="block truncate px-2 py-1.5 text-[12px]">{m.title || m.url}</span>
// // //             </button>
// // //           ))}
// // //           {rows.length === 0 && <p className="col-span-full py-10 text-center text-slate-500">No media found.</p>}
// // //         </div>
// // //         {rows.length < total && (
// // //           <div className="border-t border-slate-200 p-3 text-center">
// // //             <button type="button" className="a-btn" onClick={() => { setPage(page + 1); load(page + 1, q, false); }}>Load more</button>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export function MediaField({ id, value, onChange, kind }: { id: string; value: string; onChange: (v: string) => void; kind?: "image" | "video" }) {
// // //   const [busy, setBusy] = useState(false);
// // //   const [err, setErr] = useState("");
// // //   const [pick, setPick] = useState(false);
// // //   const file = useRef<HTMLInputElement>(null);
// // //   async function upload(f: File) {
// // //     const fd = new FormData();
// // //     fd.set("file", f);
// // //     if (kind) fd.set("only", kind);
// // //     setBusy(true);
// // //     setErr("");
// // //     const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
// // //     setBusy(false);
// // //     if (r.ok) onChange(r.url as string);
// // //     else setErr(r.error || "Upload failed.");
// // //   }
// // //   return (
// // //     <div>
// // //       <div className="flex flex-wrap items-center gap-2">
// // //         {value && <Thumb item={{ kind: kind === "video" || isVideoUrl(value) ? "video" : "image", url: value, title: "" }} className="h-10 w-16 shrink-0 rounded border border-slate-200" />}
// // //         <input id={id} className="a-input min-w-[180px] flex-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "video" ? "Upload an MP4/WebM or paste a URL" : "Upload an image or paste a URL"} />
// // //         <input ref={file} type="file" hidden accept={kind === "video" ? ".mp4,.webm" : kind === "image" ? ".jpg,.jpeg,.png,.webp,.svg" : ".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm,.pdf"} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
// // //         <button type="button" className="a-btn" disabled={busy} onClick={() => file.current?.click()}>{busy ? "Uploading…" : "Upload"}</button>
// // //         <button type="button" className="a-btn" onClick={() => setPick(true)}>Library</button>
// // //         {value && <button type="button" className="a-btn" onClick={() => onChange("")} aria-label="Clear">✕</button>}
// // //       </div>
// // //       {err && <p role="alert" className="mt-1 text-[12px] font-semibold text-red-700">{err}</p>}
// // //       {pick && <MediaPicker kind={kind} onClose={() => setPick(false)} onPick={(u) => { onChange(u); setPick(false); }} />}
// // //     </div>
// // //   );
// // // }

// // // const toLocal = (iso: unknown) => {
// // //   if (!iso) return "";
// // //   const d = new Date(String(iso));
// // //   if (Number.isNaN(d.getTime())) return "";
// // //   const p = (n: number) => String(n).padStart(2, "0");
// // //   return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// // // };

// // // export function FieldInput({ f, value, onChange, options, idPrefix = "f" }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; options?: Opt[]; idPrefix?: string }) {
// // //   const id = `${idPrefix}-${f.name}`;
// // //   const v = value ?? "";
// // //   const ro = !!f.readOnly;
// // //   let input;
// // //   switch (f.type) {
// // //     case "textarea":
// // //       input = <textarea id={id} className="a-input" rows={f.rows ?? 4} value={String(v)} readOnly={ro} onChange={(e) => onChange(e.target.value)} />;
// // //       break;
// // //     case "number":
// // //       input = <input id={id} type="number" className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
// // //       break;
// // //     case "boolean":
// // //       return (
// // //         <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[13px] font-semibold">
// // //           <input id={id} type="checkbox" className="h-4 w-4 accent-[#0f5cab]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
// // //           {f.label}
// // //           {f.help && <span className="font-normal text-slate-500">— {f.help}</span>}
// // //         </label>
// // //       );
// // //     case "select": {
// // //       const opts = f.options ?? options ?? [];
// // //       input = (
// // //         <select id={id} className="a-input" value={String(v)} disabled={ro} onChange={(e) => onChange(e.target.value)}>
// // //           {!f.required && <option value="">— none —</option>}
// // //           {f.required && !v && <option value="">Select…</option>}
// // //           {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
// // //         </select>
// // //       );
// // //       break;
// // //     }
// // //     case "media":
// // //       input = <MediaField id={id} value={String(v)} onChange={onChange} kind={f.mediaKind} />;
// // //       break;
// // //     case "datetime":
// // //       input = <input id={id} type="datetime-local" className="a-input" value={toLocal(v)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
// // //       break;
// // //     case "date":
// // //       input = <input id={id} type="date" className="a-input" value={String(v).slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
// // //       break;
// // //     case "color":
// // //       input = (
// // //         <div className="flex gap-2">
// // //           <input aria-label={`${f.label} picker`} type="color" className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value={/^#[0-9a-f]{6}$/i.test(String(v)) ? String(v) : "#0a1f44"} onChange={(e) => onChange(e.target.value)} />
// // //           <input id={id} className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />
// // //         </div>
// // //       );
// // //       break;
// // //     case "password":
// // //       input = <input id={id} type="password" className="a-input" autoComplete="new-password" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
// // //       break;
// // //     default:
// // //       input = <input id={id} type={f.type === "email" ? "email" : "text"} className="a-input" value={String(v)} readOnly={ro} maxLength={f.max ?? 600} onChange={(e) => onChange(e.target.value)} />;
// // //   }
// // //   return (
// // //     <div>
// // //       <label htmlFor={id} className="a-label">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
// // //       {input}
// // //       {f.help && <p className="a-help">{f.help}</p>}
// // //     </div>
// // //   );
// // // }






// // // new new code 




// // "use client";
// // import { useCallback, useEffect, useRef, useState } from "react";
// // import { api } from "@/lib/client";
// // import type { FieldDef, Opt } from "@/lib/admin/defs";
// // import { ImageCropModal } from "@/components/admin/ImageCropModal";

// // export type MediaItem = { id: number; title: string; altText: string; kind: string; source: string; url: string; mimeType: string; size: number; createdAt?: string };

// // const isVideoUrl = (u: string) => /\.(mp4|webm)(\?|$)/i.test(u);
// // export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// // /**
// //  * Crop preset that is pre-selected for each image field (admin can still change it in the crop dialog).
// //  * Keys must match the presets inside ImageCropModal: free | portrait | landscape | square | tall | wide
// //  */
// // const CROP_PRESET: Record<string, string> = {
// //   photoUrl: "square", // team member photo (shown in a circle)
// //   logoUrl: "square",
// //   featuredImageUrl: "landscape",
// //   cardImageUrl: "landscape",
// //   sectionImageUrl: "landscape",
// //   heroImageUrl: "wide",
// //   heroMobileImageUrl: "portrait",
// //   heroPosterUrl: "wide",
// //   ogImage: "wide",
// //   twitterImage: "wide",
// // };

// // /** Images that can be cropped in the browser (SVG stays untouched, GIF is not an allowed upload type). */
// // const isCroppable = (f: { type: string }) => f.type.startsWith("image/") && f.type !== "image/svg+xml";

// // export function Thumb({ item, className = "" }: { item: Pick<MediaItem, "kind" | "url" | "title">; className?: string }) {
// //   if (item.kind === "video" || isVideoUrl(item.url))
// //     return <div className={`flex items-center justify-center bg-slate-800 text-[11px] font-semibold text-white ${className}`}>▶ VIDEO</div>;
// //   if (item.kind === "pdf") return <div className={`flex items-center justify-center bg-red-50 text-[11px] font-bold text-red-700 ${className}`}>PDF</div>;
// //   // eslint-disable-next-line @next/next/no-img-element
// //   return <img src={item.url} alt={item.title} loading="lazy" className={`object-cover ${className}`} />;
// // }

// // export function MediaPicker({ kind, onPick, onClose }: { kind?: "image" | "video"; onPick: (url: string) => void; onClose: () => void }) {
// //   const [q, setQ] = useState("");
// //   const [rows, setRows] = useState<MediaItem[]>([]);
// //   const [page, setPage] = useState(1);
// //   const [total, setTotal] = useState(0);
// //   const load = useCallback(async (p: number, term: string, replace: boolean) => {
// //     const r = await api<{ rows: MediaItem[]; total: number }>(`/api/admin/media?limit=24&page=${p}&q=${encodeURIComponent(term)}${kind ? `&kind=${kind}` : ""}`);
// //     if (r.ok) {
// //       setRows((prev) => (replace ? (r.rows as MediaItem[]) : [...prev, ...(r.rows as MediaItem[])]));
// //       setTotal(r.total as number);
// //     }
// //   }, [kind]);
// //   useEffect(() => {
// //     const t = setTimeout(() => { setPage(1); load(1, q, true); }, 200);
// //     return () => clearTimeout(t);
// //   }, [q, load]);
// //   useEffect(() => {
// //     const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
// //     window.addEventListener("keydown", k);
// //     return () => window.removeEventListener("keydown", k);
// //   }, [onClose]);
// //   return (
// //     <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Media library">
// //       <div className="a-card flex max-h-[88vh] w-full max-w-4xl flex-col">
// //         <div className="flex items-center gap-3 border-b border-slate-200 p-3">
// //           <h3 className="text-sm font-bold">Choose from media library</h3>
// //           <input autoFocus className="a-input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search media" />
// //           <button type="button" className="a-btn ml-auto" onClick={onClose}>Close</button>
// //         </div>
// //         <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
// //           {rows.map((m) => (
// //             <button type="button" key={m.id} onClick={() => onPick(m.url)} className="group overflow-hidden rounded border border-slate-200 text-left hover:border-brand-500">
// //               <Thumb item={m} className="h-24 w-full" />
// //               <span className="block truncate px-2 py-1.5 text-[12px]">{m.title || m.url}</span>
// //             </button>
// //           ))}
// //           {rows.length === 0 && <p className="col-span-full py-10 text-center text-slate-500">No media found.</p>}
// //         </div>
// //         {rows.length < total && (
// //           <div className="border-t border-slate-200 p-3 text-center">
// //             <button type="button" className="a-btn" onClick={() => { setPage(page + 1); load(page + 1, q, false); }}>Load more</button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export function MediaField({ id, name, value, onChange, kind }: { id: string; name?: string; value: string; onChange: (v: string) => void; kind?: "image" | "video" }) {
// //   const [busy, setBusy] = useState(false);
// //   const [err, setErr] = useState("");
// //   const [pick, setPick] = useState(false);
// //   // File waiting in the crop dialog (null = dialog closed)
// //   const [cropFile, setCropFile] = useState<File | null>(null);
// //   const file = useRef<HTMLInputElement>(null);

// //   async function upload(f: File) {
// //     const fd = new FormData();
// //     fd.set("file", f);
// //     if (kind) fd.set("only", kind);
// //     setBusy(true);
// //     setErr("");
// //     const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
// //     setBusy(false);
// //     if (r.ok) onChange(r.url as string);
// //     else setErr(r.error || "Upload failed.");
// //   }

// //   /** New file chosen: images open the crop dialog first, videos / PDFs / SVGs upload directly. */
// //   function onFileChosen(f: File) {
// //     if (kind !== "video" && isCroppable(f)) setCropFile(f);
// //     else upload(f);
// //   }

// //   /** Re-crop an image that is already uploaded (only works for files on our own site). */
// //   async function recrop() {
// //     setErr("");
// //     try {
// //       const res = await fetch(value);
// //       if (!res.ok) throw new Error("fetch failed");
// //       const blob = await res.blob();
// //       if (!isCroppable(blob)) throw new Error("not croppable");
// //       const base = decodeURIComponent(value.split("?")[0].split("/").pop() || "image").replace(/\.[^.]+$/, "") || "image";
// //       setCropFile(new File([blob], `${base}.${blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type }));
// //     } catch {
// //       setErr("This image cannot be cropped here. Upload it again to crop.");
// //     }
// //   }

// //   // "Crop" button for already uploaded images that live on this site
// //   const canRecrop = !!value && kind !== "video" && !isVideoUrl(value) && value.startsWith("/") && !/\.(svg|pdf)(\?|$)/i.test(value);

// //   return (
// //     <div>
// //       <div className="flex flex-wrap items-center gap-2">
// //         {value && <Thumb item={{ kind: kind === "video" || isVideoUrl(value) ? "video" : "image", url: value, title: "" }} className="h-10 w-16 shrink-0 rounded border border-slate-200" />}
// //         <input id={id} className="a-input min-w-[180px] flex-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "video" ? "Upload an MP4/WebM or paste a URL" : "Upload an image or paste a URL"} />
// //         <input ref={file} type="file" hidden accept={kind === "video" ? ".mp4,.webm" : kind === "image" ? ".jpg,.jpeg,.png,.webp,.svg" : ".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm,.pdf"} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChosen(f); e.target.value = ""; }} />
// //         <button type="button" className="a-btn" disabled={busy} onClick={() => file.current?.click()}>{busy ? "Uploading…" : "Upload"}</button>
// //         {canRecrop && <button type="button" className="a-btn" disabled={busy} onClick={recrop}>Crop</button>}
// //         <button type="button" className="a-btn" onClick={() => setPick(true)}>Library</button>
// //         {value && <button type="button" className="a-btn" onClick={() => onChange("")} aria-label="Clear">✕</button>}
// //       </div>
// //       {err && <p role="alert" className="mt-1 text-[12px] font-semibold text-red-700">{err}</p>}
// //       {pick && <MediaPicker kind={kind} onClose={() => setPick(false)} onPick={(u) => { onChange(u); setPick(false); }} />}
// //       {cropFile && (
// //         <ImageCropModal
// //           file={cropFile}
// //           initialPreset={(name && CROP_PRESET[name]) || "free"}
// //           onCancel={() => setCropFile(null)}
// //           onConfirm={(cropped) => {
// //             setCropFile(null);
// //             upload(cropped);
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // const toLocal = (iso: unknown) => {
// //   if (!iso) return "";
// //   const d = new Date(String(iso));
// //   if (Number.isNaN(d.getTime())) return "";
// //   const p = (n: number) => String(n).padStart(2, "0");
// //   return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// // };

// // export function FieldInput({ f, value, onChange, options, idPrefix = "f" }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; options?: Opt[]; idPrefix?: string }) {
// //   const id = `${idPrefix}-${f.name}`;
// //   const v = value ?? "";
// //   const ro = !!f.readOnly;
// //   let input;
// //   switch (f.type) {
// //     case "textarea":
// //       input = <textarea id={id} className="a-input" rows={f.rows ?? 4} value={String(v)} readOnly={ro} onChange={(e) => onChange(e.target.value)} />;
// //       break;
// //     case "number":
// //       input = <input id={id} type="number" className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
// //       break;
// //     case "boolean":
// //       return (
// //         <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[13px] font-semibold">
// //           <input id={id} type="checkbox" className="h-4 w-4 accent-[#0f5cab]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
// //           {f.label}
// //           {f.help && <span className="font-normal text-slate-500">— {f.help}</span>}
// //         </label>
// //       );
// //     case "select": {
// //       const opts = f.options ?? options ?? [];
// //       input = (
// //         <select id={id} className="a-input" value={String(v)} disabled={ro} onChange={(e) => onChange(e.target.value)}>
// //           {!f.required && <option value="">— none —</option>}
// //           {f.required && !v && <option value="">Select…</option>}
// //           {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
// //         </select>
// //       );
// //       break;
// //     }
// //     case "media":
// //       input = <MediaField id={id} name={f.name} value={String(v)} onChange={onChange} kind={f.mediaKind} />;
// //       break;
// //     case "datetime":
// //       input = <input id={id} type="datetime-local" className="a-input" value={toLocal(v)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
// //       break;
// //     case "date":
// //       input = <input id={id} type="date" className="a-input" value={String(v).slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
// //       break;
// //     case "color":
// //       input = (
// //         <div className="flex gap-2">
// //           <input aria-label={`${f.label} picker`} type="color" className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value={/^#[0-9a-f]{6}$/i.test(String(v)) ? String(v) : "#0a1f44"} onChange={(e) => onChange(e.target.value)} />
// //           <input id={id} className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />
// //         </div>
// //       );
// //       break;
// //     case "password":
// //       input = <input id={id} type="password" className="a-input" autoComplete="new-password" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
// //       break;
// //     default:
// //       input = <input id={id} type={f.type === "email" ? "email" : "text"} className="a-input" value={String(v)} readOnly={ro} maxLength={f.max ?? 600} onChange={(e) => onChange(e.target.value)} />;
// //   }
// //   return (
// //     <div>
// //       <label htmlFor={id} className="a-label">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
// //       {input}
// //       {f.help && <p className="a-help">{f.help}</p>}
// //     </div>
// //   );
// // }






// // new code 




// "use client";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { api } from "@/lib/client";
// import type { FieldDef, Opt } from "@/lib/admin/defs";
// import { ImageCropModal } from "@/components/admin/ImageCropModal";
// import { resizeImage } from "@/lib/image-tools";

// export type MediaItem = { id: number; title: string; altText: string; kind: string; source: string; url: string; mimeType: string; size: number; createdAt?: string };

// const isVideoUrl = (u: string) => /\.(mp4|webm)(\?|$)/i.test(u);
// export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// /**
//  * Crop preset that is pre-selected for each image field (admin can still change it in the crop dialog).
//  * Keys must match the presets inside ImageCropModal: free | portrait | landscape | square | tall | wide
//  */
// const CROP_PRESET: Record<string, string> = {
//   photoUrl: "square", // team member photo (shown in a circle)
//   logoUrl: "square",
//   featuredImageUrl: "landscape",
//   cardImageUrl: "landscape",
//   sectionImageUrl: "landscape",
//   heroImageUrl: "wide",
//   heroMobileImageUrl: "portrait",
//   heroPosterUrl: "wide",
//   ogImage: "wide",
//   twitterImage: "wide",
// };

// /** Longest side (px) an uploaded image is shrunk to. Keeps the website fast. */
// function maxSideFor(name?: string): number {
//   if (!name) return 1600;
//   if (name.startsWith("hero")) return 2400;
//   if (name === "photoUrl" || name === "logoUrl") return 900;
//   return 1600;
// }

// /** Images that can be processed in the browser (SVG stays untouched). */
// const isCroppable = (f: { type: string }) => f.type.startsWith("image/") && f.type !== "image/svg+xml";

// export function Thumb({ item, className = "" }: { item: Pick<MediaItem, "kind" | "url" | "title">; className?: string }) {
//   if (item.kind === "video" || isVideoUrl(item.url))
//     return <div className={`flex items-center justify-center bg-slate-800 text-[11px] font-semibold text-white ${className}`}>▶ VIDEO</div>;
//   if (item.kind === "pdf") return <div className={`flex items-center justify-center bg-red-50 text-[11px] font-bold text-red-700 ${className}`}>PDF</div>;
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={item.url} alt={item.title} loading="lazy" className={`object-cover ${className}`} />;
// }

// export function MediaPicker({ kind, onPick, onClose }: { kind?: "image" | "video"; onPick: (url: string) => void; onClose: () => void }) {
//   const [q, setQ] = useState("");
//   const [rows, setRows] = useState<MediaItem[]>([]);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const load = useCallback(async (p: number, term: string, replace: boolean) => {
//     const r = await api<{ rows: MediaItem[]; total: number }>(`/api/admin/media?limit=24&page=${p}&q=${encodeURIComponent(term)}${kind ? `&kind=${kind}` : ""}`);
//     if (r.ok) {
//       setRows((prev) => (replace ? (r.rows as MediaItem[]) : [...prev, ...(r.rows as MediaItem[])]));
//       setTotal(r.total as number);
//     }
//   }, [kind]);
//   useEffect(() => {
//     const t = setTimeout(() => { setPage(1); load(1, q, true); }, 200);
//     return () => clearTimeout(t);
//   }, [q, load]);
//   useEffect(() => {
//     const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", k);
//     return () => window.removeEventListener("keydown", k);
//   }, [onClose]);
//   return (
//     <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Media library">
//       <div className="a-card flex max-h-[88vh] w-full max-w-4xl flex-col">
//         <div className="flex items-center gap-3 border-b border-slate-200 p-3">
//           <h3 className="text-sm font-bold">Choose from media library</h3>
//           <input autoFocus className="a-input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search media" />
//           <button type="button" className="a-btn ml-auto" onClick={onClose}>Close</button>
//         </div>
//         <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
//           {rows.map((m) => (
//             <button type="button" key={m.id} onClick={() => onPick(m.url)} className="group overflow-hidden rounded border border-slate-200 text-left hover:border-brand-500">
//               <Thumb item={m} className="h-24 w-full" />
//               <span className="block truncate px-2 py-1.5 text-[12px]">{m.title || m.url}</span>
//             </button>
//           ))}
//           {rows.length === 0 && <p className="col-span-full py-10 text-center text-slate-500">No media found.</p>}
//         </div>
//         {rows.length < total && (
//           <div className="border-t border-slate-200 p-3 text-center">
//             <button type="button" className="a-btn" onClick={() => { setPage(page + 1); load(page + 1, q, false); }}>Load more</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function MediaField({ id, name, value, onChange, kind }: { id: string; name?: string; value: string; onChange: (v: string) => void; kind?: "image" | "video" }) {
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");
//   const [pick, setPick] = useState(false);
//   // File waiting in the crop dialog (null = dialog closed)
//   const [cropFile, setCropFile] = useState<File | null>(null);
//   const file = useRef<HTMLInputElement>(null);

//   async function upload(f: File) {
//     setBusy(true);
//     setErr("");

//     // Shrink big photos first, so the website never has to load a 6 MB picture
//     let toSend = f;
//     if (kind !== "video" && isCroppable(f)) toSend = await resizeImage(f, f.name, maxSideFor(name));

//     const fd = new FormData();
//     fd.set("file", toSend);
//     if (kind) fd.set("only", kind);
//     const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
//     setBusy(false);
//     if (r.ok) onChange(r.url as string);
//     else setErr(r.error || "Upload failed.");
//   }

//   /** New file chosen: images open the crop dialog first, videos / PDFs / SVGs upload directly. */
//   function onFileChosen(f: File) {
//     if (kind !== "video" && isCroppable(f)) setCropFile(f);
//     else upload(f);
//   }

//   /** Re-crop (or rotate) an image that is already uploaded (only works for files on our own site). */
//   async function recrop() {
//     setErr("");
//     try {
//       const res = await fetch(value);
//       if (!res.ok) throw new Error("fetch failed");
//       const blob = await res.blob();
//       if (!isCroppable(blob)) throw new Error("not croppable");
//       const base = decodeURIComponent(value.split("?")[0].split("/").pop() || "image").replace(/\.[^.]+$/, "") || "image";
//       setCropFile(new File([blob], `${base}.${blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type }));
//     } catch {
//       setErr("This image cannot be edited here. Upload it again to crop or rotate.");
//     }
//   }

//   // "Crop" button for already uploaded images that live on this site
//   const canRecrop = !!value && kind !== "video" && !isVideoUrl(value) && value.startsWith("/") && !/\.(svg|pdf)(\?|$)/i.test(value);

//   return (
//     <div>
//       <div className="flex flex-wrap items-center gap-2">
//         {value && <Thumb item={{ kind: kind === "video" || isVideoUrl(value) ? "video" : "image", url: value, title: "" }} className="h-10 w-16 shrink-0 rounded border border-slate-200" />}
//         <input id={id} className="a-input min-w-[180px] flex-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "video" ? "Upload an MP4/WebM or paste a URL" : "Upload an image or paste a URL"} />
//         <input ref={file} type="file" hidden accept={kind === "video" ? ".mp4,.webm" : kind === "image" ? ".jpg,.jpeg,.png,.webp,.svg" : ".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm,.pdf"} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChosen(f); e.target.value = ""; }} />
//         <button type="button" className="a-btn" disabled={busy} onClick={() => file.current?.click()}>{busy ? "Uploading…" : "Upload"}</button>
//         {canRecrop && <button type="button" className="a-btn" disabled={busy} onClick={recrop}>Crop / Rotate</button>}
//         <button type="button" className="a-btn" onClick={() => setPick(true)}>Library</button>
//         {value && <button type="button" className="a-btn" onClick={() => onChange("")} aria-label="Clear">✕</button>}
//       </div>
//       {err && <p role="alert" className="mt-1 text-[12px] font-semibold text-red-700">{err}</p>}
//       {pick && <MediaPicker kind={kind} onClose={() => setPick(false)} onPick={(u) => { onChange(u); setPick(false); }} />}
//       {cropFile && (
//         <ImageCropModal
//           file={cropFile}
//           initialPreset={(name && CROP_PRESET[name]) || "free"}
//           onCancel={() => setCropFile(null)}
//           onConfirm={(cropped) => {
//             setCropFile(null);
//             upload(cropped);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// const toLocal = (iso: unknown) => {
//   if (!iso) return "";
//   const d = new Date(String(iso));
//   if (Number.isNaN(d.getTime())) return "";
//   const p = (n: number) => String(n).padStart(2, "0");
//   return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
// };

// export function FieldInput({ f, value, onChange, options, idPrefix = "f" }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; options?: Opt[]; idPrefix?: string }) {
//   const id = `${idPrefix}-${f.name}`;
//   const v = value ?? "";
//   const ro = !!f.readOnly;
//   let input;
//   switch (f.type) {
//     case "textarea":
//       input = <textarea id={id} className="a-input" rows={f.rows ?? 4} value={String(v)} readOnly={ro} onChange={(e) => onChange(e.target.value)} />;
//       break;
//     case "number":
//       input = <input id={id} type="number" className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
//       break;
//     case "boolean":
//       return (
//         <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[13px] font-semibold">
//           <input id={id} type="checkbox" className="h-4 w-4 accent-[#0f5cab]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
//           {f.label}
//           {f.help && <span className="font-normal text-slate-500">— {f.help}</span>}
//         </label>
//       );
//     case "select": {
//       const opts = f.options ?? options ?? [];
//       input = (
//         <select id={id} className="a-input" value={String(v)} disabled={ro} onChange={(e) => onChange(e.target.value)}>
//           {!f.required && <option value="">— none —</option>}
//           {f.required && !v && <option value="">Select…</option>}
//           {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//         </select>
//       );
//       break;
//     }
//     case "media":
//       input = <MediaField id={id} name={f.name} value={String(v)} onChange={onChange} kind={f.mediaKind} />;
//       break;
//     case "datetime":
//       input = <input id={id} type="datetime-local" className="a-input" value={toLocal(v)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
//       break;
//     case "date":
//       input = <input id={id} type="date" className="a-input" value={String(v).slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
//       break;
//     case "color":
//       input = (
//         <div className="flex gap-2">
//           <input aria-label={`${f.label} picker`} type="color" className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value={/^#[0-9a-f]{6}$/i.test(String(v)) ? String(v) : "#0a1f44"} onChange={(e) => onChange(e.target.value)} />
//           <input id={id} className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />
//         </div>
//       );
//       break;
//     case "password":
//       input = <input id={id} type="password" className="a-input" autoComplete="new-password" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
//       break;
//     default:
//       input = <input id={id} type={f.type === "email" ? "email" : "text"} className="a-input" value={String(v)} readOnly={ro} maxLength={f.max ?? 600} onChange={(e) => onChange(e.target.value)} />;
//   }
//   return (
//     <div>
//       <label htmlFor={id} className="a-label">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
//       {input}
//       {f.help && <p className="a-help">{f.help}</p>}
//     </div>
//   );
// }



// new code 



"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client";
import type { FieldDef, Opt } from "@/lib/admin/defs";
import { ImageCropModal } from "@/components/admin/ImageCropModal";
import { resizeImage } from "@/lib/image-tools";

export type MediaItem = { id: number; title: string; altText: string; kind: string; source: string; url: string; mimeType: string; size: number; createdAt?: string };

const isVideoUrl = (u: string) => /\.(mp4|webm)(\?|$)/i.test(u);
export const fmtSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/**
 * Crop preset that is pre-selected for each image field (admin can still change it in the crop dialog).
 * Keys must match the presets inside ImageCropModal: free | portrait | landscape | square | tall | wide
 */
const CROP_PRESET: Record<string, string> = {
  photoUrl: "square", // team member photo (shown in a circle)
  logoUrl: "square",
  featuredImageUrl: "landscape",
  cardImageUrl: "landscape",
  sectionImageUrl: "landscape",
  heroImageUrl: "wide",
  heroMobileImageUrl: "portrait",
  heroPosterUrl: "wide",
  ogImage: "wide",
  twitterImage: "wide",
};

/** Longest side (px) an uploaded image is shrunk to. Keeps the website fast. */
function maxSideFor(name?: string): number {
  if (!name) return 1600;
  if (name.startsWith("hero")) return 2400;
  if (name === "photoUrl" || name === "logoUrl") return 900;
  return 1600;
}

/** Images that can be processed in the browser (SVG stays untouched). */
const isCroppable = (f: { type: string }) => f.type.startsWith("image/") && f.type !== "image/svg+xml";

export function Thumb({ item, className = "" }: { item: Pick<MediaItem, "kind" | "url" | "title">; className?: string }) {
  if (item.kind === "video" || isVideoUrl(item.url))
    return <div className={`flex items-center justify-center bg-slate-800 text-[11px] font-semibold text-white ${className}`}>▶ VIDEO</div>;
  if (item.kind === "pdf") return <div className={`flex items-center justify-center bg-red-50 text-[11px] font-bold text-red-700 ${className}`}>PDF</div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={item.url} alt={item.title} loading="lazy" className={`object-cover ${className}`} />;
}

export function MediaPicker({ kind, onPick, onClose }: { kind?: "image" | "video"; onPick: (url: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const load = useCallback(async (p: number, term: string, replace: boolean) => {
    const r = await api<{ rows: MediaItem[]; total: number }>(`/api/admin/media?limit=24&page=${p}&q=${encodeURIComponent(term)}${kind ? `&kind=${kind}` : ""}`);
    if (r.ok) {
      setRows((prev) => (replace ? (r.rows as MediaItem[]) : [...prev, ...(r.rows as MediaItem[])]));
      setTotal(r.total as number);
    }
  }, [kind]);
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); load(1, q, true); }, 200);
    return () => clearTimeout(t);
  }, [q, load]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label="Media library">
      <div className="a-card flex max-h-[88vh] w-full max-w-4xl flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 p-3">
          <h3 className="text-sm font-bold">Choose from media library</h3>
          <input autoFocus className="a-input max-w-xs" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search media" />
          <button type="button" className="a-btn ml-auto" onClick={onClose}>Close</button>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
          {rows.map((m) => (
            <button type="button" key={m.id} onClick={() => onPick(m.url)} className="group overflow-hidden rounded border border-slate-200 text-left hover:border-brand-500">
              <Thumb item={m} className="h-24 w-full" />
              <span className="block truncate px-2 py-1.5 text-[12px]">{m.title || m.url}</span>
            </button>
          ))}
          {rows.length === 0 && <p className="col-span-full py-10 text-center text-slate-500">No media found.</p>}
        </div>
        {rows.length < total && (
          <div className="border-t border-slate-200 p-3 text-center">
            <button type="button" className="a-btn" onClick={() => { setPage(page + 1); load(page + 1, q, false); }}>Load more</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function MediaField({ id, name, value, onChange, kind }: { id: string; name?: string; value: string; onChange: (v: string) => void; kind?: "image" | "video" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pick, setPick] = useState(false);
  // File waiting in the crop dialog (null = dialog closed)
  const [cropFile, setCropFile] = useState<File | null>(null);
  const file = useRef<HTMLInputElement>(null);

  async function upload(f: File) {
    setBusy(true);
    setErr("");

    // Shrink big photos first, so the website never has to load a 6 MB picture
    let toSend = f;
    if (kind !== "video" && isCroppable(f)) toSend = await resizeImage(f, f.name, maxSideFor(name));

    const fd = new FormData();
    fd.set("file", toSend);
    if (kind) fd.set("only", kind);
    const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
    setBusy(false);
    if (r.ok) onChange(r.url as string);
    else setErr(r.error || "Upload failed.");
  }

  /** New file chosen: images open the crop dialog first, videos / PDFs / SVGs upload directly. */
  function onFileChosen(f: File) {
    if (kind !== "video" && isCroppable(f)) setCropFile(f);
    else upload(f);
  }

  /** Re-crop (or rotate) an image that is already uploaded (only works for files on our own site). */
  async function recrop() {
    setErr("");
    try {
      const res = await fetch(value);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      if (!isCroppable(blob)) throw new Error("not croppable");
      const base = decodeURIComponent(value.split("?")[0].split("/").pop() || "image").replace(/\.[^.]+$/, "") || "image";
      setCropFile(new File([blob], `${base}.${blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg"}`, { type: blob.type }));
    } catch {
      setErr("This image cannot be edited here. Upload it again to crop or rotate.");
    }
  }

  // "Crop" button for already uploaded images that live on this site
  const canRecrop = !!value && kind !== "video" && !isVideoUrl(value) && value.startsWith("/") && !/\.(svg|pdf)(\?|$)/i.test(value);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {value && <Thumb item={{ kind: kind === "video" || isVideoUrl(value) ? "video" : "image", url: value, title: "" }} className="h-10 w-16 shrink-0 rounded border border-slate-200" />}
        <input id={id} className="a-input min-w-[180px] flex-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "video" ? "Upload an MP4/WebM or paste a URL" : "Upload an image or paste a URL"} />
        <input ref={file} type="file" hidden accept={kind === "video" ? ".mp4,.webm" : kind === "image" ? ".jpg,.jpeg,.png,.webp,.svg" : ".jpg,.jpeg,.png,.webp,.svg,.mp4,.webm,.pdf"} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChosen(f); e.target.value = ""; }} />
        <button type="button" className="a-btn" disabled={busy} onClick={() => file.current?.click()}>{busy ? "Uploading…" : "Upload"}</button>
        {canRecrop && <button type="button" className="a-btn" disabled={busy} onClick={recrop}>Crop / Rotate</button>}
        <button type="button" className="a-btn" onClick={() => setPick(true)}>Library</button>
        {value && <button type="button" className="a-btn" onClick={() => onChange("")} aria-label="Clear">✕</button>}
      </div>
      {err && <p role="alert" className="mt-1 text-[12px] font-semibold text-red-700">{err}</p>}
      {pick && <MediaPicker kind={kind} onClose={() => setPick(false)} onPick={(u) => { onChange(u); setPick(false); }} />}
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          initialPreset={(name && CROP_PRESET[name]) || "free"}
          onCancel={() => setCropFile(null)}
          onConfirm={(cropped) => {
            setCropFile(null);
            upload(cropped);
          }}
        />
      )}
    </div>
  );
}

const toLocal = (iso: unknown) => {
  if (!iso) return "";
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function FieldInput({ f, value, onChange, options, idPrefix = "f" }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; options?: Opt[]; idPrefix?: string }) {
  const id = `${idPrefix}-${f.name}`;
  const v = value ?? "";
  const ro = !!f.readOnly;
  let input;
  switch (f.type) {
    case "textarea":
      input = <textarea id={id} className="a-input" rows={f.rows ?? 4} value={String(v)} readOnly={ro} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "number":
      input = <input id={id} type="number" className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "boolean":
      return (
        <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[13px] font-semibold">
          <input id={id} type="checkbox" className="h-4 w-4 accent-[#0f5cab]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {f.label}
          {f.help && <span className="font-normal text-slate-500">— {f.help}</span>}
        </label>
      );
    case "select": {
      const opts = f.options ?? options ?? [];
      input = (
        <select id={id} className="a-input" value={String(v)} disabled={ro} onChange={(e) => onChange(e.target.value)}>
          {!f.required && <option value="">— none —</option>}
          {f.required && !v && <option value="">Select…</option>}
          {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    }
    case "media":
      input = <MediaField id={id} name={f.name} value={String(v)} onChange={onChange} kind={f.mediaKind} />;
      break;
    case "datetime":
      input = <input id={id} type="datetime-local" className="a-input" value={toLocal(v)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
      break;
    case "date":
      input = <input id={id} type="date" className="a-input" value={String(v).slice(0, 10)} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "color":
      input = (
        <div className="flex gap-2">
          <input aria-label={`${f.label} picker`} type="color" className="h-9 w-12 cursor-pointer rounded border border-slate-300 bg-white p-0.5" value={/^#[0-9a-f]{6}$/i.test(String(v)) ? String(v) : "#0a1f44"} onChange={(e) => onChange(e.target.value)} />
          <input id={id} className="a-input" value={String(v)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
      break;
    case "password":
      input = <input id={id} type="password" className="a-input" autoComplete="new-password" value={String(v)} onChange={(e) => onChange(e.target.value)} />;
      break;
    default: {
      // A text field with suggestions (optionsFrom) works like a combo box: type a new value or pick an existing one
      const listId = f.type === "text" && options && options.length > 0 ? `${id}-list` : undefined;
      input = (
        <>
          <input id={id} type={f.type === "email" ? "email" : "text"} className="a-input" value={String(v)} readOnly={ro} maxLength={f.max ?? 600} list={listId} autoComplete={listId ? "off" : undefined} onChange={(e) => onChange(e.target.value)} />
          {listId && (
            <datalist id={listId}>
              {(options ?? []).map((o) => <option key={o.value} value={o.value} />)}
            </datalist>
          )}
        </>
      );
    }
  }
  return (
    <div>
      <label htmlFor={id} className="a-label">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
      {input}
      {f.help && <p className="a-help">{f.help}</p>}
    </div>
  );
}