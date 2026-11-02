// /**
//  * FILE: src/components/home/WhoWeAreView.tsx
//  * TYPE: Client Component
//  * INCLUDES: "Who We Are" split section - text on one side, image on the other
//  *           (side, shape and focus are admin-controlled), count-up stats,
//  *           floating badge, scroll reveal.
//  * NOTE: Layout uses scoped CSS (ww-*) so it never depends on Tailwind theme tokens.
//  */
// "use client";

// import Link from "next/link";
// import { useEffect, useRef, useState, type CSSProperties } from "react";
// import { Reveal } from "@/components/motion";
// import { ASPECT_RATIO } from "@/lib/home-media";
// import type { WhoWeAreData } from "@/lib/home-extras";

// const CSS = `
// .ww{position:relative;overflow:hidden;isolation:isolate;background:#fff;padding:72px 0}
// .ww-orb{position:absolute;z-index:-1;border-radius:9999px;filter:blur(70px);pointer-events:none}
// .ww-wrap{position:relative;max-width:80rem;margin:0 auto;padding:0 20px;display:grid;gap:56px;align-items:center}
// .ww-wrap.is-solo{max-width:56rem}
// @media(min-width:640px){.ww-wrap{padding:0 32px}}
// @media(min-width:1024px){
//   .ww{padding:112px 0}
//   .ww-wrap{grid-template-columns:1fr 1fr;gap:88px}
//   .ww-wrap.is-solo{grid-template-columns:1fr}
// }
// .ww-ps{margin-top:6px}
// .ww-p{margin:18px 0 0;color:#475569;font-size:16.5px;line-height:1.8}
// .ww-p:first-child{font-size:18px;color:#1e293b}
// .ww-hl{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px 24px}
// @media(min-width:640px){.ww-hl{grid-template-columns:1fr 1fr}}
// .ww-hl li{display:flex;align-items:flex-start;gap:12px;font-size:15px;font-weight:600;color:#0f172a;line-height:1.5}
// .ww-tick{flex:0 0 auto;width:24px;height:24px;margin-top:1px;border-radius:9999px;background:linear-gradient(135deg,#1f73c8,#0a1f44);color:#fff;display:flex;align-items:center;justify-content:center}
// .ww-stats{margin-top:36px;padding-top:28px;border-top:1px solid #e2e8f0;display:grid;grid-template-columns:repeat(2,1fr);gap:22px 12px}
// @media(min-width:640px){.ww-stats{grid-template-columns:repeat(var(--n),1fr)}}
// .ww-stat b{display:block;font-size:clamp(28px,4vw,38px);line-height:1;font-weight:700;color:#0a1f44;letter-spacing:-.01em}
// .ww-stat span{display:block;margin-top:8px;font-size:13px;line-height:1.4;color:#64748b}
// .ww-cta{margin-top:36px}

// .ww-media{position:relative;padding:0 22px 22px 0}
// .ww-media.is-left{padding:0 0 22px 22px}
// .ww-frame{position:absolute;right:0;bottom:0;width:80%;height:80%;border-radius:32px;border:2px solid rgba(255,153,0,.6);background:linear-gradient(135deg,rgba(255,153,0,.16),rgba(31,115,200,.16))}
// .ww-media.is-left .ww-frame{right:auto;left:0}
// .ww-dots{position:absolute;top:-18px;left:-18px;width:120px;height:120px;opacity:.38;background-image:radial-gradient(#1f73c8 1.6px,transparent 1.9px);background-size:16px 16px}
// .ww-media.is-left .ww-dots{left:auto;right:-18px}
// .ww-img{position:relative;aspect-ratio:4/5;border-radius:28px;overflow:hidden;background:#e2e8f0;box-shadow:0 36px 70px -30px rgba(10,31,68,.55)}
// .ww-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.3s cubic-bezier(.2,.7,.2,1)}
// .ww-media:hover .ww-img img{transform:scale(1.06)}
// .ww-img::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(10,31,68,.34),transparent 45%)}
// .ww-badge{position:absolute;left:14px;bottom:48px;z-index:2;display:flex;align-items:center;gap:12px;padding:14px 20px 14px 16px;border-radius:18px;background:#fff;box-shadow:0 22px 44px -18px rgba(10,31,68,.5);animation:wwFloat 5s ease-in-out infinite}
// .ww-media.is-left .ww-badge{left:auto;right:14px}
// @media(min-width:1024px){
//   .ww-badge{left:-26px}
//   .ww-media.is-left .ww-badge{left:auto;right:-26px}
// }
// .ww-badge i{flex:0 0 auto;width:12px;height:12px;border-radius:9999px;background:#ff9900;box-shadow:0 0 0 6px rgba(255,153,0,.22)}
// .ww-badge span{font-size:14px;font-weight:700;line-height:1.3;color:#0a1f44;max-width:11rem}
// @keyframes wwFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
// @media(prefers-reduced-motion:reduce){.ww-badge{animation:none}}
// `;

