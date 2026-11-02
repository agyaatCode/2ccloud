"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/SmartImage";

const Scene = dynamic(() => import("@/components/Rack3DScene"), { ssr: false, loading: () => null });

/** 3D rack scene on capable desktops; static photographic fallback everywhere else. */
export function Rack3D({ fallback, alt }: { fallback: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ever, setEver] = useState(false);

  useEffect(() => {
    const big = window.matchMedia("(min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData;
    setCapable(big && !reduce && cores >= 4 && !saveData);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setEver(true);
    }, { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full min-h-[320px] w-full overflow-hidden bg-navy-950">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${capable ? "opacity-40" : "opacity-100"}`}>
        <SmartImage src={fallback} alt={capable ? "" : alt} sizes="(min-width:1024px) 55vw, 100vw" />
      </div>
      <div className="absolute inset-0 bg-linear-to-tr from-navy-950/85 via-navy-950/30 to-navy-900/40" aria-hidden="true" />
      {capable && ever && <div className="absolute inset-0"><Scene active={visible} /></div>}
    </div>
  );
}
