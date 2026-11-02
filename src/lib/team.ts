/**
 * FILE: src/lib/team.ts
 * TYPE: Server-only data helper
 * INCLUDES: getTeamGroups() - active groups with their active members, for the About page
 */
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";

export type TeamMemberView = {
  id: number;
  name: string;
  designation: string;
  photoUrl: string;
  overview: string;
  experience: string;
  linkedinUrl: string;
  email: string;
};

export type TeamGroupView = {
  id: number;
  name: string;
  description: string;
  members: TeamMemberView[];
};

export async function getTeamGroups(): Promise<TeamGroupView[]> {
  try {
    const [groups, members] = await Promise.all([
      db.select().from(t.teamGroups).where(eq(t.teamGroups.isActive, true)).orderBy(asc(t.teamGroups.sortOrder), asc(t.teamGroups.id)),
      db.select().from(t.teamMembers).where(eq(t.teamMembers.isActive, true)).orderBy(asc(t.teamMembers.sortOrder), asc(t.teamMembers.id)),
    ]);

    return groups
      .map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        members: members
          .filter((m) => m.groupId === g.id)
          .map((m) => ({
            id: m.id,
            name: m.name,
            designation: m.designation,
            photoUrl: m.photoUrl,
            overview: m.overview,
            experience: m.experience,
            linkedinUrl: m.linkedinUrl,
            email: m.email,
          })),
      }))
      // Hide empty groups on the public site
      .filter((g) => g.members.length > 0);
  } catch (e) {
    // Never break the About page if the team tables are not migrated yet
    console.error("[team] could not load team", e);
    return [];
  }
}