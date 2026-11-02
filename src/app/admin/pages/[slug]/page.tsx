import { PageEditor } from "@/components/admin/PageEditor";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPage("pages.manage");
  const { slug } = await params;
  return <PageEditor key={slug} slug={slug} />;
}
