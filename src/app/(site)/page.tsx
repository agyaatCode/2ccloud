// // // // import Link from "next/link";
// // // // import { and, asc, eq, inArray } from "drizzle-orm";
// // // // import { db } from "@/db";
// // // // import { serviceFeatures } from "@/db/schema";
// // // // import { Hero } from "@/components/Hero";
// // // // import { SmartImage } from "@/components/SmartImage";
// // // // import { ArrowLink, JsonLd, SectionHead } from "@/components/ui";
// // // // import { ClipReveal, Counter, Reveal } from "@/components/motion";
// // // // import { FlowDiagram, MonitorPanel, PipelineTerminal, ServiceIcon } from "@/components/graphics";
// // // // import { PlatformTabs, type Platform } from "@/components/PlatformTabs";
// // // // import { Rack3D } from "@/components/Rack3D";
// // // // import { buildMetadata, getPageHero, getSections, getService, listNews, listServices, customSchema } from "@/lib/data";
// // // // import { fmtDate } from "@/lib/util";

// // // // export async function generateMetadata() {
// // // //   return buildMetadata({
// // // //     type: "page", key: "home", path: "/", fallbackTitle: "Cloud, Server, DevOps, Security & Managed Services",
// // // //     fallbackDescription: "Secure, scalable and professionally managed cloud infrastructure, migration, DevOps, email and security services for businesses.",
// // // //     image: "/images/hero/home-datacenter.jpg",
// // // //   });
// // // // }

// // // // const CAPS = [
// // // //   { label: "Public Cloud", href: "/cloud/public-cloud", icon: "cloud" },
// // // //   { label: "Private Cloud", href: "/cloud/private-cloud", icon: "server" },
// // // //   { label: "Email & Collaboration", href: "/workplace/m365", icon: "mail" },
// // // //   { label: "Cloud Migration", href: "/services/cloud-migration", icon: "migrate" },
// // // //   { label: "Security", href: "/security/ddos-protection", icon: "shield" },
// // // //   { label: "DevOps", href: "/services/devops", icon: "pipeline" },
// // // // ];

// // // // export default async function HomePage() {
// // // //   const [hero, sec, svcs, latest, schema, mig] = await Promise.all([
// // // //     getPageHero("home"), getSections("home"), listServices(), listNews(3), customSchema("page", "home"), getService("services", "cloud-migration"),
// // // //   ]);
// // // //   const by = (slug: string) => svcs.find((s) => s.slug === slug);
// // // //   const pc = by("public-cloud");
// // // //   const platformSlugs = ["aws", "azure", "google-cloud", "private-cloud", "hybrid-cloud"];
// // // //   const ids = [pc?.id, ...platformSlugs.map((s) => by(s)?.id)].filter((x): x is number => !!x);
// // // //   const feats = ids.length ? await db.select().from(serviceFeatures).where(and(inArray(serviceFeatures.serviceId, ids), eq(serviceFeatures.kind, "feature"))).orderBy(asc(serviceFeatures.sortOrder)) : [];
// // // //   const pts = (id?: number) => feats.filter((f) => f.serviceId === id).map((f) => f.title);

// // // //   const platforms: Platform[] = platformSlugs.flatMap((slug) => {
// // // //     const s = by(slug);
// // // //     return s ? [{ id: s.slug, title: s.title, kicker: s.category === "cloud" && s.parentSlug ? "Public cloud" : "Cloud platform", description: s.shortDescription, image: s.cardImageUrl || s.heroImageUrl, href: `/${s.category}/${s.slug}`, points: pts(s.id).slice(0, 3) }] : [];
// // // //   });

// // // //   const smalls = [
// // // //     { title: "Private Cloud", text: by("private-cloud")?.shortDescription ?? "", href: "/cloud/private-cloud", icon: "server" },
// // // //     { title: "Email & Collaboration", text: "Microsoft 365, Google Workspace and Zimbra — deployed, migrated and supported.", href: "/workplace/m365", icon: "mail" },
// // // //     { title: "Cloud Migration", text: by("cloud-migration")?.shortDescription ?? "", href: "/services/cloud-migration", icon: "migrate" },
// // // //     { title: "Security", text: "DDoS protection, data security, VAPT, anti-virus and Active Directory.", href: "/security/ddos-protection", icon: "shield" },
// // // //     { title: "DevOps", text: by("devops")?.shortDescription ?? "", href: "/services/devops", icon: "pipeline" },
// // // //   ];
// // // //   const securitySvcs = svcs.filter((s) => s.category === "security");
// // // //   const S = sec;

// // // //   return (
// // // //     <>
// // // //       <JsonLd data={schema} />
// // // //       <Hero hero={hero} trust={["24×7 monitored infrastructure", "Multi-cloud engineering", "Security-first operations"]} />

// // // //       {/* capability strip */}
// // // //       <section aria-label="Capabilities" className="border-b border-line bg-white">
// // // //         <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
// // // //           {CAPS.map((c) => (
// // // //             <li key={c.label}>
// // // //               <Link href={c.href} className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-brand-50">
// // // //                 <ServiceIcon kind={c.icon} className="h-9 w-9 shrink-0" />
// // // //                 <span className="text-[13.5px] font-semibold leading-tight">{c.label}</span>
// // // //               </Link>
// // // //             </li>
// // // //           ))}
// // // //         </ul>
// // // //       </section>

// // // //       {/* infrastructure story — dark, with 3D rack */}
// // // //       {/* <section className="on-dark bg-navy-950 text-white">
// // // //         <div className="grid lg:grid-cols-12">
// // // //           <div className="px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
// // // //             <Reveal>
// // // //               <p className="eyebrow mb-4">{S.story.eyebrow}</p>
// // // //               <h2 className="h-section text-balance">{S.story.title}</h2>
// // // //               <p className="lead mt-5">{S.story.body}</p>
// // // //             </Reveal>
// // // //             <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
// // // //               {S.story.items.map((it, i) => (
// // // //                 <li key={it.title}>
// // // //                   <Reveal delay={i * 0.08} className="flex gap-5 py-5">
// // // //                     <span className="font-mono text-[12px] text-brand-300">0{i + 1}</span>
// // // //                     <div>
// // // //                       <h3 className="text-[16px] font-semibold">{it.title}</h3>
// // // //                       <p className="mt-1 text-[14px] text-white/65">{it.text}</p>
// // // //                     </div>
// // // //                   </Reveal>
// // // //                 </li>
// // // //               ))}
// // // //             </ol>
// // // //           </div>
// // // //           <div className="relative min-h-[340px] lg:col-span-7 lg:min-h-[600px]">
// // // //             <Rack3D fallback="/images/stock/public-cloud.jpg" alt="Server racks with network cabling in a data center" />
// // // //             <p className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 sm:left-8">
// // // //               <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" /> Reference rack model
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       </section> */}

// // // //       {/* services — featured + index grid */}
// // // //       <section className="bg-white py-20 lg:py-28">
// // // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //           <Reveal><SectionHead eyebrow={S.services.eyebrow} title={S.services.title} body={S.services.body} /></Reveal>
// // // //           {pc && (
// // // //             <div className="mt-12 grid overflow-hidden border border-line lg:grid-cols-12">
// // // //               <ClipReveal className="img-zoom relative min-h-[300px] lg:col-span-7 lg:min-h-[460px]">
// // // //                 <SmartImage src={pc.cardImageUrl || pc.heroImageUrl} alt="Public cloud data center campus" sizes="(min-width:1024px) 58vw, 100vw" />
// // // //                 <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
// // // //                 <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
// // // //                   {[["AWS", "/cloud/aws"], ["Azure", "/cloud/azure"], ["Google Cloud", "/cloud/google-cloud"]].map(([l, h]) => (
// // // //                     <li key={l}><Link href={h} className="block border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900">{l}</Link></li>
// // // //                   ))}
// // // //                 </ul>
// // // //               </ClipReveal>
// // // //               <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
// // // //                 <ServiceIcon kind="cloud" className="always mb-6 h-14 w-14" />
// // // //                 <p className="eyebrow mb-2">Featured service</p>
// // // //                 <h3 className="text-[1.75rem] font-semibold leading-tight">{pc.title}</h3>
// // // //                 <p className="mt-3 leading-relaxed text-slate-soft">{pc.shortDescription}</p>
// // // //                 <ul className="mt-6 space-y-2.5">
// // // //                   {pts(pc.id).map((p) => (
// // // //                     <li key={p} className="flex gap-3 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{p}</li>
// // // //                   ))}
// // // //                 </ul>
// // // //                 <ArrowLink href="/cloud/public-cloud" className="mt-8">Learn more about Public Cloud</ArrowLink>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //           {/* <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
// // // //             {smalls.map((s, i) => (
// // // //               <li key={s.title}>
// // // //                 <Reveal delay={i * 0.06}>
// // // //                   <Link href={s.href} className="group block border-t-2 border-line pt-6 transition-colors duration-300 hover:border-brand-600">
// // // //                     <ServiceIcon kind={s.icon} className="mb-5 h-12 w-12" />
// // // //                     <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
// // // //                     <p className="mt-2 text-[14px] leading-relaxed text-slate-soft">{s.text}</p>
// // // //                     <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600">Learn more <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
// // // //                   </Link>
// // // //                 </Reveal>
// // // //               </li>
// // // //             ))}
// // // //           </ul> */}
// // // //         </div>
// // // //       </section>

// // // //       {/* platforms */}
// // // //       {platforms.length > 0 && (
// // // //         <section className="bg-mist py-20 lg:py-24">
// // // //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //             <Reveal><SectionHead eyebrow={S.platforms.eyebrow} title={S.platforms.title} body={S.platforms.body} /></Reveal>
// // // //             <Reveal className="mt-10"><PlatformTabs items={platforms} /></Reveal>
// // // //             <p className="mt-4 text-[12px] text-slate-soft">Platform names are trademarks of their respective owners; no official partnership is implied.</p>
// // // //           </div>
// // // //         </section>
// // // //       )}

// // // //       {/* architecture */}
// // // //       <section className="bg-white py-20 lg:py-28">
// // // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //           <Reveal><SectionHead eyebrow={S.architecture.eyebrow} title={S.architecture.title} body={S.architecture.body} /></Reveal>
// // // //           <Reveal className="on-dark mt-10 border border-navy-800 bg-navy-900 text-white">
// // // //             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
// // // //               <span>Production reference architecture</span>
// // // //               <span className="flex items-center gap-4"><span className="flex items-center gap-2"><i className="h-px w-5 bg-brand-400" />Traffic</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" />Requests</span></span>
// // // //             </div>
// // // //             <div className="p-5 sm:p-8"><FlowDiagram variant="cloud" caption="Production reference architecture" /></div>
// // // //           </Reveal>
// // // //           <dl className="mt-8 grid gap-6 sm:grid-cols-3">
// // // //             {[["Edge", "CDN, WAF and DDoS filtering sit in front of everything."], ["Application", "Stateless nodes behind a multi-zone load balancer scale on demand."], ["Data", "Replicated databases with continuous, cross-region backup."]].map(([t, d]) => (
// // // //               <div key={t} className="border-l-2 border-brand-600 pl-4"><dt className="text-[14.5px] font-semibold">{t}</dt><dd className="mt-1 text-[14px] text-slate-soft">{d}</dd></div>
// // // //             ))}
// // // //           </dl>
// // // //         </div>
// // // //       </section>

// // // //       {/* security — full-bleed image */}
// // // //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
// // // //         <div className="absolute inset-0 -z-20"><SmartImage src={S.security.imageUrl} alt="" sizes="100vw" style={{ objectPosition: "center 40%" }} /></div>
// // // //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" aria-hidden="true" />
// // // //         <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
// // // //           <Reveal className="lg:col-span-5">
// // // //             <p className="eyebrow mb-4 !text-[#5fd6a0]">{S.security.eyebrow}</p>
// // // //             <h2 className="h-section text-balance">{S.security.title}</h2>
// // // //             <p className="lead mt-5">{S.security.body}</p>
// // // //             <Link href={S.security.buttonUrl || "/security/ddos-protection"} className="btn btn-primary mt-8">{S.security.buttonText || "Explore security"} <span className="arrow" aria-hidden="true">→</span></Link>
// // // //           </Reveal>
// // // //           <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
// // // //             {securitySvcs.map((s, i) => (
// // // //               <li key={s.id}>
// // // //                 <Reveal delay={i * 0.06}>
// // // //                   <Link href={`/security/${s.slug}`} className="group flex items-center gap-5 px-2 py-5 transition-colors hover:bg-white/5">
// // // //                     <ServiceIcon kind={s.icon} className="h-11 w-11 shrink-0 !text-[#8fc2f5]" />
// // // //                     <span className="flex-1">
// // // //                       <span className="block text-[16px] font-semibold">{s.title}</span>
// // // //                       <span className="mt-0.5 block text-[13.5px] text-white/65">{s.shortDescription}</span>
// // // //                     </span>
// // // //                     <span className="text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
// // // //                   </Link>
// // // //                 </Reveal>
// // // //               </li>
// // // //             ))}
// // // //           </ul>
// // // //         </div>
// // // //       </section>

