
// /**
//  * FILE: src/components/home/GallerySlider.tsx
//  * TYPE: Client Component
//  * INCLUDES: Gallery split into groups (by "Image group title").
//  *  - every group = a title on top + all its photos / videos in ONE row of small thumbnails
//  *  - row scrolls by swipe (touch), mouse drag or arrow buttons (arrows only appear when needed)
//  *  - thumbnails keep the shape chosen in admin (portrait / landscape / square / tall) and focus position
//  *  - click a thumbnail to open the full photo or video in a lightbox (Esc, left/right arrows),
//  *    previous / next move inside the same group
//  *  - items without a group are shown last under "More moments"
//  * PERFORMANCE: small thumbnails, lazy loading, no <video> inside cards, no blur / backdrop filters,
//  *  memoized cards and rows, cached scroll measurements, section skipped by the browser until near the screen.
//  * NOTE: Layout uses scoped CSS (gl-*) so it never depends on Tailwind theme tokens.
//  */
// "use client";

// import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
// import { createPortal } from "react-dom";
// import { Reveal } from "@/components/motion";
// import { ASPECT_NUM, ASPECT_RATIO } from "@/lib/home-media";
// import type { GalleryItemView } from "@/lib/home-extras";

// const UNGROUPED = "More moments";
// const NO_GROUP_KEY = "\u0000";

// type Group = { key: string; title: string; items: GalleryItemView[] };

// const CSS = `
// .gl{--gl-h:118px;position:relative;overflow:hidden;isolation:isolate;padding:64px 0 72px;color:#fff;background:linear-gradient(160deg,#061226 0%,#0a1f44 55%,#0b2a5c 100%);content-visibility:auto;contain-intrinsic-size:auto 700px}
// @media(min-width:640px){.gl{--gl-h:140px}}
// @media(min-width:1024px){.gl{--gl-h:160px;padding:96px 0 104px}}
// /* soft glows made with gradients (no blur filter, so they are cheap to paint) */
// .gl-orb{position:absolute;z-index:-1;border-radius:9999px;pointer-events:none}

// .gl-head{max-width:80rem;margin:0 auto 36px;padding:0 20px}
// @media(min-width:640px){.gl-head{padding:0 32px}}
// .gl-eyebrow{margin:0;font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#ff9900}
// .gl-title{margin:10px 0 0;font-size:clamp(28px,4.2vw,44px);line-height:1.15;font-weight:700;color:#fff}
// .gl-sub{margin:14px 0 0;max-width:34rem;line-height:1.7;color:rgba(255,255,255,.72)}

// .gl-groups{display:grid;gap:34px}
// .gl-row{box-sizing:border-box;width:100%;max-width:80rem;margin:0 auto;padding:0 20px;animation:glIn .5s ease-out both}
// @media(min-width:640px){.gl-row{padding:0 32px}}

// /* group title line */
// .gl-ghead{display:flex;align-items:center;gap:12px;margin-bottom:14px}
// .gl-gbar{flex:0 0 auto;width:5px;height:26px;border-radius:5px;background:linear-gradient(to bottom,#1f73c8,#ff9900)}
// .gl-gtitle{margin:0;font-size:clamp(17px,2.2vw,22px);line-height:1.25;font-weight:700;color:#fff}
// .gl-gcount{flex:0 0 auto;padding:3px 10px;border-radius:9999px;font-size:11.5px;font-weight:700;color:rgba(255,255,255,.85);background:rgba(255,255,255,.12)}
// .gl-gline{flex:1;height:1px;background:rgba(255,255,255,.14)}
// .gl-garrows{display:flex;flex:0 0 auto;gap:8px}
// .gl-arrow{width:36px;height:36px;border-radius:9999px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s,color .2s}
// .gl-arrow:hover:not(:disabled){background:#ff9900;border-color:#ff9900;color:#0a1f44}
// .gl-arrow:disabled{opacity:.35;cursor:default}

// /* one row with all the photos of the group */
// .gl-track{display:flex;align-items:center;gap:12px;overflow-x:auto;padding:6px 4px 12px;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;cursor:grab;user-select:none;overscroll-behavior-x:contain}
// .gl-track::-webkit-scrollbar{display:none}
// .gl-track.is-drag{scroll-snap-type:none;cursor:grabbing}

