// app/api/db-check/route.ts
// Temporary diagnostic route: tells us exactly why the DB is not reachable on the server.
// DELETE this file after the problem is fixed.
import { NextResponse } from "next/server";
import net from "net";
import dns from "dns";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Tries one TCP connection to a specific IP and returns a readable result
function tryConnect(host: string, port: number): Promise<string> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: 6000 });
    socket.on("connect", () => {
      socket.destroy();
      resolve("OK");
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve("TIMEOUT");
    });
    socket.on("error", (err: NodeJS.ErrnoException) => {
      resolve(`ERROR code=${err.code ?? "unknown"} msg=${err.message || "-"}`);
    });
  });
}

export async function GET() {
  const url = process.env.DATABASE_URL;
  const result: Record<string, unknown> = {
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version,
    databaseUrlPresent: Boolean(url),
  };

  if (!url) {
    return NextResponse.json({ ...result, problem: "DATABASE_URL not loaded" });
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const dbPort = parseInt(parsed.port, 10) || 5432;
    result.host = host;

    // 1) DNS lookup: shows all IPs (IPv4 and IPv6) the server resolves
    let addresses: dns.LookupAddress[] = [];
    try {
      addresses = await dns.promises.lookup(host, { all: true });
      result.dns = addresses.map((a) => `${a.address} (IPv${a.family})`);
    } catch (e) {
      result.dnsError = (e as Error).message;
    }

    // 2) Test every resolved IP on DB port (5432) and on HTTPS port (443)
    const checks: Record<string, string> = {};
    for (const a of addresses) {
      checks[`${a.address}:${dbPort}`] = await tryConnect(a.address, dbPort);
      checks[`${a.address}:443`] = await tryConnect(a.address, 443);
    }
    result.checks = checks;
  } catch (e) {
    result.urlError = (e as Error).message;
  }

  return NextResponse.json(result);
}