// // // //       {/* migration */}
// // // //       <section className="bg-white py-20 lg:py-28">
// // // //         <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
// // // //           <ClipReveal className="img-zoom relative aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
// // // //             <SmartImage src={S.migration.imageUrl} alt="Server migration data hall" sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: "center" }} />
// // // //             <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
// // // //             <p className="absolute bottom-4 left-4 border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">Rehearsed · Reversible</p>
// // // //           </ClipReveal>
// // // //           <div className="lg:col-span-7">
// // // //             <Reveal>
// // // //               <p className="eyebrow mb-3">{S.migration.eyebrow}</p>
// // // //               <h2 className="h-section text-balance">{S.migration.title}</h2>
// // // //               <p className="lead mt-4 max-w-xl">{S.migration.body}</p>
// // // //             </Reveal>
// // // //             <ol className="relative mt-10 space-y-7">
// // // //               <span className="absolute bottom-3 left-[17px] top-3 w-px bg-linear-to-b from-brand-500 via-brand-300 to-transparent" aria-hidden="true" />
// // // //               {(mig?.process.length ? mig.process.map((p) => ({ t: p.title, d: p.description })) : [{ t: "Assess", d: "" }]).map((p, i) => (
// // // //                 <li key={p.t}>
// // // //                   <Reveal delay={i * 0.1} className="relative flex gap-5">
// // // //                     <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
// // // //                     <div><h3 className="text-[16px] font-semibold">{p.t}</h3><p className="mt-1 text-[14.5px] text-slate-soft">{p.d}</p></div>
// // // //                   </Reveal>
// // // //                 </li>
// // // //               ))}
// // // //             </ol>
// // // //             <ArrowLink href={S.migration.buttonUrl || "/services/cloud-migration"} className="mt-9">{S.migration.buttonText || "Plan a migration"}</ArrowLink>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* devops */}
// // // //       <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
// // // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //           <div className="grid items-center gap-12 lg:grid-cols-12">
// // // //             <Reveal className="lg:col-span-5">
// // // //               <p className="eyebrow mb-4">{S.devops.eyebrow}</p>
// // // //               <h2 className="h-section text-balance">{S.devops.title}</h2>
// // // //               <p className="lead mt-5">{S.devops.body}</p>
// // // //               <Link href={S.devops.buttonUrl || "/services/devops"} className="btn btn-primary mt-8">{S.devops.buttonText || "Explore DevOps"} <span className="arrow" aria-hidden="true">→</span></Link>
// // // //             </Reveal>
// // // //             <Reveal className="lg:col-span-7" delay={0.1}><PipelineTerminal /></Reveal>
// // // //           </div>
// // // //           <div className="mt-14 border-t border-white/10 pt-10"><FlowDiagram variant="devops" caption="CI/CD pipeline stages" /></div>
// // // //         </div>
// // // //       </section>

// // // //       {/* managed infrastructure */}
// // // //       <section className="bg-mist py-20 lg:py-28">
// // // //         <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
// // // //           <div className="relative lg:col-span-7">
// // // //             <ClipReveal className="img-zoom relative aspect-[16/10]"><SmartImage src={S.managed.imageUrl} alt="Network operations center" sizes="(min-width:1024px) 55vw, 100vw" /><div className="absolute inset-0 bg-navy-950/25" aria-hidden="true" /></ClipReveal>
// // // //             <Reveal delay={0.3} className="on-dark mt-4 text-white lg:absolute lg:-right-20 lg:bottom-8 lg:mt-0 lg:w-[310px]"><MonitorPanel /></Reveal>
// // // //           </div>
// // // //           <Reveal className="lg:col-span-4 lg:col-start-9">
// // // //             <p className="eyebrow mb-3">{S.managed.eyebrow}</p>
// // // //             <h2 className="h-section text-balance">{S.managed.title}</h2>
// // // //             <p className="lead mt-4">{S.managed.body}</p>
// // // //             <ArrowLink href={S.managed.buttonUrl || "/services/managed-services"} className="mt-7">{S.managed.buttonText || "Managed services"}</ArrowLink>
// // // //           </Reveal>
// // // //         </div>
// // // //       </section>

// // // //       {/* statistics */}
// // // //       <section className="on-dark bg-navy-900 py-14 text-white" aria-label={S.stats.title}>
// // // //         <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
// // // //           {S.stats.items.map((s) => (
// // // //             <div key={s.title} className="lg:px-8 lg:first:pl-0">
// // // //               <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none"><Counter value={s.title} /></dt>
// // // //               <dd className="mt-3 text-[13.5px] text-white/65">{s.text}</dd>
// // // //             </div>
// // // //           ))}
// // // //         </dl>
// // // //       </section>

// // // //       {/* news */}
// // // //       {latest.length > 0 && (
// // // //         <section className="bg-white py-20 lg:py-24">
// // // //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //             <div className="flex items-end justify-between gap-6">
// // // //               <div><p className="eyebrow mb-3">{S.news.eyebrow}</p><h2 className="h-section">{S.news.title}</h2></div>
// // // //               <ArrowLink href="/news" className="hidden sm:inline-flex">All news</ArrowLink>
// // // //             </div>
// // // //             <div className="mt-10 grid gap-8 lg:grid-cols-12">
// // // //               <Link href={`/news/${latest[0].n.slug}`} className="group lg:col-span-7">
// // // //                 <div className="img-zoom relative aspect-[16/9] overflow-hidden bg-navy-900"><SmartImage src={latest[0].n.featuredImageUrl} alt="" sizes="(min-width:1024px) 55vw, 100vw" /></div>
// // // //                 <p className="mt-5 font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{latest[0].categoryName} · {fmtDate(latest[0].n.publishedAt ?? latest[0].n.createdAt)}</p>
// // // //                 <h3 className="mt-2 text-[1.5rem] font-semibold leading-snug group-hover:text-brand-700">{latest[0].n.title}</h3>
// // // //                 <p className="mt-2 text-slate-soft">{latest[0].n.excerpt}</p>
// // // //               </Link>
// // // //               <ul className="divide-y divide-line border-y border-line lg:col-span-5">
// // // //                 {latest.slice(1).map((x) => (
// // // //                   <li key={x.n.id}>
// // // //                     <Link href={`/news/${x.n.slug}`} className="group flex gap-5 py-6">
// // // //                       <div className="img-zoom relative h-24 w-32 shrink-0 overflow-hidden bg-navy-900 sm:h-28 sm:w-40"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="160px" /></div>
// // // //                       <div>
// // // //                         <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
// // // //                         <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
// // // //                       </div>
// // // //                     </Link>
// // // //                   </li>
// // // //                 ))}
// // // //               </ul>
// // // //             </div>
// // // //           </div>
// // // //         </section>
// // // //       )}

// // // //       {/* CTA */}
// // // //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
// // // //         <div className="absolute inset-0 -z-20"><SmartImage src={S.cta.imageUrl} alt="" sizes="100vw" /></div>
// // // //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-900/50" aria-hidden="true" />
// // // //         <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
// // // //           <p className="eyebrow mb-4">{S.cta.eyebrow}</p>
// // // //           <h2 className="h-section max-w-2xl text-balance">{S.cta.title}</h2>
// // // //           <p className="lead mt-4 max-w-xl">{S.cta.body}</p>
// // // //           <div className="mt-8 flex flex-wrap gap-3">
// // // //             <Link href={S.cta.buttonUrl || "/contact"} className="btn btn-primary">{S.cta.buttonText || "Talk to an Expert"} <span className="arrow" aria-hidden="true">→</span></Link>
// // // //             <Link href="/register" className="btn btn-ghost-light">Create customer account</Link>
// // // //           </div>
// // // //         </Reveal>
// // // //       </section>
// // // //     </>
// // // //   );
// // // // }





// // // // new new code 





// // // import Link from "next/link";
// // // import { and, asc, eq, inArray } from "drizzle-orm";
// // // import { db } from "@/db";
// // // import { serviceFeatures } from "@/db/schema";
// // // import { Hero } from "@/components/Hero";
// // // import { SmartImage } from "@/components/SmartImage";
// // // import { ArrowLink, JsonLd, SectionHead } from "@/components/ui";
// // // import { ClipReveal, Counter, Reveal } from "@/components/motion";
// // // import { FlowDiagram, MonitorPanel, PipelineTerminal, ServiceIcon } from "@/components/graphics";
// // // import { PlatformTabs, type Platform } from "@/components/PlatformTabs";
// // // import { Rack3D } from "@/components/Rack3D";
// // // import { MarketplacesSection } from "@/components/MarketplacesSection";
// // // import { buildMetadata, getPageHero, getSections, getService, listNews, listServices, customSchema } from "@/lib/data";
// // // import { fmtDate } from "@/lib/util";

// // // export async function generateMetadata() {
// // //   return buildMetadata({
// // //     type: "page", key: "home", path: "/", fallbackTitle: "Cloud, Server, DevOps, Security & Managed Services",
// // //     fallbackDescription: "Secure, scalable and professionally managed cloud infrastructure, migration, DevOps, email and security services for businesses.",
// // //     image: "/images/hero/home-datacenter.jpg",
// // //   });
// // // }

// // // const CAPS = [
// // //   { label: "Public Cloud", href: "/cloud/public-cloud", icon: "cloud" },
// // //   { label: "Private Cloud", href: "/cloud/private-cloud", icon: "server" },
// // //   { label: "Email & Collaboration", href: "/workplace/m365", icon: "mail" },
// // //   { label: "Cloud Migration", href: "/services/cloud-migration", icon: "migrate" },
// // //   { label: "Security", href: "/security/ddos-protection", icon: "shield" },
// // //   { label: "DevOps", href: "/services/devops", icon: "pipeline" },
// // // ];

// // // export default async function HomePage() {
// // //   const [hero, sec, svcs, latest, schema, mig] = await Promise.all([
// // //     getPageHero("home"), getSections("home"), listServices(), listNews(3), customSchema("page", "home"), getService("services", "cloud-migration"),
// // //   ]);
// // //   const by = (slug: string) => svcs.find((s) => s.slug === slug);
// // //   const pc = by("public-cloud");
// // //   const platformSlugs = ["aws", "azure", "google-cloud", "private-cloud", "hybrid-cloud"];
// // //   const ids = [pc?.id, ...platformSlugs.map((s) => by(s)?.id)].filter((x): x is number => !!x);
// // //   const feats = ids.length ? await db.select().from(serviceFeatures).where(and(inArray(serviceFeatures.serviceId, ids), eq(serviceFeatures.kind, "feature"))).orderBy(asc(serviceFeatures.sortOrder)) : [];
// // //   const pts = (id?: number) => feats.filter((f) => f.serviceId === id).map((f) => f.title);

// // //   const platforms: Platform[] = platformSlugs.flatMap((slug) => {
// // //     const s = by(slug);
// // //     return s ? [{ id: s.slug, title: s.title, kicker: s.category === "cloud" && s.parentSlug ? "Public cloud" : "Cloud platform", description: s.shortDescription, image: s.cardImageUrl || s.heroImageUrl, href: `/${s.category}/${s.slug}`, points: pts(s.id).slice(0, 3) }] : [];
// // //   });

// // //   const smalls = [
// // //     { title: "Private Cloud", text: by("private-cloud")?.shortDescription ?? "", href: "/cloud/private-cloud", icon: "server" },
// // //     { title: "Email & Collaboration", text: "Microsoft 365, Google Workspace and Zimbra — deployed, migrated and supported.", href: "/workplace/m365", icon: "mail" },
// // //     { title: "Cloud Migration", text: by("cloud-migration")?.shortDescription ?? "", href: "/services/cloud-migration", icon: "migrate" },
// // //     { title: "Security", text: "DDoS protection, data security, VAPT, anti-virus and Active Directory.", href: "/security/ddos-protection", icon: "shield" },
// // //     { title: "DevOps", text: by("devops")?.shortDescription ?? "", href: "/services/devops", icon: "pipeline" },
// // //   ];
// // //   const securitySvcs = svcs.filter((s) => s.category === "security");
// // //   const S = sec;