// /* small thumbnail: fixed row height, width comes from the chosen shape (--ar / --arn are set per card) */
// .gl-card{position:relative;display:block;flex:0 0 auto;height:min(var(--gl-h),calc(72vw / var(--arn,.8)));aspect-ratio:var(--ar,4 / 5);padding:0;border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;background:#0b2a5c;color:#fff;text-align:left;cursor:pointer;scroll-snap-align:start;box-shadow:0 8px 18px -12px rgba(0,0,0,.8);transition:transform .25s cubic-bezier(.2,.7,.2,1),border-color .25s}
// .gl-card:hover{transform:translateY(-4px);border-color:rgba(255,153,0,.7)}
// .gl-card:focus-visible{outline:3px solid #ff9900;outline-offset:2px}
// .gl-media{position:absolute;inset:0;display:block;background:linear-gradient(135deg,#0f3b7a,#0a1f44)}
// .gl-media img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
// .gl-zoom{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(10,31,68,.7);opacity:0;transition:opacity .2s}
// .gl-card:hover .gl-zoom{opacity:1}
// @media(hover:none){.gl-zoom{display:none}}
// .gl-play{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#0a1f44;background:#ff9900;box-shadow:0 6px 14px -6px rgba(255,153,0,.8);transition:transform .2s}
// .gl-card:hover .gl-play{transform:scale(1.12)}
// .gl-info{position:absolute;left:0;right:0;bottom:0;display:block;padding:20px 10px 8px;font-size:12px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:linear-gradient(to top,rgba(6,18,38,.92),rgba(6,18,38,0));opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s}
// .gl-card:hover .gl-info{opacity:1;transform:none}
// @media(hover:none){.gl-info{opacity:1;transform:none}}

// /* lightbox (full photo / video) */
// .gl-lb{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:60px 16px 28px;animation:glFade .2s ease-out}
// .gl-lb-bg{position:absolute;inset:0;padding:0;border:0;background:rgba(3,10,24,.95);cursor:zoom-out}
// .gl-lb-box{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:16px;animation:glPop .22s ease-out}
// .gl-lb-media img,.gl-lb-media video{display:block;max-width:92vw;max-height:76vh;border-radius:16px;background:#000;object-fit:contain}
// .gl-lb-media iframe{display:block;width:min(92vw,1100px);aspect-ratio:16/9;border:0;border-radius:16px;background:#000}
// .gl-lb-cap{max-width:44rem;text-align:center;color:#fff}
// .gl-lb-cap b{display:block;font-size:18px}
// .gl-lb-cap span{display:block;margin-top:6px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.75)}
// .gl-lb-btn{position:absolute;z-index:2;width:46px;height:46px;border-radius:9999px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,border-color .2s}
// .gl-lb-btn:hover{background:#ff9900;border-color:#ff9900;color:#0a1f44}
// .gl-lb-close{top:12px;right:12px}
// .gl-lb-prev{left:14px;top:50%;margin-top:-23px}
// .gl-lb-next{right:14px;top:50%;margin-top:-23px}
// .gl-lb-count{position:absolute;top:24px;left:20px;right:76px;z-index:2;font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
// .gl-lb-count b{color:#ff9900}
// @media(max-width:639px){
//   .gl-lb-prev,.gl-lb-next{top:auto;bottom:14px;margin-top:0}
//   .gl-lb-prev{left:16px}
//   .gl-lb-next{right:16px}
// }
// @keyframes glIn{from{opacity:0}to{opacity:1}}
// @keyframes glFade{from{opacity:0}to{opacity:1}}
// @keyframes glPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
// @media(prefers-reduced-motion:reduce){.gl-card{transition:none}.gl-row{animation:none}}
// `;

// /* ------------------------------ grouping ------------------------------ */

