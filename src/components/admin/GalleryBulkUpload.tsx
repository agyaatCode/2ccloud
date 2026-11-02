// /**
//  * FILE: src/components/admin/GalleryBulkUpload.tsx
//  * TYPE: Client Component (admin modal)
//  * INCLUDES: Upload many images and videos in one go for the Gallery.
//  *  - drag & drop or file chooser (JPG, PNG, WebP, MP4, WebM)
//  *  - every file becomes its own gallery item (POST /api/admin/r/gallery)
//  *  - rotate button (↻) on every image row, applied before upload
//  *  - big photos are shrunk automatically (max 1280px, WebP/JPEG) so the site stays fast
//  *  - warning for very large videos (compress them for smooth playback)
//  *  - shape: auto-detected from each file's size, or one fixed shape for the whole batch
//  *  - optional crop step for every image (uses ImageCropModal, which also has rotate / flip)
//  *  - video poster is generated in the browser from the first frame
//  *  - per-file status, overall progress, retry for failed files
//  * NOTE: Geometry uses inline styles so it never depends on Tailwind theme tokens.
//  */
// "use client";

// import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
// import { api } from "@/lib/client";
// import { ImageCropModal } from "@/components/admin/ImageCropModal";
// import { fmtSize } from "@/components/admin/fields";
// import { ASPECT_OPTIONS, FOCUS_OPTIONS } from "@/lib/home-media";
// import { baseName, imageSize, resizeImage } from "@/lib/image-tools";

// type Status = "queued" | "uploading" | "done" | "error" | "skipped";
// type Kind = "image" | "video";
// type Entry = { id: string; file: File; kind: Kind; preview: string; status: Status; error: string; warn: string; rot: number };
// type CropReq = { file: File; preset: string; resolve: (f: File | null) => void };

// /* ------------------------------ helpers ------------------------------ */

// const IMG_TYPE = /^image\/(jpeg|png|webp)$/;
// const VID_TYPE = /^video\/(mp4|webm)$/;

// const GALLERY_MAX = 1280; // longest side of an uploaded gallery photo (px)
// const BIG_VIDEO = 40 * 1024 * 1024; // videos above this size get a warning

// /** Decide if a file is a supported image / video (falls back to the file extension). */
// function classify(f: File): Kind | null {
//   if (IMG_TYPE.test(f.type)) return "image";
//   if (VID_TYPE.test(f.type)) return "video";
//   const n = f.name.toLowerCase();
//   if (/\.(jpe?g|png|webp)$/.test(n)) return "image";
//   if (/\.(mp4|webm)$/.test(n)) return "video";
//   return null;
// }

// /** Pick the closest shape for a given width / height. */
// function aspectFrom(w: number, h: number): string {
//   const r = w / Math.max(h, 1);
//   if (r >= 1.2) return "landscape";
//   if (r >= 0.92) return "square";
//   if (r >= 0.7) return "portrait";
//   return "tall";
// }

// /** Grab the first frame of a local video as a JPEG (best effort) and read its size. */
// function videoPoster(file: File): Promise<{ blob: Blob | null; w: number; h: number }> {
//   return new Promise((resolve) => {
//     const url = URL.createObjectURL(file);
//     const v = document.createElement("video");
//     v.muted = true;
//     v.playsInline = true;
//     v.preload = "metadata";
//     let done = false;
//     let timer: ReturnType<typeof setTimeout>;

//     const finish = (blob: Blob | null) => {
//       if (done) return;
//       done = true;
//       clearTimeout(timer);
//       const w = v.videoWidth;
//       const h = v.videoHeight;
//       URL.revokeObjectURL(url);
//       resolve({ blob, w, h });
//     };

//     timer = setTimeout(() => finish(null), 12000);
//     v.onerror = () => finish(null);
//     v.onloadedmetadata = () => {
//       // jump a little into the video so the frame is not black
//       v.currentTime = Math.min(1, (v.duration || 1) * 0.1);
//     };
//     v.onseeked = () => {
//       try {
//         const s = Math.min(1, 1280 / Math.max(v.videoWidth, 1));
//         const c = document.createElement("canvas");
//         c.width = Math.max(1, Math.round(v.videoWidth * s));
//         c.height = Math.max(1, Math.round(v.videoHeight * s));
//         const ctx = c.getContext("2d");
//         if (!ctx) return finish(null);
//         ctx.drawImage(v, 0, 0, c.width, c.height);
//         c.toBlob((b) => finish(b), "image/jpeg", 0.8);
//       } catch {
//         finish(null);
//       }
//     };
//     v.src = url;
//   });
// }

// async function uploadFile(f: File, only: Kind): Promise<string> {
//   const fd = new FormData();
//   fd.set("file", f);
//   fd.set("only", only);
//   const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
//   if (!r.ok) throw new Error(r.error || "Upload failed.");
//   return r.url as string;
// }

