import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdminPage } from "@/lib/auth";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdminPage("settings.manage");
  return <SettingsForm initial={await getSettings()} />;
}