// /** Items with the same group title (ignoring case and extra spaces) share one row. Order follows the admin sort order. */
// function groupItems(items: GalleryItemView[]): Group[] {
//   const map = new Map<string, Group>();
//   for (const it of items) {
//     const title = (it.group || "").replace(/\s+/g, " ").trim();
//     const key = title ? title.toLowerCase() : NO_GROUP_KEY;
//     let g = map.get(key);
//     if (!g) {
//       g = { key, title: title || UNGROUPED, items: [] };
//       map.set(key, g);
//     }
//     g.items.push(it);
//   }
//   const arr = Array.from(map.values());
//   // the "no group" row always goes last (sort is stable, so the other groups keep their order)
//   arr.sort((a, b) => (a.key === NO_GROUP_KEY ? 1 : 0) - (b.key === NO_GROUP_KEY ? 1 : 0));
//   return arr;
// }

// /* ------------------------------ video helpers ------------------------------ */

// function ytId(url: string): string | null {
//   try {
//     const u = new URL(url);
//     const h = u.hostname.replace(/^www\./, "");
//     if (h === "youtu.be") return u.pathname.slice(1) || null;
//     if (h.endsWith("youtube.com")) {
//       if (u.pathname === "/watch") return u.searchParams.get("v");
//       const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
//       return m ? m[1] : null;
//     }
//   } catch {
//     /* not a valid URL (e.g. an uploaded file path) */
//   }
//   return null;
// }

// /** Returns an iframe URL for YouTube / Vimeo links, or null for plain video files. */
// function embedUrl(url: string): string | null {
//   const id = ytId(url);
//   if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
//   try {
//     const u = new URL(url);
//     if (u.hostname.replace(/^www\./, "") === "vimeo.com") {
//       const m = u.pathname.match(/^\/(\d+)/);
//       if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
//     }
//   } catch {
//     /* ignore */
//   }
//   return null;
// }

// function thumbOf(it: GalleryItemView): string {
//   if (it.imageUrl) return it.imageUrl;
//   const id = it.kind === "video" ? ytId(it.videoUrl) : null;
//   return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
// }

// /* ------------------------------ icons ------------------------------ */

// const Arrow = ({ dir }: { dir: "l" | "r" }) => (
//   <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
//     <path d={dir === "l" ? "M12.5 4.5L7 10l5.5 5.5" : "M7.5 4.5L13 10l-5.5 5.5"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );
// const PlayIcon = ({ size = 16 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
//     <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
//   </svg>
// );

// /* ------------------------------ thumbnail (memoized) ------------------------------ */

// const GalleryCard = memo(function GalleryCard({
//   it,
//   gi,
//   i,
//   eager,
//   onOpen,
// }: {
//   it: GalleryItemView;
//   gi: number;
//   i: number;
//   eager: boolean;
//   onOpen: (g: number, i: number) => void;
// }) {
//   const thumb = thumbOf(it);
//   const cardStyle = {
//     "--ar": ASPECT_RATIO[it.aspect] ?? ASPECT_RATIO.portrait,
//     "--arn": ASPECT_NUM[it.aspect] ?? ASPECT_NUM.portrait,
//   } as CSSProperties;

//   return (
//     <button
//       type="button"
//       className="gl-card"
//       style={cardStyle}
//       onClick={() => onOpen(gi, i)}
//       aria-label={`${it.kind === "video" ? "Play video" : "Open photo"}${it.title ? `: ${it.title}` : ""}`}
//     >
//       {/* Only a small poster / photo here. Videos never load inside the row. */}
//       <span className="gl-media">
//         {thumb ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img src={thumb} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} style={{ objectPosition: it.focus }} />
//         ) : null}
//       </span>
//       {it.kind === "video" ? (
//         <span className="gl-play">
//           <PlayIcon />
//         </span>
//       ) : (
//         <span className="gl-zoom" aria-hidden="true">
//           <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
//             <path d="M11.5 3H17v5.5M8.5 17H3v-5.5M17 3l-5.5 5.5M3 17l5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </span>
//       )}
//       {it.title && <span className="gl-info">{it.title}</span>}
//     </button>
//   );
// });

// /* ------------------------------ group row ------------------------------ */

