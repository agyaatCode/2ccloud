
// // // // "use client";
// // // // import Link from "next/link";
// // // // import { usePathname, useSearchParams, useRouter } from "next/navigation";
// // // // import { useState, type ReactNode } from "react";
// // // // import { api } from "@/lib/client";

// // // // type Item = { label: string; href: string; perm?: string; group?: string };
// // // // const ITEMS: Item[] = [
// // // //   { label: "Dashboard", href: "/admin", group: "Overview" },
// // // //   { label: "Branding", href: "/admin/branding", perm: "branding.manage" },
// // // //   { label: "Home", href: "/admin/pages/home", perm: "pages.manage", group: "Content" },
// // // //   { label: "Pages", href: "/admin/pages", perm: "pages.manage" },
// // // //   { label: "Services", href: "/admin/r/services", perm: "services.manage" },
// // // //   { label: "Cloud", href: "/admin/r/services?category=cloud", perm: "services.manage" },
// // // //   { label: "Workplace", href: "/admin/r/services?category=workplace", perm: "services.manage" },
// // // //   { label: "Security", href: "/admin/r/services?category=security", perm: "services.manage" },
// // // //   { label: "Marketplaces", href: "/admin/r/marketplaces", perm: "services.manage" },
// // // //   { label: "News", href: "/admin/r/news", perm: "news.manage" },
// // // //   { label: "News categories", href: "/admin/r/news_categories", perm: "news.manage" },
// // // //   { label: "Careers page", href: "/admin/pages/careers", perm: "pages.manage", group: "HR" },
// // // //   { label: "Jobs", href: "/admin/r/jobs", perm: "jobs.manage" },
// // // //   { label: "Applicants", href: "/admin/applicants", perm: "applicants.manage" },
// // // //   { label: "Universities", href: "/admin/r/universities", perm: "masters.manage" },
// // // //   { label: "Boards", href: "/admin/r/boards", perm: "masters.manage" },
// // // //   { label: "Qualifications", href: "/admin/r/qualifications", perm: "masters.manage" },
// // // //   { label: "Job roles", href: "/admin/r/job_roles", perm: "masters.manage" },
// // // //   { label: "Media", href: "/admin/media", perm: "media.manage", group: "Operations" },
// // // //   { label: "Customers", href: "/admin/r/customers", perm: "customers.view" },
// // // //   { label: "Contacts", href: "/admin/r/contacts", perm: "contacts.manage" },
// // // //   { label: "SEO", href: "/admin/r/seo", perm: "seo.manage" },
// // // //   { label: "Settings", href: "/admin/settings", perm: "settings.manage", group: "System" },
// // // //   { label: "Admin users", href: "/admin/r/admins", perm: "admins.manage" },
// // // //   { label: "Audit logs", href: "/admin/audit-logs", perm: "audit.view" },
// // // // ];

// // // // export function AdminShell({ name, role, perms, logo, children }: { name: string; role: string; perms: string[]; logo: string; children: ReactNode }) {
// // // //   const pathname = usePathname();
// // // //   const search = useSearchParams();
// // // //   const router = useRouter();
// // // //   const [open, setOpen] = useState(false);
// // // //   const allowed = ITEMS.filter((i) => !i.perm || perms.includes("*") || perms.includes(i.perm));
// // // //   const cur = pathname + (search.toString() ? `?${search.toString()}` : "");

// // // //   // Exact match or child path only (so "News" does not stay active on "News categories")
// // // //   const active = (h: string) => {
// // // //     if (h.includes("?")) return cur === h;
// // // //     if (h === "/admin") return pathname === "/admin";
// // // //     if (h === "/admin/r/services" && search.get("category")) return false;
// // // //     if (h === "/admin/pages" && pathname.startsWith("/admin/pages/")) return false;
// // // //     return pathname === h || pathname.startsWith(`${h}/`);
// // // //   };

