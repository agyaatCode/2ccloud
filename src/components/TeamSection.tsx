/**
 * FILE: src/components/TeamSection.tsx
 * TYPE: Client Component
 * INCLUDES: Stylish team grid with circular avatars, group pill tabs,
 *           and a polished "View profile" popup.
 * NOTE: Critical geometry (avatar size, circle shape, card radius) uses inline
 *       styles so it never depends on Tailwind theme tokens being defined.
 */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion";
import type { TeamGroupView, TeamMemberView } from "@/lib/team";

/* ------------------------------ helpers ------------------------------ */

// Only allow http(s) links so a bad value can never become a javascript: URL
const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : "");

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// First paragraph of the overview, used as a short teaser on the card
const teaser = (overview: string) => overview.split(/\n\s*\n/)[0]?.trim() ?? "";

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

/** Decorative dotted pattern used on banners (pure CSS, no image needed). */
const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1.4px)",
  backgroundSize: "14px 14px",
};

// Banner gradient written inline so it always renders
const BANNER_BG: CSSProperties = {
  background: "linear-gradient(135deg, #0a1f44 0%, #0b2a5c 55%, #0f5cab 100%)",
};

/* ------------------------------ avatar ------------------------------ */

/**
 * Circular profile photo with a white ring.
 * Size is set with inline styles (px) so the circle can never collapse.
 * Falls back to initials if there is no photo or the image fails to load.
 */
