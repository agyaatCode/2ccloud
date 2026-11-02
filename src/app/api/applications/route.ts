import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { applicantDocuments, applicantEducation, jobApplications, jobs } from "@/db/schema";
import { audit, clientIp, fail, isEmail, json, rateLimit, sameOrigin, str } from "@/lib/auth";
import { PRIVATE_DOCS, storeFile, UploadError } from "@/lib/files";
import { getMasters } from "@/lib/data";
import { notifyTeam, sendMail } from "@/lib/mailer";

export const maxDuration = 60;
const MAX = 5 * 1024 * 1024;
const LEVELS = ["matric", "intermediate", "diploma", "graduation", "postgraduation", "phd"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin request blocked.", 403);
  const ip = clientIp(req);
  if (!rateLimit(`apply:${ip}`, 6, 60 * 60_000)) return fail("Too many applications from this connection. Please try again later.", 429);
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail("Invalid form submission.");
  }
  if (str(fd.get("website"))) return json({ ok: true, reference: "HR-RECEIVED" });
  const g = (k: string, max = 200) => str(fd.get(k), max);
  const masters = await getMasters();

  const req_ = ["fullName", "fatherName", "email", "mobile", "dob", "gender", "address", "city", "state", "country", "pin", "highestQualification", "roleName"];
  for (const k of req_) if (!g(k, 500)) return fail(`Please complete the “${k.replace(/([A-Z])/g, " $1").toLowerCase()}” field.`);
  const email = g("email", 190).toLowerCase();
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (!/^[+\d][\d\s-]{6,20}$/.test(g("mobile", 30))) return fail("Please enter a valid mobile number.");
  if (!/^[A-Za-z0-9 -]{3,12}$/.test(g("pin", 12))) return fail("Please enter a valid PIN / postal code.");
  if (!GENDERS.includes(g("gender", 30))) return fail("Please select a valid gender.");
  const dob = new Date(g("dob", 12));
  if (Number.isNaN(dob.getTime()) || dob > new Date() || new Date().getFullYear() - dob.getFullYear() < 16) return fail("Please enter a valid date of birth.");
  const qual = g("highestQualification", 120), role = g("roleName", 200);
  if (qual !== "Other" && !masters.qualifications.includes(qual)) return fail("Please choose a valid qualification.");
  if (qual === "Other" && !g("qualificationOther", 160)) return fail("Please specify your qualification.");
  if (role !== "Other" && !masters.roles.includes(role)) return fail("Please choose a valid role.");
  if (role === "Other" && !g("roleOther", 200)) return fail("Please specify the role you are applying for.");

  const cv = fd.get("cv"), marksheet = fd.get("marksheet");
  if (!(cv instanceof File) || cv.size === 0) return fail("Please attach your CV.");
  if (!(marksheet instanceof File) || marksheet.size === 0) return fail("Please attach your highest qualification marksheet.");
  const extra = fd.getAll("additional").filter((f): f is File => f instanceof File && f.size > 0).slice(0, 5);

  let jobId: number | null = null;
  const jid = parseInt(g("jobId", 10), 10);
  if (jid) {
    const [j] = await db.select().from(jobs).where(eq(jobs.id, jid)).limit(1);
    if (!j || j.status !== "active") return fail("This position is no longer accepting applications.", 410);
    jobId = j.id;
  }

  const reference = `HR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const [app] = await db.insert(jobApplications).values({
    referenceNo: reference, jobId, roleName: role, roleOther: g("roleOther", 200), fullName: g("fullName", 140), fatherName: g("fatherName", 140), email, mobile: g("mobile", 30),
    dob: g("dob", 12), gender: g("gender", 30), address: g("address", 500), city: g("city", 80), state: g("state", 80), country: g("country", 80), pin: g("pin", 12),
    highestQualification: qual, qualificationOther: g("qualificationOther", 160), ip,
  }).returning({ id: jobApplications.id });

  try {
    const dir = path.join(PRIVATE_DOCS, String(app.id));
    const docs: { docType: string; f: File; label: string }[] = [
      { docType: "cv", f: cv, label: "CV" }, { docType: "marksheet", f: marksheet, label: "Marksheet" },
      ...extra.map((f, i) => ({ docType: "additional", f, label: `Additional document ${i + 1}` })),
    ];
    for (const d of docs) {
      const allowed = d.docType === "marksheet" ? ["pdf", "jpg", "jpeg", "png"] : ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
      const s = await storeFile(d.f, { dir, allowed, maxBytes: MAX, label: d.label });
      await db.insert(applicantDocuments).values({ applicationId: app.id, docType: d.docType, originalName: s.originalName, storedPath: `${app.id}/${s.storedName}`, mimeType: s.mime, size: s.size });
    }
    const edu = LEVELS.flatMap((level) => {
      const institution = g(`edu_${level}`, 220);
      return institution ? [{ applicationId: app.id, level, institution, year: g(`year_${level}`, 4).replace(/\D/g, ""), score: g(`score_${level}`, 20) }] : [];
    });
    if (edu.length) await db.insert(applicantEducation).values(edu);
  } catch (e) {
    // roll back the partially stored application
    await db.delete(jobApplications).where(eq(jobApplications.id, app.id));
    await fs.rm(path.join(PRIVATE_DOCS, String(app.id)), { recursive: true, force: true }).catch(() => {});
    if (e instanceof UploadError) return fail(e.message);
    console.error("[application]", e);
    return fail("We could not save your application. Please try again.", 500);
  }

  await audit({ type: "public", name: g("fullName", 140) }, "application.create", "job_application", app.id, reference, req);
  const roleLabel = role === "Other" ? g("roleOther", 200) : role;
  await Promise.all([
    sendMail({ to: email, subject: `Application received — ${reference}`, text: `Hello ${g("fullName", 140)},\n\nThank you for applying for ${roleLabel}. Your reference number is ${reference}.\nOur HR team will review your application and contact you if your profile matches.\n` }),
    notifyTeam(`New job application: ${roleLabel} — ${g("fullName", 140)}`, `Reference: ${reference}\nName: ${g("fullName", 140)}\nEmail: ${email}\nMobile: ${g("mobile", 30)}\nRole: ${roleLabel}\nQualification: ${qual}\n\nReview it in the admin panel → Applicants.`, email),
  ]);
  return json({ ok: true, reference });
}
