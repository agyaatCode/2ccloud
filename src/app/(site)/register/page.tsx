import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { RegisterForm } from "@/components/forms";
import { buildMetadata, getPageHero } from "@/lib/data";
import { getUser } from "@/lib/auth";

export const generateMetadata = () => buildMetadata({ type: "page", key: "register", path: "/register", fallbackTitle: "Register", fallbackDescription: "Create a customer account." });

export default async function RegisterPage() {
  if (await getUser()) redirect("/dashboard");
  const hero = await getPageHero("register");
  return (
    <>
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "Register" }]} />
      <section className="bg-mist py-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">Customer portal</p>
            <h2 className="text-2xl font-semibold">What you get</h2>
            <ul className="mt-6 space-y-4 text-[14.5px]">
              {["A dashboard to manage your details", "Submit and track service requests", "Direct line to our engineering team", "Updates on the services you use"].map((t) => (
                <li key={t} className="flex gap-3"><svg width="18" height="18" viewBox="0 0 18 18" className="mt-0.5 shrink-0" aria-hidden="true"><path d="M4 9.5l3.2 3L14 5.5" fill="none" stroke="#1e9e5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{t}</li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-white p-6 sm:p-9 lg:col-span-8"><RegisterForm /></div>
        </div>
      </section>
    </>
  );
}
