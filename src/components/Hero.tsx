// "use client";
// import Link from "next/link";
// import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import type { Hero as HeroData } from "@/lib/data";
// import { SmartImage } from "@/components/SmartImage";
// import { rgba } from "@/lib/util";

// export type Crumb = { name: string; href?: string };

// function overlayCss(h: HeroData) {
//   const c = h.overlayColor;
//   const o = Math.max(0, Math.min(100, h.overlayOpacity)) / 100;
//   if (h.align === "center") return `linear-gradient(180deg, ${rgba(c, o * 0.82)} 0%, ${rgba(c, o * 0.7)} 55%, ${rgba(c, o * 0.92)} 100%)`;
//   const dir = h.align === "right" ? 270 : 90;
//   return `linear-gradient(${dir}deg, ${rgba(c, o)} 0%, ${rgba(c, o * 0.82)} 42%, ${rgba(c, o * 0.26)} 100%)`;
// }

// function HeroVideo({ src, poster }: { src: string; poster: string }) {
//   const ref = useRef<HTMLVideoElement>(null);
//   const [enabled, setEnabled] = useState(false);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const desktop = window.matchMedia("(min-width: 768px)").matches;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;
//     if (!desktop || reduce || saveData) return; // mobile / reduced motion / data saver → poster image only
//     const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
//     const start = () => setEnabled(true);
//     if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
//     else setTimeout(start, 1200);
//   }, []);

//   useEffect(() => {
//     const v = ref.current;
//     if (!enabled || !v) return;
//     const io = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting) v.play().catch(() => {});
//       else v.pause();
//     });
//     io.observe(v);
//     return () => io.disconnect();
//   }, [enabled]);

//   if (!enabled) return null;
//   return (
//     <video
//       ref={ref}
//       className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
//       style={{ objectPosition: "center" }}
//       src={src}
//       poster={poster || undefined}
//       autoPlay
//       muted
//       loop
//       playsInline
//       preload="metadata"
//       onCanPlay={() => setReady(true)}
//       onError={() => setEnabled(false)}
//       aria-hidden="true"
//       tabIndex={-1}
//     />
//   );
// }

// export function Hero({ hero, crumbs, trust, priority = true }: { hero: HeroData; crumbs?: Crumb[]; trust?: string[]; priority?: boolean }) {
//   const ref = useRef<HTMLElement>(null);
//   const reduce = useReducedMotion();
//   const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
//   const animate = hero.animate && !reduce;
//   const still = hero.type === "video" ? hero.posterUrl || hero.imageUrl : hero.imageUrl;
//   const alignCls = hero.align === "center" ? "items-center text-center" : hero.align === "right" ? "items-end text-right" : "items-start text-left";
//   const h = Math.max(440, Math.min(780, hero.height));

//   const fade = (i: number) =>
//     animate ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const } } : {};

//   return (
//     <section
//       ref={ref}
//       className="on-dark relative isolate flex overflow-hidden bg-navy-950 text-white min-h-[500px] sm:min-h-[calc(var(--hh)*0.88)] lg:min-h-(--hh)"
//       style={{ "--hh": `${h}px`, "--pos-d": hero.posDesktop, "--pos-m": hero.posMobile } as React.CSSProperties}
//       aria-label={hero.title}
//     >
//       {/* media layer */}
//       <motion.div className="absolute inset-x-0 -inset-y-[8%] -z-20" style={{ y: hero.parallax && !reduce ? y : 0 }}>
//         <div className={`absolute inset-0 ${animate ? "hero-kenburns" : ""}`}>
//           {hero.mobileImageUrl && (
//             <div className="absolute inset-0 md:hidden">
//               <SmartImage src={hero.mobileImageUrl} alt="" priority={priority} sizes="100vw" style={{ objectPosition: "var(--pos-m)" }} />
//             </div>
//           )}
//           <div className={`absolute inset-0 ${hero.mobileImageUrl ? "hidden md:block" : ""}`}>
//             <SmartImage src={still} alt="" priority={priority} sizes="100vw" className="hero-img" />
//           </div>
//           {hero.type === "video" && hero.videoUrl && <HeroVideo src={hero.videoUrl} poster={still} />}
//         </div>
//       </motion.div>

//       {/* brand-colour overlays */}
//       <div className="absolute inset-0 -z-10" style={{ background: overlayCss(hero) }} aria-hidden="true" />
//       <div className="absolute inset-0 -z-10 md:hidden" style={{ background: rgba(hero.overlayColor, (hero.overlayOpacity / 100) * 0.5) }} aria-hidden="true" />
//       <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3" style={{ background: `linear-gradient(0deg, ${rgba(hero.overlayColor, 0.65)}, transparent)` }} aria-hidden="true" />
//       {animate && <div className="hero-scan pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-40 bg-linear-to-b from-transparent via-brand-300/10 to-transparent md:block" aria-hidden="true" />}