// // // //   const nav = (
// // // //     <nav aria-label="Admin" className="admin-scroll flex-1 overflow-y-auto px-3 py-3">
// // // //       {allowed.map((i, idx) => (
// // // //         <div key={i.href}>
// // // //           {i.group && <p className={`px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500 ${idx ? "mt-4" : ""}`}>{i.group}</p>}
// // // //           <Link href={i.href} onClick={() => setOpen(false)} aria-current={active(i.href) ? "page" : undefined} className={`flex min-h-8 items-center rounded px-2.5 text-[13px] ${active(i.href) ? "bg-[#1f73c8] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{i.label}</Link>
// // // //         </div>
// // // //       ))}
// // // //     </nav>
// // // //   );

// // // //   return (
// // // //     <div className="adm">
// // // //       <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0b1626] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
// // // //         <div className="flex h-14 items-center border-b border-white/10 px-4">
// // // //           {/* eslint-disable-next-line @next/next/no-img-element */}
// // // //           <img src={logo} alt="Site logo" className="h-8 w-auto max-w-[170px] object-contain" />
// // // //           <span className="ml-3 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">Admin</span>
// // // //         </div>
// // // //         {nav}
// // // //         <div className="border-t border-white/10 p-3 text-[12px] text-slate-400">
// // // //           <p className="truncate font-semibold text-slate-200">{name}</p>
// // // //           <p className="mb-2">{role}</p>
// // // //           <div className="flex gap-2">
// // // //             <Link href="/" target="_blank" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">View site</Link>
// // // //             <button className="rounded border border-white/20 px-2 py-1 hover:bg-white/10" onClick={async () => { await api("/api/admin/login", { method: "DELETE" }); router.push("/admin/login"); router.refresh(); }}>Sign out</button>
// // // //           </div>
// // // //         </div>
// // // //       </aside>
// // // //       {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />}
// // // //       <div className="lg:pl-60">
// // // //         <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
// // // //           <button className="a-btn !px-2.5" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>☰</button>
// // // //           <span className="text-sm font-bold">Admin</span>
// // // //         </header>
// // // //         <main id="main" className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }






// // // // new new code 




// // // /**
// // //  * FILE: src/components/admin/AdminShell.tsx
// // //  * TYPE: Client Component (admin left sidebar navigation + main content wrapper)
// // //  * INCLUDES: "AI Leads" navigation link under the "Operations" group (/admin/ai-leads)
// // //  */
// // // "use client";
// // // import Link from "next/link";
// // // import { usePathname, useSearchParams, useRouter } from "next/navigation";
// // // import { useState, type ReactNode } from "react";
// // // import { api } from "@/lib/client";

// // // type Item = { label: string; href: string; perm?: string; group?: string };
// // // const ITEMS: Item[] = [
// // //   { label: "Dashboard", href: "/admin", group: "Overview" },
// // //   { label: "Branding", href: "/admin/branding", perm: "branding.manage" },
// // //   { label: "Home", href: "/admin/pages/home", perm: "pages.manage", group: "Content" },
// // //   { label: "Pages", href: "/admin/pages", perm: "pages.manage" },
// // //   { label: "Services", href: "/admin/r/services", perm: "services.manage" },
// // //   { label: "Cloud", href: "/admin/r/services?category=cloud", perm: "services.manage" },
// // //   { label: "Workplace", href: "/admin/r/services?category=workplace", perm: "services.manage" },
// // //   { label: "Security", href: "/admin/r/services?category=security", perm: "services.manage" },
// // //   { label: "Marketplaces", href: "/admin/r/marketplaces", perm: "services.manage" },
// // //   { label: "News", href: "/admin/r/news", perm: "news.manage" },
// // //   { label: "News categories", href: "/admin/r/news_categories", perm: "news.manage" },
// // //   { label: "Careers page", href: "/admin/pages/careers", perm: "pages.manage", group: "HR" },
// // //   { label: "Jobs", href: "/admin/r/jobs", perm: "jobs.manage" },
// // //   { label: "Applicants", href: "/admin/applicants", perm: "applicants.manage" },
// // //   { label: "Universities", href: "/admin/r/universities", perm: "masters.manage" },
// // //   { label: "Boards", href: "/admin/r/boards", perm: "masters.manage" },
// // //   { label: "Qualifications", href: "/admin/r/qualifications", perm: "masters.manage" },
// // //   { label: "Job roles", href: "/admin/r/job_roles", perm: "masters.manage" },
// // //   { label: "Media", href: "/admin/media", perm: "media.manage", group: "Operations" },
// // //   { label: "Customers", href: "/admin/r/customers", perm: "customers.view" },
// // //   { label: "Contacts", href: "/admin/r/contacts", perm: "contacts.manage" },
// // //   // AI chatbot leads, unanswered questions & knowledge base
// // //   { label: "AI Leads", href: "/admin/ai-leads", perm: "contacts.manage" },
// // //   { label: "SEO", href: "/admin/r/seo", perm: "seo.manage" },
// // //   { label: "Settings", href: "/admin/settings", perm: "settings.manage", group: "System" },
// // //   { label: "Admin users", href: "/admin/r/admins", perm: "admins.manage" },
// // //   { label: "Audit logs", href: "/admin/audit-logs", perm: "audit.view" },
// // // ];

