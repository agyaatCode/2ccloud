/**
 * FILE: src/components/home/GalleryPageView.tsx
 * TYPE: Client Component
 * INCLUDES: The full Gallery page (/gallery)
 *  - header banner with breadcrumb and counts
 *  - filters: Photos / Videos and one chip per group
 *  - every group = title + all its thumbnails wrapped in rows (shapes chosen in admin are kept)
 *  - "Show more" loads 36 items at a time
 *  - click a thumbnail to open the full photo / video; previous / next move through the whole filtered list
 * NOTE: Layout uses scoped CSS (gp-*) so it never depends on Tailwind theme tokens.
 *       The <style> tag gets ONE single string, otherwise React hydration reports a mismatch.
 */
"use client";

import Link from "next/link";
import { memo, useCallback, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ASPECT_NUM, ASPECT_RATIO } from "@/lib/home-media";
import type { GalleryItemView } from "@/lib/home-extras";
import { GalleryLightbox, LIGHTBOX_CSS, PlayIcon, ZoomIcon, groupItems, thumbOf } from "@/components/home/gallery-shared";

const PAGE = 36; // items shown per "Show more" step

type TypeFilter = "all" | "image" | "video";

const CSS = `
.gp{--gp-h:130px;background:#f4f7fb;color:#0f172a;min-height:60vh}
@media(min-width:640px){.gp{--gp-h:150px}}
@media(min-width:1024px){.gp{--gp-h:180px}}

/* header banner */
.gp-hero{position:relative;overflow:hidden;isolation:isolate;padding:56px 0 52px;color:#fff;background:linear-gradient(160deg,#061226 0%,#0a1f44 55%,#0b2a5c 100%)}
@media(min-width:1024px){.gp-hero{padding:92px 0 76px}}
.gp-orb{position:absolute;z-index:-1;border-radius:9999px;pointer-events:none}
.gp-wrap{max-width:80rem;margin:0 auto;padding:0 20px}
@media(min-width:640px){.gp-wrap{padding:0 32px}}
.gp-crumbs{display:flex;align-items:center;gap:8px;margin:0 0 20px;font-size:13px;color:rgba(255,255,255,.65)}
.gp-crumbs a{color:rgba(255,255,255,.88);text-decoration:none}
.gp-crumbs a:hover{color:#ff9900}
.gp-eyebrow{margin:0;font-size:12.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#ff9900}
.gp-h1{margin:10px 0 0;font-size:clamp(32px,5vw,54px);line-height:1.1;font-weight:700;color:#fff}
.gp-sub{margin:16px 0 0;max-width:38rem;line-height:1.7;color:rgba(255,255,255,.75)}
.gp-stats{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.gp-stat{padding:8px 16px;border-radius:9999px;background:rgba(255,255,255,.1);font-size:13.5px;font-weight:600;color:rgba(255,255,255,.9)}
.gp-stat b{margin-right:5px;color:#ff9900}

/* filters */
.gp-body{padding:34px 0 84px}
.gp-bar{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-bottom:30px}
.gp-chips{display:flex;flex:1 1 320px;gap:8px;overflow-x:auto;padding:2px 0 4px;scrollbar-width:none}
.gp-chips::-webkit-scrollbar{display:none}
.gp-chip{flex:0 0 auto;display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:9999px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-size:13.5px;font-weight:600;white-space:nowrap;cursor:pointer;transition:border-color .2s,color .2s,background .2s}
.gp-chip:hover{border-color:#1f73c8;color:#0f5cab}
.gp-chip[aria-pressed="true"]{background:#0a1f44;border-color:#0a1f44;color:#fff}
.gp-chip i{font-style:normal;padding:1px 8px;border-radius:9999px;font-size:11.5px;font-weight:700;background:#e2e8f0;color:#475569}
.gp-chip[aria-pressed="true"] i{background:rgba(255,255,255,.2);color:#fff}
.gp-seg{display:inline-flex;gap:2px;padding:4px;border-radius:9999px;background:#e2e8f0}
.gp-seg button{padding:8px 16px;border:0;border-radius:9999px;background:transparent;color:#475569;font-size:13px;font-weight:700;cursor:pointer}
.gp-seg button[aria-pressed="true"]{background:#fff;color:#0a1f44;box-shadow:0 2px 8px -3px rgba(10,31,68,.35)}

/* group sections */
.gp-sec{margin-bottom:42px;animation:gpIn .4s ease-out both}
.gp-ghead{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.gp-gbar{flex:0 0 auto;width:5px;height:28px;border-radius:5px;background:linear-gradient(to bottom,#1f73c8,#ff9900)}
.gp-gtitle{margin:0;font-size:clamp(19px,2.4vw,26px);line-height:1.25;font-weight:700;color:#0a1f44}
.gp-gcount{flex:0 0 auto;padding:3px 10px;border-radius:9999px;font-size:12px;font-weight:700;color:#475569;background:#e2e8f0}
.gp-gline{flex:1;height:1px;background:#d5dde8}

/* thumbnails wrapped in rows: same height, width from the chosen shape */
.gp-flow{display:flex;flex-wrap:wrap;gap:10px}
.gp-card{position:relative;display:block;flex:0 0 auto;height:min(var(--gp-h),calc((100vw - 40px) / var(--arn,.8)));aspect-ratio:var(--ar,4 / 5);padding:0;border:0;border-radius:14px;overflow:hidden;background:#0b2a5c;color:#fff;text-align:left;cursor:pointer;box-shadow:0 8px 16px -12px rgba(10,31,68,.7);transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}
.gp-card:hover{transform:translateY(-4px);box-shadow:0 14px 24px -14px rgba(10,31,68,.8)}
.gp-card:focus-visible{outline:3px solid #ff9900;outline-offset:2px}
.gp-media{position:absolute;inset:0;display:block;background:linear-gradient(135deg,#0f3b7a,#0a1f44)}
.gp-media img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.gp-zoom{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(10,31,68,.7);opacity:0;transition:opacity .2s}
.gp-card:hover .gp-zoom{opacity:1}
@media(hover:none){.gp-zoom{display:none}}
.gp-play{position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#0a1f44;background:#ff9900;box-shadow:0 6px 14px -6px rgba(255,153,0,.8);transition:transform .2s}
.gp-card:hover .gp-play{transform:scale(1.12)}
.gp-info{position:absolute;left:0;right:0;bottom:0;display:block;padding:22px 10px 8px;font-size:12px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff;background:linear-gradient(to top,rgba(6,18,38,.92),rgba(6,18,38,0));opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s}
.gp-card:hover .gp-info{opacity:1;transform:none}
@media(hover:none){.gp-info{opacity:1;transform:none}}

/* show more + empty state */
.gp-more{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:8px}
.gp-btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 24px;border:0;border-radius:9999px;background:#0a1f44;color:#fff;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s,transform .2s}
.gp-btn:hover{background:#0f5cab;transform:translateY(-2px)}
.gp-note{margin:0;font-size:13px;color:#64748b}
.gp-empty{padding:70px 20px;text-align:center;color:#475569}
.gp-empty a{display:inline-block;margin-top:14px;font-weight:700;color:#0f5cab}

@keyframes gpIn{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.gp-card,.gp-btn{transition:none}.gp-sec{animation:none}}
`;

