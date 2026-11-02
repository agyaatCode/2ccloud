// "use client";
// import Link from "next/link";
// import { useCallback, useEffect, useRef, useState } from "react";

// export type MarketItem = {
//   id: number;
//   name: string;
//   category: string | null;
//   tagline: string | null;
//   description: string | null;
//   highlights?: string | null;
//   tags?: string | null;
//   logoUrl: string | null;
//   imageUrl: string | null;
//   linkText: string | null;
//   linkUrl: string | null;
// };

// const AUTOPLAY_MS = 6000;

// // "a, b, c" -> ["a","b","c"]
// const splitTags = (s?: string | null) => (s || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 5);
// // one point per line
// const splitLines = (s?: string | null) => (s || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, 6);

// export function MarketplaceCarousel({ items }: { items: MarketItem[] }) {
//   const scroller = useRef<HTMLDivElement>(null);
//   const [active, setActive] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const n = items.length;

//   const width = useCallback(() => scroller.current?.clientWidth || 1, []);

//   const goTo = useCallback(
//     (i: number) => {
//       const next = (i + n) % n; // loop around
//       scroller.current?.scrollTo({ left: next * width(), behavior: "smooth" });
//     },
//     [n, width]
//   );

//   // Keep the active index in sync while the user swipes / scrolls
//   const onScroll = () => {
//     const el = scroller.current;
//     if (!el) return;
//     setActive(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / width()))));
//   };

//   // Autoplay: paused on hover/focus, disabled for reduced-motion users
//   useEffect(() => {
//     if (paused || n < 2) return;
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//     const t = setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
//     return () => clearTimeout(t);
//   }, [paused, n, active, goTo]);

//   if (n === 0) return null;

//   return (
//     <div
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//       onFocus={() => setPaused(true)}
//       onBlur={() => setPaused(false)}
//       role="region"
//       aria-roledescription="carousel"
//       aria-label="Our marketplaces"
//     >
//       <div
//         ref={scroller}
//         onScroll={onScroll}
//         className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//       >
//         {items.map((m, i) => {
//           const tags = splitTags(m.tags);
//           const points = splitLines(m.highlights);
//           const href = m.linkUrl || "";
//           const external = /^https?:\/\//i.test(href);
//           const label = m.linkText || "Visit product";
//           const linkCls = "mt-8 inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand-600 transition-colors hover:text-brand-700";
//           return (
//             <article
//               key={m.id}
//               role="group"
//               aria-roledescription="slide"
//               aria-label={`${i + 1} of ${n}`}
//               className="grid w-full shrink-0 snap-center overflow-hidden border border-line bg-white lg:grid-cols-12"
//             >
//               {/* left: cover image (or branded fallback) + tags */}
//               <div className="on-dark relative min-h-[300px] overflow-hidden bg-navy-900 lg:col-span-7 lg:min-h-[460px]">
//                 {m.imageUrl ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img src={m.imageUrl} alt={`${m.name} preview`} loading={i === 0 ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
//                 ) : (
//                   <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-navy-900 via-navy-800 to-brand-700 p-8 text-center">
//                     <span className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none text-white/15">{m.name}</span>
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
//                 {tags.length > 0 && (
//                   <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
//                     {tags.map((t) => (
//                       <li key={t} className="border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm">{t}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {/* right: product details */}
//               <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
//                 <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-md border border-line bg-white p-2">
//                   {m.logoUrl ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={m.logoUrl} alt={`${m.name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
//                   ) : (
//                     <span className="font-display text-2xl font-semibold text-navy-900">{m.name.charAt(0)}</span>
//                   )}
//                 </div>
//                 <p className="eyebrow mb-2">{m.category || "Featured product"}</p>
//                 <h3 className="text-[1.75rem] font-semibold leading-tight">{m.name}</h3>
//                 {m.tagline && <p className="mt-3 font-medium leading-relaxed text-ink">{m.tagline}</p>}
//                 {m.description && <p className="mt-2 line-clamp-4 leading-relaxed text-slate-soft">{m.description}</p>}
//                 {points.length > 0 && (
//                   <ul className="mt-6 space-y-2.5">
//                     {points.map((p) => (
//                       <li key={p} className="flex gap-3 text-[14.5px]">
//                         <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />
//                         {p}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//                 {href &&
//                   (external ? (
//                     <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
//                       {label} <span aria-hidden="true">→</span>
//                     </a>
//                   ) : (
//                     <Link href={href} className={linkCls}>
//                       {label} <span aria-hidden="true">→</span>
//                     </Link>
//                   ))}
//               </div>
//             </article>
//           );
//         })}
//       </div>