// const GroupRow = memo(function GroupRow({ group, gi, first, onOpen }: { group: Group; gi: number; first: boolean; onOpen: (g: number, i: number) => void }) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const maxRef = useRef(0); // cached: how far the row can scroll
//   const drag = useRef({ down: false, x: 0, left: 0, moved: false });
//   const [overflow, setOverflow] = useState(false);
//   const [canPrev, setCanPrev] = useState(false);
//   const [canNext, setCanNext] = useState(false);

//   /** Update the arrows from the cached size (cheap, runs while scrolling). */
//   const sync = useCallback(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     const x = el.scrollLeft;
//     setCanPrev(x > 4);
//     setCanNext(x < maxRef.current - 4);
//   }, []);

//   useEffect(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     let raf = 0;
//     const measure = () => {
//       maxRef.current = el.scrollWidth - el.clientWidth;
//       setOverflow(maxRef.current > 4);
//       sync();
//     };
//     const onScroll = () => {
//       cancelAnimationFrame(raf);
//       raf = requestAnimationFrame(sync);
//     };
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     el.addEventListener("scroll", onScroll, { passive: true });
//     measure();
//     return () => {
//       cancelAnimationFrame(raf);
//       ro.disconnect();
//       el.removeEventListener("scroll", onScroll);
//     };
//   }, [sync, group.items.length]);

//   const scrollByPage = (dir: 1 | -1) => {
//     const el = trackRef.current;
//     if (!el) return;
//     el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.8), behavior: "smooth" });
//   };

//   /* mouse drag-to-scroll (touch uses native scrolling) */
//   const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
//     if (e.pointerType !== "mouse" || !trackRef.current) return;
//     drag.current = { down: true, x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
//   };
//   const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
//     const d = drag.current;
//     const el = trackRef.current;
//     if (!d.down || !el) return;
//     const dx = e.clientX - d.x;
//     if (Math.abs(dx) > 5 && !d.moved) {
//       d.moved = true;
//       el.classList.add("is-drag");
//     }
//     if (d.moved) el.scrollLeft = d.left - dx;
//   };
//   const endDrag = () => {
//     drag.current.down = false;
//     trackRef.current?.classList.remove("is-drag");
//   };

//   // A drag must not open the lightbox
//   const handleOpen = useCallback(
//     (g: number, i: number) => {
//       if (drag.current.moved) {
//         drag.current.moved = false;
//         return;
//       }
//       onOpen(g, i);
//     },
//     [onOpen],
//   );

//   const n = group.items.length;

//   return (
//     <div className="gl-row">
//       <div className="gl-ghead">
//         <span className="gl-gbar" aria-hidden="true" />
//         <h3 className="gl-gtitle font-display">{group.title}</h3>
//         <span className="gl-gcount">
//           {n} {n === 1 ? "item" : "items"}
//         </span>
//         <span className="gl-gline" aria-hidden="true" />
//         {overflow && (
//           <div className="gl-garrows">
//             <button type="button" className="gl-arrow" aria-label={`Scroll ${group.title} left`} disabled={!canPrev} onClick={() => scrollByPage(-1)}>
//               <Arrow dir="l" />
//             </button>
//             <button type="button" className="gl-arrow" aria-label={`Scroll ${group.title} right`} disabled={!canNext} onClick={() => scrollByPage(1)}>
//               <Arrow dir="r" />
//             </button>
//           </div>
//         )}
//       </div>

//       <div
//         ref={trackRef}
//         className="gl-track"
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={endDrag}
//         onPointerLeave={endDrag}
//         onPointerCancel={endDrag}
//       >
//         {group.items.map((it, i) => (
//           <GalleryCard key={it.id} it={it} gi={gi} i={i} eager={first && i < 4} onOpen={handleOpen} />
//         ))}
//       </div>
//     </div>
//   );
// });

// /* ------------------------------ lightbox ------------------------------ */

// function Lightbox({ group, index, onClose, onIndex }: { group: Group; index: number; onClose: () => void; onIndex: (i: number) => void }) {
//   const items = group.items;
//   const it = items[index];
//   const n = items.length;

