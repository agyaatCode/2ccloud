// import { Hero } from "@/components/Hero";
// import { ContactForm } from "@/components/forms";
// import { JsonLd } from "@/components/ui";
// import { Reveal } from "@/components/motion";
// import { breadcrumbSchema, buildMetadata, getPageHero, getSections, getSettings, getSiteUrl } from "@/lib/data";
// import { getUser } from "@/lib/auth";

// export const generateMetadata = () => buildMetadata({ type: "page", key: "contact", path: "/contact", fallbackTitle: "Contact Us", fallbackDescription: "Talk to an infrastructure expert about cloud, migration, DevOps, email and security services." });

// export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
//   const { service } = await searchParams;
//   const [hero, sec, s, base, user] = await Promise.all([getPageHero("contact"), getSections("contact"), getSettings(), getSiteUrl(), getUser()]);
//   const intro = sec.intro;
//   return (
//     <>
//       <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }])} />
//       <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact", url: `${base}/contact` }} />
//       <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, { name: "Contact Us" }]} />
//       <section className="bg-white py-14 lg:py-20">
//         <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
//           <Reveal className="lg:col-span-7">
//             <p className="eyebrow mb-3">{intro.eyebrow}</p>
//             <h2 className="h-section mb-3 text-balance">{intro.title}</h2>
//             <p className="lead mb-8">{intro.body}</p>
//             <ContactForm defaultService={service} user={user ? { name: user.fullName, email: user.email } : null} />
//           </Reveal>
//           <aside className="lg:col-span-4 lg:col-start-9">
//             <div className="border-t-2 border-brand-600 bg-mist p-7">
//               <h3 className="font-display text-lg font-semibold">Direct contact</h3>
//               <dl className="mt-5 space-y-4 text-[14.5px]">
//                 {s.contact_email && <div><dt className="font-mono text-[11px] uppercase tracking-wider text-slate-soft">Email</dt><dd><a className="font-semibold text-brand-700 hover:underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a></dd></div>}
//                 {s.contact_phone && <div><dt className="font-mono text-[11px] uppercase tracking-wider text-slate-soft">Phone</dt><dd><a className="font-semibold" href={`tel:${s.contact_phone.replace(/\s/g, "")}`}>{s.contact_phone}</a></dd></div>}
//                 {s.address && <div><dt className="font-mono text-[11px] uppercase tracking-wider text-slate-soft">Address</dt><dd className="whitespace-pre-line">{s.address}</dd></div>}
//                 <div><dt className="font-mono text-[11px] uppercase tracking-wider text-slate-soft">Company</dt><dd>{s.company_name}</dd></div>
//               </dl>
//             </div>
//             <ol className="mt-8 space-y-5">
//               {[["We review", "An engineer reads your message the same day."], ["We respond", "You get a reply within one business day."], ["We scope", "A short call to understand your environment, then a clear proposal."]].map(([t, d], i) => (
//                 <li key={t} className="flex gap-4"><span className="font-mono text-[12px] text-brand-600">0{i + 1}</span><div><h4 className="text-[15px] font-semibold">{t}</h4><p className="text-[14px] text-slate-soft">{d}</p></div></li>
//               ))}
//             </ol>
//           </aside>
//         </div>
//       </section>
//     </>
//   );
// }




// new code 



import { Hero } from "@/components/Hero";
import { ContactForm } from "@/components/forms";
import { JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { breadcrumbSchema, buildMetadata, getPageHero, getSections, getSettings, getSiteUrl } from "@/lib/data";
import { getUser } from "@/lib/auth";

export const generateMetadata = () => buildMetadata({ type: "page", key: "contact", path: "/contact", fallbackTitle: "Contact Us", fallbackDescription: "Talk to an infrastructure expert about cloud, migration, DevOps, email and security services." });

type Entry = { label: string; value: string };

/** Read the labelled list saved from Admin > Settings; fall back to the old single value. */
function parseList(raw: string | undefined, legacy: string | undefined, defaultLabel: string): Entry[] {
  try {
    const arr = JSON.parse(raw || "[]");
    if (Array.isArray(arr)) {
      const list = arr
        .filter((x) => x && typeof x === "object" && x.value)
        .map((x) => ({ label: String(x.label ?? ""), value: String(x.value) }));
      if (list.length) return list;
    }
  } catch {
    /* fall through */
  }
  return legacy ? [{ label: defaultLabel, value: legacy }] : [];
}

const DT = "font-mono text-[11px] uppercase tracking-wider text-slate-soft";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const [hero, sec, s, base, user] = await Promise.all([getPageHero("contact"), getSections("contact"), getSettings(), getSiteUrl(), getUser()]);
  const intro = sec.intro;

  const emails = parseList(s.contact_emails, s.contact_email, "General");
  const phones = parseList(s.contact_phones, s.contact_phone, "Main");
  const socials = [
    { label: "LinkedIn", url: s.linkedin_url },
    { label: "X / Twitter", url: s.twitter_url },
    { label: "Facebook", url: s.facebook_url },
    { label: "YouTube", url: s.youtube_url },
  ].filter((x) => x.url);

  return (
    <>
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact", url: `${base}/contact` }} />
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, { name: "Contact Us" }]} />
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-3">{intro.eyebrow}</p>
            <h2 className="h-section mb-3 text-balance">{intro.title}</h2>
            <p className="lead mb-8">{intro.body}</p>
            <ContactForm defaultService={service} user={user ? { name: user.fullName, email: user.email } : null} />
          </Reveal>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-t-2 border-brand-600 bg-mist p-7">
              <h3 className="font-display text-lg font-semibold">Direct contact</h3>
              <dl className="mt-5 space-y-4 text-[14.5px]">
                {emails.length > 0 && (
                  <div>
                    <dt className={DT}>Email</dt>
                    <dd className="mt-1 space-y-2">
                      {emails.map((e, i) => (
                        <div key={`${e.value}-${i}`}>
                          {e.label && <span className="block text-[12px] text-slate-soft">{e.label}</span>}
                          <a className="break-all font-semibold text-brand-700 hover:underline" href={`mailto:${e.value}`}>{e.value}</a>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                {phones.length > 0 && (
                  <div>
                    <dt className={DT}>Phone</dt>
                    <dd className="mt-1 space-y-2">
                      {phones.map((p, i) => (
                        <div key={`${p.value}-${i}`}>
                          {p.label && <span className="block text-[12px] text-slate-soft">{p.label}</span>}
                          <a className="font-semibold hover:underline" href={`tel:${p.value.replace(/[^\d+]/g, "")}`}>{p.value}</a>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
                {s.address && <div><dt className={DT}>Address</dt><dd className="whitespace-pre-line">{s.address}</dd></div>}
                <div><dt className={DT}>Company</dt><dd>{s.company_name}</dd></div>
                {socials.length > 0 && (
                  <div>
                    <dt className={DT}>Follow us</dt>
                    <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {socials.map((x) => (
                        <a key={x.label} className="font-semibold text-brand-700 hover:underline" href={x.url} target="_blank" rel="noopener noreferrer">{x.label}</a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <ol className="mt-8 space-y-5">
              {[["We review", "An engineer reads your message the same day."], ["We respond", "You get a reply within one business day."], ["We scope", "A short call to understand your environment, then a clear proposal."]].map(([t, d], i) => (
                <li key={t} className="flex gap-4"><span className="font-mono text-[12px] text-brand-600">0{i + 1}</span><div><h4 className="text-[15px] font-semibold">{t}</h4><p className="text-[14px] text-slate-soft">{d}</p></div></li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}