//       <div className="mx-auto flex w-full max-w-7xl px-5 sm:px-8">
//         <div className={`flex w-full flex-col justify-center py-14 pb-20 sm:py-20 sm:pb-24 ${alignCls}`}>
//           <div className={`max-w-2xl ${hero.align === "center" ? "mx-auto" : ""}`}>
//             {hero.eyebrow && (
//               <motion.p {...fade(0)} className="eyebrow mb-4 flex items-center gap-3">
//                 <span className="h-px w-8 bg-brand-400" aria-hidden="true" />
//                 {hero.eyebrow}
//               </motion.p>
//             )}
//             <motion.h1 {...fade(1)} className="text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] text-balance">
//               {hero.title}
//             </motion.h1>
//             {hero.description && (
//               <motion.p {...fade(2)} className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/85">
//                 {hero.description}
//               </motion.p>
//             )}
//             {(hero.primaryText || hero.secondaryText) && (
//               <motion.div {...fade(3)} className={`mt-8 flex flex-wrap gap-3 ${hero.align === "center" ? "justify-center" : hero.align === "right" ? "justify-end" : ""}`}>
//                 {hero.primaryText && (
//                   <Link href={hero.primaryUrl || "/contact"} className="btn btn-primary">
//                     {hero.primaryText}
//                     <span className="arrow" aria-hidden="true">→</span>
//                   </Link>
//                 )}
//                 {hero.secondaryText && (
//                   <Link href={hero.secondaryUrl || "/contact"} className="btn btn-ghost-light">
//                     {hero.secondaryText}
//                   </Link>
//                 )}
//               </motion.div>
//             )}
//             {trust && trust.length > 0 && (
//               <motion.ul {...fade(4)} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-white/80">
//                 {trust.map((t) => (
//                   <li key={t} className="flex items-center gap-2">
//                     <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
//                     {t}
//                   </li>
//                 ))}
//               </motion.ul>
//             )}
//           </div>
//         </div>
//       </div>

//       {crumbs && crumbs.length > 0 && (
//         <nav aria-label="Breadcrumb" className="absolute inset-x-0 bottom-0">
//           <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 px-5 pb-4 text-[12px] text-white/70 sm:px-8">
//             {crumbs.map((c, i) => (
//               <li key={c.name} className="flex items-center gap-2">
//                 {i > 0 && <span aria-hidden="true" className="text-white/40">/</span>}
//                 {c.href && i < crumbs.length - 1 ? (
//                   <Link href={c.href} className="hover:text-white hover:underline">{c.name}</Link>
//                 ) : (
//                   <span aria-current={i === crumbs.length - 1 ? "page" : undefined} className="text-white/90">{c.name}</span>
//                 )}
//               </li>
//             ))}
//           </ol>
//         </nav>
//       )}
//     </section>
//   );
// }



// new new code 



"use client";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Hero as HeroData } from "@/lib/data";
import { SmartImage } from "@/components/SmartImage";
import { rgba } from "@/lib/util";

export type Crumb = { name: string; href?: string };

/* ---------- Video behaviour settings ---------- */
// Set to false if you want mobile users to see only the image
const ENABLE_ON_MOBILE = true;
// Set to true to skip video for users with "reduce motion" enabled in their OS
const RESPECT_REDUCED_MOTION = false;
// Set to true to skip video when Data Saver is on
const RESPECT_SAVE_DATA = false;
// Max overlay opacity (0-100) when a video is playing. Lower = brighter video.
const VIDEO_OVERLAY_MAX = 55;

type Dbg = Record<string, string | number | boolean | undefined>;
type DebugFn = (patch: Dbg) => void;

function overlayCss(h: HeroData, opacity: number) {
  const c = h.overlayColor;
  const o = Math.max(0, Math.min(100, opacity)) / 100;
  if (h.align === "center") return `linear-gradient(180deg, ${rgba(c, o * 0.82)} 0%, ${rgba(c, o * 0.7)} 55%, ${rgba(c, o * 0.92)} 100%)`;
  const dir = h.align === "right" ? 270 : 90;
  return `linear-gradient(${dir}deg, ${rgba(c, o)} 0%, ${rgba(c, o * 0.7)} 42%, ${rgba(c, o * 0.12)} 100%)`;
}