//   const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);
//   const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//       else if (e.key === "ArrowLeft") prev();
//       else if (e.key === "ArrowRight") next();
//     };
//     window.addEventListener("keydown", onKey);
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prevOverflow;
//     };
//   }, [onClose, prev, next]);

//   /* warm up the neighbouring photos so next / previous feel instant */
//   useEffect(() => {
//     [(index + 1) % n, (index - 1 + n) % n].forEach((j) => {
//       const o = items[j];
//       if (o && o.kind === "image" && o.imageUrl) {
//         const im = new Image();
//         im.src = o.imageUrl;
//       }
//     });
//   }, [index, n, items]);

//   const embed = it.kind === "video" ? embedUrl(it.videoUrl) : null;

//   return (
//     <div className="gl-lb" role="dialog" aria-modal="true" aria-label={it.title || group.title}>
//       <button type="button" className="gl-lb-bg" aria-label="Close" onClick={onClose} />
//       <span className="gl-lb-count">
//         {group.title} · <b>{String(index + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
//       </span>

//       <div className="gl-lb-box" key={it.id}>
//         <div className="gl-lb-media">
//           {it.kind === "image" ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={it.imageUrl} alt={it.title || group.title} decoding="async" />
//           ) : embed ? (
//             <iframe src={embed} title={it.title || "Video"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
//           ) : (
//             <video src={it.videoUrl} poster={it.imageUrl || undefined} controls autoPlay playsInline preload="metadata" />
//           )}
//         </div>
//         {(it.title || it.caption) && (
//           <div className="gl-lb-cap">
//             {it.title && <b>{it.title}</b>}
//             {it.caption && <span>{it.caption}</span>}
//           </div>
//         )}
//       </div>

//       <button type="button" className="gl-lb-btn gl-lb-close" aria-label="Close" onClick={onClose}>
//         <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
//           <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
//         </svg>
//       </button>
//       {n > 1 && (
//         <>
//           <button type="button" className="gl-lb-btn gl-lb-prev" aria-label="Previous" onClick={prev}>
//             <Arrow dir="l" />
//           </button>
//           <button type="button" className="gl-lb-btn gl-lb-next" aria-label="Next" onClick={next}>
//             <Arrow dir="r" />
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// /* ------------------------------ section ------------------------------ */

// export function GallerySlider({ items }: { items: GalleryItemView[] }) {
//   const groups = useMemo(() => groupItems(items), [items]);
//   const [open, setOpen] = useState<{ g: number; i: number } | null>(null);

//   // Stable function, so memoized rows and thumbnails are not re-rendered
//   const openCard = useCallback((g: number, i: number) => setOpen({ g, i }), []);
//   const closeBox = useCallback(() => setOpen(null), []);
//   const setIndex = useCallback((i: number) => setOpen((o) => (o ? { g: o.g, i } : o)), []);

//   const openGroup = open ? groups[open.g] : null;

//   return (
//     <section className="gl" id="gallery" aria-label="Gallery">
//       <style>{CSS}</style>
//       <span
//         className="gl-orb"
//         style={{ left: -160, top: 20, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(31,115,200,.3), rgba(31,115,200,0))" }}
//         aria-hidden="true"
//       />
//       <span
//         className="gl-orb"
//         style={{ right: -160, bottom: 0, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(255,153,0,.14), rgba(255,153,0,0))" }}
//         aria-hidden="true"
//       />

//       <div className="gl-head">
//         <Reveal>
//           <p className="gl-eyebrow">Gallery</p>
//           <h2 className="gl-title font-display">Moments that define us</h2>
//           <p className="gl-sub">A glimpse into our work, our people and the moments that shape our journey.</p>
//         </Reveal>
//       </div>

//       <div className="gl-groups">
//         {groups.map((g, gi) => (
//           <GroupRow key={g.key} group={g} gi={gi} first={gi === 0} onOpen={openCard} />
//         ))}
//       </div>

//       {open && openGroup && openGroup.items[open.i] &&
//         createPortal(<Lightbox group={openGroup} index={open.i} onClose={closeBox} onIndex={setIndex} />, document.body)}
//     </section>
//   );
// }




// new code 




