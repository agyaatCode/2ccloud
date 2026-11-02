import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdminPage("media.manage");
  return <MediaLibrary />;
}