function Avatar({ m, size, ring = false }: { m: TeamMemberView; size: number; ring?: boolean }) {
  const [failed, setFailed] = useState(false);
  const showImg = !!m.photoUrl && !failed;

  return (
    <div
      className={`transition-all duration-500 ${ring ? "ring-2 ring-[#ff9900]" : "ring-2 ring-transparent group-hover:ring-[#ff9900]"}`}
      style={{
        padding: 6,
        borderRadius: 9999,
        background: "#fff",
        boxShadow: "0 10px 28px -10px rgba(10,31,68,0.45)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          minWidth: size,
          borderRadius: 9999,
          overflow: "hidden",
          background: "linear-gradient(135deg, #1f73c8, #0a1f44)",
        }}
      >
        {showImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.photoUrl}
            alt={m.name}
            loading="lazy"
            onError={() => setFailed(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
        ) : (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: size * 0.34,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            {initials(m.name)}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ member card ------------------------------ */

function MemberCard({ m, onOpen }: { m: TeamMemberView; onOpen: () => void }) {
  const linkedin = safeUrl(m.linkedinUrl);
  const short = teaser(m.overview);

  return (
    <article
      className="group relative flex h-full flex-col border border-line bg-white transition-all duration-500 hover:-translate-y-2 hover:border-brand-200"
      style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 2px 14px -6px rgba(10,31,68,0.2)" }}
    >
      {/* gradient banner */}
      <div className="relative overflow-hidden" style={{ height: 96, ...BANNER_BG }}>
        <div className="absolute inset-0" style={{ ...DOTS, opacity: 0.8 }} aria-hidden="true" />
        <span
          className="absolute rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"
          style={{ right: -32, top: -40, width: 128, height: 128, background: "rgba(255,153,0,0.28)" }}
          aria-hidden="true"
        />
        <span
          className="absolute rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150"
          style={{ left: -24, bottom: -48, width: 112, height: 112, background: "rgba(56,152,236,0.3)" }}
          aria-hidden="true"
        />
      </div>

      {/* circular photo overlapping the banner */}
      <div className="relative z-10 flex justify-center" style={{ marginTop: -64 }}>
        <Avatar m={m} size={124} />
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-center">
        <h4 className="font-display text-[18px] font-semibold leading-snug text-ink">{m.name}</h4>
        {m.designation && <p className="mt-1 text-[13.5px] font-semibold text-brand-600">{m.designation}</p>}

        {m.experience && (
          <p className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand-700">
            <span className="rounded-full bg-[#ff9900]" style={{ width: 6, height: 6 }} aria-hidden="true" />
            {m.experience}
          </p>
        )}

        {short && (
          <p
            className="mt-3 text-[13.5px] leading-relaxed text-slate-soft"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {short}
          </p>
        )}

        {/* actions */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={onOpen}
            className="group/btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy-900 px-4 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-brand-600"
            style={{ height: 44 }}
          >
            View profile
            <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${m.name} on LinkedIn`}
              className="flex shrink-0 items-center justify-center rounded-full border border-line text-[#0a66c2] transition-colors duration-300 hover:border-[#0a66c2] hover:bg-[#0a66c2] hover:text-white"
              style={{ width: 44, height: 44 }}
            >
              <LinkedInIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ profile popup ------------------------------ */

function ProfileModal({ m, onClose }: { m: TeamMemberView; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const linkedin = safeUrl(m.linkedinUrl);
  const paragraphs = m.overview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${m.name} profile`}
    >
      <style>{`@keyframes teamPop{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}`}</style>

      {/* backdrop */}
      <button type="button" aria-label="Close profile" className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full overflow-y-auto bg-white shadow-2xl"
        style={{ maxWidth: 560, maxHeight: "92vh", borderRadius: 28, animation: "teamPop .28s ease-out" }}
      >
        {/* header banner */}
        <div className="relative overflow-hidden" style={{ height: 120, ...BANNER_BG }}>
          <div className="absolute inset-0" style={{ ...DOTS, opacity: 0.8 }} aria-hidden="true" />
          <span
            className="absolute rounded-full blur-2xl"
            style={{ right: -40, top: -48, width: 160, height: 160, background: "rgba(255,153,0,0.28)" }}
            aria-hidden="true"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30"
            style={{ right: 12, top: 12, width: 36, height: 36 }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* circular photo */}
        <div className="relative z-10 flex justify-center" style={{ marginTop: -72 }}>
          <Avatar m={m} size={140} ring />
        </div>

        <div className="px-6 pb-8 pt-4 text-center sm:px-10">
          <h3 className="font-display text-[1.625rem] font-semibold leading-tight text-ink">{m.name}</h3>
          {m.designation && <p className="mt-1 text-[15px] font-semibold text-brand-600">{m.designation}</p>}
          {m.experience && (
            <p className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-[12.5px] font-semibold text-brand-700">
              <span className="rounded-full bg-[#ff9900]" style={{ width: 6, height: 6 }} aria-hidden="true" />
              {m.experience}
            </p>
          )}

          <div
            className="mx-auto my-6"
            style={{ height: 1, width: 64, background: "linear-gradient(to right, transparent, #7fb2e6, transparent)" }}
            aria-hidden="true"
          />

          <div className="space-y-3 text-left text-[15px] leading-relaxed text-slate-soft">
            {paragraphs.length ? (
              paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-center">Profile details will be added soon.</p>
            )}
          </div>

          {(linkedin || m.email) && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ height: 44 }}
                >
                  <LinkedInIcon />
                  Connect on LinkedIn
                </a>
              )}
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center rounded-full border border-line px-5 text-[14px] font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  style={{ height: 44 }}
                >
                  {m.email}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ main section ------------------------------ */

export function TeamSection({ groups }: { groups: TeamGroupView[] }) {
  const [active, setActive] = useState<number | "all">("all");
  const [selected, setSelected] = useState<TeamMemberView | null>(null);

  if (!groups.length) return null;
  const shown = active === "all" ? groups : groups.filter((g) => g.id === active);
  const totalMembers = groups.reduce((n, g) => n + g.members.length, 0);

  const tab = (on: boolean) =>
    `inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-all duration-300 ${
      on ? "bg-navy-900 text-white shadow-md" : "text-ink hover:bg-white hover:text-brand-700"
    }`;
  const count = (on: boolean) =>
    `rounded-full px-2 py-0.5 text-[11px] font-bold ${on ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"}`;

  return (
    <section className="relative isolate overflow-hidden bg-mist py-16 lg:py-24" id="team">
      {/* soft decorative background blobs */}
      <span
        className="pointer-events-none absolute -z-10 rounded-full blur-3xl"
        style={{ left: -96, top: 40, width: 288, height: 288, background: "rgba(127,178,230,0.3)" }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -z-10 rounded-full blur-3xl"
        style={{ right: -96, bottom: 40, width: 288, height: 288, background: "rgba(255,153,0,0.1)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Our Team</p>
          <h2 className="h-section text-balance">Meet the people behind our work</h2>
          <p className="mt-4 text-slate-soft">
            {totalMembers} dedicated professionals across {groups.length} {groups.length === 1 ? "team" : "teams"}, working together to deliver for you.
          </p>
        </Reveal>

        {/* group pill tabs */}
        {groups.length > 1 && (
          <div className="mt-9 flex justify-center">
            <div
              className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white/70 p-1.5 shadow-sm backdrop-blur"
              role="tablist"
              aria-label="Team groups"
            >
              <button type="button" role="tab" aria-selected={active === "all"} className={tab(active === "all")} onClick={() => setActive("all")}>
                All <span className={count(active === "all")}>{totalMembers}</span>
              </button>
              {groups.map((g) => (
                <button key={g.id} type="button" role="tab" aria-selected={active === g.id} className={tab(active === g.id)} onClick={() => setActive(g.id)}>
                  {g.name} <span className={count(active === g.id)}>{g.members.length}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* groups */}
        <div className="mt-12 space-y-16">
          {shown.map((g) => (
            <div key={g.id}>
              <Reveal className="mb-8 flex items-center gap-4">
                <span
                  className="rounded-full"
                  style={{ width: 6, height: 32, background: "linear-gradient(to bottom, #1f73c8, #ff9900)" }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-display text-[1.5rem] font-semibold leading-tight text-ink">{g.name}</h3>
                  {g.description && <p className="mt-1 max-w-2xl text-[14.5px] text-slate-soft">{g.description}</p>}
                </div>
                <span className="ml-auto hidden h-px flex-1 bg-line sm:block" aria-hidden="true" />
              </Reveal>

              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.members.map((m, i) => (
                  <li key={m.id}>
                    <Reveal delay={(i % 4) * 0.07} className="h-full">
                      <MemberCard m={m} onOpen={() => setSelected(m)} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {selected && <ProfileModal m={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}