// const PILL: Record<Status, { label: string; bg: string; fg: string }> = {
//   queued: { label: "Waiting", bg: "#f1f5f9", fg: "#475569" },
//   uploading: { label: "Uploading…", bg: "#dbeafe", fg: "#1d4ed8" },
//   done: { label: "✓ Done", bg: "#dcfce7", fg: "#15803d" },
//   error: { label: "Failed", bg: "#fee2e2", fg: "#b91c1c" },
//   skipped: { label: "Skipped", bg: "#fef3c7", fg: "#b45309" },
// };

// /* ------------------------------ component ------------------------------ */

// export function GalleryBulkUpload({
//   startOrder,
//   onClose,
//   onFinished,
// }: {
//   /** Number of existing items. New items get sort orders after it. */
//   startOrder: number;
//   onClose: () => void;
//   /** Called after an upload run so the list can refresh. */
//   onFinished: () => void;
// }) {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [shape, setShape] = useState("auto"); // auto | portrait | landscape | square | tall
//   const [focus, setFocus] = useState("center center");
//   const [cropEach, setCropEach] = useState(false);
//   const [nameTitle, setNameTitle] = useState(false);
//   const [running, setRunning] = useState(false);
//   const [notice, setNotice] = useState("");
//   const [over, setOver] = useState(false);
//   const [cropReq, setCropReq] = useState<CropReq | null>(null);

//   const input = useRef<HTMLInputElement>(null);
//   const opts = useRef({ shape, focus, cropEach, nameTitle }); // settings snapshot used while uploading
//   const orderRef = useRef(startOrder);
//   const orders = useRef(new Map<string, number>());
//   const previews = useRef<string[]>([]);

//   /* free the preview URLs when the dialog closes */
//   useEffect(() => {
//     const list = previews.current;
//     return () => list.forEach((u) => URL.revokeObjectURL(u));
//   }, []);

//   /* Esc closes (not while uploading or cropping) */
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && !running && !cropReq && onClose();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [running, cropReq, onClose]);

//   const patch = useCallback((id: string, p: Partial<Entry>) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...p } : e)));
//   }, []);

//   const addFiles = (list: FileList | File[]) => {
//     const arr = Array.from(list);
//     let skipped = 0;
//     const add: Entry[] = [];
//     for (const f of arr) {
//       const kind = classify(f);
//       if (!kind) {
//         skipped++;
//         continue;
//       }
//       // ignore exact duplicates already in the list
//       const dup = entries.some((e) => e.file.name === f.name && e.file.size === f.size && e.file.lastModified === f.lastModified);
//       if (dup) continue;
//       const preview = kind === "image" ? URL.createObjectURL(f) : "";
//       if (preview) previews.current.push(preview);
//       const warn = kind === "video" && f.size > BIG_VIDEO ? `Large video (${fmtSize(f.size)}). Compress it for smoother playback.` : "";
//       add.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, file: f, kind, preview, status: "queued", error: "", warn, rot: 0 });
//     }
//     setEntries((prev) => [...prev, ...add]);
//     setNotice(skipped ? `${skipped} file(s) skipped. Only JPG, PNG, WebP, MP4 and WebM are allowed.` : "");
//   };

//   const removeEntry = (id: string) => {
//     setEntries((prev) => {
//       const en = prev.find((e) => e.id === id);
//       if (en?.preview) URL.revokeObjectURL(en.preview);
//       return prev.filter((e) => e.id !== id);
//     });
//   };

//   /** Turn an image 90° clockwise (applied when the file is uploaded). */
//   const rotateEntry = (id: string) => {
//     setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, rot: (e.rot + 1) % 4 } : e)));
//   };

//   /** Ask the admin to crop one image. Resolves with the cropped file, or null to skip it. */
//   const askCrop = (file: File, preset: string) => new Promise<File | null>((resolve) => setCropReq({ file, preset, resolve }));

//   /** Upload one entry and create its gallery item. */
//   async function processOne(en: Entry) {
//     const o = opts.current;
//     patch(en.id, { status: "uploading", error: "" });
//     try {
//       let file = en.file;

//       if (en.kind === "image") {
//         // 1) rotation chosen in the list (full quality, shrunk later)
//         if (en.rot) file = await resizeImage(file, file.name, 3000, { quarter: en.rot, force: true, quality: 0.92 });

//         // 2) optional crop step
//         if (o.cropEach) {
//           const cropped = await askCrop(file, o.shape === "auto" ? "free" : o.shape);
//           if (!cropped) {
//             patch(en.id, { status: "skipped" });
//             return;
//           }
//           file = cropped;
//         }

//         // 3) keep the website fast: shrink the photo
//         file = await resizeImage(file, file.name, GALLERY_MAX);
//       }

//       let dims: { w: number; h: number } | null = null;
//       let posterUrl = "";

