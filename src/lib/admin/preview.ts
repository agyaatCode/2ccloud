// Builds a home page screenshot for a company website (used by Admin > Marketplaces).
// Called once when an admin saves a product with a link and no cover image,
// so visitors never wait for a screenshot.

function normalise(input: string) {
  const raw = input.trim();
  if (!raw || raw.startsWith("/") || raw.startsWith("#")) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

export async function fetchSitePreview(link: string): Promise<string> {
  const u = normalise(link);
  if (!u) return "";
  const host = u.hostname.toLowerCase();
  const isLocal = host === "localhost" || host.endsWith(".local") || /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  // skip local addresses and placeholder demo domains
  if (isLocal || !host.includes(".") || host === "example.com" || host.endsWith(".example.com")) return "";

  const api =
    "https://api.microlink.io/?" +
    new URLSearchParams({
      url: u.origin, // home page only
      screenshot: "true",
      meta: "false",
      type: "jpeg",
      "viewport.width": "1366",
      "viewport.height": "860",
      waitUntil: "networkidle2",
    }).toString();

  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(25000), cache: "no-store" });
    if (!res.ok) return "";
    const json = (await res.json()) as { status?: string; data?: { screenshot?: { url?: string } } };
    const url = json?.data?.screenshot?.url || "";
    return json.status === "success" && /^https:\/\//i.test(url) ? url : "";
  } catch {
    return ""; // never block saving; the carousel falls back to a gradient
  }
}