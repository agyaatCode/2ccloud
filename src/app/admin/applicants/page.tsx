import { ApplicantsManager } from "@/components/admin/ApplicantsManager";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage() {
  await requireAdminPage("applicants.manage");
  return <ApplicantsManager />;
}
