import { BrandingForm } from "@/components/admin/BrandingForm";
import { requireAdminPage } from "@/lib/auth";
import { db } from "@/db";
import { brandingSettings } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  await requireAdminPage("branding.manage");
  const [b] = await db.select().from(brandingSettings).limit(1);
  return <BrandingForm initial={{ logoUrl: b?.logoUrl ?? "", mobileLogoUrl: b?.mobileLogoUrl ?? "", darkLogoUrl: b?.darkLogoUrl ?? "", faviconUrl: b?.faviconUrl ?? "" }} />;
}