/**
 * FILE: src/components/home/GallerySlider.tsx
 * TYPE: Client Component
 * INCLUDES: Gallery split into groups (by "Image group title").
 *  - every group = a title on top + all its photos / videos in ONE row of small thumbnails
 *  - row scrolls by swipe (touch), mouse drag or arrow buttons (arrows only appear when needed)
 *  - thumbnails keep the shape chosen in admin (portrait / landscape / square / tall) and focus position
 *  - click a thumbnail to open the full photo or video in a lightbox (Esc, left/right arrows),
 *    previous / next move inside the same group
 *  - small "See more" button at the bottom opens the full gallery page (/gallery)
 * PERFORMANCE: small thumbnails, lazy loading, no <video> inside cards, no blur / backdrop filters,
 *  memoized cards and rows, cached scroll measurements, section skipped by the browser until near the screen.
 * NOTE: Layout uses scoped CSS (gl-*) so it never depends on Tailwind theme tokens.
 *       The <style> tag gets ONE single string, otherwise React hydration reports a mismatch.
 */
"use client";

import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/motion";
import { ASPECT_NUM, ASPECT_RATIO } from "@/lib/home-media";
import type { GalleryItemView } from "@/lib/home-extras";
import { Arrow, GalleryLightbox, LIGHTBOX_CSS, PlayIcon, ZoomIcon, groupItems, thumbOf, type Group } from "@/components/home/gallery-shared";

const CSS = `
.gl{--gl-h:118px;position:relative;overflow:hidden;isolation:isolate;padding:64px 0 72px;color:#fff;background:linear-gradient(160deg,#061226 0%,#0a1f44 55%,#0b2a5c 100%);content-visibility:auto;contain-intrinsic-size:auto 700px}
@media(min-width:640px){.gl{--gl-h:140px}}
@media(min-width:1024px){.gl{--gl-h:160px;padding:96px 0 104px}}
/* soft glows made with gradients (no blur filter, so they are cheap to paint) */
.gl-orb{position:absolute;z-index:-1;border-radius:9999px;pointer-events:none}

.gl-head{max-width:80rem;margin:0 auto 36px;padding:0 20px}
@media(min-width:640px){.gl-head{padding:0 32px}}
.gl-eyebrow{margin:0;font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#ff9900}
.gl-title{margin:10px 0 0;font-size:clamp(28px,4.2vw,44px);line-height:1.15;font-weight:700;color:#fff}
.gl-sub{margin:14px 0 0;max-width:34rem;line-height:1.7;color:rgba(255,255,255,.72)}

.gl-groups{display:grid;gap:34px}
.gl-row{box-sizing:border-box;width:100%;max-width:80rem;margin:0 auto;padding:0 20px;animation:glIn .5s ease-out both}
@media(min-width:640px){.gl-row{padding:0 32px}}

/* group title line */
.gl-ghead{display:flex;align-items:center;gap:12px;margin-bottom:14px}
.gl-gbar{flex:0 0 auto;width:5px;height:26px;border-radius:5px;background:linear-gradient(to bottom,#1f73c8,#ff9900)}
.gl-gtitle{margin:0;font-size:clamp(17px,2.2vw,22px);line-height:1.25;font-weight:700;color:#fff}
.gl-gcount{flex:0 0 auto;padding:3px 10px;border-radius:9999px;font-size:11.5px;font-weight:700;color:rgba(255,255,255,.85);background:rgba(255,255,255,.12)}
.gl-gline{flex:1;height:1px;background:rgba(255,255,255,.14)}
.gl-garrows{display:flex;flex:0 0 auto;gap:8px}
.gl-arrow{width:36px;height:36px;border-radius:9999px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s,color .2s}
.gl-arrow:hover:not(:disabled){background:#ff9900;border-color:#ff9900;color:#0a1f44}
.gl-arrow:disabled{opacity:.35;cursor:default}

/* one row with all the photos of the group */
.gl-track{display:flex;align-items:center;gap:12px;overflow-x:auto;padding:6px 4px 12px;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;cursor:grab;user-select:none;overscroll-behavior-x:contain}
.gl-track::-webkit-scrollbar{display:none}
.gl-track.is-drag{scroll-snap-type:none;cursor:grabbing}

/* small thumbnail: fixed row height, width comes from the chosen shape (--ar / --arn are set per card) */
.gl-card{position:relative;display:block;flex:0 0 auto;height:min(var(--gl-h),calc(72vw / var(--arn,.8)));aspect-ratio:var(--ar,4 / 5);padding:0;border:1px solid rgba(255,255,255,.1);border-radius:14px;overflow:hidden;background:#0b2a5c;color:#fff;text-align:left;cursor:pointer;scroll-snap-align:start;box-shadow:0 8px 18px -12px rgba(0,0,0,.8);transition:transform .25s cubic-bezier(.2,.7,.2,1),border-color .25s}
.gl-card:hover{transform:translateY(-4px);border-color:rgba(255,153,0,.7)}
.gl-card:focus-visible{outline:3px solid #ff9900;outline-offset:2px}
.gl-media{position:absolute;inset:0;display:block;background:linear-gradient(135deg,#0f3b7a,#0a1f44)}
.gl-media img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.gl-zoom{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(10,31,68,.7);opacity:0;transition:opacity .2s}
.gl-card:hover .gl-zoom{opacity:1}
@media(hover:none){.gl-zoom{display:none}}
.gl-play{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#0a1f44;background:#ff9900;box-shadow:0 6px 14px -6px rgba(255,153,0,.8);transition:transform .2s}
.gl-card:hover .gl-play{transform:scale(1.12)}
.gl-info{position:absolute;left:0;right:0;bottom:0;display:block;padding:20px 10px 8px;font-size:12px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:linear-gradient(to top,rgba(6,18,38,.92),rgba(6,18,38,0));opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s}
.gl-card:hover .gl-info{opacity:1;transform:none}
@media(hover:none){.gl-info{opacity:1;transform:none}}

/* small "See more" button */
.gl-more{display:flex;justify-content:center;margin:34px auto 0;padding:0 20px}
.gl-morebtn{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 20px;border-radius:9999px;background:#ff9900;color:#0a1f44;font-size:13.5px;font-weight:700;line-height:1;text-decoration:none;transition:transform .2s,background .2s}
.gl-morebtn:hover{background:#fff;transform:translateY(-2px)}
.gl-morebtn span{transition:transform .2s}
.gl-morebtn:hover span{transform:translateX(3px)}

@keyframes glIn{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.gl-card,.gl-morebtn{transition:none}.gl-row{animation:none}}
`;