// // // export function AdminShell({
// // //   name,
// // //   role,
// // //   perms,
// // //   logo,
// // //   children,
// // // }: {
// // //   name: string;
// // //   role: string;
// // //   perms: string[];
// // //   logo: string;
// // //   children: ReactNode;
// // // }) {
// // //   const pathname = usePathname();
// // //   const search = useSearchParams();
// // //   const router = useRouter();
// // //   const [open, setOpen] = useState(false);
// // //   const allowed = ITEMS.filter((i) => !i.perm || perms.includes("*") || perms.includes(i.perm));
// // //   const cur = pathname + (search.toString() ? `?${search.toString()}` : "");

// // //   // Exact match or child path only (so "News" does not stay active on "News categories")
// // //   const active = (h: string) => {
// // //     if (h.includes("?")) return cur === h;
// // //     if (h === "/admin") return pathname === "/admin";
// // //     if (h === "/admin/r/services" && search.get("category")) return false;
// // //     if (h === "/admin/pages" && pathname.startsWith("/admin/pages/")) return false;
// // //     return pathname === h || pathname.startsWith(`${h}/`);
// // //   };

// // //   const nav = (
// // //     <nav aria-label="Admin" className="admin-scroll flex-1 overflow-y-auto px-3 py-3">
// // //       {allowed.map((i, idx) => (
// // //         <div key={i.href}>
// // //           {i.group && (
// // //             <p className={`px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500 ${idx ? "mt-4" : ""}`}>
// // //               {i.group}
// // //             </p>
// // //           )}
// // //           <Link
// // //             href={i.href}
// // //             onClick={() => setOpen(false)}
// // //             aria-current={active(i.href) ? "page" : undefined}
// // //             className={`flex min-h-8 items-center rounded px-2.5 text-[13px] ${
// // //               active(i.href) ? "bg-[#1f73c8] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
// // //             }`}
// // //           >
// // //             {i.label}
// // //           </Link>
// // //         </div>
// // //       ))}
// // //     </nav>
// // //   );

