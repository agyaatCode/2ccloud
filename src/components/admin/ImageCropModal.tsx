// /**
//  * FILE: src/components/admin/ImageCropModal.tsx
//  * TYPE: Client Component
//  * INCLUDES: Crop dialog shown before an image is uploaded.
//  *  - drag the box to move it, drag a corner to resize it
//  *  - aspect presets: Free, Portrait, Landscape, Square, Story, Wide
//  *  - exports the cropped area as a new File (JPEG / PNG / WebP) using a canvas
//  * USAGE:
//  *   <ImageCropModal file={file} onCancel={...} onConfirm={(croppedFile) => upload(croppedFile)} />
//  * NOTE: Geometry uses inline styles so it never depends on Tailwind theme tokens.
//  */
// "use client";

// import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type SyntheticEvent } from "react";
// import { createPortal } from "react-dom";

// type Rect = { x: number; y: number; w: number; h: number };
// type Drag = { mode: "move"; sx: number; sy: number; r0: Rect } | { mode: "resize"; ax: number; ay: number };

// const PRESETS: { key: string; label: string; ratio: number | null }[] = [
//   { key: "free", label: "Free", ratio: null },
//   { key: "portrait", label: "Portrait 4:5", ratio: 4 / 5 },
//   { key: "landscape", label: "Landscape 16:10", ratio: 16 / 10 },
//   { key: "square", label: "Square 1:1", ratio: 1 },
//   { key: "tall", label: "Story 9:16", ratio: 9 / 16 },
//   { key: "wide", label: "Wide 16:9", ratio: 16 / 9 },
// ];

// const HANDLES = [
//   { k: "nw", l: 0, t: 0, cursor: "nwse-resize" },
//   { k: "ne", l: 100, t: 0, cursor: "nesw-resize" },
//   { k: "sw", l: 0, t: 100, cursor: "nesw-resize" },
//   { k: "se", l: 100, t: 100, cursor: "nwse-resize" },
// ];

// const MIN = 48; // smallest crop box (display px)
// const MAX_OUT = 2400; // longest side of the exported image (px)

// const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

// /** Largest centered box of the given ratio that fits inside the image (with a small margin). */
// function fit(W: number, H: number, ratio: number | null): Rect {
//   if (!ratio) return { x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9 };
//   let w: number;
//   let h: number;
//   if (W / H > ratio) {
//     h = H * 0.9;
//     w = h * ratio;
//   } else {
//     w = W * 0.9;
//     h = w / ratio;
//   }
//   return { x: (W - w) / 2, y: (H - h) / 2, w, h };
// }

// export function ImageCropModal({
//   file,
//   initialPreset = "free",
//   onCancel,
//   onConfirm,
// }: {
//   file: File;
//   initialPreset?: string;
//   onCancel: () => void;
//   onConfirm: (cropped: File) => void;
// }) {
//   const imgRef = useRef<HTMLImageElement>(null);
//   const stageRef = useRef<HTMLDivElement>(null);
//   const drag = useRef<Drag | null>(null);

//   const [url, setUrl] = useState("");
//   const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
//   const [disp, setDisp] = useState<{ w: number; h: number } | null>(null);
//   const [rect, setRect] = useState<Rect | null>(null);
//   const [preset, setPreset] = useState(initialPreset);
//   const [busy, setBusy] = useState(false);

//   const ratio = PRESETS.find((p) => p.key === preset)?.ratio ?? null;

//   /* object URL for the selected file */
//   useEffect(() => {
//     const u = URL.createObjectURL(file);
//     setUrl(u);
//     return () => URL.revokeObjectURL(u);
//   }, [file]);

//   /* Esc closes, page scroll locked while open */
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
//     window.addEventListener("keydown", onKey);
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prev;
//     };
//   }, [onCancel]);

//   /* measure the image once it has loaded and place the first crop box */
//   const onImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
//     const img = e.currentTarget;
//     const nw = img.naturalWidth;
//     const nh = img.naturalHeight;
//     const maxW = Math.min(window.innerWidth - 48, 760);
//     const maxH = Math.min(window.innerHeight * 0.55, 540);
//     const s = Math.min(maxW / nw, maxH / nh, 1);
//     const d = { w: Math.round(nw * s), h: Math.round(nh * s) };
//     setNat({ w: nw, h: nh });
//     setDisp(d);
//     setRect(fit(d.w, d.h, ratio));
//   };

//   const choosePreset = (key: string) => {
//     setPreset(key);
//     if (!disp) return;
//     const r = PRESETS.find((p) => p.key === key)?.ratio ?? null;
//     setRect(fit(disp.w, disp.h, r));
//   };

//   /* pointer helpers (coordinates relative to the image stage) */
//   const local = (e: ReactPointerEvent) => {
//     const b = stageRef.current!.getBoundingClientRect();
//     return { x: e.clientX - b.left, y: e.clientY - b.top };
//   };

//   const startMove = (e: ReactPointerEvent) => {
//     if (!rect) return;
//     const p = local(e);
//     drag.current = { mode: "move", sx: p.x, sy: p.y, r0: rect };
//     stageRef.current?.setPointerCapture(e.pointerId);
//   };

//   const startResize = (e: ReactPointerEvent, k: string) => {
//     if (!rect) return;
//     e.stopPropagation();
//     // The opposite corner stays fixed while the dragged corner moves
//     const ax = k.includes("w") ? rect.x + rect.w : rect.x;
//     const ay = k.includes("n") ? rect.y + rect.h : rect.y;
//     drag.current = { mode: "resize", ax, ay };
//     stageRef.current?.setPointerCapture(e.pointerId);
//   };

//   const onMove = (e: ReactPointerEvent) => {
//     const d = drag.current;
//     if (!d || !disp) return;
//     const p = local(e);
//     const W = disp.w;
//     const H = disp.h;

//     if (d.mode === "move") {
//       setRect({
//         ...d.r0,
//         x: clamp(d.r0.x + (p.x - d.sx), 0, W - d.r0.w),
//         y: clamp(d.r0.y + (p.y - d.sy), 0, H - d.r0.h),
//       });
//       return;
//     }

//     const px = clamp(p.x, 0, W);
//     const py = clamp(p.y, 0, H);
//     const sx = px >= d.ax ? 1 : -1;
//     const sy = py >= d.ay ? 1 : -1;
//     const maxW = sx > 0 ? W - d.ax : d.ax;
//     const maxH = sy > 0 ? H - d.ay : d.ay;
//     let w = Math.min(Math.abs(px - d.ax), maxW);
//     let h = Math.min(Math.abs(py - d.ay), maxH);
//     if (ratio) {
//       if (w / Math.max(h, 1) > ratio) w = h * ratio;
//       else h = w / ratio;
//     }
//     w = Math.max(w, MIN);
//     h = ratio ? Math.max(w / ratio, MIN) : Math.max(h, MIN);
//     const x = clamp(sx > 0 ? d.ax : d.ax - w, 0, Math.max(0, W - w));
//     const y = clamp(sy > 0 ? d.ay : d.ay - h, 0, Math.max(0, H - h));
//     setRect({ x, y, w, h });
//   };

//   const endDrag = (e: ReactPointerEvent) => {
//     drag.current = null;
//     try {
//       stageRef.current?.releasePointerCapture(e.pointerId);
//     } catch {
//       /* pointer already released */
//     }
//   };

//   /* export the selected area as a new File */
//   const confirm = () => {
//     const img = imgRef.current;
//     if (!img || !rect || !nat || !disp) return;
//     setBusy(true);

//     const sc = nat.w / disp.w; // display px -> natural px
//     const sw = rect.w * sc;
//     const sh = rect.h * sc;
//     const k = Math.min(1, MAX_OUT / Math.max(sw, sh));
//     const cw = Math.max(1, Math.round(sw * k));
//     const ch = Math.max(1, Math.round(sh * k));

//     const canvas = document.createElement("canvas");
//     canvas.width = cw;
//     canvas.height = ch;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//       setBusy(false);
//       return;
//     }
//     ctx.drawImage(img, rect.x * sc, rect.y * sc, sw, sh, 0, 0, cw, ch);

//     const type = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
//     const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           setBusy(false);
//           return;
//         }
//         const base = file.name.replace(/\.[^.]+$/, "") || "image";
//         onConfirm(new File([blob], `${base}.${ext}`, { type }));
//       },
//       type,
//       0.92,
//     );
//   };

//   const outSize =
//     rect && nat && disp
//       ? (() => {
//           const sc = nat.w / disp.w;
//           const sw = rect.w * sc;
//           const sh = rect.h * sc;
//           const k = Math.min(1, MAX_OUT / Math.max(sw, sh));
//           return `${Math.round(sw * k)} × ${Math.round(sh * k)} px`;
//         })()
//       : "";