/* One single string for the <style> tag (two separate children cause a hydration mismatch) */
const ALL_CSS = LIGHTBOX_CSS + CSS;

/* ------------------------------ thumbnail (memoized) ------------------------------ */

const GalleryCard = memo(function GalleryCard({
  it,
  gi,
  i,
  eager,
  onOpen,
}: {
  it: GalleryItemView;
  gi: number;
  i: number;
  eager: boolean;
  onOpen: (g: number, i: number) => void;
}) {
  const thumb = thumbOf(it);
  const cardStyle = {
    "--ar": ASPECT_RATIO[it.aspect] ?? ASPECT_RATIO.portrait,
    "--arn": ASPECT_NUM[it.aspect] ?? ASPECT_NUM.portrait,
  } as CSSProperties;

  return (
    <button
      type="button"
      className="gl-card"
      style={cardStyle}
      onClick={() => onOpen(gi, i)}
      aria-label={`${it.kind === "video" ? "Play video" : "Open photo"}${it.title ? `: ${it.title}` : ""}`}
    >
      {/* Only a small poster / photo here. Videos never load inside the row. */}
      <span className="gl-media">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} style={{ objectPosition: it.focus }} />
        ) : null}
      </span>
      {it.kind === "video" ? (
        <span className="gl-play">
          <PlayIcon />
        </span>
      ) : (
        <span className="gl-zoom" aria-hidden="true">
          <ZoomIcon />
        </span>
      )}
      {it.title && <span className="gl-info">{it.title}</span>}
    </button>
  );
});

/* ------------------------------ group row ------------------------------ */