// // //   return (
// // //     <div className="adm">
// // //       <aside
// // //         className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0b1626] transition-transform lg:translate-x-0 ${
// // //           open ? "translate-x-0" : "-translate-x-full"
// // //         }`}
// // //       >
// // //         <div className="flex h-14 items-center border-b border-white/10 px-4">
// // //           {/* eslint-disable-next-line @next/next/no-img-element */}
// // //           <img src={logo} alt="Site logo" className="h-8 w-auto max-w-[170px] object-contain" />
// // //           <span className="ml-3 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
// // //             Admin
// // //           </span>
// // //         </div>
// // //         {nav}
// // //         <div className="border-t border-white/10 p-3 text-[12px] text-slate-400">
// // //           <p className="truncate font-semibold text-slate-200">{name}</p>
// // //           <p className="mb-2">{role}</p>
// // //           <div className="flex gap-2">
// // //             <Link href="/" target="_blank" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">
// // //               View site
// // //             </Link>
// // //             <button
// // //               className="rounded border border-white/20 px-2 py-1 hover:bg-white/10"
// // //               onClick={async () => {
// // //                 await api("/api/admin/login", { method: "DELETE" });
// // //                 router.push("/admin/login");
// // //                 router.refresh();
// // //               }}
// // //             >
// // //               Sign out
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </aside>
// // //       {open && (
// // //         <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />
// // //       )}
// // //       <div className="lg:pl-60">
// // //         <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
// // //           <button className="a-btn !px-2.5" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
// // //             ☰
// // //           </button>
// // //           <span className="text-sm font-bold">Admin</span>
// // //         </header>
// // //         <main id="main" className="mx-auto max-w-6xl p-4 sm:p-6">
// // //           {children}
// // //         </main>
// // //       </div>
// // //     </div>
// // //   );
// // // }








// // // new new code 




// // /**
// //  * FILE: src/components/admin/AdminShell.tsx
// //  * TYPE: Client Component (admin left sidebar navigation + main content wrapper)
// //  * INCLUDES: "AI Leads" link (Operations) and "Team groups" / "Team members" links (Team group)
// //  */
// // "use client";
// // import Link from "next/link";
// // import { usePathname, useSearchParams, useRouter } from "next/navigation";
// // import { useState, type ReactNode } from "react";
// // import { api } from "@/lib/client";

// // type Item = { label: string; href: string; perm?: string; group?: string };
// // const ITEMS: Item[] = [
// //   { label: "Dashboard", href: "/admin", group: "Overview" },
// //   { label: "Branding", href: "/admin/branding", perm: "branding.manage" },
// //   { label: "Home", href: "/admin/pages/home", perm: "pages.manage", group: "Content" },
// //   { label: "Pages", href: "/admin/pages", perm: "pages.manage" },
// //   { label: "Services", href: "/admin/r/services", perm: "services.manage" },
// //   { label: "Cloud", href: "/admin/r/services?category=cloud", perm: "services.manage" },
// //   { label: "Workplace", href: "/admin/r/services?category=workplace", perm: "services.manage" },
// //   { label: "Security", href: "/admin/r/services?category=security", perm: "services.manage" },
// //   { label: "Marketplaces", href: "/admin/r/marketplaces", perm: "services.manage" },
// //   { label: "News", href: "/admin/r/news", perm: "news.manage" },
// //   { label: "News categories", href: "/admin/r/news_categories", perm: "news.manage" },
// //   { label: "Careers page", href: "/admin/pages/careers", perm: "pages.manage", group: "HR" },
// //   { label: "Jobs", href: "/admin/r/jobs", perm: "jobs.manage" },
// //   { label: "Applicants", href: "/admin/applicants", perm: "applicants.manage" },
// //   { label: "Universities", href: "/admin/r/universities", perm: "masters.manage" },
// //   { label: "Boards", href: "/admin/r/boards", perm: "masters.manage" },
// //   { label: "Qualifications", href: "/admin/r/qualifications", perm: "masters.manage" },
// //   { label: "Job roles", href: "/admin/r/job_roles", perm: "masters.manage" },
// //   // Team management (Admin + HR)
// //   { label: "Team members", href: "/admin/r/team_members", perm: "team.manage", group: "Team" },
// //   { label: "Team groups", href: "/admin/r/team_groups", perm: "team.manage" },
// //   { label: "Media", href: "/admin/media", perm: "media.manage", group: "Operations" },
// //   { label: "Customers", href: "/admin/r/customers", perm: "customers.view" },
// //   { label: "Contacts", href: "/admin/r/contacts", perm: "contacts.manage" },
// //   // AI chatbot leads, unanswered questions & knowledge base
// //   { label: "AI Leads", href: "/admin/ai-leads", perm: "contacts.manage" },
// //   { label: "SEO", href: "/admin/r/seo", perm: "seo.manage" },
// //   { label: "Settings", href: "/admin/settings", perm: "settings.manage", group: "System" },
// //   { label: "Admin users", href: "/admin/r/admins", perm: "admins.manage" },
// //   { label: "Audit logs", href: "/admin/audit-logs", perm: "audit.view" },
// // ];