// // //   return (
// // //     <>
// // //       <JsonLd data={schema} />
// // //       <Hero hero={hero} trust={["24×7 monitored infrastructure", "Multi-cloud engineering", "Security-first operations"]} />

// // //       {/* capability strip */}
// // //       <section aria-label="Capabilities" className="border-b border-line bg-white">
// // //         <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
// // //           {CAPS.map((c) => (
// // //             <li key={c.label}>
// // //               <Link href={c.href} className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-brand-50">
// // //                 <ServiceIcon kind={c.icon} className="h-9 w-9 shrink-0" />
// // //                 <span className="text-[13.5px] font-semibold leading-tight">{c.label}</span>
// // //               </Link>
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </section>

// // //       {/* infrastructure story — dark, with 3D rack */}
// // //       {/* <section className="on-dark bg-navy-950 text-white">
// // //         <div className="grid lg:grid-cols-12">
// // //           <div className="px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
// // //             <Reveal>
// // //               <p className="eyebrow mb-4">{S.story.eyebrow}</p>
// // //               <h2 className="h-section text-balance">{S.story.title}</h2>
// // //               <p className="lead mt-5">{S.story.body}</p>
// // //             </Reveal>
// // //             <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
// // //               {S.story.items.map((it, i) => (
// // //                 <li key={it.title}>
// // //                   <Reveal delay={i * 0.08} className="flex gap-5 py-5">
// // //                     <span className="font-mono text-[12px] text-brand-300">0{i + 1}</span>
// // //                     <div>
// // //                       <h3 className="text-[16px] font-semibold">{it.title}</h3>
// // //                       <p className="mt-1 text-[14px] text-white/65">{it.text}</p>
// // //                     </div>
// // //                   </Reveal>
// // //                 </li>
// // //               ))}
// // //             </ol>
// // //           </div>
// // //           <div className="relative min-h-[340px] lg:col-span-7 lg:min-h-[600px]">
// // //             <Rack3D fallback="/images/stock/public-cloud.jpg" alt="Server racks with network cabling in a data center" />
// // //             <p className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 sm:left-8">
// // //               <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" /> Reference rack model
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </section> */}

// // //       {/* services — featured + index grid */}
// // //       <section className="bg-white py-20 lg:py-28">
// // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // //           <Reveal><SectionHead eyebrow={S.services.eyebrow} title={S.services.title} body={S.services.body} /></Reveal>
// // //           {pc && (
// // //             <div className="mt-12 grid overflow-hidden border border-line lg:grid-cols-12">
// // //               <ClipReveal className="img-zoom relative min-h-[300px] lg:col-span-7 lg:min-h-[460px]">
// // //                 <SmartImage src={pc.cardImageUrl || pc.heroImageUrl} alt="Public cloud data center campus" sizes="(min-width:1024px) 58vw, 100vw" />
// // //                 <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
// // //                 <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
// // //                   {[["AWS", "/cloud/aws"], ["Azure", "/cloud/azure"], ["Google Cloud", "/cloud/google-cloud"]].map(([l, h]) => (
// // //                     <li key={l}><Link href={h} className="block border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900">{l}</Link></li>
// // //                   ))}
// // //                 </ul>
// // //               </ClipReveal>
// // //               <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
// // //                 <ServiceIcon kind="cloud" className="always mb-6 h-14 w-14" />
// // //                 <p className="eyebrow mb-2">Featured service</p>
// // //                 <h3 className="text-[1.75rem] font-semibold leading-tight">{pc.title}</h3>
// // //                 <p className="mt-3 leading-relaxed text-slate-soft">{pc.shortDescription}</p>
// // //                 <ul className="mt-6 space-y-2.5">
// // //                   {pts(pc.id).map((p) => (
// // //                     <li key={p} className="flex gap-3 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{p}</li>
// // //                   ))}
// // //                 </ul>
// // //                 <ArrowLink href="/cloud/public-cloud" className="mt-8">Learn more about Public Cloud</ArrowLink>
// // //               </div>
// // //             </div>
// // //           )}
// // //           {/* <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
// // //             {smalls.map((s, i) => (
// // //               <li key={s.title}>
// // //                 <Reveal delay={i * 0.06}>
// // //                   <Link href={s.href} className="group block border-t-2 border-line pt-6 transition-colors duration-300 hover:border-brand-600">
// // //                     <ServiceIcon kind={s.icon} className="mb-5 h-12 w-12" />
// // //                     <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
// // //                     <p className="mt-2 text-[14px] leading-relaxed text-slate-soft">{s.text}</p>
// // //                     <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600">Learn more <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
// // //                   </Link>
// // //                 </Reveal>
// // //               </li>
// // //             ))}
// // //           </ul> */}
// // //         </div>
// // //       </section>

// // //       {/* platforms */}
// // //       {platforms.length > 0 && (
// // //         <section className="bg-mist py-20 lg:py-24">
// // //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // //             <Reveal><SectionHead eyebrow={S.platforms.eyebrow} title={S.platforms.title} body={S.platforms.body} /></Reveal>
// // //             <Reveal className="mt-10"><PlatformTabs items={platforms} /></Reveal>
// // //             <p className="mt-4 text-[12px] text-slate-soft">Platform names are trademarks of their respective owners; no official partnership is implied.</p>
// // //           </div>
// // //         </section>
// // //       )}

// // //       {/* architecture */}
// // //       <section className="bg-white py-20 lg:py-28">
// // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // //           <Reveal><SectionHead eyebrow={S.architecture.eyebrow} title={S.architecture.title} body={S.architecture.body} /></Reveal>
// // //           <Reveal className="on-dark mt-10 border border-navy-800 bg-navy-900 text-white">
// // //             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
// // //               <span>Production reference architecture</span>
// // //               <span className="flex items-center gap-4"><span className="flex items-center gap-2"><i className="h-px w-5 bg-brand-400" />Traffic</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" />Requests</span></span>
// // //             </div>
// // //             <div className="p-5 sm:p-8"><FlowDiagram variant="cloud" caption="Production reference architecture" /></div>
// // //           </Reveal>
// // //           <dl className="mt-8 grid gap-6 sm:grid-cols-3">
// // //             {[["Edge", "CDN, WAF and DDoS filtering sit in front of everything."], ["Application", "Stateless nodes behind a multi-zone load balancer scale on demand."], ["Data", "Replicated databases with continuous, cross-region backup."]].map(([t, d]) => (
// // //               <div key={t} className="border-l-2 border-brand-600 pl-4"><dt className="text-[14.5px] font-semibold">{t}</dt><dd className="mt-1 text-[14px] text-slate-soft">{d}</dd></div>
// // //             ))}
// // //           </dl>
// // //         </div>
// // //       </section>

// // //       {/* security — full-bleed image */}
// // //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
// // //         <div className="absolute inset-0 -z-20"><SmartImage src={S.security.imageUrl} alt="" sizes="100vw" style={{ objectPosition: "center 40%" }} /></div>
// // //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" aria-hidden="true" />
// // //         <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
// // //           <Reveal className="lg:col-span-5">
// // //             <p className="eyebrow mb-4 !text-[#5fd6a0]">{S.security.eyebrow}</p>
// // //             <h2 className="h-section text-balance">{S.security.title}</h2>
// // //             <p className="lead mt-5">{S.security.body}</p>
// // //             <Link href={S.security.buttonUrl || "/security/ddos-protection"} className="btn btn-primary mt-8">{S.security.buttonText || "Explore security"} <span className="arrow" aria-hidden="true">→</span></Link>
// // //           </Reveal>
// // //           <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
// // //             {securitySvcs.map((s, i) => (
// // //               <li key={s.id}>
// // //                 <Reveal delay={i * 0.06}>
// // //                   <Link href={`/security/${s.slug}`} className="group flex items-center gap-5 px-2 py-5 transition-colors hover:bg-white/5">
// // //                     <ServiceIcon kind={s.icon} className="h-11 w-11 shrink-0 !text-[#8fc2f5]" />
// // //                     <span className="flex-1">
// // //                       <span className="block text-[16px] font-semibold">{s.title}</span>
// // //                       <span className="mt-0.5 block text-[13.5px] text-white/65">{s.shortDescription}</span>
// // //                     </span>
// // //                     <span className="text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
// // //                   </Link>
// // //                 </Reveal>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       </section>

// // //       {/* migration */}
// // //       <section className="bg-white py-20 lg:py-28">
// // //         <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
// // //           <ClipReveal className="img-zoom relative aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
// // //             <SmartImage src={S.migration.imageUrl} alt="Server migration data hall" sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: "center" }} />
// // //             <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
// // //             <p className="absolute bottom-4 left-4 border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">Rehearsed · Reversible</p>
// // //           </ClipReveal>
// // //           <div className="lg:col-span-7">
// // //             <Reveal>
// // //               <p className="eyebrow mb-3">{S.migration.eyebrow}</p>
// // //               <h2 className="h-section text-balance">{S.migration.title}</h2>
// // //               <p className="lead mt-4 max-w-xl">{S.migration.body}</p>
// // //             </Reveal>
// // //             <ol className="relative mt-10 space-y-7">
// // //               <span className="absolute bottom-3 left-[17px] top-3 w-px bg-linear-to-b from-brand-500 via-brand-300 to-transparent" aria-hidden="true" />
// // //               {(mig?.process.length ? mig.process.map((p) => ({ t: p.title, d: p.description })) : [{ t: "Assess", d: "" }]).map((p, i) => (
// // //                 <li key={p.t}>
// // //                   <Reveal delay={i * 0.1} className="relative flex gap-5">
// // //                     <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
// // //                     <div><h3 className="text-[16px] font-semibold">{p.t}</h3><p className="mt-1 text-[14.5px] text-slate-soft">{p.d}</p></div>
// // //                   </Reveal>
// // //                 </li>
// // //               ))}
// // //             </ol>
// // //             <ArrowLink href={S.migration.buttonUrl || "/services/cloud-migration"} className="mt-9">{S.migration.buttonText || "Plan a migration"}</ArrowLink>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* devops */}
// // //       <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
// // //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // //           <div className="grid items-center gap-12 lg:grid-cols-12">
// // //             <Reveal className="lg:col-span-5">
// // //               <p className="eyebrow mb-4">{S.devops.eyebrow}</p>
// // //               <h2 className="h-section text-balance">{S.devops.title}</h2>
// // //               <p className="lead mt-5">{S.devops.body}</p>
// // //               <Link href={S.devops.buttonUrl || "/services/devops"} className="btn btn-primary mt-8">{S.devops.buttonText || "Explore DevOps"} <span className="arrow" aria-hidden="true">→</span></Link>
// // //             </Reveal>
// // //             <Reveal className="lg:col-span-7" delay={0.1}><PipelineTerminal /></Reveal>
// // //           </div>
// // //           <div className="mt-14 border-t border-white/10 pt-10"><FlowDiagram variant="devops" caption="CI/CD pipeline stages" /></div>
// // //         </div>
// // //       </section>

// // //       {/* managed infrastructure */}
// // //       <section className="bg-mist py-20 lg:py-28">
// // //         <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
// // //           <div className="relative lg:col-span-7">
// // //             <ClipReveal className="img-zoom relative aspect-[16/10]"><SmartImage src={S.managed.imageUrl} alt="Network operations center" sizes="(min-width:1024px) 55vw, 100vw" /><div className="absolute inset-0 bg-navy-950/25" aria-hidden="true" /></ClipReveal>
// // //             <Reveal delay={0.3} className="on-dark mt-4 text-white lg:absolute lg:-right-20 lg:bottom-8 lg:mt-0 lg:w-[310px]"><MonitorPanel /></Reveal>
// // //           </div>
// // //           <Reveal className="lg:col-span-4 lg:col-start-9">
// // //             <p className="eyebrow mb-3">{S.managed.eyebrow}</p>
// // //             <h2 className="h-section text-balance">{S.managed.title}</h2>
// // //             <p className="lead mt-4">{S.managed.body}</p>
// // //             <ArrowLink href={S.managed.buttonUrl || "/services/managed-services"} className="mt-7">{S.managed.buttonText || "Managed services"}</ArrowLink>
// // //           </Reveal>
// // //         </div>
// // //       </section>

