import fs from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { MIME_BY_EXT, PUBLIC_UPLOADS, safeJoin } from "@/lib/files";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const abs = safeJoin(PUBLIC_UPLOADS, parts);
  if (!abs) return new Response("Not found", { status: 404 });
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime || ["doc", "docx"].includes(ext)) return new Response("Not found", { status: 404 });
  let st;
  try {
    st = await stat(abs);
    if (!st.isFile()) throw new Error("x");
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const headers: Record<string, string> = {
    "Content-Type": mime,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };
  if (ext === "svg") headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
  const range = req.headers.get("range");
  if (range && /^bytes=\d*-\d*$/.test(range)) {
    const [a, b] = range.replace("bytes=", "").split("-");
    const start = a ? parseInt(a, 10) : Math.max(0, st.size - parseInt(b, 10));
    const end = a && b ? Math.min(parseInt(b, 10), st.size - 1) : st.size - 1;
    if (start > end || start >= st.size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${st.size}` } });
    const stream = Readable.toWeb(fs.createReadStream(abs, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Content-Length": String(end - start + 1) } });
  }
  const stream = Readable.toWeb(fs.createReadStream(abs)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, "Content-Length": String(st.size) } });
}
