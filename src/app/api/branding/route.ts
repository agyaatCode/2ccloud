import { getBranding } from "@/lib/data";

export const dynamic = "force-dynamic";

/** Public branding endpoint — the frontend (and any external consumer) loads the active logo from here. */
export async function GET() {
  const b = await getBranding();
  return Response.json(b, { headers: { "Cache-Control": "public, max-age=30, s-maxage=30" } });
}