//       if (en.kind === "video") {
//         const { blob, w, h } = await videoPoster(file);
//         if (w && h) dims = { w, h };
//         if (blob) {
//           try {
//             posterUrl = await uploadFile(new File([blob], `${baseName(file.name)}-poster.jpg`, { type: "image/jpeg" }), "image");
//           } catch {
//             posterUrl = ""; // the poster is optional
//           }
//         }
//       } else {
//         dims = await imageSize(file);
//       }

//       const url = await uploadFile(file, en.kind);
//       const aspect = o.shape === "auto" ? (dims ? aspectFrom(dims.w, dims.h) : "portrait") : o.shape;
//       const title = o.nameTitle ? baseName(en.file.name).replace(/[_-]+/g, " ").trim().slice(0, 160) : "";

//       const r = await api("/api/admin/r/gallery", {
//         method: "POST",
//         json: {
//           kind: en.kind,
//           title,
//           caption: "",
//           imageUrl: en.kind === "image" ? url : posterUrl,
//           videoUrl: en.kind === "video" ? url : "",
//           aspect,
//           focus: o.focus,
//           sortOrder: orders.current.get(en.id) ?? 0,
//           isActive: true,
//         },
//       });
//       if (!r.ok) throw new Error(r.error || "Could not save the gallery item.");
//       patch(en.id, { status: "done" });
//     } catch (e) {
//       patch(en.id, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
//     }
//   }

//   /** Run a list of entries with a small worker pool. */
//   async function run(list: Entry[]) {
//     if (!list.length) return;
//     opts.current = { shape, focus, cropEach, nameTitle };
//     list.forEach((en) => orders.current.set(en.id, ++orderRef.current));
//     setRunning(true);
//     setNotice("");

//     const queue = [...list];
//     const workers = opts.current.cropEach ? 1 : 3; // cropping needs one file at a time
//     await Promise.all(
//       Array.from({ length: Math.min(workers, queue.length) }, async () => {
//         while (queue.length) {
//           const en = queue.shift();
//           if (en) await processOne(en);
//         }
//       }),
//     );

//     setRunning(false);
//     onFinished();
//   }

//   const queued = entries.filter((e) => e.status === "queued");
//   const failed = entries.filter((e) => e.status === "error");
//   const doneCount = entries.filter((e) => e.status === "done").length;
//   const finished = entries.filter((e) => e.status === "done" || e.status === "error" || e.status === "skipped").length;
//   const pct = entries.length ? Math.round((finished / entries.length) * 100) : 0;

//   const retryFailed = () => {
//     const list = failed;
//     setEntries((prev) => prev.map((e) => (e.status === "error" ? { ...e, status: "queued", error: "" } : e)));
//     run(list);
//   };

//   const zone: CSSProperties = {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     padding: "26px 16px",
//     borderRadius: 14,
//     border: `2px dashed ${over ? "#1f73c8" : "#cbd5e1"}`,
//     background: over ? "#eff6ff" : "#f8fafc",
//     textAlign: "center",
//     cursor: running ? "default" : "pointer",
//     transition: "background .2s,border-color .2s",
//   };

//   return (
//     <div role="dialog" aria-modal="true" aria-label="Upload multiple files" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//       <button
//         type="button"
//         aria-label="Close"
//         disabled={running}
//         onClick={onClose}
//         style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "rgba(8,16,32,.65)", cursor: "default" }}
//       />

//       <div style={{ position: "relative", width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", borderRadius: 18, background: "#fff", boxShadow: "0 40px 90px -30px rgba(0,0,0,.6)", padding: 20 }}>
//         {/* header */}
//         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
//           <div>
//             <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Upload multiple files</h3>
//             <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>
//               Add many photos and videos at once. Each file becomes its own gallery item. Big photos are resized automatically. Use ↻ to turn a sideways photo upright.
//             </p>
//           </div>
//           <button type="button" className="a-btn" onClick={onClose} disabled={running} aria-label="Close">
//             ✕
//           </button>
//         </div>

//         {/* drop zone */}
//         <div
//           style={zone}
//           onClick={() => !running && input.current?.click()}
//           onDragOver={(e) => {
//             e.preventDefault();
//             if (!running) setOver(true);
//           }}
//           onDragLeave={() => setOver(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setOver(false);
//             if (!running && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
//           }}
//         >
//           <span style={{ fontSize: 28 }} aria-hidden="true">
//             ⬆
//           </span>
//           <strong style={{ fontSize: 14 }}>Drag & drop images and videos here</strong>
//           <span style={{ fontSize: 12.5, color: "#64748b" }}>or click to choose files · JPG, PNG, WebP, MP4, WebM</span>
//           <input
//             ref={input}
//             type="file"
//             multiple
//             hidden
//             accept=".jpg,.jpeg,.png,.webp,.mp4,.webm"
//             onChange={(e) => {
//               if (e.target.files?.length) addFiles(e.target.files);
//               e.target.value = "";
//             }}
//           />
//         </div>

//         {notice && (
//           <p role="status" style={{ margin: "10px 0 0", fontSize: 12.5, fontWeight: 600, color: "#b45309" }}>
//             {notice}
//           </p>
//         )}

//         {/* batch settings */}
//         <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginTop: 16 }}>
//           <div>
//             <label htmlFor="bulk-shape" className="a-label">
//               Shape / size
//             </label>
//             <select id="bulk-shape" className="a-input" value={shape} disabled={running} onChange={(e) => setShape(e.target.value)}>
//               <option value="auto">Auto-detect from each file</option>
//               {ASPECT_OPTIONS.map(([v, l]) => (
//                 <option key={v} value={v}>
//                   {l}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="bulk-focus" className="a-label">
//               Focus (part that stays visible)
//             </label>
//             <select id="bulk-focus" className="a-input" value={focus} disabled={running} onChange={(e) => setFocus(e.target.value)}>
//               {FOCUS_OPTIONS.map(([v, l]) => (
//                 <option key={v} value={v}>
//                   {l}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", marginTop: 10 }}>
//           <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//             <input type="checkbox" checked={cropEach} disabled={running} onChange={(e) => setCropEach(e.target.checked)} />
//             Crop each image before upload
//           </label>
//           <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
//             <input type="checkbox" checked={nameTitle} disabled={running} onChange={(e) => setNameTitle(e.target.checked)} />
//             Use file name as title
//           </label>
//         </div>

//         {/* file list */}
//         {entries.length > 0 && (
//           <div style={{ marginTop: 16 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
//               <span>
//                 {entries.length} file{entries.length === 1 ? "" : "s"} · {doneCount} uploaded
//               </span>
//               {(running || finished > 0) && <span>{pct}%</span>}
//             </div>
//             <div style={{ height: 6, borderRadius: 6, background: "#e2e8f0", overflow: "hidden", marginBottom: 10 }}>
//               <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#1f73c8,#ff9900)", transition: "width .3s" }} />
//             </div>

//             <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 280, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: 12 }}>
//               {entries.map((en) => {
//                 const p = PILL[en.status];
//                 const second = en.status === "error" ? en.error : en.warn && en.status === "queued" ? en.warn : `${en.kind === "video" ? "Video" : "Image"} · ${fmtSize(en.file.size)}${en.rot ? ` · rotated ${en.rot * 90}°` : ""}`;
//                 const secondColor = en.status === "error" ? "#b91c1c" : en.warn && en.status === "queued" ? "#b45309" : "#64748b";
//                 const canEditRow = !running && (en.status === "queued" || en.status === "error");
//                 return (
//                   <li key={en.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
//                     <div
//                       style={{ width: 48, height: 48, flex: "0 0 48px", borderRadius: 8, overflow: "hidden", background: "#0b1626", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}
//                     >
//                       {en.preview ? (
//                         // eslint-disable-next-line @next/next/no-img-element
//                         <img
//                           src={en.preview}
//                           alt=""
//                           style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `rotate(${en.rot * 90}deg)`, transition: "transform .2s" }}
//                         />
//                       ) : (
//                         "▶ VIDEO"
//                       )}
//                     </div>
//                     <div style={{ minWidth: 0, flex: 1 }}>
//                       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{en.file.name}</p>
//                       <p style={{ margin: "2px 0 0", fontSize: 11.5, color: secondColor }}>{second}</p>
//                     </div>
//                     <span style={{ flex: "0 0 auto", padding: "3px 10px", borderRadius: 9999, fontSize: 11.5, fontWeight: 700, background: p.bg, color: p.fg }}>{p.label}</span>
//                     {canEditRow && en.kind === "image" && (
//                       <button type="button" className="a-btn !px-2" onClick={() => rotateEntry(en.id)} aria-label={`Rotate ${en.file.name}`} title="Rotate 90°">
//                         ↻
//                       </button>
//                     )}
//                     {canEditRow && (
//                       <button type="button" className="a-btn !px-2" onClick={() => removeEntry(en.id)} aria-label={`Remove ${en.file.name}`}>
//                         ✕
//                       </button>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}

//         {/* actions */}
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
//           <button type="button" className="a-btn" onClick={onClose} disabled={running}>
//             {doneCount > 0 && !queued.length ? "Close" : "Cancel"}
//           </button>
//           {failed.length > 0 && !running && (
//             <button type="button" className="a-btn" onClick={retryFailed}>
//               Retry failed ({failed.length})
//             </button>
//           )}
//           <button type="button" className="a-btn a-btn-primary" disabled={running || queued.length === 0} onClick={() => run(queued)}>
//             {running ? "Uploading…" : `Upload ${queued.length || ""} file${queued.length === 1 ? "" : "s"}`.replace("  ", " ")}
//           </button>
//         </div>
//       </div>

//       {/* crop step (only when "Crop each image" is ticked) */}
//       {cropReq && (
//         <ImageCropModal
//           file={cropReq.file}
//           initialPreset={cropReq.preset}
//           onCancel={() => {
//             cropReq.resolve(null);
//             setCropReq(null);
//           }}
//           onConfirm={(f) => {
//             cropReq.resolve(f);
//             setCropReq(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }







