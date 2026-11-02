"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { SEARCH_HINTS, searchSite, type SearchResult } from "@/lib/search";

const TYPE_BADGE: Record<SearchResult["type"], string> = {
  Service: "bg-brand-600/10 text-brand-700",
  Page: "bg-slate-100 text-slate-600",
  Section: "bg-amber-100 text-amber-700",
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded-sm bg-amber-200 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

type Props = {
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

export function SiteSearch({ placeholder = "Search services, pages, topics…", autoFocus = false, onNavigate }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchSite(query, 8), [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onGlobalKey = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      input.current?.focus();
      setOpen(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onGlobalKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onGlobalKey);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => (results.length ? Math.min(a + 1, results.length - 1) : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      input.current?.blur();
    }
  };

  return (
    <div ref={root} className="relative w-full">
      <style>{`@keyframes ssIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>

      <form
        role="search"
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) go(results[0].href);
        }}
      >
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
          <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={input}
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search the site"
          aria-expanded={open}
          aria-controls="site-search-results"
          className="h-10 w-full rounded-md border border-transparent bg-white pl-9 pr-9 text-[14px] text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#ff9900] focus:ring-2 focus:ring-[#ff9900]/40"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
          /
        </span>
      </form>

      {open && (
        <div
          id="site-search-results"
          style={{ animation: "ssIn .15s ease-out" }}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_50px_-20px_rgba(10,31,68,0.45)]"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Quick links"}
            </span>
            <span className="hidden text-[11px] text-slate-400 sm:block">↑↓ navigate · ↵ open · esc close</span>
          </div>

          {query.trim() === "" ? (
            <div className="flex flex-wrap gap-2 px-4 py-3">
              {SEARCH_HINTS.map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => {
                    setQuery(hint);
                    input.current?.focus();
                  }}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[12.5px] font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  {hint}
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-5 text-[13.5px] text-slate-500">
              No results for “{query}”. Try “cloud”, “security”, “migration” or “contact”.
            </p>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={`${r.href}-${r.title}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === active ? "bg-brand-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TYPE_BADGE[r.type]}`}
                    >
                      {r.type}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-slate-900">
                        <Highlight text={r.title} query={query} />
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-slate-500">{r.desc}</span>
                    </span>
                    <span className="mt-0.5 hidden max-w-[120px] truncate text-right text-[11px] text-slate-400 sm:block">
                      {r.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
