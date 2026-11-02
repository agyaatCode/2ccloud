"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "@/components/SmartImage";

export type Platform = { id: string; title: string; kicker: string; description: string; image: string; href: string; points: string[] };

export function PlatformTabs({ items }: { items: Platform[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const cur = items[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <div className="grid overflow-hidden border border-line bg-white lg:grid-cols-12">
      <div role="tablist" aria-label="Cloud platforms" aria-orientation="vertical" className="flex overflow-x-auto border-b border-line lg:col-span-3 lg:flex-col lg:border-b-0 lg:border-r">
        {items.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${p.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative flex min-h-14 shrink-0 items-center gap-3 px-5 py-4 text-left text-[15px] font-semibold transition-colors lg:border-b lg:border-line lg:last:border-b-0 ${
              active === i ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-mist"
            }`}
          >
            <span className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-brand-600 transition-transform duration-300 ${active === i ? "scale-y-100" : "scale-y-0"}`} aria-hidden="true" />
            <span className="font-mono text-[11px] text-slate-soft">0{i + 1}</span>
            {p.title}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${cur.id}`} aria-labelledby={`tab-${cur.id}`} className="grid lg:col-span-9 lg:grid-cols-2">
        <div className="relative min-h-[260px] overflow-hidden bg-navy-900">
          <AnimatePresence mode="popLayout">
            <motion.div key={cur.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <SmartImage src={cur.image} alt={`${cur.title} infrastructure`} sizes="(min-width:1024px) 38vw, 100vw" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 to-transparent" aria-hidden="true" />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-10">
          <p className="eyebrow mb-3">{cur.kicker}</p>
          <h3 className="text-2xl font-semibold">{cur.title}</h3>
          <p className="mt-3 leading-relaxed text-slate-soft">{cur.description}</p>
          <ul className="mt-6 space-y-2.5">
            {cur.points.map((p) => (
              <li key={p} className="flex gap-3 text-[14.5px]">
                <svg width="18" height="18" viewBox="0 0 18 18" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M4 9.5l3.2 3L14 5.5" fill="none" stroke="#1e9e5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {p}
              </li>
            ))}
          </ul>
          <Link href={cur.href} className="btn btn-outline mt-8 self-start">
            Explore {cur.title} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