// // //       {/* statistics */}
// // //       <section className="on-dark bg-navy-900 py-14 text-white" aria-label={S.stats.title}>
// // //         <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
// // //           {S.stats.items.map((s) => (
// // //             <div key={s.title} className="lg:px-8 lg:first:pl-0">
// // //               <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none"><Counter value={s.title} /></dt>
// // //               <dd className="mt-3 text-[13.5px] text-white/65">{s.text}</dd>
// // //             </div>
// // //           ))}
// // //         </dl>
// // //       </section>

// // //       {/* our marketplaces — client products carousel (managed from Admin > Marketplaces) */}
// // //       <MarketplacesSection />

// // //       {/* news */}
// // //       {latest.length > 0 && (
// // //         <section className="bg-white py-20 lg:py-24">
// // //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// // //             <div className="flex items-end justify-between gap-6">
// // //               <div><p className="eyebrow mb-3">{S.news.eyebrow}</p><h2 className="h-section">{S.news.title}</h2></div>
// // //               <ArrowLink href="/news" className="hidden sm:inline-flex">All news</ArrowLink>
// // //             </div>
// // //             <div className="mt-10 grid gap-8 lg:grid-cols-12">
// // //               <Link href={`/news/${latest[0].n.slug}`} className="group lg:col-span-7">
// // //                 <div className="img-zoom relative aspect-[16/9] overflow-hidden bg-navy-900"><SmartImage src={latest[0].n.featuredImageUrl} alt="" sizes="(min-width:1024px) 55vw, 100vw" /></div>
// // //                 <p className="mt-5 font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{latest[0].categoryName} · {fmtDate(latest[0].n.publishedAt ?? latest[0].n.createdAt)}</p>
// // //                 <h3 className="mt-2 text-[1.5rem] font-semibold leading-snug group-hover:text-brand-700">{latest[0].n.title}</h3>
// // //                 <p className="mt-2 text-slate-soft">{latest[0].n.excerpt}</p>
// // //               </Link>
// // //               <ul className="divide-y divide-line border-y border-line lg:col-span-5">
// // //                 {latest.slice(1).map((x) => (
// // //                   <li key={x.n.id}>
// // //                     <Link href={`/news/${x.n.slug}`} className="group flex gap-5 py-6">
// // //                       <div className="img-zoom relative h-24 w-32 shrink-0 overflow-hidden bg-navy-900 sm:h-28 sm:w-40"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="160px" /></div>
// // //                       <div>
// // //                         <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
// // //                         <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
// // //                       </div>
// // //                     </Link>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           </div>
// // //         </section>
// // //       )}

// // //       {/* CTA */}
// // //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
// // //         <div className="absolute inset-0 -z-20"><SmartImage src={S.cta.imageUrl} alt="" sizes="100vw" /></div>
// // //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-900/50" aria-hidden="true" />
// // //         <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
// // //           <p className="eyebrow mb-4">{S.cta.eyebrow}</p>
// // //           <h2 className="h-section max-w-2xl text-balance">{S.cta.title}</h2>
// // //           <p className="lead mt-4 max-w-xl">{S.cta.body}</p>
// // //           <div className="mt-8 flex flex-wrap gap-3">
// // //             <Link href={S.cta.buttonUrl || "/contact"} className="btn btn-primary">{S.cta.buttonText || "Talk to an Expert"} <span className="arrow" aria-hidden="true">→</span></Link>
// // //             <Link href="/register" className="btn btn-ghost-light">Create customer account</Link>
// // //           </div>
// // //         </Reveal>
// // //       </section>
// // //     </>
// // //   );
// // // }








// // // new code 









// // import Link from "next/link";
// // import { and, asc, eq, inArray } from "drizzle-orm";
// // import { db } from "@/db";
// // import { serviceFeatures } from "@/db/schema";
// // import { Hero } from "@/components/Hero";
// // import { SmartImage } from "@/components/SmartImage";
// // import { ArrowLink, JsonLd, SectionHead } from "@/components/ui";
// // import { ClipReveal, Counter, Reveal } from "@/components/motion";
// // import { FlowDiagram, MonitorPanel, PipelineTerminal, ServiceIcon } from "@/components/graphics";
// // import { PlatformTabs, type Platform } from "@/components/PlatformTabs";
// // import { Rack3D } from "@/components/Rack3D";
// // import { MarketplaceCarousel } from "@/components/MarketplaceCarousel";
// // import { buildMetadata, getPageHero, getSections, getService, getMarketplaces, listNews, listServices, customSchema } from "@/lib/data";
// // import { fmtDate } from "@/lib/util";

// // export async function generateMetadata() {
// //   return buildMetadata({
// //     type: "page", key: "home", path: "/", fallbackTitle: "Cloud, Server, DevOps, Security & Managed Services",
// //     fallbackDescription: "Secure, scalable and professionally managed cloud infrastructure, migration, DevOps, email and security services for businesses.",
// //     image: "/images/hero/home-datacenter.jpg",
// //   });
// // }

// // const CAPS = [
// //   { label: "Public Cloud", href: "/cloud/public-cloud", icon: "cloud" },
// //   { label: "Private Cloud", href: "/cloud/private-cloud", icon: "server" },
// //   { label: "Email & Collaboration", href: "/workplace/m365", icon: "mail" },
// //   { label: "Cloud Migration", href: "/services/cloud-migration", icon: "migrate" },
// //   { label: "Security", href: "/security/ddos-protection", icon: "shield" },
// //   { label: "DevOps", href: "/services/devops", icon: "pipeline" },
// // ];

// // export default async function HomePage() {
// //   const [hero, sec, svcs, latest, schema, mig, market] = await Promise.all([
// //     getPageHero("home"), getSections("home"), listServices(), listNews(3), customSchema("page", "home"), getService("services", "cloud-migration"), getMarketplaces(),
// //   ]);
// //   const by = (slug: string) => svcs.find((s) => s.slug === slug);
// //   const pc = by("public-cloud");
// //   const platformSlugs = ["aws", "azure", "google-cloud", "private-cloud", "hybrid-cloud"];
// //   const ids = [pc?.id, ...platformSlugs.map((s) => by(s)?.id)].filter((x): x is number => !!x);
// //   const feats = ids.length ? await db.select().from(serviceFeatures).where(and(inArray(serviceFeatures.serviceId, ids), eq(serviceFeatures.kind, "feature"))).orderBy(asc(serviceFeatures.sortOrder)) : [];
// //   const pts = (id?: number) => feats.filter((f) => f.serviceId === id).map((f) => f.title);

// //   const platforms: Platform[] = platformSlugs.flatMap((slug) => {
// //     const s = by(slug);
// //     return s ? [{ id: s.slug, title: s.title, kicker: s.category === "cloud" && s.parentSlug ? "Public cloud" : "Cloud platform", description: s.shortDescription, image: s.cardImageUrl || s.heroImageUrl, href: `/${s.category}/${s.slug}`, points: pts(s.id).slice(0, 3) }] : [];
// //   });

// //   const smalls = [
// //     { title: "Private Cloud", text: by("private-cloud")?.shortDescription ?? "", href: "/cloud/private-cloud", icon: "server" },
// //     { title: "Email & Collaboration", text: "Microsoft 365, Google Workspace and Zimbra — deployed, migrated and supported.", href: "/workplace/m365", icon: "mail" },
// //     { title: "Cloud Migration", text: by("cloud-migration")?.shortDescription ?? "", href: "/services/cloud-migration", icon: "migrate" },
// //     { title: "Security", text: "DDoS protection, data security, VAPT, anti-virus and Active Directory.", href: "/security/ddos-protection", icon: "shield" },
// //     { title: "DevOps", text: by("devops")?.shortDescription ?? "", href: "/services/devops", icon: "pipeline" },
// //   ];
// //   const securitySvcs = svcs.filter((s) => s.category === "security");
// //   const S = sec;

// //   // Marketplaces heading (editable from Admin > Pages > Home, with fallbacks)
// //   const M = S.marketplaces;
// //   const showMarket = market.length > 0 && (M ? M.isActive : true);

// //   return (
// //     <>
// //       <JsonLd data={schema} />
// //       <Hero hero={hero} trust={["24×7 monitored infrastructure", "Multi-cloud engineering", "Security-first operations"]} />

// //       {/* capability strip */}
// //       <section aria-label="Capabilities" className="border-b border-line bg-white">
// //         <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
// //           {CAPS.map((c) => (
// //             <li key={c.label}>
// //               <Link href={c.href} className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-brand-50">
// //                 <ServiceIcon kind={c.icon} className="h-9 w-9 shrink-0" />
// //                 <span className="text-[13.5px] font-semibold leading-tight">{c.label}</span>
// //               </Link>
// //             </li>
// //           ))}
// //         </ul>
// //       </section>

// //       {/* infrastructure story — dark, with 3D rack */}
// //       {/* <section className="on-dark bg-navy-950 text-white">
// //         <div className="grid lg:grid-cols-12">
// //           <div className="px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
// //             <Reveal>
// //               <p className="eyebrow mb-4">{S.story.eyebrow}</p>
// //               <h2 className="h-section text-balance">{S.story.title}</h2>
// //               <p className="lead mt-5">{S.story.body}</p>
// //             </Reveal>
// //             <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
// //               {S.story.items.map((it, i) => (
// //                 <li key={it.title}>
// //                   <Reveal delay={i * 0.08} className="flex gap-5 py-5">
// //                     <span className="font-mono text-[12px] text-brand-300">0{i + 1}</span>
// //                     <div>
// //                       <h3 className="text-[16px] font-semibold">{it.title}</h3>
// //                       <p className="mt-1 text-[14px] text-white/65">{it.text}</p>
// //                     </div>
// //                   </Reveal>
// //                 </li>
// //               ))}
// //             </ol>
// //           </div>
// //           <div className="relative min-h-[340px] lg:col-span-7 lg:min-h-[600px]">
// //             <Rack3D fallback="/images/stock/public-cloud.jpg" alt="Server racks with network cabling in a data center" />
// //             <p className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 sm:left-8">
// //               <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" /> Reference rack model
// //             </p>
// //           </div>
// //         </div>
// //       </section> */}

// //       {/* services — featured + index grid */}
// //       {/* <section className="bg-white py-20 lg:py-28">
// //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //           <Reveal><SectionHead eyebrow={S.services.eyebrow} title={S.services.title} body={S.services.body} /></Reveal>
// //           {pc && (
// //             <div className="mt-12 grid overflow-hidden border border-line lg:grid-cols-12">
// //               <ClipReveal className="img-zoom relative min-h-[300px] lg:col-span-7 lg:min-h-[460px]">
// //                 <SmartImage src={pc.cardImageUrl || pc.heroImageUrl} alt="Public cloud data center campus" sizes="(min-width:1024px) 58vw, 100vw" />
// //                 <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
// //                 <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
// //                   {[["AWS", "/cloud/aws"], ["Azure", "/cloud/azure"], ["Google Cloud", "/cloud/google-cloud"]].map(([l, h]) => (
// //                     <li key={l}><Link href={h} className="block border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900">{l}</Link></li>
// //                   ))}
// //                 </ul>
// //               </ClipReveal>
// //               <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
// //                 <ServiceIcon kind="cloud" className="always mb-6 h-14 w-14" />
// //                 <p className="eyebrow mb-2">Featured service</p>
// //                 <h3 className="text-[1.75rem] font-semibold leading-tight">{pc.title}</h3>
// //                 <p className="mt-3 leading-relaxed text-slate-soft">{pc.shortDescription}</p>
// //                 <ul className="mt-6 space-y-2.5">
// //                   {pts(pc.id).map((p) => (
// //                     <li key={p} className="flex gap-3 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{p}</li>
// //                   ))}
// //                 </ul>
// //                 <ArrowLink href="/cloud/public-cloud" className="mt-8">Learn more about Public Cloud</ArrowLink>
// //               </div>
// //             </div>
// //           )}
// //           <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
// //             {smalls.map((s, i) => (
// //               <li key={s.title}>
// //                 <Reveal delay={i * 0.06}>
// //                   <Link href={s.href} className="group block border-t-2 border-line pt-6 transition-colors duration-300 hover:border-brand-600">
// //                     <ServiceIcon kind={s.icon} className="mb-5 h-12 w-12" />
// //                     <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
// //                     <p className="mt-2 text-[14px] leading-relaxed text-slate-soft">{s.text}</p>
// //                     <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600">Learn more <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
// //                   </Link>
// //                 </Reveal>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </section> */}

