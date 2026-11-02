import { Hero } from "@/components/Hero";
import { ApplyForm } from "@/components/ApplyForm";
import { baseHero } from "@/lib/hero";
import { getMasters, getPage } from "@/lib/data";

export const metadata = { title: "General application | Careers" };

export default async function GeneralApply() {
  const [masters, careers] = await Promise.all([getMasters(), getPage("careers")]);
  const hero = baseHero({
    eyebrow: "Careers", title: "Send us your application", description: "Do not see a role that fits? Tell us about yourself and we will keep your details for upcoming openings.",
    imageUrl: careers?.heroImageUrl || "/images/stock/careers.jpg", posDesktop: careers?.heroPosDesktop || "center 40%", height: 460, overlayOpacity: 82,
  });
  return (
    <>
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "Careers", href: "/careers" }, { name: "General application" }]} />
      <section className="bg-mist py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8"><div className="border border-line bg-white p-6 sm:p-10"><ApplyForm masters={masters} /></div></div>
      </section>
    </>
  );
}
