// // //src/components/ContentPage.tsx
// // import Link from "next/link";
// // import { Hero } from "@/components/Hero";
// // import { SmartImage } from "@/components/SmartImage";
// // import { JsonLd, Prose } from "@/components/ui";
// // import { ClipReveal, Reveal } from "@/components/motion";
// // import { breadcrumbSchema, customSchema, getPageHero, getSections, getSiteUrl } from "@/lib/data";

// // const NEXT: Record<string, { text: string; label: string; href: string }> = {
// //   about: { text: "See how we can help with your infrastructure.", label: "Talk to an Expert", href: "/contact" },
// //   vision: { text: "Learn how we deliver on this every day.", label: "Read our Mission", href: "/mission" },
// //   mission: { text: "Want to be part of the team?", label: "View Careers", href: "/careers" },
// // };

// // export async function ContentPage({ slug, title }: { slug: "about" | "vision" | "mission"; title: string }) {
// //   const [hero, sec, base, custom] = await Promise.all([getPageHero(slug), getSections(slug), getSiteUrl(), customSchema("page", slug)]);
// //   const crumbs = [{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, ...(slug === "about" ? [] : [{ name: title }])];
// //   if (slug === "about") crumbs.splice(1, 1, { name: "About Us" });
// //   const { intro, image, pillars } = sec;
// //   const next = NEXT[slug];
// //   return (
// //     <>
// //       <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: title, path: `/${slug}` }])} />
// //       <JsonLd data={custom} />
// //       <Hero hero={hero} crumbs={crumbs} />

// //       {intro && (
// //         <section className="bg-white py-16 lg:py-24">
// //           <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
// //             <Reveal className="lg:col-span-5">
// //               <p className="eyebrow mb-3">{intro.eyebrow}</p>
// //               <h2 className="h-section text-balance">{intro.title}</h2>
// //             </Reveal>
// //             <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
// //               <Prose text={intro.body} className="[&_p:first-child]:text-[1.125rem] [&_p:first-child]:text-ink" />
// //             </Reveal>
// //           </div>
// //         </section>
// //       )}

// //       {image?.imageUrl && (
// //         <section className="relative isolate">
// //           <ClipReveal from="bottom" className="relative h-[300px] sm:h-[420px]">
// //             <SmartImage src={image.imageUrl} alt={image.title} sizes="100vw" style={{ objectPosition: "center 55%" }} />
// //             <div className="absolute inset-0 bg-linear-to-r from-navy-950/85 via-navy-900/45 to-transparent" aria-hidden="true" />
// //             <div className="on-dark absolute inset-0 mx-auto flex max-w-7xl items-end px-5 pb-8 text-white sm:px-8 sm:pb-12">
// //               <div className="max-w-md"><h2 className="text-2xl font-semibold">{image.title}</h2><p className="mt-2 text-white/80">{image.body}</p></div>
// //             </div>
// //           </ClipReveal>
// //         </section>
// //       )}

// //       {pillars && pillars.items.length > 0 && (
// //         <section className="bg-mist py-16 lg:py-24">
// //           <div className="mx-auto max-w-7xl px-5 sm:px-8">
// //             <Reveal><p className="eyebrow mb-3">{pillars.eyebrow}</p><h2 className="h-section">{pillars.title}</h2></Reveal>
// //             <ol className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
// //               {pillars.items.map((p, i) => (
// //                 <li key={p.title}>
// //                   <Reveal delay={(i % 2) * 0.08} className="grid grid-cols-[3.5rem_1fr] border-t border-line pt-6">
// //                     <span className="font-display text-[2rem] font-semibold leading-none text-brand-300">0{i + 1}</span>
// //                     <div><h3 className="text-[18px] font-semibold">{p.title}</h3><p className="mt-2 leading-relaxed text-slate-soft">{p.text}</p></div>
// //                   </Reveal>
// //                 </li>
// //               ))}
// //             </ol>
// //           </div>
// //         </section>
// //       )}

// //       <section className="on-dark bg-navy-900 py-14 text-white">
// //         <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
// //           <p className="font-display text-[1.375rem] font-semibold">{next.text}</p>
// //           <Link href={next.href} className="btn btn-primary">{next.label} <span className="arrow" aria-hidden="true">→</span></Link>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// // export async function contentMeta(slug: string, fallbackTitle: string, desc: string) {
// //   const { buildMetadata } = await import("@/lib/data");
// //   return buildMetadata({ type: "page", key: slug, path: `/${slug}`, fallbackTitle, fallbackDescription: desc });
// // }





