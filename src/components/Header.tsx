
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, type NavItem } from "@/lib/content";
import { SiteSearch } from "@/components/SiteSearch";

type Props = {
  logo: string;
  mobileLogo: string;
  alt: string;
  ctaText: string;
  ctaUrl: string;
  userName: string | null;
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
    <path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Header({ logo, mobileLogo, alt, ctaText, ctaUrl, userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [acc, setAcc] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const schedule = () => {
    cancel();
    timer.current = setTimeout(() => setOpen(null), 160);
  };
  const show = (i: number) => {
    cancel();
    setOpen(i);
  };
  const closeAll = useCallback(() => {
    setOpen(null);
    setMobile(false);
    setMobileSearch(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const isActive = (n: NavItem) =>
    n.href === "/"
      ? pathname === "/"
      : n.columns
        ? n.columns.some((c) => c.links.some((l) => pathname === l.href || pathname.startsWith(l.href + "/")))
        : pathname.startsWith(n.href);

  const openItem = open !== null ? NAV[open] : null;

  const navLinkBase = (active: boolean) =>
    `relative flex h-10 items-center gap-1.5 rounded-md px-3 text-[14px] font-medium transition-colors ${
      active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-slate-100 hover:text-brand-600"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_28px_-18px_rgba(10,31,68,0.35)]" : ""
      }`}
      onMouseLeave={schedule}
    >
      <style>{`@keyframes megaIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

      {/* ===== top bar ===== */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Home">
          <picture>
            <source media="(max-width: 1023px)" srcSet={mobileLogo} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={alt} height={40} className="h-10 w-auto max-w-[170px] object-contain" />
          </picture>
        </Link>

        {/* ===== primary nav ===== */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n, i) => {
              const active = isActive(n);
              return (
                <li key={n.label} onMouseEnter={() => (n.columns ? show(i) : (cancel(), setOpen(null)))}>
                  {n.columns ? (
                    <button
                      type="button"
                      className={navLinkBase(active)}
                      aria-expanded={open === i}
                      aria-haspopup="true"
                      aria-controls={`mega-${i}`}
                      onClick={() => (open === i ? setOpen(null) : show(i))}
                    >
                      {n.label}
                      <Chevron open={open === i} />
                    </button>
                  ) : (
                    <Link href={n.href} className={navLinkBase(active)} aria-current={active ? "page" : undefined}>
                      {n.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ===== search ===== */}
        <div className="hidden min-w-0 flex-1 md:block lg:max-w-[380px]">
          <SiteSearch />
        </div>

        {/* ===== right cluster ===== */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {userName ? (
            <Link href="/dashboard" className="hidden h-10 items-center px-2 text-[14px] font-medium text-ink transition-colors hover:text-brand-600 lg:flex">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="hidden h-10 items-center px-2 text-[14px] font-medium text-ink transition-colors hover:text-brand-600 lg:flex">
              Sign in
            </Link>
          )}
         
          <Link
            href={userName ? "/dashboard" : "/register"}
            className="hidden h-10 items-center rounded-md bg-[#ff9900] px-4 text-[14px] font-semibold text-[#232f3e] shadow-sm transition-colors hover:bg-[#ec7211] hover:text-white sm:inline-flex"
          >
            {userName ? "Dashboard" : "Create Account"}
          </Link>

           <Link
            href={ctaUrl}
            className="hidden h-10 items-center rounded-md border border-line px-4 text-[14px] font-medium text-ink transition-colors hover:bg-slate-100 xl:inline-flex"
          >
            {ctaText}
          </Link>

          {/* mobile search toggle */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Search"
            aria-expanded={mobileSearch}
            onClick={() => {
              setMobileSearch((s) => !s);
              setMobile(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* hamburger */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-slate-100 lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => {
              setMobile((m) => !m);
              setMobileSearch(false);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {mobile ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ===== mobile search row ===== */}
      {mobileSearch && (
        <div className="border-t border-line bg-white px-4 py-3 md:hidden">
          <SiteSearch autoFocus onNavigate={() => setMobileSearch(false)} />
        </div>
      )}

      {/* ===== desktop mega menu ===== */}
      {openItem?.columns && (
        <div id={`mega-${open}`} className="absolute inset-x-0 top-full hidden px-4 lg:block" onMouseEnter={cancel}>
          <div
            style={{ animation: "megaIn .18s ease-out" }}
            className="mx-auto w-[min(1080px,100%)] overflow-hidden rounded-b-xl border border-t-0 border-line bg-white shadow-[0_32px_64px_-24px_rgba(10,31,68,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{openItem.label}</span>
              <Link
                href={openItem.href}
                onClick={closeAll}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
              >
                View all {openItem.label}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${openItem.columns.length}, minmax(0, 1fr)) 300px` }}
            >
              {openItem.columns.map((col) => (
                <div key={col.title} className="border-r border-slate-100 px-6 py-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{col.title}</p>
                  <ul className="space-y-0.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={closeAll}
                          className="group -mx-3 block rounded-md px-3 py-2.5 transition-colors hover:bg-brand-50"
                        >
                          <span className="flex items-center justify-between text-[14px] font-semibold text-slate-900 group-hover:text-brand-700">
                            {l.label}
                            <span
                              className="-translate-x-1 text-brand-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </span>
                          {l.desc && <span className="mt-0.5 block text-[12.5px] leading-snug text-slate-500">{l.desc}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* featured card */}
              <Link
                href={openItem.href}
                onClick={closeAll}
                className="group relative block min-h-[280px] overflow-hidden bg-navy-900"
              >
                {openItem.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={openItem.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                )}
                <span className="absolute inset-0 bg-linear-to-t from-navy-950/95 via-navy-950/55 to-navy-900/20" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="block font-display text-[15px] font-semibold leading-snug">{openItem.imageTitle}</span>
                  <span className="mt-1 block text-[12px] leading-snug text-white/75">{openItem.imageText}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#ff9900]">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== mobile nav ===== */}
      {mobile && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white lg:hidden">
          <nav aria-label="Mobile" className="px-4 pb-10 pt-2">
            <ul className="divide-y divide-line">
              {NAV.map((n, i) => (
                <li key={n.label}>
                  {n.columns ? (
                    <>
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-center justify-between text-left text-[16px] font-semibold text-ink"
                        aria-expanded={acc === i}
                        onClick={() => setAcc(acc === i ? null : i)}
                      >
                        {n.label}
                        <Chevron open={acc === i} />
                      </button>
                      {acc === i && (
                        <div className="pb-4">
                          {n.columns.map((c) => (
                            <div key={c.title} className="mb-3">
                              <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">{c.title}</p>
                              <ul>
                                {c.links.map((l) => (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href}
                                      className="flex min-h-11 items-center border-l-2 border-brand-100 pl-4 text-[15px] text-ink active:bg-brand-50"
                                      onClick={closeAll}
                                    >
                                      {l.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={n.href} className="flex min-h-14 items-center text-[16px] font-semibold text-ink" onClick={closeAll}>
                      {n.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link
                href={ctaUrl}
                className="inline-flex h-12 items-center justify-center rounded-md border border-line px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-slate-50"
                onClick={closeAll}
              >
                {ctaText}
              </Link>
              <Link
                href={userName ? "/dashboard" : "/register"}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#ff9900] px-4 text-[15px] font-semibold text-[#232f3e] transition-colors hover:bg-[#ec7211] hover:text-white"
                onClick={closeAll}
              >
                {userName ? "Dashboard" : "Create Account"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