// // export function AdminShell({
// //   name,
// //   role,
// //   perms,
// //   logo,
// //   children,
// // }: {
// //   name: string;
// //   role: string;
// //   perms: string[];
// //   logo: string;
// //   children: ReactNode;
// // }) {
// //   const pathname = usePathname();
// //   const search = useSearchParams();
// //   const router = useRouter();
// //   const [open, setOpen] = useState(false);
// //   const allowed = ITEMS.filter((i) => !i.perm || perms.includes("*") || perms.includes(i.perm));
// //   const cur = pathname + (search.toString() ? `?${search.toString()}` : "");

// //   // Exact match or child path only (so "News" does not stay active on "News categories")
// //   const active = (h: string) => {
// //     if (h.includes("?")) return cur === h;
// //     if (h === "/admin") return pathname === "/admin";
// //     if (h === "/admin/r/services" && search.get("category")) return false;
// //     if (h === "/admin/pages" && pathname.startsWith("/admin/pages/")) return false;
// //     return pathname === h || pathname.startsWith(`${h}/`);
// //   };

// //   const nav = (
// //     <nav aria-label="Admin" className="admin-scroll flex-1 overflow-y-auto px-3 py-3">
// //       {allowed.map((i, idx) => (
// //         <div key={i.href}>
// //           {i.group && (
// //             <p className={`px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500 ${idx ? "mt-4" : ""}`}>
// //               {i.group}
// //             </p>
// //           )}
// //           <Link
// //             href={i.href}
// //             onClick={() => setOpen(false)}
// //             aria-current={active(i.href) ? "page" : undefined}
// //             className={`flex min-h-8 items-center rounded px-2.5 text-[13px] ${
// //               active(i.href) ? "bg-[#1f73c8] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
// //             }`}
// //           >
// //             {i.label}
// //           </Link>
// //         </div>
// //       ))}
// //     </nav>
// //   );

// //   return (
// //     <div className="adm">
// //       <aside
// //         className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0b1626] transition-transform lg:translate-x-0 ${
// //           open ? "translate-x-0" : "-translate-x-full"
// //         }`}
// //       >
// //         <div className="flex h-14 items-center border-b border-white/10 px-4">
// //           {/* eslint-disable-next-line @next/next/no-img-element */}
// //           <img src={logo} alt="Site logo" className="h-8 w-auto max-w-[170px] object-contain" />
// //           <span className="ml-3 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
// //             Admin
// //           </span>
// //         </div>
// //         {nav}
// //         <div className="border-t border-white/10 p-3 text-[12px] text-slate-400">
// //           <p className="truncate font-semibold text-slate-200">{name}</p>
// //           <p className="mb-2">{role}</p>
// //           <div className="flex gap-2">
// //             <Link href="/" target="_blank" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">
// //               View site
// //             </Link>
// //             <button
// //               className="rounded border border-white/20 px-2 py-1 hover:bg-white/10"
// //               onClick={async () => {
// //                 await api("/api/admin/login", { method: "DELETE" });
// //                 router.push("/admin/login");
// //                 router.refresh();
// //               }}
// //             >
// //               Sign out
// //             </button>
// //           </div>
// //         </div>
// //       </aside>
// //       {open && (
// //         <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />
// //       )}
// //       <div className="lg:pl-60">
// //         <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
// //           <button className="a-btn !px-2.5" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
// //             ☰
// //           </button>
// //           <span className="text-sm font-bold">Admin</span>
// //         </header>
// //         <main id="main" className="mx-auto max-w-6xl p-4 sm:p-6">
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }





// // new code 