// new code 




/**
 * FILE: src/components/admin/GalleryBulkUpload.tsx
 * TYPE: Client Component (admin modal)
 * INCLUDES: Upload many images and videos in one go for the Gallery.
 *  - "Image group title": type a new group or pick an existing one; every file of the batch joins that group
 *  - drag & drop or file chooser (JPG, PNG, WebP, MP4, WebM)
 *  - every file becomes its own gallery item (POST /api/admin/r/gallery)
 *  - rotate button (↻) on every image row, applied before upload
 *  - big photos are shrunk automatically (max 1280px, WebP/JPEG) so the site stays fast
 *  - warning for very large videos (compress them for smooth playback)
 *  - shape: auto-detected from each file's size, or one fixed shape for the whole batch
 *  - optional crop step for every image (uses ImageCropModal, which also has rotate / flip)
 *  - video poster is generated in the browser from the first frame
 *  - per-file status, overall progress, retry for failed files
 * NOTE: Geometry uses inline styles so it never depends on Tailwind theme tokens.
 */
"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { api } from "@/lib/client";
import { ImageCropModal } from "@/components/admin/ImageCropModal";
import { fmtSize } from "@/components/admin/fields";
import { ASPECT_OPTIONS, FOCUS_OPTIONS } from "@/lib/home-media";
import { baseName, imageSize, resizeImage } from "@/lib/image-tools";

type Status = "queued" | "uploading" | "done" | "error" | "skipped";
type Kind = "image" | "video";
type Entry = { id: string; file: File; kind: Kind; preview: string; status: Status; error: string; warn: string; rot: number };
type CropReq = { file: File; preset: string; resolve: (f: File | null) => void };

/* ------------------------------ helpers ------------------------------ */

const IMG_TYPE = /^image\/(jpeg|png|webp)$/;
const VID_TYPE = /^video\/(mp4|webm)$/;

const GALLERY_MAX = 1280; // longest side of an uploaded gallery photo (px)
const BIG_VIDEO = 40 * 1024 * 1024; // videos above this size get a warning

/** Decide if a file is a supported image / video (falls back to the file extension). */
function classify(f: File): Kind | null {
  if (IMG_TYPE.test(f.type)) return "image";
  if (VID_TYPE.test(f.type)) return "video";
  const n = f.name.toLowerCase();
  if (/\.(jpe?g|png|webp)$/.test(n)) return "image";
  if (/\.(mp4|webm)$/.test(n)) return "video";
  return null;
}

/** Pick the closest shape for a given width / height. */
function aspectFrom(w: number, h: number): string {
  const r = w / Math.max(h, 1);
  if (r >= 1.2) return "landscape";
  if (r >= 0.92) return "square";
  if (r >= 0.7) return "portrait";
  return "tall";
}

/** Grab the first frame of a local video as a JPEG (best effort) and read its size. */
function videoPoster(file: File): Promise<{ blob: Blob | null; w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    let done = false;
    let timer: ReturnType<typeof setTimeout>;

    const finish = (blob: Blob | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const w = v.videoWidth;
      const h = v.videoHeight;
      URL.revokeObjectURL(url);
      resolve({ blob, w, h });
    };

    timer = setTimeout(() => finish(null), 12000);
    v.onerror = () => finish(null);
    v.onloadedmetadata = () => {
      // jump a little into the video so the frame is not black
      v.currentTime = Math.min(1, (v.duration || 1) * 0.1);
    };
    v.onseeked = () => {
      try {
        const s = Math.min(1, 1280 / Math.max(v.videoWidth, 1));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(v.videoWidth * s));
        c.height = Math.max(1, Math.round(v.videoHeight * s));
        const ctx = c.getContext("2d");
        if (!ctx) return finish(null);
        ctx.drawImage(v, 0, 0, c.width, c.height);
        c.toBlob((b) => finish(b), "image/jpeg", 0.8);
      } catch {
        finish(null);
      }
    };
    v.src = url;
  });
}

async function uploadFile(f: File, only: Kind): Promise<string> {
  const fd = new FormData();
  fd.set("file", f);
  fd.set("only", only);
  const r = await api<{ url: string }>("/api/admin/upload", { form: fd });
  if (!r.ok) throw new Error(r.error || "Upload failed.");
  return r.url as string;
}

const PILL: Record<Status, { label: string; bg: string; fg: string }> = {
  queued: { label: "Waiting", bg: "#f1f5f9", fg: "#475569" },
  uploading: { label: "Uploading…", bg: "#dbeafe", fg: "#1d4ed8" },
  done: { label: "✓ Done", bg: "#dcfce7", fg: "#15803d" },
  error: { label: "Failed", bg: "#fee2e2", fg: "#b91c1c" },
  skipped: { label: "Skipped", bg: "#fef3c7", fg: "#b45309" },
};

