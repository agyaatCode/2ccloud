"use client";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, delay = 0, y = 18, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Clip-path image reveal: the frame opens left→right while the image settles. */
export function ClipReveal({ children, className, from = "left" }: { children: ReactNode; className?: string; from?: "left" | "bottom" }) {
  const reduce = useReducedMotion();
  const start = from === "left" ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)";
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: start }}
      whileInView={{ clipPath: "inset(0 0% 0% 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(value.trim());
  const target = m ? parseFloat(m[1]) : null;
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;
  const [n, setN] = useState(reduce || target === null ? target ?? 0 : 0);
  useEffect(() => {
    if (!inView || target === null || reduce) return;
    const c = animate(0, target, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, target, reduce]);
  if (target === null) return <span ref={ref} className={className}>{value}</span>;
  return (
    <span ref={ref} className={className} aria-label={value}>
      {n.toFixed(decimals)}
      {m![2]}
    </span>
  );
}

/** Pauses CSS/SMIL animations inside when scrolled off-screen. */
export function PauseOffscreen({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.dataset.paused = e.isIntersecting ? "false" : "true";
      el.querySelectorAll("svg").forEach((s) => {
        const svg = s as SVGSVGElement;
        if (typeof svg.pauseAnimations === "function") e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations();
      });
    }, { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