// //         {/* our marketplaces — client products carousel (managed from Admin > Marketplaces) */}
// //       {showMarket && (
// //         <section className="bg-mist py-20 lg:py-24" aria-label="Our marketplaces">
// //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //             <Reveal className="mb-10 max-w-2xl">
// //               <p className="eyebrow mb-3">{M?.eyebrow || "Our Marketplaces"}</p>
// //               <h2 className="h-section text-balance">{M?.title || "Products trusted by our clients"}</h2>
// //               {M?.body && <p className="mt-4 leading-relaxed text-slate-soft">{M.body}</p>}
// //             </Reveal>
// //             <MarketplaceCarousel items={market} />
// //           </div>
// //         </section>
// //       )}

// //       {/* platforms */}
// //       {platforms.length > 0 && (
// //         <section className="bg-mist py-20 lg:py-24">
// //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //             <Reveal><SectionHead eyebrow={S.platforms.eyebrow} title={S.platforms.title} body={S.platforms.body} /></Reveal>
// //             <Reveal className="mt-10"><PlatformTabs items={platforms} /></Reveal>
// //             <p className="mt-4 text-[12px] text-slate-soft">Platform names are trademarks of their respective owners; no official partnership is implied.</p>
// //           </div>
// //         </section>
// //       )}

// //       {/* architecture */}
// //       <section className="bg-white py-20 lg:py-28">
// //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //           <Reveal><SectionHead eyebrow={S.architecture.eyebrow} title={S.architecture.title} body={S.architecture.body} /></Reveal>
// //           <Reveal className="on-dark mt-10 border border-navy-800 bg-navy-900 text-white">
// //             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
// //               <span>Production reference architecture</span>
// //               <span className="flex items-center gap-4"><span className="flex items-center gap-2"><i className="h-px w-5 bg-brand-400" />Traffic</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" />Requests</span></span>
// //             </div>
// //             <div className="p-5 sm:p-8"><FlowDiagram variant="cloud" caption="Production reference architecture" /></div>
// //           </Reveal>
// //           <dl className="mt-8 grid gap-6 sm:grid-cols-3">
// //             {[["Edge", "CDN, WAF and DDoS filtering sit in front of everything."], ["Application", "Stateless nodes behind a multi-zone load balancer scale on demand."], ["Data", "Replicated databases with continuous, cross-region backup."]].map(([t, d]) => (
// //               <div key={t} className="border-l-2 border-brand-600 pl-4"><dt className="text-[14.5px] font-semibold">{t}</dt><dd className="mt-1 text-[14px] text-slate-soft">{d}</dd></div>
// //             ))}
// //           </dl>
// //         </div>
// //       </section>

// //       {/* security — full-bleed image */}
// //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
// //         <div className="absolute inset-0 -z-20"><SmartImage src={S.security.imageUrl} alt="" sizes="100vw" style={{ objectPosition: "center 40%" }} /></div>
// //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" aria-hidden="true" />
// //         <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
// //           <Reveal className="lg:col-span-5">
// //             <p className="eyebrow mb-4 !text-[#5fd6a0]">{S.security.eyebrow}</p>
// //             <h2 className="h-section text-balance">{S.security.title}</h2>
// //             <p className="lead mt-5">{S.security.body}</p>
// //             <Link href={S.security.buttonUrl || "/security/ddos-protection"} className="btn btn-primary mt-8">{S.security.buttonText || "Explore security"} <span className="arrow" aria-hidden="true">→</span></Link>
// //           </Reveal>
// //           <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
// //             {securitySvcs.map((s, i) => (
// //               <li key={s.id}>
// //                 <Reveal delay={i * 0.06}>
// //                   <Link href={`/security/${s.slug}`} className="group flex items-center gap-5 px-2 py-5 transition-colors hover:bg-white/5">
// //                     <ServiceIcon kind={s.icon} className="h-11 w-11 shrink-0 !text-[#8fc2f5]" />
// //                     <span className="flex-1">
// //                       <span className="block text-[16px] font-semibold">{s.title}</span>
// //                       <span className="mt-0.5 block text-[13.5px] text-white/65">{s.shortDescription}</span>
// //                     </span>
// //                     <span className="text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
// //                   </Link>
// //                 </Reveal>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </section>

// //       {/* migration */}
// //       <section className="bg-white py-20 lg:py-28">
// //         <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
// //           <ClipReveal className="img-zoom relative aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
// //             <SmartImage src={S.migration.imageUrl} alt="Server migration data hall" sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: "center" }} />
// //             <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
// //             <p className="absolute bottom-4 left-4 border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">Rehearsed · Reversible</p>
// //           </ClipReveal>
// //           <div className="lg:col-span-7">
// //             <Reveal>
// //               <p className="eyebrow mb-3">{S.migration.eyebrow}</p>
// //               <h2 className="h-section text-balance">{S.migration.title}</h2>
// //               <p className="lead mt-4 max-w-xl">{S.migration.body}</p>
// //             </Reveal>
// //             <ol className="relative mt-10 space-y-7">
// //               <span className="absolute bottom-3 left-[17px] top-3 w-px bg-linear-to-b from-brand-500 via-brand-300 to-transparent" aria-hidden="true" />
// //               {(mig?.process.length ? mig.process.map((p) => ({ t: p.title, d: p.description })) : [{ t: "Assess", d: "" }]).map((p, i) => (
// //                 <li key={p.t}>
// //                   <Reveal delay={i * 0.1} className="relative flex gap-5">
// //                     <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
// //                     <div><h3 className="text-[16px] font-semibold">{p.t}</h3><p className="mt-1 text-[14.5px] text-slate-soft">{p.d}</p></div>
// //                   </Reveal>
// //                 </li>
// //               ))}
// //             </ol>
// //             <ArrowLink href={S.migration.buttonUrl || "/services/cloud-migration"} className="mt-9">{S.migration.buttonText || "Plan a migration"}</ArrowLink>
// //           </div>
// //         </div>
// //       </section>

// //       {/* devops */}
// //       <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
// //         <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //           <div className="grid items-center gap-12 lg:grid-cols-12">
// //             <Reveal className="lg:col-span-5">
// //               <p className="eyebrow mb-4">{S.devops.eyebrow}</p>
// //               <h2 className="h-section text-balance">{S.devops.title}</h2>
// //               <p className="lead mt-5">{S.devops.body}</p>
// //               <Link href={S.devops.buttonUrl || "/services/devops"} className="btn btn-primary mt-8">{S.devops.buttonText || "Explore DevOps"} <span className="arrow" aria-hidden="true">→</span></Link>
// //             </Reveal>
// //             <Reveal className="lg:col-span-7" delay={0.1}><PipelineTerminal /></Reveal>
// //           </div>
// //           <div className="mt-14 border-t border-white/10 pt-10"><FlowDiagram variant="devops" caption="CI/CD pipeline stages" /></div>
// //         </div>
// //       </section>

// //       {/* managed infrastructure */}
// //       <section className="bg-mist py-20 lg:py-28">
// //         <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
// //           <div className="relative lg:col-span-7">
// //             <ClipReveal className="img-zoom relative aspect-[16/10]"><SmartImage src={S.managed.imageUrl} alt="Network operations center" sizes="(min-width:1024px) 55vw, 100vw" /><div className="absolute inset-0 bg-navy-950/25" aria-hidden="true" /></ClipReveal>
// //             <Reveal delay={0.3} className="on-dark mt-4 text-white lg:absolute lg:-right-20 lg:bottom-8 lg:mt-0 lg:w-[310px]"><MonitorPanel /></Reveal>
// //           </div>
// //           <Reveal className="lg:col-span-4 lg:col-start-9">
// //             <p className="eyebrow mb-3">{S.managed.eyebrow}</p>
// //             <h2 className="h-section text-balance">{S.managed.title}</h2>
// //             <p className="lead mt-4">{S.managed.body}</p>
// //             <ArrowLink href={S.managed.buttonUrl || "/services/managed-services"} className="mt-7">{S.managed.buttonText || "Managed services"}</ArrowLink>
// //           </Reveal>
// //         </div>
// //       </section>

// //       {/* statistics */}
// //       <section className="on-dark bg-navy-900 py-14 text-white" aria-label={S.stats.title}>
// //         <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
// //           {S.stats.items.map((s) => (
// //             <div key={s.title} className="lg:px-8 lg:first:pl-0">
// //               <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none"><Counter value={s.title} /></dt>
// //               <dd className="mt-3 text-[13.5px] text-white/65">{s.text}</dd>
// //             </div>
// //           ))}
// //         </dl>
// //       </section>

    

// //       {/* news */}
// //       {latest.length > 0 && (
// //         <section className="bg-white py-20 lg:py-24">
// //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //             <div className="flex items-end justify-between gap-6">
// //               <div><p className="eyebrow mb-3">{S.news.eyebrow}</p><h2 className="h-section">{S.news.title}</h2></div>
// //               <ArrowLink href="/news" className="hidden sm:inline-flex">All news</ArrowLink>
// //             </div>
// //             <div className="mt-10 grid gap-8 lg:grid-cols-12">
// //               <Link href={`/news/${latest[0].n.slug}`} className="group lg:col-span-7">
// //                 <div className="img-zoom relative aspect-[16/9] overflow-hidden bg-navy-900"><SmartImage src={latest[0].n.featuredImageUrl} alt="" sizes="(min-width:1024px) 55vw, 100vw" /></div>
// //                 <p className="mt-5 font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{latest[0].categoryName} · {fmtDate(latest[0].n.publishedAt ?? latest[0].n.createdAt)}</p>
// //                 <h3 className="mt-2 text-[1.5rem] font-semibold leading-snug group-hover:text-brand-700">{latest[0].n.title}</h3>
// //                 <p className="mt-2 text-slate-soft">{latest[0].n.excerpt}</p>
// //               </Link>
// //               <ul className="divide-y divide-line border-y border-line lg:col-span-5">
// //                 {latest.slice(1).map((x) => (
// //                   <li key={x.n.id}>
// //                     <Link href={`/news/${x.n.slug}`} className="group flex gap-5 py-6">
// //                       <div className="img-zoom relative h-24 w-32 shrink-0 overflow-hidden bg-navy-900 sm:h-28 sm:w-40"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="160px" /></div>
// //                       <div>
// //                         <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
// //                         <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
// //                       </div>
// //                     </Link>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {/* CTA */}
// //       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
// //         <div className="absolute inset-0 -z-20"><SmartImage src={S.cta.imageUrl} alt="" sizes="100vw" /></div>
// //         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-900/50" aria-hidden="true" />
// //         <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
// //           <p className="eyebrow mb-4">{S.cta.eyebrow}</p>
// //           <h2 className="h-section max-w-2xl text-balance">{S.cta.title}</h2>
// //           <p className="lead mt-4 max-w-xl">{S.cta.body}</p>
// //           <div className="mt-8 flex flex-wrap gap-3">
// //             <Link href={S.cta.buttonUrl || "/contact"} className="btn btn-primary">{S.cta.buttonText || "Talk to an Expert"} <span className="arrow" aria-hidden="true">→</span></Link>
// //             <Link href="/register" className="btn btn-ghost-light">Create customer account</Link>
// //           </div>
// //         </Reveal>
// //       </section>
// //     </>
// //   );
// // }







// // new code 




// import Link from "next/link";
// import { and, asc, eq, inArray } from "drizzle-orm";
// import { db } from "@/db";
// import { serviceFeatures } from "@/db/schema";
// import { Hero } from "@/components/Hero";
// import { SmartImage } from "@/components/SmartImage";
// import { ArrowLink, JsonLd, SectionHead } from "@/components/ui";
// import { ClipReveal, Counter, Reveal } from "@/components/motion";
// import { FlowDiagram, MonitorPanel, PipelineTerminal, ServiceIcon } from "@/components/graphics";
// import { PlatformTabs, type Platform } from "@/components/PlatformTabs";
// import { Rack3D } from "@/components/Rack3D";
// import { MarketplaceCarousel } from "@/components/MarketplaceCarousel";
// import { WhoAndGallery } from "@/components/home/WhoAndGallery";
// import { buildMetadata, getPageHero, getSections, getService, getMarketplaces, listNews, listServices, customSchema } from "@/lib/data";
// import { fmtDate } from "@/lib/util";

