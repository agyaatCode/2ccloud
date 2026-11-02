import fs from "node:fs";
import { and, eq } from "drizzle-orm";
import { Readable } from "node:stream";
import { db } from "@/db";
import { applicantDocuments } from "@/db/schema";
import { audit, fail, guardAdmin } from "@/lib/auth";
import { PRIVATE_DOCS, safeJoin } from "@/lib/files";

type Ctx = { params: Promise<{ id: string; docId: string }> };

/** Private applicant documents are only ever served to authorised admins. */
export async function GET(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const p = await params;
  const [doc] = await db.select().from(applicantDocuments).where(and(eq(applicantDocuments.id, parseInt(p.docId, 10)), eq(applicantDocuments.applicationId, parseInt(p.id, 10)))).limit(1);
  if (!doc) return fail("Not found.", 404);
  const abs = safeJoin(PRIVATE_DOCS, doc.storedPath.split("/"));
  if (!abs || !fs.existsSync(abs)) return fail("File missing on server.", 404);
  const inline = new URL(req.url).searchParams.get("inline") === "1" && ["application/pdf", "image/jpeg", "image/png"].includes(doc.mimeType);
  await audit({ id: g.admin.id, name: g.admin.name }, "applicant.document.download", "applicant_document", doc.id, doc.originalName, req);
  return new Response(Readable.toWeb(fs.createReadStream(abs)) as ReadableStream, {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(doc.size),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${doc.originalName.replace(/[^\w.\- ]/g, "_")}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