// Normalise the URL coming from the admin panel
function normalizeVideoUrl(raw: string) {
  let u = (raw || "").trim();
  if (!u) return "";
  if (!/^(https?:)?\/\//i.test(u) && !u.startsWith("/") && !u.startsWith("blob:") && !u.startsWith("data:")) u = "/" + u;
  return u.replace(/ /g, "%20");
}

function HeroVideo({ src, poster, onDebug }: { src: string; poster?: string; onDebug: DebugFn }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(true);
  const [ready, setReady] = useState(false);

  // Decide on the client whether the video is allowed to play
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (!ENABLE_ON_MOBILE && !isDesktop) {
      setAllowed(false);
      return onDebug({ skipped: "mobile disabled" });
    }
    if (RESPECT_REDUCED_MOTION && reduce) {
      setAllowed(false);
      return onDebug({ skipped: "reduced motion" });
    }
    if (RESPECT_SAVE_DATA && saveData) {
      setAllowed(false);
      return onDebug({ skipped: "data saver" });
    }
  }, [onDebug]);

  const tryPlay = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    // React does not reliably set the muted attribute, and browsers block autoplay
    // unless the video is muted, so we force it directly on the DOM node.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch((err: unknown) => onDebug({ playError: err instanceof Error ? err.name : String(err) }));
    }
  }, [onDebug]);

  // Play when visible, pause when off-screen
  useEffect(() => {
    const v = ref.current;
    if (!allowed || !v) return;

    // If the video was already loaded before React attached the listeners
    if (v.readyState >= 2) setReady(true);
    tryPlay();

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) tryPlay();
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(v);

    const onVis = () => {
      if (document.visibilityState === "visible") {
        const r = v.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Some browsers (iOS Low Power Mode) need a user gesture before autoplay
    const onGesture = () => tryPlay();
    window.addEventListener("touchstart", onGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", onGesture, { once: true, passive: true });
    window.addEventListener("scroll", onGesture, { once: true, passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
  }, [allowed, tryPlay]);

  if (!allowed) return null;

  const show = () => {
    setReady(true);
    tryPlay();
  };

  return (
    <video
      key={src}
      ref={ref}
      src={src}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      style={{ objectPosition: "center" }}
      poster={poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      // Show the video on whichever event comes first
      onLoadedData={() => {
        onDebug({ loaded: true });
        show();
      }}
      onCanPlay={show}
      onPlaying={() => {
        setReady(true);
        onDebug({ playing: true });
      }}
      onError={(e) => {
        const err = (e.currentTarget as HTMLVideoElement).error;
        // 1 = aborted, 2 = network, 3 = decode, 4 = 404 / unsupported format
        onDebug({ videoErrorCode: err?.code, videoErrorMsg: err?.message || "no message" });
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export function Hero({ hero, crumbs, trust, priority = true }: { hero: HeroData; crumbs?: Crumb[]; trust?: string[]; priority?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const animate = hero.animate && !reduce;

  const videoSrc = normalizeVideoUrl(hero.videoUrl);
  const still = hero.type === "video" ? hero.posterUrl || hero.imageUrl : hero.imageUrl;
  // Play video if type is "video", or if there is no still image at all but a video exists
  const isVideo = !!videoSrc && (hero.type === "video" || !still);

  // Lighter overlay when a video is playing, so the video is actually visible
  const overlayOpacity = isVideo ? Math.min(hero.overlayOpacity, VIDEO_OVERLAY_MAX) : hero.overlayOpacity;

  const alignCls = hero.align === "center" ? "items-center text-center" : hero.align === "right" ? "items-end text-right" : "items-start text-left";
  const h = Math.max(440, Math.min(780, hero.height));

  /* ---------- Debug badge: open the page with ?herodebug=1 ---------- */
  const [debugOn, setDebugOn] = useState(false);
  const [dbg, setDbg] = useState<Dbg>({});
  useEffect(() => {
    setDebugOn(new URLSearchParams(window.location.search).has("herodebug"));
  }, []);
  const onDebug = useCallback<DebugFn>((patch) => setDbg((p) => ({ ...p, ...patch })), []);

  const fade = (i: number) =>
    animate ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const } } : {};

  return (
    <section
      ref={ref}
      className="on-dark relative isolate flex overflow-hidden bg-navy-950 text-white min-h-[500px] sm:min-h-[calc(var(--hh)*0.88)] lg:min-h-(--hh)"
      style={{ "--hh": `${h}px`, "--pos-d": hero.posDesktop, "--pos-m": hero.posMobile } as React.CSSProperties}
      aria-label={hero.title}
    >
      {/* media layer: image (with parallax / Ken Burns) */}
      {!isVideo && (
        <motion.div className="absolute inset-x-0 -inset-y-[8%] -z-20 will-change-transform" style={{ y: hero.parallax && !reduce ? y : 0 }}>
          <div className={`absolute inset-0 ${animate ? "hero-kenburns" : ""}`}>
            {hero.mobileImageUrl && (
              <div className="absolute inset-0 md:hidden">
                <SmartImage src={hero.mobileImageUrl} alt="" priority={priority} sizes="100vw" style={{ objectPosition: "var(--pos-m)" }} />
              </div>
            )}
            <div className={`absolute inset-0 ${hero.mobileImageUrl ? "hidden md:block" : ""}`}>
              {still ? <SmartImage src={still} alt="" priority={priority} sizes="100vw" className="hero-img" /> : null}
            </div>
          </div>
        </motion.div>
      )}

      {/* media layer: video (own layer, no Ken Burns, so playback stays smooth) */}
      {isVideo && (
        <div className="absolute inset-0 -z-20 overflow-hidden">
          {still ? (
            <div className="absolute inset-0">
              <SmartImage src={still} alt="" priority={priority} sizes="100vw" className="hero-img" />
            </div>
          ) : null}
          <HeroVideo src={videoSrc} poster={still || undefined} onDebug={onDebug} />
        </div>
      )}

      {/* brand-colour overlays */}
      <div className="absolute inset-0 -z-10" style={{ background: overlayCss(hero, overlayOpacity) }} aria-hidden="true" />
      <div className="absolute inset-0 -z-10 md:hidden" style={{ background: rgba(hero.overlayColor, (overlayOpacity / 100) * 0.4) }} aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3" style={{ background: `linear-gradient(0deg, ${rgba(hero.overlayColor, isVideo ? 0.5 : 0.65)}, transparent)` }} aria-hidden="true" />
      {animate && <div className="hero-scan pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-40 bg-linear-to-b from-transparent via-brand-300/10 to-transparent md:block" aria-hidden="true" />}

      <div className="mx-auto flex w-full max-w-7xl px-5 sm:px-8">
        <div className={`flex w-full flex-col justify-center py-14 pb-20 sm:py-20 sm:pb-24 ${alignCls}`}>
          <div className={`max-w-2xl ${hero.align === "center" ? "mx-auto" : ""}`}>
            {hero.eyebrow && (
              <motion.p {...fade(0)} className="eyebrow mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-brand-400" aria-hidden="true" />
                {hero.eyebrow}
              </motion.p>
            )}
            <motion.h1 {...fade(1)} className="text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.08] text-balance">
              {hero.title}
            </motion.h1>
            {hero.description && (
              <motion.p {...fade(2)} className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/85">
                {hero.description}
              </motion.p>
            )}
            {(hero.primaryText || hero.secondaryText) && (
              <motion.div {...fade(3)} className={`mt-8 flex flex-wrap gap-3 ${hero.align === "center" ? "justify-center" : hero.align === "right" ? "justify-end" : ""}`}>
                {hero.primaryText && (
                  <Link href={hero.primaryUrl || "/contact"} className="btn btn-primary">
                    {hero.primaryText}
                    <span className="arrow" aria-hidden="true">→</span>
                  </Link>
                )}
                {hero.secondaryText && (
                  <Link href={hero.secondaryUrl || "/contact"} className="btn btn-ghost-light">
                    {hero.secondaryText}
                  </Link>
                )}
              </motion.div>
            )}
            {trust && trust.length > 0 && (
              <motion.ul {...fade(4)} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-white/80">
                {trust.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </div>

      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="absolute inset-x-0 bottom-0">
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 px-5 pb-4 text-[12px] text-white/70 sm:px-8">
            {crumbs.map((c, i) => (
              <li key={c.name} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-white/40">/</span>}
                {c.href && i < crumbs.length - 1 ? (
                  <Link href={c.href} className="hover:text-white hover:underline">{c.name}</Link>
                ) : (
                  <span aria-current={i === crumbs.length - 1 ? "page" : undefined} className="text-white/90">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Debug badge (only with ?herodebug=1) */}
      {debugOn && (
        <pre className="fixed bottom-3 left-3 z-[9999] max-w-[90vw] overflow-auto rounded-md bg-black/90 p-3 text-[11px] leading-snug text-lime-300">
          {JSON.stringify(
            {
              "hero.type": hero.type,
              rawVideoUrl: hero.videoUrl || "(EMPTY)",
              finalVideoSrc: videoSrc || "(EMPTY)",
              still: still || "(EMPTY)",
              overlayOpacityAdmin: hero.overlayOpacity,
              overlayOpacityUsed: overlayOpacity,
              isVideo,
              ...dbg,
            },
            null,
            2
          )}
        </pre>
      )}
    </section>
  );
}