// // Keep the home page fresh so admin edits (Who We Are, Gallery) show up immediately
// export const dynamic = "force-dynamic";

// export async function generateMetadata() {
//   return buildMetadata({
//     type: "page", key: "home", path: "/", fallbackTitle: "Cloud, Server, DevOps, Security & Managed Services",
//     fallbackDescription: "Secure, scalable and professionally managed cloud infrastructure, migration, DevOps, email and security services for businesses.",
//     image: "/images/hero/home-datacenter.jpg",
//   });
// }

// const CAPS = [
//   { label: "Public Cloud", href: "/cloud/public-cloud", icon: "cloud" },
//   { label: "Private Cloud", href: "/cloud/private-cloud", icon: "server" },
//   { label: "Email & Collaboration", href: "/workplace/m365", icon: "mail" },
//   { label: "Cloud Migration", href: "/services/cloud-migration", icon: "migrate" },
//   { label: "Security", href: "/security/ddos-protection", icon: "shield" },
//   { label: "DevOps", href: "/services/devops", icon: "pipeline" },
// ];

// export default async function HomePage() {
//   const [hero, sec, svcs, latest, schema, mig, market] = await Promise.all([
//     getPageHero("home"), getSections("home"), listServices(), listNews(3), customSchema("page", "home"), getService("services", "cloud-migration"), getMarketplaces(),
//   ]);
//   const by = (slug: string) => svcs.find((s) => s.slug === slug);
//   const pc = by("public-cloud");
//   const platformSlugs = ["aws", "azure", "google-cloud", "private-cloud", "hybrid-cloud"];
//   const ids = [pc?.id, ...platformSlugs.map((s) => by(s)?.id)].filter((x): x is number => !!x);
//   const feats = ids.length ? await db.select().from(serviceFeatures).where(and(inArray(serviceFeatures.serviceId, ids), eq(serviceFeatures.kind, "feature"))).orderBy(asc(serviceFeatures.sortOrder)) : [];
//   const pts = (id?: number) => feats.filter((f) => f.serviceId === id).map((f) => f.title);

//   const platforms: Platform[] = platformSlugs.flatMap((slug) => {
//     const s = by(slug);
//     return s ? [{ id: s.slug, title: s.title, kicker: s.category === "cloud" && s.parentSlug ? "Public cloud" : "Cloud platform", description: s.shortDescription, image: s.cardImageUrl || s.heroImageUrl, href: `/${s.category}/${s.slug}`, points: pts(s.id).slice(0, 3) }] : [];
//   });

//   const smalls = [
//     { title: "Private Cloud", text: by("private-cloud")?.shortDescription ?? "", href: "/cloud/private-cloud", icon: "server" },
//     { title: "Email & Collaboration", text: "Microsoft 365, Google Workspace and Zimbra — deployed, migrated and supported.", href: "/workplace/m365", icon: "mail" },
//     { title: "Cloud Migration", text: by("cloud-migration")?.shortDescription ?? "", href: "/services/cloud-migration", icon: "migrate" },
//     { title: "Security", text: "DDoS protection, data security, VAPT, anti-virus and Active Directory.", href: "/security/ddos-protection", icon: "shield" },
//     { title: "DevOps", text: by("devops")?.shortDescription ?? "", href: "/services/devops", icon: "pipeline" },
//   ];
//   const securitySvcs = svcs.filter((s) => s.category === "security");
//   const S = sec;

//   // Marketplaces heading (editable from Admin > Pages > Home, with fallbacks)
//   const M = S.marketplaces;
//   const showMarket = market.length > 0 && (M ? M.isActive : true);

//   return (
//     <>
//       <JsonLd data={schema} />
//       <Hero hero={hero} trust={["24×7 monitored infrastructure", "Multi-cloud engineering", "Security-first operations"]} />

//       {/* capability strip */}
//       <section aria-label="Capabilities" className="border-b border-line bg-white">
//         <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
//           {CAPS.map((c) => (
//             <li key={c.label}>
//               <Link href={c.href} className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-brand-50">
//                 <ServiceIcon kind={c.icon} className="h-9 w-9 shrink-0" />
//                 <span className="text-[13.5px] font-semibold leading-tight">{c.label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </section>

//       {/* infrastructure story — dark, with 3D rack */}
//       {/* <section className="on-dark bg-navy-950 text-white">
//         <div className="grid lg:grid-cols-12">
//           <div className="px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
//             <Reveal>
//               <p className="eyebrow mb-4">{S.story.eyebrow}</p>
//               <h2 className="h-section text-balance">{S.story.title}</h2>
//               <p className="lead mt-5">{S.story.body}</p>
//             </Reveal>
//             <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
//               {S.story.items.map((it, i) => (
//                 <li key={it.title}>
//                   <Reveal delay={i * 0.08} className="flex gap-5 py-5">
//                     <span className="font-mono text-[12px] text-brand-300">0{i + 1}</span>
//                     <div>
//                       <h3 className="text-[16px] font-semibold">{it.title}</h3>
//                       <p className="mt-1 text-[14px] text-white/65">{it.text}</p>
//                     </div>
//                   </Reveal>
//                 </li>
//               ))}
//             </ol>
//           </div>
//           <div className="relative min-h-[340px] lg:col-span-7 lg:min-h-[600px]">
//             <Rack3D fallback="/images/stock/public-cloud.jpg" alt="Server racks with network cabling in a data center" />
//             <p className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 sm:left-8">
//               <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" /> Reference rack model
//             </p>
//           </div>
//         </div>
//       </section> */}

//       {/* services — featured + index grid */}
//       {/* <section className="bg-white py-20 lg:py-28">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8">
//           <Reveal><SectionHead eyebrow={S.services.eyebrow} title={S.services.title} body={S.services.body} /></Reveal>
//           {pc && (
//             <div className="mt-12 grid overflow-hidden border border-line lg:grid-cols-12">
//               <ClipReveal className="img-zoom relative min-h-[300px] lg:col-span-7 lg:min-h-[460px]">
//                 <SmartImage src={pc.cardImageUrl || pc.heroImageUrl} alt="Public cloud data center campus" sizes="(min-width:1024px) 58vw, 100vw" />
//                 <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
//                 <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
//                   {[["AWS", "/cloud/aws"], ["Azure", "/cloud/azure"], ["Google Cloud", "/cloud/google-cloud"]].map(([l, h]) => (
//                     <li key={l}><Link href={h} className="block border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900">{l}</Link></li>
//                   ))}
//                 </ul>
//               </ClipReveal>
//               <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
//                 <ServiceIcon kind="cloud" className="always mb-6 h-14 w-14" />
//                 <p className="eyebrow mb-2">Featured service</p>
//                 <h3 className="text-[1.75rem] font-semibold leading-tight">{pc.title}</h3>
//                 <p className="mt-3 leading-relaxed text-slate-soft">{pc.shortDescription}</p>
//                 <ul className="mt-6 space-y-2.5">
//                   {pts(pc.id).map((p) => (
//                     <li key={p} className="flex gap-3 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{p}</li>
//                   ))}
//                 </ul>
//                 <ArrowLink href="/cloud/public-cloud" className="mt-8">Learn more about Public Cloud</ArrowLink>
//               </div>
//             </div>
//           )}
//           <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
//             {smalls.map((s, i) => (
//               <li key={s.title}>
//                 <Reveal delay={i * 0.06}>
//                   <Link href={s.href} className="group block border-t-2 border-line pt-6 transition-colors duration-300 hover:border-brand-600">
//                     <ServiceIcon kind={s.icon} className="mb-5 h-12 w-12" />
//                     <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
//                     <p className="mt-2 text-[14px] leading-relaxed text-slate-soft">{s.text}</p>
//                     <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600">Learn more <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
//                   </Link>
//                 </Reveal>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section> */}

//       {/* Who We Are + Gallery slider (managed from Admin > Who We Are / Gallery) */}
//       <WhoAndGallery />

      

//       {/* platforms */}
//       {platforms.length > 0 && (
//         <section className="bg-mist py-20 lg:py-24">
//           <div className="mx-auto max-w-7xl px-5 sm:px-8">
//             <Reveal><SectionHead eyebrow={S.platforms.eyebrow} title={S.platforms.title} body={S.platforms.body} /></Reveal>
//             <Reveal className="mt-10"><PlatformTabs items={platforms} /></Reveal>
//             <p className="mt-4 text-[12px] text-slate-soft">Platform names are trademarks of their respective owners; no official partnership is implied.</p>
//           </div>
//         </section>
//       )}

//       {/* architecture */}
//       {/* <section className="bg-white py-20 lg:py-28">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8">
//           <Reveal><SectionHead eyebrow={S.architecture.eyebrow} title={S.architecture.title} body={S.architecture.body} /></Reveal>
//           <Reveal className="on-dark mt-10 border border-navy-800 bg-navy-900 text-white">
//             <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
//               <span>Production reference architecture</span>
//               <span className="flex items-center gap-4"><span className="flex items-center gap-2"><i className="h-px w-5 bg-brand-400" />Traffic</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" />Requests</span></span>
//             </div>
//             <div className="p-5 sm:p-8"><FlowDiagram variant="cloud" caption="Production reference architecture" /></div>
//           </Reveal>
//           <dl className="mt-8 grid gap-6 sm:grid-cols-3">
//             {[["Edge", "CDN, WAF and DDoS filtering sit in front of everything."], ["Application", "Stateless nodes behind a multi-zone load balancer scale on demand."], ["Data", "Replicated databases with continuous, cross-region backup."]].map(([t, d]) => (
//               <div key={t} className="border-l-2 border-brand-600 pl-4"><dt className="text-[14.5px] font-semibold">{t}</dt><dd className="mt-1 text-[14px] text-slate-soft">{d}</dd></div>
//             ))}
//           </dl>
//         </div>
//       </section> */}

//       {/* security — full-bleed image */}
//       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
//         <div className="absolute inset-0 -z-20"><SmartImage src={S.security.imageUrl} alt="" sizes="100vw" style={{ objectPosition: "center 40%" }} /></div>
//         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" aria-hidden="true" />
//         <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
//           <Reveal className="lg:col-span-5">
//             <p className="eyebrow mb-4 !text-[#5fd6a0]">{S.security.eyebrow}</p>
//             <h2 className="h-section text-balance">{S.security.title}</h2>
//             <p className="lead mt-5">{S.security.body}</p>
//             <Link href={S.security.buttonUrl || "/security/ddos-protection"} className="btn btn-primary mt-8">{S.security.buttonText || "Explore security"} <span className="arrow" aria-hidden="true">→</span></Link>
//           </Reveal>
//           <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
//             {securitySvcs.map((s, i) => (
//               <li key={s.id}>
//                 <Reveal delay={i * 0.06}>
//                   <Link href={`/security/${s.slug}`} className="group flex items-center gap-5 px-2 py-5 transition-colors hover:bg-white/5">
//                     <ServiceIcon kind={s.icon} className="h-11 w-11 shrink-0 !text-[#8fc2f5]" />
//                     <span className="flex-1">
//                       <span className="block text-[16px] font-semibold">{s.title}</span>
//                       <span className="mt-0.5 block text-[13.5px] text-white/65">{s.shortDescription}</span>
//                     </span>
//                     <span className="text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
//                   </Link>
//                 </Reveal>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* migration */}
//       <section className="bg-white py-20 lg:py-28">
//         <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
//           <ClipReveal className="img-zoom relative aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
//             <SmartImage src={S.migration.imageUrl} alt="Server migration data hall" sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: "center" }} />
//             <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
//             <p className="absolute bottom-4 left-4 border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">Rehearsed · Reversible</p>
//           </ClipReveal>
//           <div className="lg:col-span-7">
//             <Reveal>
//               <p className="eyebrow mb-3">{S.migration.eyebrow}</p>
//               <h2 className="h-section text-balance">{S.migration.title}</h2>
//               <p className="lead mt-4 max-w-xl">{S.migration.body}</p>
//             </Reveal>
//             <ol className="relative mt-10 space-y-7">
//               <span className="absolute bottom-3 left-[17px] top-3 w-px bg-linear-to-b from-brand-500 via-brand-300 to-transparent" aria-hidden="true" />
//               {(mig?.process.length ? mig.process.map((p) => ({ t: p.title, d: p.description })) : [{ t: "Assess", d: "" }]).map((p, i) => (
//                 <li key={p.t}>
//                   <Reveal delay={i * 0.1} className="relative flex gap-5">
//                     <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
//                     <div><h3 className="text-[16px] font-semibold">{p.t}</h3><p className="mt-1 text-[14.5px] text-slate-soft">{p.d}</p></div>
//                   </Reveal>
//                 </li>
//               ))}
//             </ol>
//             <ArrowLink href={S.migration.buttonUrl || "/services/cloud-migration"} className="mt-9">{S.migration.buttonText || "Plan a migration"}</ArrowLink>
//           </div>
//         </div>
//       </section>

