import { redirect } from "next/navigation";
import { Hero } from "@/components/Hero";
import { LoginForm } from "@/components/forms";
import { buildMetadata, getPageHero } from "@/lib/data";
import { getUser } from "@/lib/auth";

export const generateMetadata = () => buildMetadata({ type: "page", key: "login", path: "/login", fallbackTitle: "Sign in", fallbackDescription: "Sign in to your customer dashboard." });

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getUser()) redirect("/dashboard");
  const hero = await getPageHero("login");
  return (
    <>
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "Sign in" }]} />
      <section className="bg-mist py-14 lg:py-20">
        <div className="mx-auto max-w-md px-5"><div className="border border-line bg-white p-7 sm:p-9"><h2 className="mb-6 text-xl font-semibold">Sign in to your account</h2><LoginForm next={next} /></div></div>
      </section>
    </>
  );
}
