import { Suspense, type ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdmin } from "@/lib/auth";
import { getBranding } from "@/lib/data";

export const metadata = { title: { absolute: "Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();
  if (!admin) return <div className="adm">{children}</div>;
  const b = await getBranding();
  return (
    <Suspense>
      <AdminShell name={admin.name} role={admin.roleName} perms={admin.permissions} logo={b.darkLogoUrl}>{children}</AdminShell>
    </Suspense>
  );
}