// /**
//  * FILE: src/components/admin/AdminShell.tsx
//  * TYPE: Client Component (admin left sidebar navigation + main content wrapper)
//  * INCLUDES: Who We Are + Gallery links (Content), Team links (Team), AI Leads (Operations)
//  */
// "use client";
// import Link from "next/link";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";
// import { useState, type ReactNode } from "react";
// import { api } from "@/lib/client";

// type Item = { label: string; href: string; perm?: string; group?: string };
// const ITEMS: Item[] = [
//   { label: "Dashboard", href: "/admin", group: "Overview" },
//   { label: "Branding", href: "/admin/branding", perm: "branding.manage" },
//   { label: "Home", href: "/admin/pages/home", perm: "pages.manage", group: "Content" },
//   { label: "Pages", href: "/admin/pages", perm: "pages.manage" },
//   // Home page sections
//   { label: "Who We Are", href: "/admin/r/who_we_are", perm: "pages.manage" },
//   { label: "Gallery", href: "/admin/r/gallery", perm: "pages.manage" },
//   { label: "Services", href: "/admin/r/services", perm: "services.manage" },
//   { label: "Cloud", href: "/admin/r/services?category=cloud", perm: "services.manage" },
//   { label: "Workplace", href: "/admin/r/services?category=workplace", perm: "services.manage" },
//   { label: "Security", href: "/admin/r/services?category=security", perm: "services.manage" },
//   { label: "Marketplaces", href: "/admin/r/marketplaces", perm: "services.manage" },
//   { label: "News", href: "/admin/r/news", perm: "news.manage" },
//   { label: "News categories", href: "/admin/r/news_categories", perm: "news.manage" },
//   { label: "Careers page", href: "/admin/pages/careers", perm: "pages.manage", group: "HR" },
//   { label: "Jobs", href: "/admin/r/jobs", perm: "jobs.manage" },
//   { label: "Applicants", href: "/admin/applicants", perm: "applicants.manage" },
//   { label: "Universities", href: "/admin/r/universities", perm: "masters.manage" },
//   { label: "Boards", href: "/admin/r/boards", perm: "masters.manage" },
//   { label: "Qualifications", href: "/admin/r/qualifications", perm: "masters.manage" },
//   { label: "Job roles", href: "/admin/r/job_roles", perm: "masters.manage" },
//   // Team management (Admin + HR)
//   { label: "Team members", href: "/admin/r/team_members", perm: "team.manage", group: "Team" },
//   { label: "Team groups", href: "/admin/r/team_groups", perm: "team.manage" },
//   { label: "Media", href: "/admin/media", perm: "media.manage", group: "Operations" },
//   { label: "Customers", href: "/admin/r/customers", perm: "customers.view" },
//   { label: "Contacts", href: "/admin/r/contacts", perm: "contacts.manage" },
//   // AI chatbot leads, unanswered questions & knowledge base
//   { label: "AI Leads", href: "/admin/ai-leads", perm: "contacts.manage" },
//   { label: "SEO", href: "/admin/r/seo", perm: "seo.manage" },
//   { label: "Settings", href: "/admin/settings", perm: "settings.manage", group: "System" },
//   { label: "Admin users", href: "/admin/r/admins", perm: "admins.manage" },
//   { label: "Audit logs", href: "/admin/audit-logs", perm: "audit.view" },
// ];

// export function AdminShell({
//   name,
//   role,
//   perms,
//   logo,
//   children,
// }: {
//   name: string;
//   role: string;
//   perms: string[];
//   logo: string;
//   children: ReactNode;
// }) {
//   const pathname = usePathname();
//   const search = useSearchParams();
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const allowed = ITEMS.filter((i) => !i.perm || perms.includes("*") || perms.includes(i.perm));
//   const cur = pathname + (search.toString() ? `?${search.toString()}` : "");

//   // Exact match or child path only (so "News" does not stay active on "News categories")
//   const active = (h: string) => {
//     if (h.includes("?")) return cur === h;
//     if (h === "/admin") return pathname === "/admin";
//     if (h === "/admin/r/services" && search.get("category")) return false;
//     if (h === "/admin/pages" && pathname.startsWith("/admin/pages/")) return false;
//     return pathname === h || pathname.startsWith(`${h}/`);
//   };