//   const chip = (on: boolean): React.CSSProperties => ({
//     padding: "7px 14px",
//     borderRadius: 9999,
//     border: `1px solid ${on ? "#1f73c8" : "#cbd5e1"}`,
//     background: on ? "#1f73c8" : "#fff",
//     color: on ? "#fff" : "#0f172a",
//     fontSize: 12.5,
//     fontWeight: 600,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   });

//   const modal = (
//     <div
//       role="dialog"
//       aria-modal="true"
//       aria-label="Crop image"
//       style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
//     >
//       <button
//         type="button"
//         aria-label="Cancel"
//         onClick={onCancel}
//         style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "rgba(8,16,32,.72)", cursor: "default" }}
//       />

//       <div
//         style={{
//           position: "relative",
//           width: "100%",
//           maxWidth: 820,
//           maxHeight: "94vh",
//           overflowY: "auto",
//           borderRadius: 18,
//           background: "#fff",
//           boxShadow: "0 40px 90px -30px rgba(0,0,0,.6)",
//           padding: 20,
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
//           <div>
//             <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Crop image</h3>
//             <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>Drag the box to move it. Drag a corner to resize.</p>
//           </div>
//           <button type="button" className="a-btn" onClick={onCancel} aria-label="Close">
//             ✕
//           </button>
//         </div>

//         {/* shape presets */}
//         <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
//           {PRESETS.map((p) => (
//             <button key={p.key} type="button" style={chip(preset === p.key)} onClick={() => choosePreset(p.key)}>
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* crop stage */}
//         <div style={{ display: "flex", justifyContent: "center", background: "#0b1626", borderRadius: 12, padding: 12 }}>
//           <div
//             ref={stageRef}
//             onPointerMove={onMove}
//             onPointerUp={endDrag}
//             onPointerCancel={endDrag}
//             style={{
//               position: "relative",
//               width: disp ? disp.w : "auto",
//               height: disp ? disp.h : "auto",
//               overflow: "hidden",
//               touchAction: "none",
//               userSelect: "none",
//               borderRadius: 4,
//             }}
//           >
//             {url && (
//               // eslint-disable-next-line @next/next/no-img-element
//               <img
//                 ref={imgRef}
//                 src={url}
//                 alt="Image to crop"
//                 onLoad={onImgLoad}
//                 draggable={false}
//                 style={disp ? { display: "block", width: disp.w, height: disp.h } : { display: "block", maxWidth: "100%", opacity: 0 }}
//               />
//             )}

//             {rect && (
//               <div
//                 onPointerDown={startMove}
//                 style={{
//                   position: "absolute",
//                   left: rect.x,
//                   top: rect.y,
//                   width: rect.w,
//                   height: rect.h,
//                   border: "2px solid #fff",
//                   boxShadow: "0 0 0 9999px rgba(8,16,32,.6)",
//                   cursor: "move",
//                   boxSizing: "border-box",
//                 }}
//               >
//                 {/* rule-of-thirds guides */}
//                 {[33.33, 66.66].map((p) => (
//                   <span key={`v${p}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: "rgba(255,255,255,.4)", pointerEvents: "none" }} />
//                 ))}
//                 {[33.33, 66.66].map((p) => (
//                   <span key={`h${p}`} style={{ position: "absolute", left: 0, right: 0, top: `${p}%`, height: 1, background: "rgba(255,255,255,.4)", pointerEvents: "none" }} />
//                 ))}

