// lib/db.ts
// Neon serverless driver over WebSocket (port 443) so it works on hosts that block port 5432
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// Node.js has no global WebSocket in older setups, so give the driver the "ws" package
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool);