import { clearCookies, destroySession, json, withCookies } from "@/lib/auth";

export async function POST() {
  await destroySession("user");
  return withCookies(json({ ok: true }), clearCookies("user"));
}
