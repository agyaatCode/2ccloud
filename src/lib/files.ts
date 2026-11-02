import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const STORAGE_ROOT = process.env.STORAGE_DIR ? path.resolve(process.env.STORAGE_DIR) : path.join(process.cwd(), "storage");
export const PUBLIC_UPLOADS = path.join(STORAGE_ROOT, "uploads");
export const PRIVATE_DOCS = path.join(STORAGE_ROOT, "private", "applicants");

const eq = (b: Buffer, start: number, bytes: number[]) => bytes.every((v, i) => b[start + i] === v);
const txt = (b: Buffer, s: number, e: number) => b.subarray(s, e).toString("latin1");

function safeSvg(s: string): boolean {
  const l = s.slice(0, 2_000_000).toLowerCase();
  if (!/<svg[\s>]/.test(l)) return false;
  return !/<script|<foreignobject|<iframe|<object|<embed|javascript:|\son[a-z]+\s*=|<!entity|<link|<audio|<video/.test(l);
}

type Rule = { mimes: string[]; check: (b: Buffer) => boolean };
const jpeg: Rule = { mimes: ["image/jpeg", "image/pjpeg"], check: (b) => eq(b, 0, [0xff, 0xd8, 0xff]) };
export const RULES: Record<string, Rule> = {
  jpg: jpeg,
  jpeg,
  png: { mimes: ["image/png"], check: (b) => eq(b, 0, [0x89, 0x50, 0x4e, 0x47]) },
  webp: { mimes: ["image/webp"], check: (b) => txt(b, 0, 4) === "RIFF" && txt(b, 8, 12) === "WEBP" },
  svg: { mimes: ["image/svg+xml"], check: (b) => safeSvg(b.toString("utf8")) },
  mp4: { mimes: ["video/mp4"], check: (b) => txt(b, 4, 8) === "ftyp" },
  webm: { mimes: ["video/webm"], check: (b) => eq(b, 0, [0x1a, 0x45, 0xdf, 0xa3]) },
  pdf: { mimes: ["application/pdf"], check: (b) => txt(b, 0, 4) === "%PDF" },
  doc: { mimes: ["application/msword"], check: (b) => eq(b, 0, [0xd0, 0xcf, 0x11, 0xe0]) },
  docx: { mimes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], check: (b) => txt(b, 0, 2) === "PK" },
};

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(Object.entries(RULES).map(([k, v]) => [k, v.mimes[0]]));
export const kindOfExt = (ext: string): "image" | "video" | "pdf" | null =>
  ["jpg", "jpeg", "png", "webp", "svg"].includes(ext) ? "image" : ["mp4", "webm"].includes(ext) ? "video" : ext === "pdf" ? "pdf" : null;

export class UploadError extends Error {}

export type Stored = { storedName: string; absPath: string; relPath: string; originalName: string; mime: string; size: number; ext: string };

/** Validates extension, declared MIME, size and file signature, then writes the file with a random name. */
export async function storeFile(file: File, opts: { dir: string; allowed: string[]; maxBytes: number; label?: string }): Promise<Stored> {
  const original = (file.name || "file").replace(/[^\w.\- ()]/g, "_").slice(0, 180);
  const ext = path.extname(original).slice(1).toLowerCase();
  const label = opts.label || original;
  if (!ext || !opts.allowed.includes(ext) || !RULES[ext]) throw new UploadError(`${label}: file type .${ext || "?"} is not allowed. Allowed: ${opts.allowed.join(", ")}.`);
  if (file.size === 0) throw new UploadError(`${label} is empty.`);
  if (file.size > opts.maxBytes) throw new UploadError(`${label} exceeds the ${Math.round(opts.maxBytes / 1048576)} MB limit.`);
  const declared = (file.type || "").toLowerCase();
  const rule = RULES[ext];
  if (declared && declared !== "application/octet-stream" && !rule.mimes.includes(declared) && !(ext === "doc" && declared.includes("word")))
    throw new UploadError(`${label}: content type ${declared} does not match .${ext}.`);
  const buf = Buffer.from(await file.arrayBuffer());
  if (!rule.check(buf)) throw new UploadError(`${label}: file contents do not match a valid .${ext} file.`);
  const d = new Date();
  const sub = opts.dir.includes("private") ? "" : `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const folder = path.join(opts.dir, sub);
  await fs.mkdir(folder, { recursive: true });
  const storedName = `${crypto.randomBytes(12).toString("hex")}.${ext}`;
  const absPath = path.join(folder, storedName);
  await fs.writeFile(absPath, buf, { mode: 0o640 });
  return { storedName, absPath, relPath: path.join(sub, storedName).replace(/\\/g, "/"), originalName: original, mime: rule.mimes[0], size: file.size, ext };
}

/** Resolve a user-supplied relative path inside a root; returns null on traversal. */
export function safeJoin(root: string, rel: string[]): string | null {
  const abs = path.resolve(root, ...rel);
  return abs.startsWith(path.resolve(root) + path.sep) ? abs : null;
}