const GroupRow = memo(function GroupRow({ group, gi, first, onOpen }: { group: Group; gi: number; first: boolean; onOpen: (g: number, i: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef(0); // cached: how far the row can scroll
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [overflow, setOverflow] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /** Update the arrows from the cached size (cheap, runs while scrolling). */
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const x = el.scrollLeft;
    setCanPrev(x > 4);
    setCanNext(x < maxRef.current - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      maxRef.current = el.scrollWidth - el.clientWidth;
      setOverflow(maxRef.current > 4);
      sync();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [sync, group.items.length]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.8), behavior: "smooth" });
  };

  /* mouse drag-to-scroll (touch uses native scrolling) */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { down: true, x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5 && !d.moved) {
      d.moved = true;
      el.classList.add("is-drag");
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
    trackRef.current?.classList.remove("is-drag");
  };

  // A drag must not open the lightbox
  const handleOpen = useCallback(
    (g: number, i: number) => {
      if (drag.current.moved) {
        drag.current.moved = false;
        return;
      }
      onOpen(g, i);
    },
    [onOpen],
  );

  const n = group.items.length;

  return (
    <div className="gl-row">
      <div className="gl-ghead">
        <span className="gl-gbar" aria-hidden="true" />
        <h3 className="gl-gtitle font-display">{group.title}</h3>
        <span className="gl-gcount">
          {n} {n === 1 ? "item" : "items"}
        </span>
        <span className="gl-gline" aria-hidden="true" />
        {overflow && (
          <div className="gl-garrows">
            <button type="button" className="gl-arrow" aria-label={`Scroll ${group.title} left`} disabled={!canPrev} onClick={() => scrollByPage(-1)}>
              <Arrow dir="l" />
            </button>
            <button type="button" className="gl-arrow" aria-label={`Scroll ${group.title} right`} disabled={!canNext} onClick={() => scrollByPage(1)}>
              <Arrow dir="r" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="gl-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {group.items.map((it, i) => (
          <GalleryCard key={it.id} it={it} gi={gi} i={i} eager={first && i < 4} onOpen={handleOpen} />
        ))}
      </div>
    </div>
  );
});

/* ------------------------------ section ------------------------------ */

export function GallerySlider({ items }: { items: GalleryItemView[] }) {
  const groups = useMemo(() => groupItems(items), [items]);
  const [open, setOpen] = useState<{ g: number; i: number } | null>(null);

  // Stable functions, so memoized rows and thumbnails are not re-rendered
  const openCard = useCallback((g: number, i: number) => setOpen({ g, i }), []);
  const closeBox = useCallback(() => setOpen(null), []);
  const setIndex = useCallback((i: number) => setOpen((o) => (o ? { g: o.g, i } : o)), []);

  const openGroup = open ? groups[open.g] : null;

  return (
    <section className="gl" id="gallery" aria-label="Gallery">
      <style>{ALL_CSS}</style>
      <span
        className="gl-orb"
        style={{ left: -160, top: 20, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(31,115,200,.3), rgba(31,115,200,0))" }}
        aria-hidden="true"
      />
      <span
        className="gl-orb"
        style={{ right: -160, bottom: 0, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(255,153,0,.14), rgba(255,153,0,0))" }}
        aria-hidden="true"
      />

      <div className="gl-head">
        <Reveal>
          <p className="gl-eyebrow">Gallery</p>
          <h2 className="gl-title font-display">Moments that define us</h2>
          <p className="gl-sub">A glimpse into our work, our people and the moments that shape our journey.</p>
        </Reveal>
      </div>

      <div className="gl-groups">
        {groups.map((g, gi) => (
          <GroupRow key={g.key} group={g} gi={gi} first={gi === 0} onOpen={openCard} />
        ))}
      </div>

      {/* opens the full gallery page */}
      <div className="gl-more">
        <Link href="/gallery" className="gl-morebtn">
          See more <span aria-hidden="true">→</span>
        </Link>
      </div>

      {open && openGroup && openGroup.items[open.i] &&
        createPortal(<GalleryLightbox items={openGroup.items} index={open.i} onClose={closeBox} onIndex={setIndex} />, document.body)}
    </section>
  );
}