// const isExternal = (u: string) => /^https?:\/\//i.test(u);

// /** Animated number: counts up when it scrolls into view. Non-numeric values are shown as-is. */
// function CountUp({ value }: { value: string }) {
//   const ref = useRef<HTMLElement>(null);
//   const [n, setN] = useState<number | null>(null);

//   useEffect(() => {
//     const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
//     const el = ref.current;
//     if (!m || !el) return;
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

//     const target = parseFloat(m[2]);
//     let raf = 0;
//     const io = new IntersectionObserver(
//       ([entry]) => {
//         if (!entry.isIntersecting) return;
//         io.disconnect();
//         const t0 = performance.now();
//         const dur = 1400;
//         const tick = (now: number) => {
//           const p = Math.min(1, (now - t0) / dur);
//           setN(target * (1 - Math.pow(1 - p, 3))); // ease-out
//           if (p < 1) raf = requestAnimationFrame(tick);
//         };
//         raf = requestAnimationFrame(tick);
//       },
//       { threshold: 0.4 },
//     );
//     io.observe(el);
//     return () => {
//       io.disconnect();
//       cancelAnimationFrame(raf);
//     };
//   }, [value]);

//   const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
//   if (!m) return <b ref={ref}>{value}</b>;
//   const dec = (m[2].split(".")[1] ?? "").length;
//   const shown = (n ?? parseFloat(m[2])).toFixed(dec);
//   return (
//     <b ref={ref}>
//       {m[1]}
//       {shown}
//       {m[3]}
//     </b>
//   );
// }

// export function WhoWeAreView({ data }: { data: WhoWeAreData }) {
//   const [imgOk, setImgOk] = useState(true);
//   const hasImg = !!data.imageUrl && imgOk;
//   const left = hasImg && data.imageSide === "left";

//   const text = (
//     <Reveal>
//       <p className="eyebrow mb-3">{data.eyebrow}</p>
//       <h2 className="h-section text-balance">{data.title}</h2>

//       {data.paragraphs.length > 0 && (
//         <div className="ww-ps">
//           {data.paragraphs.map((p, i) => (
//             <p key={i} className="ww-p">
//               {p}
//             </p>
//           ))}
//         </div>
//       )}

//       {data.highlights.length > 0 && (
//         <ul className="ww-hl">
//           {data.highlights.map((h) => (
//             <li key={h}>
//               <span className="ww-tick" aria-hidden="true">
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                   <path d="M2.5 6.2l2.4 2.4L9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </span>
//               {h}
//             </li>
//           ))}
//         </ul>
//       )}

//       {data.stats.length > 0 && (
//         <div className="ww-stats" style={{ "--n": data.stats.length } as CSSProperties}>
//           {data.stats.map((s) => (
//             <div key={s.label} className="ww-stat">
//               <CountUp value={s.value} />
//               <span>{s.label}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {data.buttonText && data.buttonUrl && (
//         <div className="ww-cta">
//           {isExternal(data.buttonUrl) ? (
//             <a href={data.buttonUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
//               {data.buttonText} <span className="arrow" aria-hidden="true">→</span>
//             </a>
//           ) : (
//             <Link href={data.buttonUrl} className="btn btn-primary">
//               {data.buttonText} <span className="arrow" aria-hidden="true">→</span>
//             </Link>
//           )}
//         </div>
//       )}
//     </Reveal>
//   );

//   const media = hasImg ? (
//     <Reveal delay={0.12}>
//       <div className={`ww-media${left ? " is-left" : ""}`}>
//         <span className="ww-frame" aria-hidden="true" />
//         <span className="ww-dots" aria-hidden="true" />
//         {/* shape comes from the admin (portrait / landscape / square) */}
//         <div className="ww-img" style={{ aspectRatio: ASPECT_RATIO[data.imageAspect] ?? ASPECT_RATIO.portrait }}>
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={data.imageUrl} alt={data.title} loading="lazy" onError={() => setImgOk(false)} style={{ objectPosition: data.imageFocus }} />
//         </div>
//         {data.badgeText && (
//           <div className="ww-badge">
//             <i aria-hidden="true" />
//             <span>{data.badgeText}</span>
//           </div>
//         )}
//       </div>
//     </Reveal>
//   ) : null;

