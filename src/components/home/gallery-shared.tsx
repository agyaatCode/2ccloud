/**
 * FILE: src/components/home/gallery-shared.tsx
 * TYPE: Client module (shared by the home page slider and the /gallery page)
 * INCLUDES: grouping helper, video helpers (YouTube / Vimeo), icons and the full-screen lightbox
 */
"use client";

import { useCallback, useEffect } from "react";
import type { GalleryItemView } from "@/lib/home-extras";

export const UNGROUPED = "More moments";
export const NO_GROUP_KEY = "\u0000";

export type Group = { key: string; title: string; items: GalleryItemView[] };

/** Group name shown for an item (items without a group share "More moments"). */
export const groupLabel = (it: GalleryItemView) => (it.group || "").replace(/\s+/g, " ").trim() || UNGROUPED;

/**
 * Items with the same group title (ignoring case and extra spaces) share one group.
 * Order follows the admin sort order; the "no group" bucket always goes last.
 */
export function groupItems(items: GalleryItemView[]): Group[] {
  const map = new Map<string, Group>();
  for (const it of items) {
    const title = (it.group || "").replace(/\s+/g, " ").trim();
    const key = title ? title.toLowerCase() : NO_GROUP_KEY;
    let g = map.get(key);
    if (!g) {
      g = { key, title: title || UNGROUPED, items: [] };
      map.set(key, g);
    }
    g.items.push(it);
  }
  const arr = Array.from(map.values());
  // sort is stable, so the other groups keep their order
  arr.sort((a, b) => (a.key === NO_GROUP_KEY ? 1 : 0) - (b.key === NO_GROUP_KEY ? 1 : 0));
  return arr;
}

/* ------------------------------ video helpers ------------------------------ */

export function ytId(url: string): string | null {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, "");
    if (h === "youtu.be") return u.pathname.slice(1) || null;
    if (h.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
      return m ? m[1] : null;
    }
  } catch {
    /* not a valid URL (e.g. an uploaded file path) */
  }
  return null;
}

/** Returns an iframe URL for YouTube / Vimeo links, or null for plain video files. */
export function embedUrl(url: string): string | null {
  const id = ytId(url);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  try {
    const u = new URL(url);
    if (u.hostname.replace(/^www\./, "") === "vimeo.com") {
      const m = u.pathname.match(/^\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Small picture used on cards: the photo, the video poster, or a YouTube thumbnail. */
export function thumbOf(it: GalleryItemView): string {
  if (it.imageUrl) return it.imageUrl;
  const id = it.kind === "video" ? ytId(it.videoUrl) : null;
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

/* ------------------------------ icons ------------------------------ */

export const Arrow = ({ dir }: { dir: "l" | "r" }) => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d={dir === "l" ? "M12.5 4.5L7 10l5.5 5.5" : "M7.5 4.5L13 10l-5.5 5.5"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
  </svg>
);

export const ZoomIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11.5 3H17v5.5M8.5 17H3v-5.5M17 3l-5.5 5.5M3 17l5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------ lightbox ------------------------------ */

export const LIGHTBOX_CSS = `
.gl-lb{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:60px 16px 28px;animation:glFade .2s ease-out}
.gl-lb-bg{position:absolute;inset:0;padding:0;border:0;background:rgba(3,10,24,.95);cursor:zoom-out}
.gl-lb-box{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:16px;animation:glPop .22s ease-out}
.gl-lb-media img,.gl-lb-media video{display:block;max-width:92vw;max-height:76vh;border-radius:16px;background:#000;object-fit:contain}
.gl-lb-media iframe{display:block;width:min(92vw,1100px);aspect-ratio:16/9;border:0;border-radius:16px;background:#000}
.gl-lb-cap{max-width:44rem;text-align:center;color:#fff}
.gl-lb-cap b{display:block;font-size:18px}
.gl-lb-cap span{display:block;margin-top:6px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.75)}
.gl-lb-btn{position:absolute;z-index:2;width:46px;height:46px;border-radius:9999px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,border-color .2s}
.gl-lb-btn:hover{background:#ff9900;border-color:#ff9900;color:#0a1f44}
.gl-lb-close{top:12px;right:12px}
.gl-lb-prev{left:14px;top:50%;margin-top:-23px}
.gl-lb-next{right:14px;top:50%;margin-top:-23px}
.gl-lb-count{position:absolute;top:24px;left:20px;right:76px;z-index:2;font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gl-lb-count b{color:#ff9900}
@media(max-width:639px){
  .gl-lb-prev,.gl-lb-next{top:auto;bottom:14px;margin-top:0}
  .gl-lb-prev{left:16px}
  .gl-lb-next{right:16px}
}
@keyframes glFade{from{opacity:0}to{opacity:1}}
@keyframes glPop{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}
`;

/** Full photo / video viewer. Needs LIGHTBOX_CSS on the page. Render it with createPortal(…, document.body). */
export function GalleryLightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItemView[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const it = items[index];
  const n = items.length;

  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  /* warm up the neighbouring photos so next / previous feel instant */
  useEffect(() => {
    [(index + 1) % n, (index - 1 + n) % n].forEach((j) => {
      const o = items[j];
      if (o && o.kind === "image" && o.imageUrl) {
        const im = new Image();
        im.src = o.imageUrl;
      }
    });
  }, [index, n, items]);

  if (!it) return null;
  const label = groupLabel(it);
  const embed = it.kind === "video" ? embedUrl(it.videoUrl) : null;

  return (
    <div className="gl-lb" role="dialog" aria-modal="true" aria-label={it.title || label}>
      <button type="button" className="gl-lb-bg" aria-label="Close" onClick={onClose} />
      <span className="gl-lb-count">
        {label} · <b>{String(index + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
      </span>

      <div className="gl-lb-box" key={it.id}>
        <div className="gl-lb-media">
          {it.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.imageUrl} alt={it.title || label} decoding="async" />
          ) : embed ? (
            <iframe src={embed} title={it.title || "Video"} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          ) : (
            <video src={it.videoUrl} poster={it.imageUrl || undefined} controls autoPlay playsInline preload="metadata" />
          )}
        </div>
        {(it.title || it.caption) && (
          <div className="gl-lb-cap">
            {it.title && <b>{it.title}</b>}
            {it.caption && <span>{it.caption}</span>}
          </div>
        )}
      </div>

      <button type="button" className="gl-lb-btn gl-lb-close" aria-label="Close" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      </button>
      {n > 1 && (
        <>
          <button type="button" className="gl-lb-btn gl-lb-prev" aria-label="Previous" onClick={prev}>
            <Arrow dir="l" />
          </button>
          <button type="button" className="gl-lb-btn gl-lb-next" aria-label="Next" onClick={next}>
            <Arrow dir="r" />
          </button>
        </>
      )}
    </div>
  );
}