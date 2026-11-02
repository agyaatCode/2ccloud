import { db } from "@/db";
import { media } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { kindOfExt, PUBLIC_UPLOADS, storeFile, UploadError } from "@/lib/files";
import path from "node:path";

export const maxDuration = 120;
const LIMITS = { image: 8 * 1048576, video: 80 * 1048576, pdf: 15 * 1048576 };

export async function POST(req: Request) {
  const g = await guardAdmin(req); // any signed-in admin may upload from content forms
  if ("error" in g) return g.error;
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail("Invalid upload.");
  }
  const file = fd.get("file");
  if (!(file instanceof File)) return fail("No file received.");
  const ext = path.extname(file.name || "").slice(1).toLowerCase();
  const kind = kindOfExt(ext);
  if (!kind) return fail("Unsupported file type. Allowed: JPG, PNG, WEBP, SVG, MP4, WEBM, PDF.");
  const only = str(fd.get("only"), 10); // optional restriction from the field: image | video
  if ((only === "image" || only === "video") && kind !== only) return fail(`This field needs a${only === "image" ? "n image" : " video"} file.`);
  try {
    const s = await storeFile(file, { dir: PUBLIC_UPLOADS, allowed: [ext], maxBytes: LIMITS[kind] });
    const url = `/uploads/${s.relPath}`;
    const title = str(fd.get("title"), 200) || s.originalName.replace(/\.[^.]+$/, "");
    const [row] = await db.insert(media).values({ title, altText: str(fd.get("alt"), 300), kind, source: "upload", url, storagePath: s.relPath, mimeType: s.mime, size: s.size, uploadedBy: g.admin.id }).returning();
    await audit({ id: g.admin.id, name: g.admin.name }, "media.upload", "media", row.id, s.originalName, req);
    return json({ ok: true, url, media: row });
  } catch (e) {
    if (e instanceof UploadError) return fail(e.message);
    console.error("[upload]", e);
    return fail("Upload failed.", 500);
  }
}