//   return (
//     <section className="ww" id="who-we-are" aria-label={data.eyebrow}>
//       <style>{CSS}</style>
//       <span className="ww-orb" style={{ left: -120, top: 40, width: 320, height: 320, background: "rgba(127,178,230,.28)" }} aria-hidden="true" />
//       <span className="ww-orb" style={{ right: -120, bottom: 20, width: 320, height: 320, background: "rgba(255,153,0,.12)" }} aria-hidden="true" />

//       <div className={`ww-wrap${hasImg ? "" : " is-solo"}`}>
//         {left ? (
//           <>
//             {media}
//             {text}
//           </>
//         ) : (
//           <>
//             {text}
//             {media}
//           </>
//         )}
//       </div>
//     </section>
//   );
// }





// new code 



/**
 * FILE: src/components/home/WhoWeAreView.tsx
 * TYPE: Client Component
 * INCLUDES: "Who We Are" split section - text on one side, image on the other
 *           (side, shape and focus are admin-controlled), count-up stats,
 *           floating badge, scroll reveal.
 * PERFORMANCE: no blur filters, no image hover-zoom, async image decoding,
 *              and the browser skips rendering the section until it is near the screen.
 * NOTE: Layout uses scoped CSS (ww-*) so it never depends on Tailwind theme tokens.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion";
import { ASPECT_RATIO } from "@/lib/home-media";
import type { WhoWeAreData } from "@/lib/home-extras";

const CSS = `
.ww{position:relative;overflow:hidden;isolation:isolate;background:#fff;padding:72px 0;content-visibility:auto;contain-intrinsic-size:auto 760px}
/* soft glows made with gradients (no blur filter, so they are cheap to paint) */
.ww-orb{position:absolute;z-index:-1;border-radius:9999px;pointer-events:none}
.ww-wrap{position:relative;max-width:80rem;margin:0 auto;padding:0 20px;display:grid;gap:56px;align-items:center}
.ww-wrap.is-solo{max-width:56rem}
@media(min-width:640px){.ww-wrap{padding:0 32px}}
@media(min-width:1024px){
  .ww{padding:112px 0}
  .ww-wrap{grid-template-columns:1fr 1fr;gap:88px}
  .ww-wrap.is-solo{grid-template-columns:1fr}
}
.ww-ps{margin-top:6px}
.ww-p{margin:18px 0 0;color:#475569;font-size:16.5px;line-height:1.8}
.ww-p:first-child{font-size:18px;color:#1e293b}
.ww-hl{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px 24px}
@media(min-width:640px){.ww-hl{grid-template-columns:1fr 1fr}}
.ww-hl li{display:flex;align-items:flex-start;gap:12px;font-size:15px;font-weight:600;color:#0f172a;line-height:1.5}
.ww-tick{flex:0 0 auto;width:24px;height:24px;margin-top:1px;border-radius:9999px;background:linear-gradient(135deg,#1f73c8,#0a1f44);color:#fff;display:flex;align-items:center;justify-content:center}
.ww-stats{margin-top:36px;padding-top:28px;border-top:1px solid #e2e8f0;display:grid;grid-template-columns:repeat(2,1fr);gap:22px 12px}
@media(min-width:640px){.ww-stats{grid-template-columns:repeat(var(--n),1fr)}}
.ww-stat b{display:block;font-size:clamp(28px,4vw,38px);line-height:1;font-weight:700;color:#0a1f44;letter-spacing:-.01em}
.ww-stat span{display:block;margin-top:8px;font-size:13px;line-height:1.4;color:#64748b}
.ww-cta{margin-top:36px}

.ww-media{position:relative;padding:0 22px 22px 0}
.ww-media.is-left{padding:0 0 22px 22px}

.ww-media.is-left .ww-frame{right:auto;left:0}
.ww-dots{position:absolute;top:-18px;left:-18px;width:120px;height:120px;opacity:.38;background-image:radial-gradient(#1f73c8 1.6px,transparent 1.9px);background-size:16px 16px}
.ww-media.is-left .ww-dots{left:auto;right:-18px}
.ww-img{position:relative;aspect-ratio:4/5;border-radius:28px;overflow:hidden;background:#e2e8f0;box-shadow:0 24px 48px -28px rgba(10,31,68,.5)}
.ww-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ww-img::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(10,31,68,.3),transparent 45%)}
.ww-badge{position:absolute;left:14px;bottom:48px;z-index:2;display:flex;align-items:center;gap:12px;padding:14px 20px 14px 16px;border-radius:18px;background:#fff;box-shadow:0 14px 30px -16px rgba(10,31,68,.5);animation:wwFloat 5s ease-in-out infinite}
.ww-media.is-left .ww-badge{left:auto;right:14px}
@media(min-width:1024px){
  .ww-badge{left:-26px}
  .ww-media.is-left .ww-badge{left:auto;right:-26px}
}
.ww-badge i{flex:0 0 auto;width:12px;height:12px;border-radius:9999px;background:#ff9900;box-shadow:0 0 0 6px rgba(255,153,0,.22)}
.ww-badge span{font-size:14px;font-weight:700;line-height:1.3;color:#0a1f44;max-width:11rem}
@keyframes wwFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media(prefers-reduced-motion:reduce){.ww-badge{animation:none}}
`;

const isExternal = (u: string) => /^https?:\/\//i.test(u);

/** Animated number: counts up when it scrolls into view. Non-numeric values are shown as-is. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    const el = ref.current;
    if (!m || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = parseFloat(m[2]);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          setN(target * (1 - Math.pow(1 - p, 3))); // ease-out
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return <b ref={ref}>{value}</b>;
  const dec = (m[2].split(".")[1] ?? "").length;
  const shown = (n ?? parseFloat(m[2])).toFixed(dec);
  return (
    <b ref={ref}>
      {m[1]}
      {shown}
      {m[3]}
    </b>
  );
}

export function WhoWeAreView({ data }: { data: WhoWeAreData }) {
  const [imgOk, setImgOk] = useState(true);
  const hasImg = !!data.imageUrl && imgOk;
  const left = hasImg && data.imageSide === "left";

  const text = (
    <Reveal>
      <p className="eyebrow mb-3">{data.eyebrow}</p>
      <h2 className="h-section text-balance">{data.title}</h2>

      {data.paragraphs.length > 0 && (
        <div className="ww-ps">
          {data.paragraphs.map((p, i) => (
            <p key={i} className="ww-p">
              {p}
            </p>
          ))}
        </div>
      )}

      {data.highlights.length > 0 && (
        <ul className="ww-hl">
          {data.highlights.map((h) => (
            <li key={h}>
              <span className="ww-tick" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2l2.4 2.4L9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}

      {data.stats.length > 0 && (
        <div className="ww-stats" style={{ "--n": data.stats.length } as CSSProperties}>
          {data.stats.map((s) => (
            <div key={s.label} className="ww-stat">
              <CountUp value={s.value} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {data.buttonText && data.buttonUrl && (
        <div className="ww-cta">
          {isExternal(data.buttonUrl) ? (
            <a href={data.buttonUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              {data.buttonText} <span className="arrow" aria-hidden="true">→</span>
            </a>
          ) : (
            <Link href={data.buttonUrl} className="btn btn-primary">
              {data.buttonText} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
    </Reveal>
  );

  const media = hasImg ? (
    <Reveal delay={0.12}>
      <div className={`ww-media${left ? " is-left" : ""}`}>
        <span className="ww-frame" aria-hidden="true" />
        <span className="ww-dots" aria-hidden="true" />
        {/* shape comes from the admin (portrait / landscape / square) */}
        <div className="ww-img" style={{ aspectRatio: ASPECT_RATIO[data.imageAspect] ?? ASPECT_RATIO.portrait }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.imageUrl} alt={data.title} loading="lazy" decoding="async" onError={() => setImgOk(false)} style={{ objectPosition: data.imageFocus }} />
        </div>
        {data.badgeText && (
          <div className="ww-badge">
            <i aria-hidden="true" />
            <span>{data.badgeText}</span>
          </div>
        )}
      </div>
    </Reveal>
  ) : null;

  return (
    <section className="ww" id="who-we-are" aria-label={data.eyebrow}>
      <style>{CSS}</style>
      <span
        className="ww-orb"
        style={{ left: -160, top: 20, width: 480, height: 480, background: "radial-gradient(closest-side, rgba(127,178,230,.28), rgba(127,178,230,0))" }}
        aria-hidden="true"
      />
      <span
        className="ww-orb"
        style={{ right: -160, bottom: 0, width: 480, height: 480, background: "radial-gradient(closest-side, rgba(255,153,0,.12), rgba(255,153,0,0))" }}
        aria-hidden="true"
      />

      <div className={`ww-wrap${hasImg ? "" : " is-solo"}`}>
        {left ? (
          <>
            {media}
            {text}
          </>
        ) : (
          <>
            {text}
            {media}
          </>
        )}
      </div>
    </section>
  );
}