//   const nav = (
//     <nav aria-label="Admin" className="admin-scroll flex-1 overflow-y-auto px-3 py-3">
//       {allowed.map((i, idx) => (
//         <div key={i.href}>
//           {i.group && (
//             <p className={`px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500 ${idx ? "mt-4" : ""}`}>
//               {i.group}
//             </p>
//           )}
//           <Link
//             href={i.href}
//             onClick={() => setOpen(false)}
//             aria-current={active(i.href) ? "page" : undefined}
//             className={`flex min-h-8 items-center rounded px-2.5 text-[13px] ${
//               active(i.href) ? "bg-[#1f73c8] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
//             }`}
//           >
//             {i.label}
//           </Link>
//         </div>
//       ))}
//     </nav>
//   );

//   return (
//     <div className="adm">
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0b1626] transition-transform lg:translate-x-0 ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-14 items-center border-b border-white/10 px-4">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={logo} alt="Site logo" className="h-8 w-auto max-w-[170px] object-contain" />
//           <span className="ml-3 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
//             Admin
//           </span>
//         </div>
//         {nav}
//         <div className="border-t border-white/10 p-3 text-[12px] text-slate-400">
//           <p className="truncate font-semibold text-slate-200">{name}</p>
//           <p className="mb-2">{role}</p>
//           <div className="flex gap-2">
//             <Link href="/" target="_blank" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">
//               View site
//             </Link>
//             <button
//               className="rounded border border-white/20 px-2 py-1 hover:bg-white/10"
//               onClick={async () => {
//                 await api("/api/admin/login", { method: "DELETE" });
//                 router.push("/admin/login");
//                 router.refresh();
//               }}
//             >
//               Sign out
//             </button>
//           </div>
//         </div>
//       </aside>
//       {open && (
//         <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />
//       )}
//       <div className="lg:pl-60">
//         <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
//           <button className="a-btn !px-2.5" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
//             ☰
//           </button>
//           <span className="text-sm font-bold">Admin</span>
//         </header>
//         <main id="main" className="mx-auto max-w-6xl p-4 sm:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }







// new new code 




/**
 * FILE: src/components/admin/AdminShell.tsx
 * TYPE: Client Component (admin left sidebar navigation + main content wrapper)
 * INCLUDES: Who We Are, Gallery, Sophos section / products (Content), Team links (Team), AI Leads (Operations)
 */
"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { api } from "@/lib/client";

