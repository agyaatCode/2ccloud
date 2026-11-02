import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCES } from "@/lib/admin/defs";
import { loadOptions } from "@/lib/admin/crud";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ResourcePage({ params, searchParams }: { params: Promise<{ resource: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { resource } = await params;
  const sp = await searchParams;
  const def = RESOURCES[resource];
  if (!def) notFound();
  await requireAdminPage(def.perm);
  const optionsMap: Record<string, { value: string; label: string }[]> = {};
  for (const f of def.fields) if (f.optionsFrom && !optionsMap[f.optionsFrom]) optionsMap[f.optionsFrom] = await loadOptions(f.optionsFrom);
  const initialFilters: Record<string, string> = {};
  for (const f of def.filters ?? []) if (sp[f.name]) initialFilters[f.name] = sp[f.name]!;
  return <ResourceManager key={`${resource}:${JSON.stringify(initialFilters)}`} def={def} optionsMap={optionsMap} initialFilters={initialFilters} />;
}