//       {n > 1 && (
//         <div className="mt-5 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-2" role="tablist" aria-label="Choose product">
//             {items.map((m, i) => (
//               <button
//                 key={m.id}
//                 type="button"
//                 role="tab"
//                 aria-selected={i === active}
//                 aria-label={`Go to ${m.name}`}
//                 onClick={() => goTo(i)}
//                 className={`h-1.5 transition-all duration-300 ${i === active ? "w-8 bg-brand-600" : "w-4 bg-line hover:bg-slate-400"}`}
//               />
//             ))}
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="font-mono text-[12px] tracking-wider text-slate-soft">
//               {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
//             </span>
//             <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous product" className="flex h-11 w-11 items-center justify-center border border-line bg-white text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">←</button>
//             <button type="button" onClick={() => goTo(active + 1)} aria-label="Next product" className="flex h-11 w-11 items-center justify-center border border-line bg-white text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">→</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// new code 



"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type MarketItem = {
  id: number;
  name: string;
  category: string | null;
  tagline: string | null;
  description: string | null;
  highlights?: string | null;
  tags?: string | null;
  logoUrl: string | null;
  imageUrl: string | null;
  linkText: string | null;
  linkUrl: string | null;
};

const AUTOPLAY_MS = 6000;

// "a, b, c" -> ["a","b","c"]
const splitTags = (s?: string | null) => (s || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 5);
// one point per line
const splitLines = (s?: string | null) => (s || "").split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, 6);

// Normalise the admin-entered link: "www.site.com" -> "https://www.site.com"
function normaliseLink(input?: string | null) {
  const raw = (input || "").trim();
  const external = !!raw && !raw.startsWith("/") && !raw.startsWith("#");
  const href = external && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  return { href, external };
}

// Cover: saved image (uploaded or auto screenshot) -> branded gradient
function Cover({ name, src, eager }: { name: string; src: string; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-navy-900 via-navy-800 to-brand-700 p-8 text-center">
        <span className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none text-white/15">{name}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name} preview`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}

export function MarketplaceCarousel({ items }: { items: MarketItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = items.length;

  const width = useCallback(() => scroller.current?.clientWidth || 1, []);

  const goTo = useCallback(
    (i: number) => {
      const next = (i + n) % n; // loop around
      scroller.current?.scrollTo({ left: next * width(), behavior: "smooth" });
    },
    [n, width]
  );

  // Keep the active index in sync while the user swipes / scrolls
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / width()))));
  };

  // Autoplay: paused on hover/focus, disabled for reduced-motion users
  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [paused, n, active, goTo]);

  if (n === 0) return null;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our marketplaces"
    >
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((m, i) => {
          const tags = splitTags(m.tags);
          const points = splitLines(m.highlights);
          const { href, external } = normaliseLink(m.linkUrl);
          const label = m.linkText || "Visit product";
          const linkCls = "mt-8 inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand-600 transition-colors hover:text-brand-700";
          return (
            <article
              key={m.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              className="grid w-full shrink-0 snap-center overflow-hidden border border-line bg-white lg:grid-cols-12"
            >
              {/* left: cover image + tags */}
              <div className="on-dark relative min-h-[300px] overflow-hidden bg-navy-900 lg:col-span-7 lg:min-h-[460px]">
                <Cover name={m.name} src={m.imageUrl || ""} eager={i === 0} />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-navy-950/5 to-transparent" aria-hidden="true" />
                {tags.length > 0 && (
                  <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <li key={t} className="border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm">{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* right: product details */}
              <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
                <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-md border border-line bg-white p-2">
                  {m.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.logoUrl} alt={`${m.name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-display text-2xl font-semibold text-navy-900">{m.name.charAt(0)}</span>
                  )}
                </div>
                <p className="eyebrow mb-2">{m.category || "Featured product"}</p>
                <h3 className="text-[1.75rem] font-semibold leading-tight">{m.name}</h3>
                {m.tagline && <p className="mt-3 font-medium leading-relaxed text-ink">{m.tagline}</p>}
                {m.description && <p className="mt-2 line-clamp-4 leading-relaxed text-slate-soft">{m.description}</p>}
                {points.length > 0 && (
                  <ul className="mt-6 space-y-2.5">
                    {points.map((p) => (
                      <li key={p} className="flex gap-3 text-[14.5px]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {href &&
                  (external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {label} <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link href={href} className={linkCls}>
                      {label} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
              </div>
            </article>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose product">
            {items.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to ${m.name}`}
                onClick={() => goTo(i)}
                className={`h-1.5 transition-all duration-300 ${i === active ? "w-8 bg-brand-600" : "w-4 bg-line hover:bg-slate-400"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] tracking-wider text-slate-soft">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous product" className="flex h-11 w-11 items-center justify-center border border-line bg-white text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">←</button>
            <button type="button" onClick={() => goTo(active + 1)} aria-label="Next product" className="flex h-11 w-11 items-center justify-center border border-line bg-white text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">→</button>
          </div>
        </div>
      )}
    </div>
  );
}