//       {/* devops */}
//       <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8">
//           <div className="grid items-center gap-12 lg:grid-cols-12">
//             <Reveal className="lg:col-span-5">
//               <p className="eyebrow mb-4">{S.devops.eyebrow}</p>
//               <h2 className="h-section text-balance">{S.devops.title}</h2>
//               <p className="lead mt-5">{S.devops.body}</p>
//               <Link href={S.devops.buttonUrl || "/services/devops"} className="btn btn-primary mt-8">{S.devops.buttonText || "Explore DevOps"} <span className="arrow" aria-hidden="true">→</span></Link>
//             </Reveal>
//             <Reveal className="lg:col-span-7" delay={0.1}><PipelineTerminal /></Reveal>
//           </div>
//           <div className="mt-14 border-t border-white/10 pt-10"><FlowDiagram variant="devops" caption="CI/CD pipeline stages" /></div>
//         </div>
//       </section>

//       {/* managed infrastructure */}
//       <section className="bg-mist py-20 lg:py-28">
//         <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
//           <div className="relative lg:col-span-7">
//             <ClipReveal className="img-zoom relative aspect-[16/10]"><SmartImage src={S.managed.imageUrl} alt="Network operations center" sizes="(min-width:1024px) 55vw, 100vw" /><div className="absolute inset-0 bg-navy-950/25" aria-hidden="true" /></ClipReveal>
//             <Reveal delay={0.3} className="on-dark mt-4 text-white lg:absolute lg:-right-20 lg:bottom-8 lg:mt-0 lg:w-[310px]"><MonitorPanel /></Reveal>
//           </div>
//           <Reveal className="lg:col-span-4 lg:col-start-9">
//             <p className="eyebrow mb-3">{S.managed.eyebrow}</p>
//             <h2 className="h-section text-balance">{S.managed.title}</h2>
//             <p className="lead mt-4">{S.managed.body}</p>
//             <ArrowLink href={S.managed.buttonUrl || "/services/managed-services"} className="mt-7">{S.managed.buttonText || "Managed services"}</ArrowLink>
//           </Reveal>
//         </div>
//       </section>

//       {/* statistics */}
//       <section className="on-dark bg-navy-900 py-14 text-white" aria-label={S.stats.title}>
//         <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
//           {S.stats.items.map((s) => (
//             <div key={s.title} className="lg:px-8 lg:first:pl-0">
//               <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none"><Counter value={s.title} /></dt>
//               <dd className="mt-3 text-[13.5px] text-white/65">{s.text}</dd>
//             </div>
//           ))}
//         </dl>
//       </section>

//       {/* news */}
//       {latest.length > 0 && (
//         <section className="bg-white py-20 lg:py-24">
//           <div className="mx-auto max-w-7xl px-5 sm:px-8">
//             <div className="flex items-end justify-between gap-6">
//               <div><p className="eyebrow mb-3">{S.news.eyebrow}</p><h2 className="h-section">{S.news.title}</h2></div>
//               <ArrowLink href="/news" className="hidden sm:inline-flex">All news</ArrowLink>
//             </div>
//             <div className="mt-10 grid gap-8 lg:grid-cols-12">
//               <Link href={`/news/${latest[0].n.slug}`} className="group lg:col-span-7">
//                 <div className="img-zoom relative aspect-[16/9] overflow-hidden bg-navy-900"><SmartImage src={latest[0].n.featuredImageUrl} alt="" sizes="(min-width:1024px) 55vw, 100vw" /></div>
//                 <p className="mt-5 font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{latest[0].categoryName} · {fmtDate(latest[0].n.publishedAt ?? latest[0].n.createdAt)}</p>
//                 <h3 className="mt-2 text-[1.5rem] font-semibold leading-snug group-hover:text-brand-700">{latest[0].n.title}</h3>
//                 <p className="mt-2 text-slate-soft">{latest[0].n.excerpt}</p>
//               </Link>
//               <ul className="divide-y divide-line border-y border-line lg:col-span-5">
//                 {latest.slice(1).map((x) => (
//                   <li key={x.n.id}>
//                     <Link href={`/news/${x.n.slug}`} className="group flex gap-5 py-6">
//                       <div className="img-zoom relative h-24 w-32 shrink-0 overflow-hidden bg-navy-900 sm:h-28 sm:w-40"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="160px" /></div>
//                       <div>
//                         <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
//                         <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
//                       </div>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* our marketplaces — client products carousel (managed from Admin > Marketplaces) */}
//       {showMarket && (
//         <section className="bg-mist py-20 lg:py-24" aria-label="Our marketplaces">
//           <div className="mx-auto max-w-7xl px-5 sm:px-8">
//             <Reveal className="mb-10 max-w-2xl">
//               <p className="eyebrow mb-3">{M?.eyebrow || "Our Marketplaces"}</p>
//               <h2 className="h-section text-balance">{M?.title || "Products trusted by our clients"}</h2>
//               {M?.body && <p className="mt-4 leading-relaxed text-slate-soft">{M.body}</p>}
//             </Reveal>
//             <MarketplaceCarousel items={market} />
//           </div>
//         </section>
//       )}

//       {/* CTA */}
//       <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
//         <div className="absolute inset-0 -z-20"><SmartImage src={S.cta.imageUrl} alt="" sizes="100vw" /></div>
//         <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-900/50" aria-hidden="true" />
//         <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
//           <p className="eyebrow mb-4">{S.cta.eyebrow}</p>
//           <h2 className="h-section max-w-2xl text-balance">{S.cta.title}</h2>
//           <p className="lead mt-4 max-w-xl">{S.cta.body}</p>
//           <div className="mt-8 flex flex-wrap gap-3">
//             <Link href={S.cta.buttonUrl || "/contact"} className="btn btn-primary">{S.cta.buttonText || "Talk to an Expert"} <span className="arrow" aria-hidden="true">→</span></Link>
//             <Link href="/register" className="btn btn-ghost-light">Create customer account</Link>
//           </div>
//         </Reveal>
//       </section>
//     </>
//   );
// }




// new code 




import Link from "next/link";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { serviceFeatures } from "@/db/schema";
import { Hero } from "@/components/Hero";
import { SmartImage } from "@/components/SmartImage";
import { ArrowLink, JsonLd, SectionHead } from "@/components/ui";
import { ClipReveal, Counter, Reveal } from "@/components/motion";
import { FlowDiagram, MonitorPanel, PipelineTerminal, ServiceIcon } from "@/components/graphics";
import { PlatformTabs, type Platform } from "@/components/PlatformTabs";
import { Rack3D } from "@/components/Rack3D";
import { MarketplaceCarousel } from "@/components/MarketplaceCarousel";
import { WhoAndGallery } from "@/components/home/WhoAndGallery";
import { buildMetadata, getPageHero, getSections, getService, getMarketplaces, listNews, listServices, customSchema } from "@/lib/data";
import { getSophos } from "@/lib/home-extras";
import { fmtDate } from "@/lib/util";

// Keep the home page fresh so admin edits (Who We Are, Gallery, Sophos) show up immediately
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildMetadata({
    type: "page", key: "home", path: "/", fallbackTitle: "Cloud, Server, DevOps, Security & Managed Services",
    fallbackDescription: "Secure, scalable and professionally managed cloud infrastructure, migration, DevOps, email and security services for businesses.",
    image: "/images/hero/home-datacenter.jpg",
  });
}

const CAPS = [
  { label: "Public Cloud", href: "/cloud/public-cloud", icon: "cloud" },
  { label: "Private Cloud", href: "/cloud/private-cloud", icon: "server" },
  { label: "Email & Collaboration", href: "/workplace/m365", icon: "mail" },
  { label: "Cloud Migration", href: "/services/cloud-migration", icon: "migrate" },
  { label: "Security", href: "/security/ddos-protection", icon: "shield" },
  { label: "DevOps", href: "/services/devops", icon: "pipeline" },
];

