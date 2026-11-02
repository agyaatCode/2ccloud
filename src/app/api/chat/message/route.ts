/**
 * ============================================================================
 * FILE: src/app/api/chat/message/route.ts
 * ENDPOINT: POST /api/chat/message
 * ============================================================================
 * PURPOSE:
 *   Handles every incoming visitor chat message using our Self-Learning
 *   DB-First Semantic Brain (`answerVisitorMessage` in `src/lib/chat.ts`).
 *
 * EXECUTION FLOW:
 *   1. Validates active session token against `chat_sessions` + `chat_leads`.
 *   2. Calls `answerVisitorMessage(...)` FIRST before writing the user message:
 *      - Searches `chat_knowledge` via the <0.1ms RAM Semantic Index (0 API credits).
 *      - On DB miss, calls Groq AI (`openai/gpt-oss-120b`), replies in the
 *        visitor's language, and auto-learns general tech/server Q&As into
 *        `chat_knowledge` (`source = "auto"`) OR escalates company pricing/support
 *        questions to `chat_tickets`.
 *   3. Saves BOTH the visitor message (`role = "user"`) and bot reply (`role = "bot"`)
 *      in order so failed requests never leave orphan questions in history.
 *   4. Extends the 15-day rolling session expiration window.
 *
 * TABLES TOUCHED:
 *   - `chat_sessions` & `chat_leads` (SELECT active session, UPDATE expiry)
 *   - `chat_knowledge` & `chat_tickets` (via `answerVisitorMessage`)
 *   - `chat_messages` (INSERT user + bot rows)
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { chatLeads, chatMessages, chatSessions } from "@/db/chat-schema";
import { answerVisitorMessage, futureExpiry } from "@/lib/chat";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = String(body?.token || "").trim();
    const message = String(body?.message || "").trim().slice(0, 1000);
    const lang = String(body?.lang || "auto").trim().slice(0, 20);

    if (!token) return NextResponse.json({ error: "Session missing." }, { status: 401 });
    if (!message) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });

    const [sessionRow] = await db
      .select({ session: chatSessions, lead: chatLeads })
      .from(chatSessions)
      .innerJoin(chatLeads, eq(chatLeads.id, chatSessions.leadId))
      .where(and(eq(chatSessions.token, token), gt(chatSessions.expiresAt, new Date())))
      .limit(1);

    if (!sessionRow) {
      return NextResponse.json({ error: "Session expired." }, { status: 401 });
    }

    const { session, lead } = sessionRow;

    // 1. Generate reply FIRST (from DB in <0.1ms or Groq AI + Auto-Learn) so failed requests never pollute history
    const { reply } = await answerVisitorMessage({
      sessionId: session.id,
      leadId: lead.id,
      leadName: lead.name,
      message,
      lang,
    });

    // 2. Insert user message + bot reply cleanly in order
    const [savedUser] = await db
      .insert(chatMessages)
      .values({
        sessionId: session.id,
        role: "user",
        content: message,
      })
      .returning({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
      });

    const [savedBot] = await db
      .insert(chatMessages)
      .values({
        sessionId: session.id,
        role: "bot",
        content: reply,
      })
      .returning({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
      });

    // 3. Extend rolling 15-day session expiry
    await db
      .update(chatSessions)
      .set({ expiresAt: futureExpiry() })
      .where(eq(chatSessions.id, session.id));

    return NextResponse.json({ messages: [savedUser, savedBot] });
  } catch (err) {
    console.error("[POST /api/chat/message]", err);
    const msg = err instanceof Error ? err.message : "Sorry, could not process your message right now.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}