//                 {HANDLES.map((h) => (
//                   <span
//                     key={h.k}
//                     onPointerDown={(e) => startResize(e, h.k)}
//                     style={{
//                       position: "absolute",
//                       left: `${h.l}%`,
//                       top: `${h.t}%`,
//                       width: 22,
//                       height: 22,
//                       marginLeft: -11,
//                       marginTop: -11,
//                       borderRadius: 6,
//                       background: "#fff",
//                       border: "3px solid #1f73c8",
//                       boxSizing: "border-box",
//                       cursor: h.cursor,
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {outSize && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#64748b", textAlign: "center" }}>Output size: {outSize}</p>}

//         {/* actions */}
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
//           <button type="button" className="a-btn" onClick={onCancel} disabled={busy}>
//             Cancel
//           </button>
//           <button type="button" className="a-btn" onClick={() => onConfirm(file)} disabled={busy}>
//             Use original (no crop)
//           </button>
//           <button type="button" className="a-btn a-btn-primary" onClick={confirm} disabled={busy || !rect}>
//             {busy ? "Cropping…" : "Crop & upload"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return createPortal(modal, document.body);
// }



// new code 




/**
 * FILE: src/components/admin/ImageCropModal.tsx
 * TYPE: Client Component
 * INCLUDES: Crop dialog shown before an image is uploaded.
 *  - rotate left / right (90°), flip, reset
 *  - drag the box to move it, drag a corner to resize it
 *  - aspect presets: Free, Portrait, Landscape, Square, Story, Wide
 *  - exports the selected area as a new File (JPEG / PNG / WebP) using a canvas
 * USAGE:
 *   <ImageCropModal file={file} onCancel={...} onConfirm={(croppedFile) => upload(croppedFile)} />
 * NOTE: Geometry uses inline styles so it never depends on Tailwind theme tokens.
 */
"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { resizeImage } from "@/lib/image-tools";

type Rect = { x: number; y: number; w: number; h: number };
type Drag = { mode: "move"; sx: number; sy: number; r0: Rect } | { mode: "resize"; ax: number; ay: number };

const PRESETS: { key: string; label: string; ratio: number | null }[] = [
  { key: "free", label: "Free", ratio: null },
  { key: "portrait", label: "Portrait 4:5", ratio: 4 / 5 },
  { key: "landscape", label: "Landscape 16:10", ratio: 16 / 10 },
  { key: "square", label: "Square 1:1", ratio: 1 },
  { key: "tall", label: "Story 9:16", ratio: 9 / 16 },
  { key: "wide", label: "Wide 16:9", ratio: 16 / 9 },
];

const HANDLES = [
  { k: "nw", l: 0, t: 0, cursor: "nwse-resize" },
  { k: "ne", l: 100, t: 0, cursor: "nesw-resize" },
  { k: "sw", l: 0, t: 100, cursor: "nesw-resize" },
  { k: "se", l: 100, t: 100, cursor: "nwse-resize" },
];

const MIN = 48; // smallest crop box (display px)
const MAX_OUT = 2000; // longest side of the exported image (px)
const WORK_MAX = 3000; // longest side of the rotated working copy (px)

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

/** Largest centered box of the given ratio that fits inside the image (with a small margin). */
function fit(W: number, H: number, ratio: number | null): Rect {
  if (!ratio) return { x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9 };
  let w: number;
  let h: number;
  if (W / H > ratio) {
    h = H * 0.9;
    w = h * ratio;
  } else {
    w = W * 0.9;
    h = w / ratio;
  }
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

export function ImageCropModal({
  file,
  initialPreset = "free",
  onCancel,
  onConfirm,
}: {
  file: File;
  initialPreset?: string;
  onCancel: () => void;
  onConfirm: (cropped: File) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

  const [url, setUrl] = useState(""); // original picture
  const [workUrl, setWorkUrl] = useState(""); // picture shown in the stage (original, or rotated / flipped copy)
  const [quarter, setQuarter] = useState(0); // clockwise quarter turns
  const [flip, setFlip] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [disp, setDisp] = useState<{ w: number; h: number } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [preset, setPreset] = useState(initialPreset);
  const [busy, setBusy] = useState(false);

  const ratio = PRESETS.find((p) => p.key === preset)?.ratio ?? null;
  const transformed = quarter !== 0 || flip;

  /** Show a new picture in the stage; size and crop box are measured again once it has loaded. */
  const applyWork = (u: string) => {
    setDisp(null);
    setRect(null);
    setWorkUrl(u);
  };

  /* object URL for the selected file */
  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  /* Esc closes, page scroll locked while open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  /* build the rotated / flipped working copy */
  useEffect(() => {
    if (!url) return;
    if (!transformed) {
      setRotating(false);
      applyWork(url);
      return;
    }
    let cancelled = false;
    let made = "";
    setRotating(true);
    resizeImage(file, file.name, WORK_MAX, { quarter, flipX: flip, force: true, quality: 0.95 }).then((f) => {
      if (cancelled) return;
      made = URL.createObjectURL(f);
      setRotating(false);
      applyWork(made);
    });
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, url, quarter, flip]);

  /* measure the picture once it has loaded and place the crop box */
  const onImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const maxW = Math.min(window.innerWidth - 48, 760);
    const maxH = Math.min(window.innerHeight * 0.5, 520);
    const s = Math.min(maxW / nw, maxH / nh, 1);
    const d = { w: Math.round(nw * s), h: Math.round(nh * s) };
    setNat({ w: nw, h: nh });
    setDisp(d);
    setRect(fit(d.w, d.h, ratio));
  };

  const choosePreset = (key: string) => {
    setPreset(key);
    if (!disp) return;
    const r = PRESETS.find((p) => p.key === key)?.ratio ?? null;
    setRect(fit(disp.w, disp.h, r));
  };

  const rotate = (dir: 1 | -1) => setQuarter((q) => (q + dir + 4) % 4);
  const reset = () => {
    setQuarter(0);
    setFlip(false);
  };

  /* pointer helpers (coordinates relative to the picture stage) */
  const local = (e: ReactPointerEvent) => {
    const b = stageRef.current!.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };

  const startMove = (e: ReactPointerEvent) => {
    if (!rect) return;
    const p = local(e);
    drag.current = { mode: "move", sx: p.x, sy: p.y, r0: rect };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const startResize = (e: ReactPointerEvent, k: string) => {
    if (!rect) return;
    e.stopPropagation();
    // The opposite corner stays fixed while the dragged corner moves
    const ax = k.includes("w") ? rect.x + rect.w : rect.x;
    const ay = k.includes("n") ? rect.y + rect.h : rect.y;
    drag.current = { mode: "resize", ax, ay };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d || !disp) return;
    const p = local(e);
    const W = disp.w;
    const H = disp.h;

    if (d.mode === "move") {
      setRect({
        ...d.r0,
        x: clamp(d.r0.x + (p.x - d.sx), 0, W - d.r0.w),
        y: clamp(d.r0.y + (p.y - d.sy), 0, H - d.r0.h),
      });
      return;
    }

    const px = clamp(p.x, 0, W);
    const py = clamp(p.y, 0, H);
    const sx = px >= d.ax ? 1 : -1;
    const sy = py >= d.ay ? 1 : -1;
    const maxW = sx > 0 ? W - d.ax : d.ax;
    const maxH = sy > 0 ? H - d.ay : d.ay;
    let w = Math.min(Math.abs(px - d.ax), maxW);
    let h = Math.min(Math.abs(py - d.ay), maxH);
    if (ratio) {
      if (w / Math.max(h, 1) > ratio) w = h * ratio;
      else h = w / ratio;
    }
    w = Math.max(w, MIN);
    h = ratio ? Math.max(w / ratio, MIN) : Math.max(h, MIN);
    const x = clamp(sx > 0 ? d.ax : d.ax - w, 0, Math.max(0, W - w));
    const y = clamp(sy > 0 ? d.ay : d.ay - h, 0, Math.max(0, H - h));
    setRect({ x, y, w, h });
  };

  const endDrag = (e: ReactPointerEvent) => {
    drag.current = null;
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  /** Export an area (display coordinates) of the current picture as a new File. */
  const doExport = (r: Rect) => {
    const img = imgRef.current;
    if (!img || !nat || !disp) return;
    setBusy(true);

    const sc = nat.w / disp.w; // display px -> picture px
    const sw = r.w * sc;
    const sh = r.h * sc;
    const k = Math.min(1, MAX_OUT / Math.max(sw, sh));
    const cw = Math.max(1, Math.round(sw * k));
    const ch = Math.max(1, Math.round(sh * k));

    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setBusy(false);
      return;
    }
    ctx.drawImage(img, r.x * sc, r.y * sc, sw, sh, 0, 0, cw, ch);

    const type = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
    const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setBusy(false);
          return;
        }
        const base = file.name.replace(/\.[^.]+$/, "") || "image";
        onConfirm(new File([blob], `${base}.${ext}`, { type }));
      },
      type,
      0.9,
    );
  };

  /** Use the whole picture without cropping (rotation / flip are kept). */
  const useWhole = () => {
    if (!transformed) return onConfirm(file);
    if (disp) doExport({ x: 0, y: 0, w: disp.w, h: disp.h });
  };

  const outSize =
    rect && nat && disp
      ? (() => {
          const sc = nat.w / disp.w;
          const sw = rect.w * sc;
          const sh = rect.h * sc;
          const k = Math.min(1, MAX_OUT / Math.max(sw, sh));
          return `${Math.round(sw * k)} × ${Math.round(sh * k)} px`;
        })()
      : "";

  const chip = (on: boolean): CSSProperties => ({
    padding: "7px 14px",
    borderRadius: 9999,
    border: `1px solid ${on ? "#1f73c8" : "#cbd5e1"}`,
    background: on ? "#1f73c8" : "#fff",
    color: on ? "#fff" : "#0f172a",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop image"
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "rgba(8,16,32,.72)", cursor: "default" }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 820,
          maxHeight: "94vh",
          overflowY: "auto",
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 40px 90px -30px rgba(0,0,0,.6)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Crop & rotate image</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>Rotate first if needed, then drag the box to move it or a corner to resize.</p>
          </div>
          <button type="button" className="a-btn" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        {/* rotate / flip */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <button type="button" className="a-btn" onClick={() => rotate(-1)} disabled={rotating || busy} aria-label="Rotate left">
            ⟲ Rotate left
          </button>
          <button type="button" className="a-btn" onClick={() => rotate(1)} disabled={rotating || busy} aria-label="Rotate right">
            ⟳ Rotate right
          </button>
          <button type="button" className="a-btn" onClick={() => setFlip((f) => !f)} disabled={rotating || busy} aria-pressed={flip}>
            ⇋ Flip
          </button>
          <button type="button" className="a-btn" onClick={reset} disabled={!transformed || rotating || busy}>
            Reset
          </button>
          <span style={{ fontSize: 12.5, color: "#64748b" }}>
            {rotating ? "Rotating…" : transformed ? `Rotated ${quarter * 90}°${flip ? " · flipped" : ""}` : "Original orientation"}
          </span>
        </div>

        {/* shape presets */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
          {PRESETS.map((p) => (
            <button key={p.key} type="button" style={chip(preset === p.key)} onClick={() => choosePreset(p.key)}>
              {p.label}
            </button>
          ))}
        </div>

        {/* crop stage */}
        <div style={{ display: "flex", justifyContent: "center", background: "#0b1626", borderRadius: 12, padding: 12, minHeight: 120 }}>
          <div
            ref={stageRef}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{
              position: "relative",
              width: disp ? disp.w : "auto",
              height: disp ? disp.h : "auto",
              overflow: "hidden",
              touchAction: "none",
              userSelect: "none",
              borderRadius: 4,
            }}
          >
            {workUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={workUrl}
                ref={imgRef}
                src={workUrl}
                alt="Image to crop"
                onLoad={onImgLoad}
                draggable={false}
                style={disp ? { display: "block", width: disp.w, height: disp.h } : { display: "block", maxWidth: "100%", opacity: 0 }}
              />
            )}

            {rect && (
              <div
                onPointerDown={startMove}
                style={{
                  position: "absolute",
                  left: rect.x,
                  top: rect.y,
                  width: rect.w,
                  height: rect.h,
                  border: "2px solid #fff",
                  boxShadow: "0 0 0 9999px rgba(8,16,32,.6)",
                  cursor: "move",
                  boxSizing: "border-box",
                }}
              >
                {/* rule-of-thirds guides */}
                {[33.33, 66.66].map((p) => (
                  <span key={`v${p}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${p}%`, width: 1, background: "rgba(255,255,255,.4)", pointerEvents: "none" }} />
                ))}
                {[33.33, 66.66].map((p) => (
                  <span key={`h${p}`} style={{ position: "absolute", left: 0, right: 0, top: `${p}%`, height: 1, background: "rgba(255,255,255,.4)", pointerEvents: "none" }} />
                ))}

                {HANDLES.map((h) => (
                  <span
                    key={h.k}
                    onPointerDown={(e) => startResize(e, h.k)}
                    style={{
                      position: "absolute",
                      left: `${h.l}%`,
                      top: `${h.t}%`,
                      width: 22,
                      height: 22,
                      marginLeft: -11,
                      marginTop: -11,
                      borderRadius: 6,
                      background: "#fff",
                      border: "3px solid #1f73c8",
                      boxSizing: "border-box",
                      cursor: h.cursor,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {outSize && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#64748b", textAlign: "center" }}>Output size: {outSize}</p>}

        {/* actions */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" className="a-btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="a-btn" onClick={useWhole} disabled={busy || rotating}>
            {transformed ? "Use whole image (no crop)" : "Use original (no crop)"}
          </button>
          <button type="button" className="a-btn a-btn-primary" onClick={() => rect && doExport(rect)} disabled={busy || rotating || !rect}>
            {busy ? "Working…" : "Crop & upload"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}