// // new new code 




// //src/components/ContentPage.tsx
// import Link from "next/link";
// import { Hero } from "@/components/Hero";
// import { SmartImage } from "@/components/SmartImage";
// import { JsonLd, Prose } from "@/components/ui";
// import { ClipReveal, Reveal } from "@/components/motion";
// import { TeamSection } from "@/components/TeamSection";
// import { breadcrumbSchema, customSchema, getPageHero, getSections, getSiteUrl } from "@/lib/data";
// import { getTeamGroups } from "@/lib/team";

// const NEXT: Record<string, { text: string; label: string; href: string }> = {
//   about: { text: "See how we can help with your infrastructure.", label: "Talk to an Expert", href: "/contact" },
//   vision: { text: "Learn how we deliver on this every day.", label: "Read our Mission", href: "/mission" },
//   mission: { text: "Want to be part of the team?", label: "View Careers", href: "/careers" },
// };

// export async function ContentPage({ slug, title }: { slug: "about" | "vision" | "mission"; title: string }) {
//   const [hero, sec, base, custom, teamGroups] = await Promise.all([
//     getPageHero(slug),
//     getSections(slug),
//     getSiteUrl(),
//     customSchema("page", slug),
//     // Team is only shown on the About page
//     slug === "about" ? getTeamGroups() : Promise.resolve([]),
//   ]);
//   const crumbs = [{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, ...(slug === "about" ? [] : [{ name: title }])];
//   if (slug === "about") crumbs.splice(1, 1, { name: "About Us" });
//   const { intro, image, pillars } = sec;
//   const next = NEXT[slug];
//   return (
//     <>
//       <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: title, path: `/${slug}` }])} />
//       <JsonLd data={custom} />
//       <Hero hero={hero} crumbs={crumbs} />

//       {intro && (
//         <section className="bg-white py-16 lg:py-24">
//           <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
//             <Reveal className="lg:col-span-5">
//               <p className="eyebrow mb-3">{intro.eyebrow}</p>
//               <h2 className="h-section text-balance">{intro.title}</h2>
//             </Reveal>
//             <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
//               <Prose text={intro.body} className="[&_p:first-child]:text-[1.125rem] [&_p:first-child]:text-ink" />
//             </Reveal>
//           </div>
//         </section>
//       )}

//       {image?.imageUrl && (
//         <section className="relative isolate">
//           <ClipReveal from="bottom" className="relative h-[300px] sm:h-[420px]">
//             <SmartImage src={image.imageUrl} alt={image.title} sizes="100vw" style={{ objectPosition: "center 55%" }} />
//             <div className="absolute inset-0 bg-linear-to-r from-navy-950/85 via-navy-900/45 to-transparent" aria-hidden="true" />
//             <div className="on-dark absolute inset-0 mx-auto flex max-w-7xl items-end px-5 pb-8 text-white sm:px-8 sm:pb-12">
//               <div className="max-w-md"><h2 className="text-2xl font-semibold">{image.title}</h2><p className="mt-2 text-white/80">{image.body}</p></div>
//             </div>
//           </ClipReveal>
//         </section>
//       )}

//       {pillars && pillars.items.length > 0 && (
//         <section className="bg-mist py-16 lg:py-24">
//           <div className="mx-auto max-w-7xl px-5 sm:px-8">
//             <Reveal><p className="eyebrow mb-3">{pillars.eyebrow}</p><h2 className="h-section">{pillars.title}</h2></Reveal>
//             <ol className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
//               {pillars.items.map((p, i) => (
//                 <li key={p.title}>
//                   <Reveal delay={(i % 2) * 0.08} className="grid grid-cols-[3.5rem_1fr] border-t border-line pt-6">
//                     <span className="font-display text-[2rem] font-semibold leading-none text-brand-300">0{i + 1}</span>
//                     <div><h3 className="text-[18px] font-semibold">{p.title}</h3><p className="mt-2 leading-relaxed text-slate-soft">{p.text}</p></div>
//                   </Reveal>
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </section>
//       )}

//       {/* Our Team (About page only, managed from Admin > Team) */}
//       {slug === "about" && <TeamSection groups={teamGroups} />}

