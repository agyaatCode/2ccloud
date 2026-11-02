/**
 * FILE: src/app/admin/ai-leads/page.tsx
 * ROUTE: GET /admin/ai-leads
 * TYPE: Admin page (Server Component). Loads leads, unanswered questions, and learned KB entries,
 *       then renders the compact <AiLeadsManager /> client interface.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { chatKnowledge, chatLeads, chatSessions, chatTickets } from "@/db/chat-schema";
import { requireAdminPage } from "@/lib/auth";
import { AiLeadsManager } from "@/components/admin/AiLeadsManager";

export const dynamic = "force-dynamic";

export default async function AiLeadsPage() {
  await requireAdminPage();

  const [leads, tickets, knowledge] = await Promise.all([
    db.select().from(chatLeads).orderBy(desc(chatLeads.createdAt)).limit(500),
    db
      .select({ t: chatTickets, lead: chatLeads, sessionExpires: chatSessions.expiresAt })
      .from(chatTickets)
      .innerJoin(chatLeads, eq(chatLeads.id, chatTickets.leadId))
      .leftJoin(chatSessions, eq(chatSessions.id, chatTickets.sessionId))
      .orderBy(desc(chatTickets.createdAt))
      .limit(300),
    db.select().from(chatKnowledge).orderBy(desc(chatKnowledge.createdAt)).limit(500),
  ]);

  const now = new Date();
  return (
    <AiLeadsManager
      leads={leads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        status: l.status,
        createdAt: l.createdAt.toISOString(),
      }))}
      tickets={tickets.map(({ t, lead, sessionExpires }) => ({
        id: t.id,
        code: t.code,
        question: t.question,
        standalone: t.standalone,
        language: t.language,
        answer: t.answer,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        leadName: lead.name,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        chatAlive: Boolean(t.sessionId && sessionExpires && sessionExpires > now),
      }))}
      knowledge={knowledge.map((k) => ({
        id: k.id,
        question: k.question,
        answer: k.answer,
        source: k.source,
        isActive: k.isActive,
        createdAt: k.createdAt.toISOString(),
      }))}
    />
  );
}