/* One single string for the <style> tag (two separate children cause a hydration mismatch) */
const ALL_CSS = LIGHTBOX_CSS + CSS;

/* ------------------------------ thumbnail (memoized) ------------------------------ */

const PageCard = memo(function PageCard({ it, idx, eager, onOpen }: { it: GalleryItemView; idx: number; eager: boolean; onOpen: (i: number) => void }) {
  const thumb = thumbOf(it);
  const style = {
    "--ar": ASPECT_RATIO[it.aspect] ?? ASPECT_RATIO.portrait,
    "--arn": ASPECT_NUM[it.aspect] ?? ASPECT_NUM.portrait,
  } as CSSProperties;

  return (
    <button
      type="button"
      className="gp-card"
      style={style}
      onClick={() => onOpen(idx)}
      aria-label={`${it.kind === "video" ? "Play video" : "Open photo"}${it.title ? `: ${it.title}` : ""}`}
    >
      <span className="gp-media">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} style={{ objectPosition: it.focus }} />
        ) : null}
      </span>
      {it.kind === "video" ? (
        <span className="gp-play">
          <PlayIcon size={18} />
        </span>
      ) : (
        <span className="gp-zoom" aria-hidden="true">
          <ZoomIcon />
        </span>
      )}
      {it.title && <span className="gp-info">{it.title}</span>}
    </button>
  );
});

/* ------------------------------ page ------------------------------ */

