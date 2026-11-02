/**
 * FILE: src/app/api/chat/whatsapp/route.ts
 * ROUTE: POST /api/chat/whatsapp?token=WHATSAPP_WEBHOOK_TOKEN
 * CALLED BY: Twilio (WhatsApp webhook), NOT by the website. Set this URL in the Twilio console.
 * WHAT IT DOES: Receives the admin's WhatsApp reply in the format "CODE your answer", translates it into the
 *   visitor's language, sends it into the visitor's chat (if the chat is still alive), marks the ticket answered,
 *   and saves the Q&A in the knowledge base so the bot learns it forever.
 */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatMessages, chatSessions, chatTickets } from "@/db/chat-schema";
import { futureExpiry, learn, translateTo } from "@/lib/chat";

export const dynamic = "force-dynamic";

const xml = (msg = "") =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${msg ? `<Message>${msg}</Message>` : ""}</Response>`, {
    headers: { "Content-Type": "text/xml" },
  });

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (!process.env.WHATSAPP_WEBHOOK_TOKEN || url.searchParams.get("token") !== process.env.WHATSAPP_WEBHOOK_TOKEN) {
    return new Response("Forbidden", { status: 403 });
  }

  const form = await req.formData();
  const from = String(form.get("From") || "");
  const body = String(form.get("Body") || "").trim();

  // Only the admin number may answer.
  if (from !== process.env.ADMIN_WHATSAPP_TO) return xml();

  const m = body.match(/^#?([A-Za-z0-9]{4})\s+([\s\S]+)$/);
  if (!m) return xml("Format: CODE your answer (example: K7P2 Yes, we do)");

  const code = m[1].toUpperCase();
  const answer = m[2].trim().slice(0, 2000);

  const [ticket] = await db.select().from(chatTickets).where(eq(chatTickets.code, code)).limit(1);
  if (!ticket) return xml(`Ticket ${code} not found.`);

  await db.update(chatTickets).set({ answer, status: "answered", answeredAt: new Date() }).where(eq(chatTickets.id, ticket.id));

  // Relay to the visitor in their language (only if their chat session still exists).
  if (ticket.sessionId) {
    const text = await translateTo(answer, ticket.language);
    await db.insert(chatMessages).values({ sessionId: ticket.sessionId, role: "admin", content: text });
    await db.update(chatSessions).set({ expiresAt: futureExpiry() }).where(eq(chatSessions.id, ticket.sessionId));
  }

  // Learning: store the English question with the admin's answer.
  await learn(ticket.standalone || ticket.question, answer, "admin");

  return xml(`Sent and saved to the knowledge base (#${code}).`);
}