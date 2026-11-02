/**
 * ============================================================================
 * FILE: src/app/api/chat/poll/route.ts
 * ENDPOINT: GET /api/chat/poll?token=<session_token>&after=<last_message_id>
 * ============================================================================
 * PURPOSE:
 *   1. Restores full chat transcript on page load when `after=0`.
 *   2. Streams live human Admin replies (`role = "admin"`) sent from
 *      `/admin/ai-leads` -> `Unanswered` directly into the visitor's open chat
 *      window by fetching only new rows where `chat_messages.id > after`.
 *
 * CACHE POLICY:
 *   `dynamic = "force-dynamic"` ensures Next.js never serves stale cached
 *   polling responses.
 *
 * TABLES TOUCHED:
 *   - `chat_sessions` (SELECT active token check)
 *   - `chat_messages` (SELECT messages with `id > after` ordered ascending)
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { chatMessages, chatSessions } from "@/db/chat-schema";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = String(searchParams.get("token") || "").trim();
    const after = Math.max(0, Number(searchParams.get("after") || 0) || 0);

    if (!token) return NextResponse.json({ error: "Missing session token." }, { status: 401 });

    const [session] = await db
      .select({ id: chatSessions.id })
      .from(chatSessions)
      .where(and(eq(chatSessions.token, token), gt(chatSessions.expiresAt, new Date())))
      .limit(1);

    if (!session) {
      return NextResponse.json({ error: "Session expired." }, { status: 401 });
    }

    const messages = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
      })
      .from(chatMessages)
      .where(and(eq(chatMessages.sessionId, session.id), gt(chatMessages.id, after)))
      .orderBy(asc(chatMessages.id))
      .limit(200);

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[GET /api/chat/poll]", err);
    return NextResponse.json({ error: "Poll failed." }, { status: 500 });
  }
}