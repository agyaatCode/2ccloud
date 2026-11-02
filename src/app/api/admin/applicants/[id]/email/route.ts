import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const b = await req.json().catch(() => null);
  const subject = str(b?.subject, 200), message = str(b?.message, 8000);
  if (!subject || message.length < 3) return fail("Please enter a subject and a message.");
  const [a] = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  if (!a) return fail("Not found.", 404);
  await sendMail({ to: a.email, subject, text: `${message}\n\n— HR Team\nReference: ${a.referenceNo}` });
  await audit({ id: g.admin.id, name: g.admin.name }, "applicant.email", "job_application", id, subject, req);
  return json({ ok: true });
}
