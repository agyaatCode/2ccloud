// import Link from "next/link";
// import { getBranding, getSettings } from "@/lib/data";
// import { NAV } from "@/lib/content";

// export async function Footer() {
//   const [b, s] = await Promise.all([getBranding(), getSettings()]);
//   const cols = NAV.filter((n) => n.columns && n.label !== "About Us");
//   const company = [
//     { label: "About Us", href: "/about" }, { label: "Vision", href: "/vision" }, { label: "Mission", href: "/mission" },
//     { label: "News", href: "/news" }, { label: "Careers", href: "/careers" }, { label: "Contact Us", href: "/contact" },
//   ];
//   const social = [["LinkedIn", s.linkedin_url], ["X / Twitter", s.twitter_url], ["Facebook", s.facebook_url], ["YouTube", s.youtube_url]].filter(([, u]) => u);
//   return (
//     <footer className="on-dark bg-navy-950 text-white">
//       <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8">
//         <div className="grid gap-12 lg:grid-cols-12">
//           <div className="lg:col-span-4">
//             <Link href="/" aria-label="Home" className="inline-block">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img src={b.darkLogoUrl} alt={s.brand_name} height={48} className="h-12 w-auto max-w-[240px] object-contain" />
//             </Link>
//             <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/65">{s.footer_blurb}</p>
//             <ul className="mt-6 space-y-1.5 text-[14px] text-white/80">
//               {s.contact_email && <li><a className="hover:text-white hover:underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>}
//               {s.contact_phone && <li><a className="hover:text-white hover:underline" href={`tel:${s.contact_phone.replace(/\s/g, "")}`}>{s.contact_phone}</a></li>}
//               {s.address && <li className="whitespace-pre-line text-white/65">{s.address}</li>}
//             </ul>
//             {social.length > 0 && (
//               <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/70">
//                 {social.map(([l, u]) => (
//                   <li key={l}><a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{l}</a></li>
//                 ))}
//               </ul>
//             )}
//           </div>
//           <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
//             {cols.map((c) => (
//               <div key={c.label}>
//                 <h2 className="eyebrow mb-4 !text-[11px]">{c.label}</h2>
//                 <ul className="space-y-2.5 text-[14px]">
//                   {c.columns!.flatMap((x) => x.links).map((l) => (
//                     <li key={l.href}><Link href={l.href} className="text-white/75 transition-colors hover:text-white">{l.label}</Link></li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//             <div>
//               <h2 className="eyebrow mb-4 !text-[11px]">Company</h2>
//               <ul className="space-y-2.5 text-[14px]">
//                 {company.map((l) => (
//                   <li key={l.href}><Link href={l.href} className="text-white/75 transition-colors hover:text-white">{l.label}</Link></li>
//                 ))}
//                 <li><Link href="/register" className="text-white/75 transition-colors hover:text-white">Customer Register</Link></li>
//               </ul>
//             </div>
//           </nav>
//         </div>
//         <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12.5px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
//           <p>© {new Date().getFullYear()} {s.company_name} All rights reserved.</p>
//           <p>Operating as {s.brand_name}</p>
//         </div>
//       </div>
//     </footer>
//   );
// }




// new new code 




import Link from "next/link";
import type { CSSProperties } from "react";
import { getBranding, getSettings } from "@/lib/data";
import { NAV } from "@/lib/content";

export async function Footer() {
  const [b, s] = await Promise.all([getBranding(), getSettings()]);
  const cols = NAV.filter((n) => n.columns && n.label !== "About Us");
  const company = [
    { label: "About Us", href: "/about" }, { label: "Vision", href: "/vision" }, { label: "Mission", href: "/mission" },
    { label: "News", href: "/news" }, { label: "Careers", href: "/careers" }, { label: "Contact Us", href: "/contact" },
  ];
  const social = [["LinkedIn", s.linkedin_url], ["X / Twitter", s.twitter_url], ["Facebook", s.facebook_url], ["YouTube", s.youtube_url]].filter(([, u]) => u);

  // Total link columns = nav columns + the "Company" column (all kept in ONE row on desktop)
  const totalCols = cols.length + 1;

  return (
    <footer className="on-dark bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Link href="/" aria-label="Home" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.darkLogoUrl} alt={s.brand_name} height={48} className="h-12 w-auto max-w-[240px] object-contain" />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/65">{s.footer_blurb}</p>
            <ul className="mt-6 space-y-1.5 text-[14px] text-white/80">
              {s.contact_email && <li><a className="break-words hover:text-white hover:underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></li>}
              {s.contact_phone && <li><a className="hover:text-white hover:underline" href={`tel:${s.contact_phone.replace(/\s/g, "")}`}>{s.contact_phone}</a></li>}
              {s.address && <li className="whitespace-pre-line text-white/65">{s.address}</li>}
            </ul>
            {social.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/70">
                {social.map(([l, u]) => (
                  <li key={l}><a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">{l}</a></li>
                ))}
              </ul>
            )}
          </div>

          {/* Link columns: 2 cols on mobile, 3 on tablet, ALL in a single row on desktop (lg+) */}
          <nav
            aria-label="Footer"
            style={{ "--cols": totalCols } as CSSProperties}
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-9 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
          >
            {cols.map((c) => (
              <div key={c.label} className="min-w-0">
                <h2 className="eyebrow mb-4 !text-[11px]">{c.label}</h2>
                <ul className="space-y-2.5 text-[14px]">
                  {c.columns!.flatMap((x) => x.links).map((l) => (
                    <li key={l.href}><Link href={l.href} className="break-words text-white/75 transition-colors hover:text-white">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="min-w-0">
              <h2 className="eyebrow mb-4 !text-[11px]">Company</h2>
              <ul className="space-y-2.5 text-[14px]">
                {company.map((l) => (
                  <li key={l.href}><Link href={l.href} className="break-words text-white/75 transition-colors hover:text-white">{l.label}</Link></li>
                ))}
                <li><Link href="/register" className="break-words text-white/75 transition-colors hover:text-white">Customer Register</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12.5px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {s.company_name} All rights reserved.</p>
          <p>Operating as {s.brand_name}</p>
        </div>
      </div>
    </footer>
  );
}