type Item = { label: string; href: string; perm?: string; group?: string };
const ITEMS: Item[] = [
  { label: "Dashboard", href: "/admin", group: "Overview" },
  { label: "Branding", href: "/admin/branding", perm: "branding.manage" },
  { label: "Home", href: "/admin/pages/home", perm: "pages.manage", group: "Content" },
  { label: "Pages", href: "/admin/pages", perm: "pages.manage" },
  // Home page sections
  { label: "Who We Are", href: "/admin/r/who_we_are", perm: "pages.manage" },
  { label: "Gallery", href: "/admin/r/gallery", perm: "pages.manage" },
  { label: "Sophos section", href: "/admin/r/sophos_section", perm: "pages.manage" },
  { label: "Sophos products", href: "/admin/r/sophos_products", perm: "pages.manage" },
  { label: "Services", href: "/admin/r/services", perm: "services.manage" },
  { label: "Cloud", href: "/admin/r/services?category=cloud", perm: "services.manage" },
  { label: "Workplace", href: "/admin/r/services?category=workplace", perm: "services.manage" },
  { label: "Security", href: "/admin/r/services?category=security", perm: "services.manage" },
  { label: "Marketplaces", href: "/admin/r/marketplaces", perm: "services.manage" },
  { label: "News", href: "/admin/r/news", perm: "news.manage" },
  { label: "News categories", href: "/admin/r/news_categories", perm: "news.manage" },
  { label: "Careers page", href: "/admin/pages/careers", perm: "pages.manage", group: "HR" },
  { label: "Jobs", href: "/admin/r/jobs", perm: "jobs.manage" },
  { label: "Applicants", href: "/admin/applicants", perm: "applicants.manage" },
  { label: "Universities", href: "/admin/r/universities", perm: "masters.manage" },
  { label: "Boards", href: "/admin/r/boards", perm: "masters.manage" },
  { label: "Qualifications", href: "/admin/r/qualifications", perm: "masters.manage" },
  { label: "Job roles", href: "/admin/r/job_roles", perm: "masters.manage" },
  // Team management (Admin + HR)
  { label: "Team members", href: "/admin/r/team_members", perm: "team.manage", group: "Team" },
  { label: "Team groups", href: "/admin/r/team_groups", perm: "team.manage" },
  { label: "Media", href: "/admin/media", perm: "media.manage", group: "Operations" },
  { label: "Customers", href: "/admin/r/customers", perm: "customers.view" },
  { label: "Contacts", href: "/admin/r/contacts", perm: "contacts.manage" },
  // AI chatbot leads, unanswered questions & knowledge base
  { label: "AI Leads", href: "/admin/ai-leads", perm: "contacts.manage" },
  { label: "SEO", href: "/admin/r/seo", perm: "seo.manage" },
  { label: "Settings", href: "/admin/settings", perm: "settings.manage", group: "System" },
  { label: "Admin users", href: "/admin/r/admins", perm: "admins.manage" },
  { label: "Audit logs", href: "/admin/audit-logs", perm: "audit.view" },
];

export function AdminShell({
  name,
  role,
  perms,
  logo,
  children,
}: {
  name: string;
  role: string;
  perms: string[];
  logo: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const allowed = ITEMS.filter((i) => !i.perm || perms.includes("*") || perms.includes(i.perm));
  const cur = pathname + (search.toString() ? `?${search.toString()}` : "");

  // Exact match or child path only (so "News" does not stay active on "News categories")
  const active = (h: string) => {
    if (h.includes("?")) return cur === h;
    if (h === "/admin") return pathname === "/admin";
    if (h === "/admin/r/services" && search.get("category")) return false;
    if (h === "/admin/pages" && pathname.startsWith("/admin/pages/")) return false;
    return pathname === h || pathname.startsWith(`${h}/`);
  };

  const nav = (
    <nav aria-label="Admin" className="admin-scroll flex-1 overflow-y-auto px-3 py-3">
      {allowed.map((i, idx) => (
        <div key={i.href}>
          {i.group && (
            <p className={`px-2 pb-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-500 ${idx ? "mt-4" : ""}`}>
              {i.group}
            </p>
          )}
          <Link
            href={i.href}
            onClick={() => setOpen(false)}
            aria-current={active(i.href) ? "page" : undefined}
            className={`flex min-h-8 items-center rounded px-2.5 text-[13px] ${
              active(i.href) ? "bg-[#1f73c8] font-semibold text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {i.label}
          </Link>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="adm">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-[#0b1626] transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="Site logo" className="h-8 w-auto max-w-[170px] object-contain" />
          <span className="ml-3 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Admin
          </span>
        </div>
        {nav}
        <div className="border-t border-white/10 p-3 text-[12px] text-slate-400">
          <p className="truncate font-semibold text-slate-200">{name}</p>
          <p className="mb-2">{role}</p>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="rounded border border-white/20 px-2 py-1 hover:bg-white/10">
              View site
            </Link>
            <button
              className="rounded border border-white/20 px-2 py-1 hover:bg-white/10"
              onClick={async () => {
                await api("/api/admin/login", { method: "DELETE" });
                router.push("/admin/login");
                router.refresh();
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button className="a-btn !px-2.5" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            ☰
          </button>
          <span className="text-sm font-bold">Admin</span>
        </header>
        <main id="main" className="mx-auto max-w-6xl p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}