export default async function HomePage() {
  const [hero, sec, svcs, latest, schema, mig, market, SAP] = await Promise.all([
    getPageHero("home"), getSections("home"), listServices(), listNews(3), customSchema("page", "home"), getService("services", "cloud-migration"), getMarketplaces(), getSophos(),
  ]);
  const by = (slug: string) => svcs.find((s) => s.slug === slug);
  const pc = by("public-cloud");
  const platformSlugs = ["aws", "azure", "google-cloud", "private-cloud", "hybrid-cloud"];
  const ids = [pc?.id, ...platformSlugs.map((s) => by(s)?.id)].filter((x): x is number => !!x);
  const feats = ids.length ? await db.select().from(serviceFeatures).where(and(inArray(serviceFeatures.serviceId, ids), eq(serviceFeatures.kind, "feature"))).orderBy(asc(serviceFeatures.sortOrder)) : [];
  const pts = (id?: number) => feats.filter((f) => f.serviceId === id).map((f) => f.title);

  const platforms: Platform[] = platformSlugs.flatMap((slug) => {
    const s = by(slug);
    return s ? [{ id: s.slug, title: s.title, kicker: s.category === "cloud" && s.parentSlug ? "Public cloud" : "Cloud platform", description: s.shortDescription, image: s.cardImageUrl || s.heroImageUrl, href: `/${s.category}/${s.slug}`, points: pts(s.id).slice(0, 3) }] : [];
  });

  const smalls = [
    { title: "Private Cloud", text: by("private-cloud")?.shortDescription ?? "", href: "/cloud/private-cloud", icon: "server" },
    { title: "Email & Collaboration", text: "Microsoft 365, Google Workspace and Zimbra — deployed, migrated and supported.", href: "/workplace/m365", icon: "mail" },
    { title: "Cloud Migration", text: by("cloud-migration")?.shortDescription ?? "", href: "/services/cloud-migration", icon: "migrate" },
    { title: "Security", text: "DDoS protection, data security, VAPT, anti-virus and Active Directory.", href: "/security/ddos-protection", icon: "shield" },
    { title: "DevOps", text: by("devops")?.shortDescription ?? "", href: "/services/devops", icon: "pipeline" },
  ];
  const securitySvcs = svcs.filter((s) => s.category === "security");
  const S = sec;

  // Marketplaces heading (editable from Admin > Pages > Home, with fallbacks)
  const M = S.marketplaces;
  const showMarket = market.length > 0 && (M ? M.isActive : true);

  return (
    <>
      <JsonLd data={schema} />
      <Hero hero={hero} trust={["24×7 monitored infrastructure", "Multi-cloud engineering", "Security-first operations"]} />

      {/* capability strip */}
      <section aria-label="Capabilities" className="border-b border-line bg-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-3 md:divide-y-0 lg:grid-cols-6">
          {CAPS.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="group flex items-center gap-3 px-5 py-5 transition-colors hover:bg-brand-50">
                <ServiceIcon kind={c.icon} className="h-9 w-9 shrink-0" />
                <span className="text-[13.5px] font-semibold leading-tight">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* infrastructure story — dark, with 3D rack */}
      {/* <section className="on-dark bg-navy-950 text-white">
        <div className="grid lg:grid-cols-12">
          <div className="px-5 py-16 sm:px-8 lg:col-span-5 lg:py-24 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
            <Reveal>
              <p className="eyebrow mb-4">{S.story.eyebrow}</p>
              <h2 className="h-section text-balance">{S.story.title}</h2>
              <p className="lead mt-5">{S.story.body}</p>
            </Reveal>
            <ol className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {S.story.items.map((it, i) => (
                <li key={it.title}>
                  <Reveal delay={i * 0.08} className="flex gap-5 py-5">
                    <span className="font-mono text-[12px] text-brand-300">0{i + 1}</span>
                    <div>
                      <h3 className="text-[16px] font-semibold">{it.title}</h3>
                      <p className="mt-1 text-[14px] text-white/65">{it.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative min-h-[340px] lg:col-span-7 lg:min-h-[600px]">
            <Rack3D fallback="/images/stock/public-cloud.jpg" alt="Server racks with network cabling in a data center" />
            <p className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/60 sm:left-8">
              <span className="led-pulse h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" /> Reference rack model
            </p>
          </div>
        </div>
      </section> */}

      {/* services — featured + index grid */}
      {/* <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal><SectionHead eyebrow={S.services.eyebrow} title={S.services.title} body={S.services.body} /></Reveal>
          {pc && (
            <div className="mt-12 grid overflow-hidden border border-line lg:grid-cols-12">
              <ClipReveal className="img-zoom relative min-h-[300px] lg:col-span-7 lg:min-h-[460px]">
                <SmartImage src={pc.cardImageUrl || pc.heroImageUrl} alt="Public cloud data center campus" sizes="(min-width:1024px) 58vw, 100vw" />
                <div className="absolute inset-0 bg-linear-to-t from-navy-950/80 via-navy-950/10 to-transparent" aria-hidden="true" />
                <ul className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  {[["AWS", "/cloud/aws"], ["Azure", "/cloud/azure"], ["Google Cloud", "/cloud/google-cloud"]].map(([l, h]) => (
                    <li key={l}><Link href={h} className="block border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11.5px] uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy-900">{l}</Link></li>
                  ))}
                </ul>
              </ClipReveal>
              <div className="flex flex-col justify-center bg-mist p-8 lg:col-span-5 lg:p-12">
                <ServiceIcon kind="cloud" className="always mb-6 h-14 w-14" />
                <p className="eyebrow mb-2">Featured service</p>
                <h3 className="text-[1.75rem] font-semibold leading-tight">{pc.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-soft">{pc.shortDescription}</p>
                <ul className="mt-6 space-y-2.5">
                  {pts(pc.id).map((p) => (
                    <li key={p} className="flex gap-3 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{p}</li>
                  ))}
                </ul>
                <ArrowLink href="/cloud/public-cloud" className="mt-8">Learn more about Public Cloud</ArrowLink>
              </div>
            </div>
          )}
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {smalls.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.06}>
                  <Link href={s.href} className="group block border-t-2 border-line pt-6 transition-colors duration-300 hover:border-brand-600">
                    <ServiceIcon kind={s.icon} className="mb-5 h-12 w-12" />
                    <h3 className="text-[1.1rem] font-semibold">{s.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-slate-soft">{s.text}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600">Learn more <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span></span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section> */}

      {/* Who We Are + Gallery slider (managed from Admin > Who We Are / Gallery) */}
      <WhoAndGallery />

      {/* platforms */}
      {platforms.length > 0 && (
        <section className="bg-mist py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal><SectionHead eyebrow={S.platforms.eyebrow} title={S.platforms.title} body={S.platforms.body} /></Reveal>
            <Reveal className="mt-10"><PlatformTabs items={platforms} /></Reveal>
            <p className="mt-4 text-[12px] text-slate-soft">Platform names are trademarks of their respective owners; no official partnership is implied.</p>
          </div>
        </section>
      )}

      {/* Sophos — same tab switcher as Cloud platforms (managed from Admin > Sophos section / Sophos products) */}
      {SAP && (
        <section id="sophos" className="bg-white py-20 lg:py-24" aria-label="Sophos">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal><SectionHead eyebrow={SAP.eyebrow} title={SAP.title} body={SAP.body} /></Reveal>
            <Reveal className="mt-10"><PlatformTabs items={SAP.items} /></Reveal>
            {SAP.note && <p className="mt-4 text-[12px] text-slate-soft">{SAP.note}</p>}
          </div>
        </section>
      )}

      {/* architecture */}
      {/* <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal><SectionHead eyebrow={S.architecture.eyebrow} title={S.architecture.title} body={S.architecture.body} /></Reveal>
          <Reveal className="on-dark mt-10 border border-navy-800 bg-navy-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
              <span>Production reference architecture</span>
              <span className="flex items-center gap-4"><span className="flex items-center gap-2"><i className="h-px w-5 bg-brand-400" />Traffic</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" />Requests</span></span>
            </div>
            <div className="p-5 sm:p-8"><FlowDiagram variant="cloud" caption="Production reference architecture" /></div>
          </Reveal>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {[["Edge", "CDN, WAF and DDoS filtering sit in front of everything."], ["Application", "Stateless nodes behind a multi-zone load balancer scale on demand."], ["Data", "Replicated databases with continuous, cross-region backup."]].map(([t, d]) => (
              <div key={t} className="border-l-2 border-brand-600 pl-4"><dt className="text-[14.5px] font-semibold">{t}</dt><dd className="mt-1 text-[14px] text-slate-soft">{d}</dd></div>
            ))}
          </dl>
        </div>
      </section> */}

      {/* security — full-bleed image */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-28">
        <div className="absolute inset-0 -z-20"><SmartImage src={S.security.imageUrl} alt="" sizes="100vw" style={{ objectPosition: "center 40%" }} /></div>
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4 !text-[#5fd6a0]">{S.security.eyebrow}</p>
            <h2 className="h-section text-balance">{S.security.title}</h2>
            <p className="lead mt-5">{S.security.body}</p>
            <Link href={S.security.buttonUrl || "/security/ddos-protection"} className="btn btn-primary mt-8">{S.security.buttonText || "Explore security"} <span className="arrow" aria-hidden="true">→</span></Link>
          </Reveal>
          <ul className="divide-y divide-white/15 border-y border-white/15 lg:col-span-6 lg:col-start-7">
            {securitySvcs.map((s, i) => (
              <li key={s.id}>
                <Reveal delay={i * 0.06}>
                  <Link href={`/security/${s.slug}`} className="group flex items-center gap-5 px-2 py-5 transition-colors hover:bg-white/5">
                    <ServiceIcon kind={s.icon} className="h-11 w-11 shrink-0 !text-[#8fc2f5]" />
                    <span className="flex-1">
                      <span className="block text-[16px] font-semibold">{s.title}</span>
                      <span className="mt-0.5 block text-[13.5px] text-white/65">{s.shortDescription}</span>
                    </span>
                    <span className="text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden="true">→</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* migration */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <ClipReveal className="img-zoom relative aspect-[4/3] lg:col-span-5 lg:aspect-[4/5]">
            <SmartImage src={S.migration.imageUrl} alt="Server migration data hall" sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: "center" }} />
            <div className="absolute inset-0 bg-linear-to-t from-navy-950/60 to-transparent" aria-hidden="true" />
            <p className="absolute bottom-4 left-4 border border-white/40 bg-navy-950/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">Rehearsed · Reversible</p>
          </ClipReveal>
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-3">{S.migration.eyebrow}</p>
              <h2 className="h-section text-balance">{S.migration.title}</h2>
              <p className="lead mt-4 max-w-xl">{S.migration.body}</p>
            </Reveal>
            <ol className="relative mt-10 space-y-7">
              <span className="absolute bottom-3 left-[17px] top-3 w-px bg-linear-to-b from-brand-500 via-brand-300 to-transparent" aria-hidden="true" />
              {(mig?.process.length ? mig.process.map((p) => ({ t: p.title, d: p.description })) : [{ t: "Assess", d: "" }]).map((p, i) => (
                <li key={p.t}>
                  <Reveal delay={i * 0.1} className="relative flex gap-5">
                    <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
                    <div><h3 className="text-[16px] font-semibold">{p.t}</h3><p className="mt-1 text-[14.5px] text-slate-soft">{p.d}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <ArrowLink href={S.migration.buttonUrl || "/services/cloud-migration"} className="mt-9">{S.migration.buttonText || "Plan a migration"}</ArrowLink>
          </div>
        </div>
      </section>

      {/* devops */}
      <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow mb-4">{S.devops.eyebrow}</p>
              <h2 className="h-section text-balance">{S.devops.title}</h2>
              <p className="lead mt-5">{S.devops.body}</p>
              <Link href={S.devops.buttonUrl || "/services/devops"} className="btn btn-primary mt-8">{S.devops.buttonText || "Explore DevOps"} <span className="arrow" aria-hidden="true">→</span></Link>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={0.1}><PipelineTerminal /></Reveal>
          </div>
          <div className="mt-14 border-t border-white/10 pt-10"><FlowDiagram variant="devops" caption="CI/CD pipeline stages" /></div>
        </div>
      </section>

      {/* managed infrastructure */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <ClipReveal className="img-zoom relative aspect-[16/10]"><SmartImage src={S.managed.imageUrl} alt="Network operations center" sizes="(min-width:1024px) 55vw, 100vw" /><div className="absolute inset-0 bg-navy-950/25" aria-hidden="true" /></ClipReveal>
            <Reveal delay={0.3} className="on-dark mt-4 text-white lg:absolute lg:-right-20 lg:bottom-8 lg:mt-0 lg:w-[310px]"><MonitorPanel /></Reveal>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-3">{S.managed.eyebrow}</p>
            <h2 className="h-section text-balance">{S.managed.title}</h2>
            <p className="lead mt-4">{S.managed.body}</p>
            <ArrowLink href={S.managed.buttonUrl || "/services/managed-services"} className="mt-7">{S.managed.buttonText || "Managed services"}</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* statistics */}
      <section className="on-dark bg-navy-900 py-14 text-white" aria-label={S.stats.title}>
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {S.stats.items.map((s) => (
            <div key={s.title} className="lg:px-8 lg:first:pl-0">
              <dt className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none"><Counter value={s.title} /></dt>
              <dd className="mt-3 text-[13.5px] text-white/65">{s.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* news */}
      {latest.length > 0 && (
        <section className="bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-6">
              <div><p className="eyebrow mb-3">{S.news.eyebrow}</p><h2 className="h-section">{S.news.title}</h2></div>
              <ArrowLink href="/news" className="hidden sm:inline-flex">All news</ArrowLink>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <Link href={`/news/${latest[0].n.slug}`} className="group lg:col-span-7">
                <div className="img-zoom relative aspect-[16/9] overflow-hidden bg-navy-900"><SmartImage src={latest[0].n.featuredImageUrl} alt="" sizes="(min-width:1024px) 55vw, 100vw" /></div>
                <p className="mt-5 font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{latest[0].categoryName} · {fmtDate(latest[0].n.publishedAt ?? latest[0].n.createdAt)}</p>
                <h3 className="mt-2 text-[1.5rem] font-semibold leading-snug group-hover:text-brand-700">{latest[0].n.title}</h3>
                <p className="mt-2 text-slate-soft">{latest[0].n.excerpt}</p>
              </Link>
              <ul className="divide-y divide-line border-y border-line lg:col-span-5">
                {latest.slice(1).map((x) => (
                  <li key={x.n.id}>
                    <Link href={`/news/${x.n.slug}`} className="group flex gap-5 py-6">
                      <div className="img-zoom relative h-24 w-32 shrink-0 overflow-hidden bg-navy-900 sm:h-28 sm:w-40"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="160px" /></div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
                        <h3 className="mt-1.5 text-[1.05rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* our marketplaces — client products carousel (managed from Admin > Marketplaces) */}
      {showMarket && (
        <section className="bg-mist py-20 lg:py-24" aria-label="Our marketplaces">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">{M?.eyebrow || "Our Marketplaces"}</p>
              <h2 className="h-section text-balance">{M?.title || "Products trusted by our clients"}</h2>
              {M?.body && <p className="mt-4 leading-relaxed text-slate-soft">{M.body}</p>}
            </Reveal>
            <MarketplaceCarousel items={market} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white lg:py-24">
        <div className="absolute inset-0 -z-20"><SmartImage src={S.cta.imageUrl} alt="" sizes="100vw" /></div>
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/80 to-navy-900/50" aria-hidden="true" />
        <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow mb-4">{S.cta.eyebrow}</p>
          <h2 className="h-section max-w-2xl text-balance">{S.cta.title}</h2>
          <p className="lead mt-4 max-w-xl">{S.cta.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={S.cta.buttonUrl || "/contact"} className="btn btn-primary">{S.cta.buttonText || "Talk to an Expert"} <span className="arrow" aria-hidden="true">→</span></Link>
            <Link href="/register" className="btn btn-ghost-light">Create customer account</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}