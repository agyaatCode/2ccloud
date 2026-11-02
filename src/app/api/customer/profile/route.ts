import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { audit, fail, guardUser, json, str } from "@/lib/auth";

export async function PUT(req: Request) {
  const g = await guardUser(req);
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => null);
  if (!b) return fail("Invalid request.");
  const fullName = str(b.fullName, 140), mobile = str(b.mobile, 30);
  if (fullName.length < 2) return fail("Please enter your full name.");
  if (!/^[+\d][\d\s-]{6,20}$/.test(mobile)) return fail("Please enter a valid mobile number.");
  await db.update(users).set({
    fullName, mobile, company: str(b.company, 160), country: str(b.country, 80), state: str(b.state, 80), city: str(b.city, 80),
    address: str(b.address, 500), serviceInterest: str(b.serviceInterest, 120), updatedAt: new Date(),
  }).where(eq(users.id, g.user.id));
  await audit({ type: "user", id: g.user.id, name: fullName }, "customer.profile.update", "user", g.user.id, "", req);
  return json({ ok: true });
}