/* ------------------------------ component ------------------------------ */

export function GalleryBulkUpload({
  startOrder,
  onClose,
  onFinished,
}: {
  /** Number of existing items. New items get sort orders after it. */
  startOrder: number;
  onClose: () => void;
  /** Called after an upload run so the list can refresh. */
  onFinished: () => void;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [groupTitle, setGroupTitle] = useState(""); // image group for the whole batch
  const [groupAsTitle, setGroupAsTitle] = useState(false); // also use the group title as every image's own title
  const [groupNames, setGroupNames] = useState<string[]>([]); // groups that already exist
  const [shape, setShape] = useState("auto"); // auto | portrait | landscape | square | tall
  const [focus, setFocus] = useState("center center");
  const [cropEach, setCropEach] = useState(false);
  const [nameTitle, setNameTitle] = useState(false);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [over, setOver] = useState(false);
  const [cropReq, setCropReq] = useState<CropReq | null>(null);

  const input = useRef<HTMLInputElement>(null);
  const opts = useRef({ shape, focus, cropEach, nameTitle, group: "", groupAsTitle }); // settings snapshot used while uploading
  const orderRef = useRef(startOrder);
  const orders = useRef(new Map<string, number>());
  const previews = useRef<string[]>([]);

  /* load the group names that already exist (for the suggestions list) */
  useEffect(() => {
    let off = false;
    (async () => {
      const names = new Set<string>();
      let page = 1;
      let seen = 0;
      let count = 0;
      do {
        const r = await api<{ rows: { groupTitle?: string }[]; total: number }>(`/api/admin/r/gallery?page=${page}&limit=100&q=`);
        if (!r.ok || off) return;
        const rows = r.rows as { groupTitle?: string }[];
        rows.forEach((x) => {
          const t = String(x.groupTitle || "").trim();
          if (t) names.add(t);
        });
        count = r.total as number;
        seen += rows.length;
        page++;
      } while (seen < count && page < 20);
      if (!off) setGroupNames(Array.from(names).sort((a, b) => a.localeCompare(b)));
    })();
    return () => {
      off = true;
    };
  }, []);

  /* free the preview URLs when the dialog closes */
  useEffect(() => {
    const list = previews.current;
    return () => list.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  /* Esc closes (not while uploading or cropping) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !running && !cropReq && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, cropReq, onClose]);

  const patch = useCallback((id: string, p: Partial<Entry>) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...p } : e)));
  }, []);

  const addFiles = (list: FileList | File[]) => {
    const arr = Array.from(list);
    let skipped = 0;
    const add: Entry[] = [];
    for (const f of arr) {
      const kind = classify(f);
      if (!kind) {
        skipped++;
        continue;
      }
      // ignore exact duplicates already in the list
      const dup = entries.some((e) => e.file.name === f.name && e.file.size === f.size && e.file.lastModified === f.lastModified);
      if (dup) continue;
      const preview = kind === "image" ? URL.createObjectURL(f) : "";
      if (preview) previews.current.push(preview);
      const warn = kind === "video" && f.size > BIG_VIDEO ? `Large video (${fmtSize(f.size)}). Compress it for smoother playback.` : "";
      add.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, file: f, kind, preview, status: "queued", error: "", warn, rot: 0 });
    }
    setEntries((prev) => [...prev, ...add]);
    setNotice(skipped ? `${skipped} file(s) skipped. Only JPG, PNG, WebP, MP4 and WebM are allowed.` : "");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      const en = prev.find((e) => e.id === id);
      if (en?.preview) URL.revokeObjectURL(en.preview);
      return prev.filter((e) => e.id !== id);
    });
  };

  /** Turn an image 90° clockwise (applied when the file is uploaded). */
  const rotateEntry = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, rot: (e.rot + 1) % 4 } : e)));
  };

  /** Ask the admin to crop one image. Resolves with the cropped file, or null to skip it. */
  const askCrop = (file: File, preset: string) => new Promise<File | null>((resolve) => setCropReq({ file, preset, resolve }));

  /** Upload one entry and create its gallery item. */
  async function processOne(en: Entry) {
    const o = opts.current;
    patch(en.id, { status: "uploading", error: "" });
    try {
      let file = en.file;

      if (en.kind === "image") {
        // 1) rotation chosen in the list (full quality, shrunk later)
        if (en.rot) file = await resizeImage(file, file.name, 3000, { quarter: en.rot, force: true, quality: 0.92 });

        // 2) optional crop step
        if (o.cropEach) {
          const cropped = await askCrop(file, o.shape === "auto" ? "free" : o.shape);
          if (!cropped) {
            patch(en.id, { status: "skipped" });
            return;
          }
          file = cropped;
        }

        // 3) keep the website fast: shrink the photo
        file = await resizeImage(file, file.name, GALLERY_MAX);
      }

      let dims: { w: number; h: number } | null = null;
      let posterUrl = "";

      if (en.kind === "video") {
        const { blob, w, h } = await videoPoster(file);
        if (w && h) dims = { w, h };
        if (blob) {
          try {
            posterUrl = await uploadFile(new File([blob], `${baseName(file.name)}-poster.jpg`, { type: "image/jpeg" }), "image");
          } catch {
            posterUrl = ""; // the poster is optional
          }
        }
      } else {
        dims = await imageSize(file);
      }

      const url = await uploadFile(file, en.kind);
      const aspect = o.shape === "auto" ? (dims ? aspectFrom(dims.w, dims.h) : "portrait") : o.shape;
      const title = o.nameTitle
        ? baseName(en.file.name).replace(/[_-]+/g, " ").trim().slice(0, 160)
        : o.groupAsTitle && o.group
          ? o.group.slice(0, 160)
          : "";

      const r = await api("/api/admin/r/gallery", {
        method: "POST",
        json: {
          kind: en.kind,
          groupTitle: o.group,
          title,
          caption: "",
          imageUrl: en.kind === "image" ? url : posterUrl,
          videoUrl: en.kind === "video" ? url : "",
          aspect,
          focus: o.focus,
          sortOrder: orders.current.get(en.id) ?? 0,
          isActive: true,
        },
      });
      if (!r.ok) throw new Error(r.error || "Could not save the gallery item.");
      patch(en.id, { status: "done" });
    } catch (e) {
      patch(en.id, { status: "error", error: e instanceof Error ? e.message : "Upload failed." });
    }
  }

  /** Run a list of entries with a small worker pool. */
  async function run(list: Entry[]) {
    if (!list.length) return;

    // Reuse the exact spelling of an existing group (so "wedding" joins "Wedding")
    const typed = groupTitle.replace(/\s+/g, " ").trim();
    const match = groupNames.find((n) => n.toLowerCase() === typed.toLowerCase());
    const group = match ?? typed;

    opts.current = { shape, focus, cropEach, nameTitle, group, groupAsTitle };
    list.forEach((en) => orders.current.set(en.id, ++orderRef.current));
    setRunning(true);
    setNotice("");

    const queue = [...list];
    const workers = opts.current.cropEach ? 1 : 3; // cropping needs one file at a time
    await Promise.all(
      Array.from({ length: Math.min(workers, queue.length) }, async () => {
        while (queue.length) {
          const en = queue.shift();
          if (en) await processOne(en);
        }
      }),
    );

    if (group && !match) setGroupNames((prev) => [...prev, group].sort((a, b) => a.localeCompare(b)));
    setRunning(false);
    onFinished();
  }

  const queued = entries.filter((e) => e.status === "queued");
  const failed = entries.filter((e) => e.status === "error");
  const doneCount = entries.filter((e) => e.status === "done").length;
  const finished = entries.filter((e) => e.status === "done" || e.status === "error" || e.status === "skipped").length;
  const pct = entries.length ? Math.round((finished / entries.length) * 100) : 0;

  const retryFailed = () => {
    const list = failed;
    setEntries((prev) => prev.map((e) => (e.status === "error" ? { ...e, status: "queued", error: "" } : e)));
    run(list);
  };

  const zone: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "26px 16px",
    borderRadius: 14,
    border: `2px dashed ${over ? "#1f73c8" : "#cbd5e1"}`,
    background: over ? "#eff6ff" : "#f8fafc",
    textAlign: "center",
    cursor: running ? "default" : "pointer",
    transition: "background .2s,border-color .2s",
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Upload multiple files" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <button
        type="button"
        aria-label="Close"
        disabled={running}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "rgba(8,16,32,.65)", cursor: "default" }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: 760, maxHeight: "92vh", overflowY: "auto", borderRadius: 18, background: "#fff", boxShadow: "0 40px 90px -30px rgba(0,0,0,.6)", padding: 20 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Upload multiple files</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>
              Add many photos and videos at once. Each file becomes its own gallery item. Big photos are resized automatically. Use ↻ to turn a sideways photo upright.
            </p>
          </div>
          <button type="button" className="a-btn" onClick={onClose} disabled={running} aria-label="Close">
            ✕
          </button>
        </div>

        {/* image group title */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="bulk-group" className="a-label">
            Image group title
          </label>
          <input
            id="bulk-group"
            className="a-input"
            list="bulk-groups"
            autoComplete="off"
            value={groupTitle}
            disabled={running}
            maxLength={160}
            placeholder="Type a new group name or pick an existing one"
            onChange={(e) => setGroupTitle(e.target.value)}
          />
          <datalist id="bulk-groups">
            {groupNames.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          <p className="a-help">All files in this upload join this group. On the website they appear together in one row under this title. Leave empty for no group.</p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 6 }}>
            <input type="checkbox" checked={groupAsTitle} disabled={running || !groupTitle.trim()} onChange={(e) => setGroupAsTitle(e.target.checked)} />
            Also use the group title as every image&apos;s own title
          </label>
        </div>

        {/* drop zone */}
        <div
          style={zone}
          onClick={() => !running && input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!running) setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (!running && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
          }}
        >
          <span style={{ fontSize: 28 }} aria-hidden="true">
            ⬆
          </span>
          <strong style={{ fontSize: 14 }}>Drag & drop images and videos here</strong>
          <span style={{ fontSize: 12.5, color: "#64748b" }}>or click to choose files · JPG, PNG, WebP, MP4, WebM</span>
          <input
            ref={input}
            type="file"
            multiple
            hidden
            accept=".jpg,.jpeg,.png,.webp,.mp4,.webm"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {notice && (
          <p role="status" style={{ margin: "10px 0 0", fontSize: 12.5, fontWeight: 600, color: "#b45309" }}>
            {notice}
          </p>
        )}

        {/* batch settings */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", marginTop: 16 }}>
          <div>
            <label htmlFor="bulk-shape" className="a-label">
              Shape / size
            </label>
            <select id="bulk-shape" className="a-input" value={shape} disabled={running} onChange={(e) => setShape(e.target.value)}>
              <option value="auto">Auto-detect from each file</option>
              {ASPECT_OPTIONS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bulk-focus" className="a-label">
              Focus (part that stays visible)
            </label>
            <select id="bulk-focus" className="a-input" value={focus} disabled={running} onChange={(e) => setFocus(e.target.value)}>
              {FOCUS_OPTIONS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", marginTop: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={cropEach} disabled={running} onChange={(e) => setCropEach(e.target.checked)} />
            Crop each image before upload
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <input type="checkbox" checked={nameTitle} disabled={running} onChange={(e) => setNameTitle(e.target.checked)} />
            Use file name as title
          </label>
        </div>

        {/* file list */}
        {entries.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
              <span>
                {entries.length} file{entries.length === 1 ? "" : "s"} · {doneCount} uploaded
              </span>
              {(running || finished > 0) && <span>{pct}%</span>}
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#e2e8f0", overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#1f73c8,#ff9900)", transition: "width .3s" }} />
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 280, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: 12 }}>
              {entries.map((en) => {
                const p = PILL[en.status];
                const second = en.status === "error" ? en.error : en.warn && en.status === "queued" ? en.warn : `${en.kind === "video" ? "Video" : "Image"} · ${fmtSize(en.file.size)}${en.rot ? ` · rotated ${en.rot * 90}°` : ""}`;
                const secondColor = en.status === "error" ? "#b91c1c" : en.warn && en.status === "queued" ? "#b45309" : "#64748b";
                const canEditRow = !running && (en.status === "queued" || en.status === "error");
                return (
                  <li key={en.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderBottom: "1px solid #f1f5f9" }}>
                    <div
                      style={{ width: 48, height: 48, flex: "0 0 48px", borderRadius: 8, overflow: "hidden", background: "#0b1626", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}
                    >
                      {en.preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={en.preview}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `rotate(${en.rot * 90}deg)`, transition: "transform .2s" }}
                        />
                      ) : (
                        "▶ VIDEO"
                      )}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{en.file.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: secondColor }}>{second}</p>
                    </div>
                    <span style={{ flex: "0 0 auto", padding: "3px 10px", borderRadius: 9999, fontSize: 11.5, fontWeight: 700, background: p.bg, color: p.fg }}>{p.label}</span>
                    {canEditRow && en.kind === "image" && (
                      <button type="button" className="a-btn !px-2" onClick={() => rotateEntry(en.id)} aria-label={`Rotate ${en.file.name}`} title="Rotate 90°">
                        ↻
                      </button>
                    )}
                    {canEditRow && (
                      <button type="button" className="a-btn !px-2" onClick={() => removeEntry(en.id)} aria-label={`Remove ${en.file.name}`}>
                        ✕
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* actions */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button type="button" className="a-btn" onClick={onClose} disabled={running}>
            {doneCount > 0 && !queued.length ? "Close" : "Cancel"}
          </button>
          {failed.length > 0 && !running && (
            <button type="button" className="a-btn" onClick={retryFailed}>
              Retry failed ({failed.length})
            </button>
          )}
          <button type="button" className="a-btn a-btn-primary" disabled={running || queued.length === 0} onClick={() => run(queued)}>
            {running ? "Uploading…" : `Upload ${queued.length || ""} file${queued.length === 1 ? "" : "s"}`.replace("  ", " ")}
          </button>
        </div>
      </div>

      {/* crop step (only when "Crop each image" is ticked) */}
      {cropReq && (
        <ImageCropModal
          file={cropReq.file}
          initialPreset={cropReq.preset}
          onCancel={() => {
            cropReq.resolve(null);
            setCropReq(null);
          }}
          onConfirm={(f) => {
            cropReq.resolve(f);
            setCropReq(null);
          }}
        />
      )}
    </div>
  );
}