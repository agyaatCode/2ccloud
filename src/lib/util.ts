export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function rgba(hex: string, a: number): string {
  let h = (hex || "#0A1F44").replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return `rgba(10,31,68,${a})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

export const isExternal = (u: string) => /^https?:\/\//i.test(u);

export function fmtDate(d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", opts).format(new Date(d));
}

export function lines(text: string): string[] {
  return (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

export function paragraphs(text: string): string[] {
  return (text || "").split(/\n{2,}/).map((l) => l.trim()).filter(Boolean);
}

export const videoEmbedSafe = (u: string) => /^(https?:\/\/|\/)/i.test(u);