//       <section className="on-dark bg-navy-900 py-14 text-white">
//         <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
//           <p className="font-display text-[1.375rem] font-semibold">{next.text}</p>
//           <Link href={next.href} className="btn btn-primary">{next.label} <span className="arrow" aria-hidden="true">→</span></Link>
//         </div>
//       </section>
//     </>
//   );
// }

// export async function contentMeta(slug: string, fallbackTitle: string, desc: string) {
//   const { buildMetadata } = await import("@/lib/data");
//   return buildMetadata({ type: "page", key: slug, path: `/${slug}`, fallbackTitle, fallbackDescription: desc });
// }




// new code 




//src/components/ContentPage.tsx
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd, Prose } from "@/components/ui";
import { ClipReveal, Reveal } from "@/components/motion";
import { TeamSection } from "@/components/TeamSection";
import { breadcrumbSchema, customSchema, getPageHero, getSections, getSiteUrl } from "@/lib/data";
import { getTeamGroups } from "@/lib/team";

const NEXT: Record<string, { text: string; label: string; href: string }> = {
  about: { text: "See how we can help with your infrastructure.", label: "Talk to an Expert", href: "/contact" },
  vision: { text: "Learn how we deliver on this every day.", label: "Read our Mission", href: "/mission" },
  mission: { text: "Want to be part of the team?", label: "View Careers", href: "/careers" },
};

export async function ContentPage({ slug, title }: { slug: "about" | "vision" | "mission"; title: string }) {
  const [hero, sec, base, custom, teamGroups] = await Promise.all([
    getPageHero(slug),
    getSections(slug),
    getSiteUrl(),
    customSchema("page", slug),
    // Team is only shown on the About page
    slug === "about" ? getTeamGroups() : Promise.resolve([]),
  ]);
  const crumbs = [{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, ...(slug === "about" ? [] : [{ name: title }])];
  if (slug === "about") crumbs.splice(1, 1, { name: "About Us" });
  const { intro, image, pillars } = sec;
  const next = NEXT[slug];
  return (
    <>
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: title, path: `/${slug}` }])} />
      <JsonLd data={custom} />
      <Hero hero={hero} crumbs={crumbs} />

      {intro && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow mb-3">{intro.eyebrow}</p>
              <h2 className="h-section text-balance">{intro.title}</h2>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
              <Prose text={intro.body} className="[&_p:first-child]:text-[1.125rem] [&_p:first-child]:text-ink" />
            </Reveal>
          </div>
        </section>
      )}

      {image?.imageUrl && (
        <section className="relative isolate">
          <ClipReveal from="bottom" className="relative h-[300px] sm:h-[420px]">
            <SmartImage src={image.imageUrl} alt={image.title} sizes="100vw" style={{ objectPosition: "center 55%" }} />
            <div className="absolute inset-0 bg-linear-to-r from-navy-950/85 via-navy-900/45 to-transparent" aria-hidden="true" />
            <div className="on-dark absolute inset-0 mx-auto flex max-w-7xl items-end px-5 pb-8 text-white sm:px-8 sm:pb-12">
              <div className="max-w-md"><h2 className="text-2xl font-semibold">{image.title}</h2><p className="mt-2 text-white/80">{image.body}</p></div>
            </div>
          </ClipReveal>
        </section>
      )}

      {pillars && pillars.items.length > 0 && (
        <section className="bg-mist py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal><p className="eyebrow mb-3">{pillars.eyebrow}</p><h2 className="h-section">{pillars.title}</h2></Reveal>
            <ol className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
              {pillars.items.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={(i % 2) * 0.08} className="grid grid-cols-[3.5rem_1fr] border-t border-line pt-6">
                    <span className="font-display text-[2rem] font-semibold leading-none text-brand-300">0{i + 1}</span>
                    <div><h3 className="text-[18px] font-semibold">{p.title}</h3><p className="mt-2 leading-relaxed text-slate-soft">{p.text}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Our Team (About page only, managed from Admin > Team) */}
      {slug === "about" && <TeamSection groups={teamGroups} />}

      <section className="on-dark bg-navy-900 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-[1.375rem] font-semibold">{next.text}</p>
          <Link href={next.href} className="btn btn-primary">{next.label} <span className="arrow" aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}

export async function contentMeta(slug: string, fallbackTitle: string, desc: string) {
  const { buildMetadata } = await import("@/lib/data");
  return buildMetadata({ type: "page", key: slug, path: `/${slug}`, fallbackTitle, fallbackDescription: desc });
}