export function GalleryPageView({ items }: { items: GalleryItemView[] }) {
  const [type, setType] = useState<TypeFilter>("all");
  const [groupKey, setGroupKey] = useState("all");
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const photoCount = useMemo(() => items.filter((i) => i.kind === "image").length, [items]);
  const videoCount = items.length - photoCount;
  const groupCount = useMemo(() => groupItems(items).length, [items]);

  /* 1) type filter, 2) group the result, 3) pick the chosen group */
  const byType = useMemo(() => (type === "all" ? items : items.filter((i) => i.kind === type)), [items, type]);
  const groups = useMemo(() => groupItems(byType), [byType]);
  const activeKey = groups.some((g) => g.key === groupKey) ? groupKey : "all";
  const shownGroups = useMemo(() => (activeKey === "all" ? groups : groups.filter((g) => g.key === activeKey)), [groups, activeKey]);

  /** Every item of the current filter in display order (used by the lightbox). */
  const flat = useMemo(() => shownGroups.flatMap((g) => g.items), [shownGroups]);

  /** Sections to draw: the first `visible` items across the groups. `base` = index of the group's first item in `flat`. */
  const sections = useMemo(() => {
    let left = visible;
    let base = 0;
    return shownGroups
      .map((g) => {
        const take = Math.max(0, Math.min(g.items.length, left));
        left -= take;
        const sec = { group: g, base, shown: g.items.slice(0, take) };
        base += g.items.length;
        return sec;
      })
      .filter((s) => s.shown.length > 0);
  }, [shownGroups, visible]);

  const shownCount = sections.reduce((n, s) => n + s.shown.length, 0);
  const remaining = flat.length - shownCount;

  const openCard = useCallback((i: number) => setOpen(i), []);
  const closeBox = useCallback(() => setOpen(null), []);

  const pickType = (t: TypeFilter) => {
    setType(t);
    setVisible(PAGE);
  };
  const pickGroup = (k: string) => {
    setGroupKey(k);
    setVisible(PAGE);
  };

  return (
    <div className="gp">
      <style>{ALL_CSS}</style>

      {/* header banner */}
      <section className="gp-hero">
        <span
          className="gp-orb"
          style={{ left: -160, top: -40, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(31,115,200,.34), rgba(31,115,200,0))" }}
          aria-hidden="true"
        />
        <span
          className="gp-orb"
          style={{ right: -160, bottom: -80, width: 520, height: 520, background: "radial-gradient(closest-side, rgba(255,153,0,.16), rgba(255,153,0,0))" }}
          aria-hidden="true"
        />
        <div className="gp-wrap">
          <nav className="gp-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Gallery</span>
          </nav>
          <p className="gp-eyebrow">Gallery</p>
          <h1 className="gp-h1 font-display">Moments that define us</h1>
          <p className="gp-sub">Browse every photo and video, organised by group. Tap any picture to see it in full.</p>
          <div className="gp-stats">
            <span className="gp-stat">
              <b>{photoCount}</b>
              {photoCount === 1 ? "photo" : "photos"}
            </span>
            <span className="gp-stat">
              <b>{videoCount}</b>
              {videoCount === 1 ? "video" : "videos"}
            </span>
            <span className="gp-stat">
              <b>{groupCount}</b>
              {groupCount === 1 ? "group" : "groups"}
            </span>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="gp-body" aria-label="All photos and videos">
        <div className="gp-wrap">
          {items.length === 0 ? (
            <div className="gp-empty">
              <p>The gallery is empty right now. Please check back soon.</p>
              <Link href="/">Back to home</Link>
            </div>
          ) : (
            <>
              <div className="gp-bar">
                <div className="gp-chips" role="group" aria-label="Filter by group">
                  <button type="button" className="gp-chip" aria-pressed={activeKey === "all"} onClick={() => pickGroup("all")}>
                    All groups <i>{byType.length}</i>
                  </button>
                  {groups.map((g) => (
                    <button key={g.key} type="button" className="gp-chip" aria-pressed={activeKey === g.key} onClick={() => pickGroup(g.key)}>
                      {g.title} <i>{g.items.length}</i>
                    </button>
                  ))}
                </div>
                <div className="gp-seg" role="group" aria-label="Filter by type">
                  {(
                    [
                      ["all", "All"],
                      ["image", "Photos"],
                      ["video", "Videos"],
                    ] as [TypeFilter, string][]
                  ).map(([v, l]) => (
                    <button key={v} type="button" aria-pressed={type === v} onClick={() => pickType(v)}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {sections.length === 0 && (
                <div className="gp-empty">
                  <p>Nothing matches this filter.</p>
                </div>
              )}

              {sections.map((s, si) => (
                <section key={s.group.key} className="gp-sec" aria-label={s.group.title}>
                  <div className="gp-ghead">
                    <span className="gp-gbar" aria-hidden="true" />
                    <h2 className="gp-gtitle font-display">{s.group.title}</h2>
                    <span className="gp-gcount">
                      {s.group.items.length} {s.group.items.length === 1 ? "item" : "items"}
                    </span>
                    <span className="gp-gline" aria-hidden="true" />
                  </div>
                  <div className="gp-flow">
                    {s.shown.map((it, i) => (
                      <PageCard key={it.id} it={it} idx={s.base + i} eager={si === 0 && i < 8} onOpen={openCard} />
                    ))}
                  </div>
                </section>
              ))}

              {remaining > 0 && (
                <div className="gp-more">
                  <button type="button" className="gp-btn" onClick={() => setVisible((v) => v + PAGE)}>
                    Show more
                  </button>
                  <p className="gp-note">
                    Showing {shownCount} of {flat.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {open !== null && flat[open] &&
        createPortal(<GalleryLightbox items={flat} index={open} onClose={closeBox} onIndex={setOpen} />, document.body)}
    </div>
  );
}