import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getBranding, getSettings, organizationSchema } from "@/lib/data";
import { getUser } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [b, s, user, org] = await Promise.all([getBranding(), getSettings(), getUser(), organizationSchema()]);
  return (
    <>
      <Header logo={b.logoUrl} mobileLogo={b.mobileLogoUrl} alt={s.brand_name} ctaText={s.header_cta_text} ctaUrl={s.header_cta_url} userName={user?.fullName ?? null} />
      <main id="main">{children}</main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org).replace(/</g, "\\u003c") }} />
    </>
  );
}
