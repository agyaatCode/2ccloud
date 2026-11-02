/**
 * ============================================================================
 * FILE: src/app/api/chat/start/route.ts
 * ENDPOINT: POST /api/chat/start
 * ============================================================================
 * PURPOSE:
 *   Initializes a visitor chat session from the lead capture form inside
 *   `ChatWidget.tsx`.
 *
 * EXECUTION FLOW:
 *   1. Validates visitor `name`, `email`, and `phone` (rejects invalid inputs
 *      with HTTP 400 JSON before touching the database).
 *   2. Upserts the visitor record in `chat_leads` matched by lowercase `email`
 *      so returning visitors keep one unified lead history.
 *   3. Creates a 15-day rolling session row in `chat_sessions` with a secure
 *      48-character random hex `token`.
 *   4. Inserts the initial localized bot greeting into `chat_messages`.
 *   5. Returns `{ token }` so the browser stores it in `localStorage`.
 *
 * TABLES TOUCHED:
 *   - `chat_leads`    (SELECT / INSERT / UPDATE)
 *   - `chat_sessions` (INSERT)
 *   - `chat_messages` (INSERT initial greeting)
 * ============================================================================
 */

import crypto from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatLeads, chatMessages, chatSessions } from "@/db/chat-schema";
import { futureExpiry } from "@/lib/chat";
import { greeting } from "@/lib/chat-lang";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || "").trim().slice(0, 140);
    const email = String(body?.email || "").trim().toLowerCase().slice(0, 190);
    const phone = String(body?.phone || "").trim().slice(0, 30);
    const lang = String(body?.lang || "auto").trim().slice(0, 20);
    const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "")
      .trim()
      .slice(0, 64);

    if (name.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    // Reuse existing lead if email already exists; otherwise create a new lead
    const [existingLead] = await db.select().from(chatLeads).where(eq(chatLeads.email, email)).limit(1);
    let leadId: number;

    if (existingLead) {
      leadId = existingLead.id;
      await db
        .update(chatLeads)
        .set({ name, phone, ...(ip ? { ip } : {}), updatedAt: new Date() })
        .where(eq(chatLeads.id, existingLead.id));
    } else {
      const [created] = await db
        .insert(chatLeads)
        .values({ name, email, phone, status: "new", ip })
        .returning({ id: chatLeads.id });
      leadId = created.id;
    }

    // Create a 15-day session token and store the opening bot greeting message
    const token = crypto.randomBytes(24).toString("hex");
    const [session] = await db
      .insert(chatSessions)
      .values({
        leadId,
        token,
        expiresAt: futureExpiry(),
      })
      .returning({ id: chatSessions.id });

    const firstName = name.split(/\s+/)[0] || name;
    await db.insert(chatMessages).values({
      sessionId: session.id,
      role: "bot",
      content: greeting(lang, firstName),
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("[POST /api/chat/start]", err);
    const msg = err instanceof Error ? err.message : "Unable to start chat right now.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}