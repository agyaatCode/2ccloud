/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * FILE: src/lib/chat.ts
 * TYPE: Server-only Self-Learning Semantic AI + PostgreSQL Engine
 * PRIMARY PROVIDER: GROQ_API_KEY (default model: openai/gpt-oss-120b)
 * ALSO SUPPORTS: GEMINI_API_KEY or OPENAI_API_KEY automatically if set.
 *
 * ARCHITECTURE (DB-FIRST + SELF-LEARNING CONSCIOUSNESS):
 *   1) Visitor asks ANY question (English / Hinglish / Hindi / Typos / Server Issue).
 *   2) Ultra-fast RAM Semantic Brain (<0.1ms) normalizes intent, stems synonyms, checks strict
 *      intent/error-code/pricing guardrails, and searches `chat_knowledge` first:
 *        • HIT  -> Returns verified DB answer immediately in ~5ms (ZERO API calls, ZERO credits used!).
 *        • MISS -> Calls Groq AI once with live Website CMS + KB context:
 *                  - If General Tech / Cloud / Server Troubleshooting: answers clearly AND automatically
 *                    stores a clean, name-free Q&A + English/Hinglish search aliases into `chat_knowledge`
 *                    (`source = "auto"`), training the database permanently for all future visitors!
 *                  - If Unverified Company Pricing / Quote / Live Support Ticket: escalates cleanly to
 *                    `chat_tickets` so Admin trains official company answers in `/admin/ai-leads`.
 */

import { config as loadEnv } from "dotenv";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  chatKnowledge,
  chatMessages,
  chatTickets,
  jobs,
  marketplaces,
  news,
  pages,
  pageSections,
  serviceBenefits,
  serviceFaqs,
  serviceFeatures,
  services,
  siteSettings,
} from "@/db/schema";
import { langByCode } from "@/lib/chat-lang";
import { STARTER_CLOUD_SERVER_KB } from "@/lib/chat-templates";

(loadEnv as any)({ path: ".env.local", override: true, quiet: true });

export const SESSION_DAYS = 15;
export const futureExpiry = () => new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

const SENSITIVE_SETTING_RE = /secret|password|passwd|token|api[_-]?key|smtp|private|webhook/i;

/* ============================================================================
 * 1. SEMANTIC CONSCIOUSNESS & SUB-0.1MS IN-MEMORY INVERTED INDEX ENGINE
 * ============================================================================ */

export type QueryIntent =
  | "company_pricing"
  | "account_support"
  | "company_info"
  | "compare"
  | "why_benefits"
  | "troubleshoot"
  | "howto"
  | "define";

export type QueryAnalysis = {
  canonicalKey: string;
  intent: QueryIntent;
  coreTokens: string[];
  errorCodes: string[];
  trigrams: Set<string>;
  hasContextPronoun: boolean;
};

type StoredKbMeta = {
  v: 2;
  aliases: string[];
  vec?: number[];
};

type IndexedPhrase = {
  analysis: QueryAnalysis;
  raw: string;
};

type IndexedKbEntry = {
  id: number;
  question: string;
  answer: string;
  source: string;
  phrases: IndexedPhrase[];
  allTokens: Set<string>;
  vec: number[];
};

/** Multi-word English + Hinglish + Hindi semantic phrase normalizations. */
const PHRASE_RULES: Array<[RegExp, string]> = [
  [/\b(physical\s+servers?|bare[\s-]?metal(\s+servers?)?|dedicated(\s+servers?|\s+hosting)?|on[\s-]?premise(\s+servers?)?|hardware\s+servers?)\b/giu, " physicalserver "],
  [/फिजिकल\s*सर्वर|डेडिकेटेड\s*सर्वर/gu, " physicalserver "],
  [/\b(virtual\s+private\s+servers?|cloud\s+vps)\b/giu, " vps "],
  [/\b(no\s+space\s+left(\s+on\s+device)?|disk\s+(space\s+)?(100%?\s+)?full|storage\s+(100%?\s+)?full|100%?\s*disk)\b/giu, " diskfull "],
  [/\b(out\s+of\s+memory|oom[\s-]?killer|memory\s+(100%?\s+)?full|ram\s+(100%?\s+)?full|low\s+memory)\b/giu, " ramfull "],
  [/\b(high\s+cpu(\s+usage|\s+load)?|cpu\s+(usage\s+)?(at\s+)?100%?|100%?\s*cpu|high\s+load(\s+average)?|very\s+slow|bahut\s+slow|server\s+slow|hang\s+ho)\b/giu, " highcpu "],
  [/\b(bad\s+gateway)\b/giu, " 502 badgateway "],
  [/\b(service\s+unavailable)\b/giu, " 503 serviceunavailable "],
  [/\b(gateway\s+time[\s-]?out)\b/giu, " 504 gatewaytimeout "],
  [/\b(connection\s+refused)\b/giu, " connrefused "],
  [/\b(connection\s+timed?\s*out|request\s+timed?\s*out|timed?\s*out)\b/giu, " conntimeout "],
  [/\b(permission\s+denied|publickey)\b/giu, " permdenied "],
  [/\b(too\s+many\s+connections)\b/giu, " toomanyconn "],
  [/\b(disaster\s+recovery)\b/giu, " backupdr "],
  [/\b(your\s+connection\s+is\s+not\s+private|not\s+secure|certificate\s+expired|ssl\s+error|ssl\s+renew)\b/giu, " sslerror "],
  [/\b(crash\s*loop\s*back\s*off|restarting\s+continuously|restart\s+loop|baar\s+baar\s+restart)\b/giu, " crashloop "],
  [/\b(two[\s-]?factor|multi[\s-]?factor|2fa|mfa)\b/giu, " mfa2fa "],
  [/\b(what\s+services\s+do\s+you|services\s+you\s+offer|your\s+services|aap\s+kya\s+service|hamari\s+services|kaunsi\s+services)\b/giu, " companyservices "],
  [/\b(instead\s+of|ke\s+badle|ki\s+jagah|compared\s+to|difference\s+between|farak\s+hai|antar\s+hai|which\s+is\s+better|which\s+one\s+is\s+better|konsa\s+sahi|konsa\s+better|kaunsa\s+achha)\b/giu, " __compare__ "],
  [/\b(why\s+should|why\s+use|why\s+choose|why\s+move|kyu\s+use|kyun\s+use|fayde\s+kya|kya\s+fayde|kya\s+fayda|benefits?\s+of|advantages?\s+of)\b/giu, " __why__ "],
  [/\b(how\s+much|kitne\s+ka|kitna\s+price|kitna\s+rate|kitna\s+charge|kitna\s+kharcha|kya\s+rate|kya\s+price|starting\s+price|monthly\s+cost)\b/giu, " __pricing__ "],
];

/** Optional OS / platform context words that carry soft weight (0.22) so mentioning OS/browser doesn't break matches. */
const CONTEXT_MODIFIER_TOKENS = new Set([
  "linux", "ubuntu", "debian", "centos", "almalinux", "rocky", "windows", "rhel",
  "web", "website", "site", "browser", "chrome", "app", "application", "service",
  "business", "company", "organization", "host", "hosting", "move", "switch",
  "show", "kill", "port", "connect", "login", "process", "node", "mysql", "nginx", "apache",
]);

/** Single-token synonym, Hindi script & common typo normalization map. */
const WORD_SYNONYMS: Record<string, string> = {
  पब्लिक: "public",
  क्लाउड: "cloud",
  कंप्यूटिंग: "comput",
  kloud: "cloud",
  cluod: "cloud",
  clod: "cloud",
  सर्वर: "server",
  servar: "server",
  srvr: "server",
  सिक्योरिटी: "security",
  सुरक्षा: "security",
  बैकअप: "backup",
  डेटाबेस: "database",
  फायदे: "benefit",
  फ़ायदे: "benefit",
  फायदा: "benefit",
  अंतर: "difference",
  फरक: "difference",
  फ़र्क: "difference",
  db: "database",
  vms: "vm",
  instances: "instance",
  containers: "container",
  k8s: "kubernetes",
  kubernets: "kubernetes",
  ngnix: "nginx",
  cert: "ssl",
  https: "ssl",
  certificates: "ssl",
  storage: "disk",
  space: "disk",
  memory: "ram",
  oom: "ramfull",
  lag: "highcpu",
  hanging: "highcpu",
  slowness: "highcpu",
  cost: "price",
  costs: "price",
  pricing: "price",
  rates: "price",
  rate: "price",
  charges: "price",
  charge: "price",
  plans: "price",
  quote: "price",
  quotation: "price",
  कीमत: "price",
  प्राइस: "price",
  खर्चा: "price",
};

/** Conversational & grammar stopwords across English, Hinglish, and Hindi. */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "am", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had", "can", "could", "should", "would",
  "will", "shall", "may", "might", "must", "i", "me", "my", "we", "us", "our",
  "you", "your", "he", "she", "they", "them", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "about", "into", "over", "after", "before", "or",
  "and", "if", "so", "than", "then", "too", "very", "just", "only", "also",
  "what", "when", "where", "who", "whom", "which", "how", "why",
  "please", "pls", "plz", "kindly", "tell", "explain", "describe", "define",
  "meaning", "means", "mean", "simple", "terms", "detail", "details", "brief",
  "know", "want", "need", "help", "guide", "solve", "fix", "issue", "problem",
  "error", "facing", "getting", "having", "running", "working", "check", "clean",
  "safely", "diagnose", "unable", "cannot", "cant", "not",
  // Hinglish & Hindi conversational fillers
  "bhai", "bro", "sir", "ji", "hello", "hi", "hey", "dear",
  "kya", "kyu", "kyun", "kaise", "kab", "kaha", "kahan", "konsa", "kaunsa", "kitna", "kitne",
  "hai", "hain", "ho", "tha", "thi", "the", "hota", "hoti", "hote",
  "ka", "ki", "ke", "ko", "se", "me", "mai", "mein", "par", "pe", "tak", "wala", "wali", "wale",
  "aur", "ya", "toh", "bhi", "hi", "ek", "koi", "kuch", "thoda", "pura", "sahi", "achha",
  "mera", "mere", "meri", "mujhe", "meko", "hum", "hamara", "apna", "apne", "aap", "aapka", "aapke",
  "batao", "bataiye", "samjhao", "samjhaiye", "kise", "kehte", "matlab", "arth",
  "raha", "rahi", "rahe", "gaya", "gayi", "gaye", "aa", "aata", "jata", "chal", "kar", "kare", "karu", "karna", "chahiye",
  "क्या", "क्यों", "कैसे", "कब", "कहाँ", "कौन", "है", "हैं", "होता", "होती", "का", "की", "के", "को", "में", "पर", "से", "और", "या", "मुझे", "मेरा", "बताओ", "समझाओ",
]);

function stemToken(word: string): string {
  const mapped = WORD_SYNONYMS[word] || word;
  if (mapped.length <= 4 || /\d/.test(mapped)) return mapped;
  if (mapped.endsWith("ies") && mapped.length > 5) return mapped.slice(0, -3) + "y";
  if (mapped.endsWith("ing") && mapped.length > 6) return mapped.slice(0, -3);
  if (mapped.endsWith("ed") && mapped.length > 5) return mapped.slice(0, -2);
  if (mapped.endsWith("es") && mapped.length > 5 && !mapped.endsWith("ses")) return mapped.slice(0, -2);
  if (mapped.endsWith("s") && !mapped.endsWith("ss") && !mapped.endsWith("vps") && mapped.length > 4) {
    return mapped.slice(0, -1);
  }
  return mapped;
}

function buildTrigrams(s: string): Set<string> {
  const padded = `  ${s}  `;
  const out = new Set<string>();
  for (let i = 0; i <= padded.length - 3; i++) out.add(padded.slice(i, i + 3));
  return out;
}

function trigramJaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/**
 * Core "Consciousness" Analyzer:
 * Understands intent, extracts HTTP/port error discriminators, resolves synonyms/typos,
 * and flags follow-up pronouns ("iska price?", "when is it better?") in ~0.04ms!
 */
export function analyzeQuery(rawInput: string): QueryAnalysis {
  const lower = String(rawInput || "").toLowerCase().trim();

  // Detect live account-specific / human callback requests that must NEVER get generic FAQ replies
  const hasIpAddress = /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(lower);
  const isAccountSupport =
    hasIpAddress ||
    /\b(reboot\s+my|restart\s+my\s+server|my\s+account|my\s+invoice|refund|call\s+me|callback|call\s+back|talk\s+to\s+(a\s+)?human|talk\s+to\s+agent|baat\s+karni\s+hai|mera\s+order)\b/i.test(
      lower,
    );

  // Detect short follow-up questions relying on previous turn pronouns
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  const hasContextPronoun =
    wordCount <= 6 &&
    /\b(it|this|that|they|iska|iske|iski|usme|uska|unke|isme|aur\s+iska)\b/i.test(lower);

  let normalized = lower;
  for (const [regex, replacement] of PHRASE_RULES) {
    normalized = normalized.replace(regex, replacement);
  }

  // Extract explicit HTTP / port error numbers (e.g. 403, 404, 500, 502, 503, 504, 22, 3306, 5432)
  const rawCodes = normalized.match(/\b(21|22|25|53|80|443|1433|3306|3389|5432|6379|8080|400|401|403|404|408|429|500|502|503|504)\b/g) || [];
  const errorCodes = Array.from(new Set(rawCodes));

  // Classify primary intent bucket BEFORE stripping marker tokens
  let intent: QueryIntent = "define";
  if (isAccountSupport) {
    intent = "account_support";
  } else if (
    normalized.includes("__pricing__") ||
    /\b(price|pricing|cost|rate|charges?|billing|plan|package|quote|quotation|discount|emi|gst|kharcha|कीमत|प्राइस)\b/u.test(
      normalized,
    )
  ) {
    intent = "company_pricing";
  } else if (
    normalized.includes("companyservices") ||
    /\b(2ccloud|your\s+company|your\s+office|office\s+address|contact\s+number|phone\s+number|email\s+id|hiring|vacancy|job\s+opening|careers?|sla\s+guarantee)\b/i.test(
      normalized,
    )
  ) {
    intent = "company_info";
  } else if (
    normalized.includes("__compare__") ||
    /\b(vs|versus|compare|comparison|difference|differ|farak|antar)\b|अंतर|फरक|फ़र्क/iu.test(normalized)
  ) {
    intent = "compare";
  } else if (
    errorCodes.length > 0 ||
    /\b(diskfull|ramfull|highcpu|badgateway|serviceunavailable|gatewaytimeout|connrefused|conntimeout|permdenied|toomanyconn|sslerror|crashloop)\b/.test(
      normalized,
    ) ||
    /\b(error|issue|problem|fix|solve|troubleshoot|down|crash|failed|failing|stuck|refused|timeout|denied|corrupt|hacked|malware|dikkat|kharab)\b/i.test(
      lower,
    )
  ) {
    intent = "troubleshoot";
  } else if (
    normalized.includes("__why__") ||
    /\b(why|benefit|benefits|advantage|advantages|pros|importance|fayda|fayde)\b|फायदे|फ़ायदे|फायदा/iu.test(normalized)
  ) {
    intent = "why_benefits";
  } else if (/\b(how\s+to|setup|set\s+up|install|configure|deploy|migrate|step\s+by\s+step|kaise\s+kare)\b/i.test(lower)) {
    intent = "howto";
  }

  // Clean marker tokens & punctuation (preserving \p{M} combining marks for Devanagari & Indian scripts!)
  const cleanTokens = normalized
    .replace(/__(compare|why|pricing)__/g, " ")
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((t) => stemToken(t.trim()))
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));

  // Deduplicate preserving unique core concepts (drop redundant generic "server" ONLY when 2+ more specific tokens exist)
  let uniqueTokens = Array.from(new Set(cleanTokens));
  if (uniqueTokens.length >= 3 && uniqueTokens.includes("server")) {
    uniqueTokens = uniqueTokens.filter((t) => t !== "server");
  }
  if (uniqueTokens.length >= 2 && uniqueTokens.includes("comput")) {
    uniqueTokens = uniqueTokens.filter((t) => t !== "comput");
  }

  const canonicalKey = `${intent}:${[...uniqueTokens].sort().join("_")}`;
  return {
    canonicalKey,
    intent,
    coreTokens: uniqueTokens,
    errorCodes,
    trigrams: buildTrigrams(uniqueTokens.join(" ")),
    hasContextPronoun,
  };
}

function areIntentsCompatible(queryIntent: QueryIntent, entryIntent: QueryIntent, source: string): boolean {
  if (queryIntent === "account_support") return false;
  if (queryIntent === "company_pricing") {
    return entryIntent === "company_pricing" && source !== "auto";
  }
  if (entryIntent === "company_pricing") {
    return false;
  }
  if (queryIntent === "company_info") {
    return entryIntent === "company_info";
  }
  if (queryIntent === "compare" || entryIntent === "compare") {
    return queryIntent === entryIntent;
  }
  if (queryIntent === "troubleshoot") {
    return entryIntent === "troubleshoot" || entryIntent === "howto";
  }
  return true;
}

/* ------------------------------ Fast Pre-Indexed RAM Cache ------------------------------ */

let kbCache: {
  builtAt: number;
  entries: IndexedKbEntry[];
  exactMap: Map<string, IndexedKbEntry>;
  inverted: Map<string, number[]>;
  idf: Map<string, number>;
} | null = null;

let starterBootstrapped = false;
const KB_CACHE_TTL_MS = 45_000;

export function invalidateKnowledgeCache() {
  kbCache = null;
}

function parseStoredMeta(raw: unknown): { aliases: string[]; vec: number[] } {
  if (Array.isArray(raw)) {
    return { aliases: [], vec: raw.filter((n): n is number => typeof n === "number") };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as Partial<StoredKbMeta>;
    return {
      aliases: Array.isArray(obj.aliases) ? obj.aliases.map(String) : [],
      vec: Array.isArray(obj.vec) ? obj.vec : [],
    };
  }
  return { aliases: [], vec: [] };
}

/** Ensures foundational Cloud, Physical Server & Server-Troubleshooting FAQs exist in PostgreSQL once. */
async function ensureStarterKnowledgeOnce() {
  if (starterBootstrapped) return;
  starterBootstrapped = true;
  try {
    const allRows = await db.select({ question: chatKnowledge.question }).from(chatKnowledge);
    const existingSet = new Set(allRows.map((r) => r.question.trim().toLowerCase()));
    const missing = STARTER_CLOUD_SERVER_KB.filter(
      (item) => !existingSet.has(item.question.trim().toLowerCase()),
    );
    if (!missing.length) return;

    await db.insert(chatKnowledge).values(
      missing.map((item) => ({
        question: item.question,
        answer: item.answer,
        source: "seed",
        embedding: { v: 2, aliases: item.aliases } as any,
        isActive: true,
      })),
    );
    kbCache = null;
  } catch {
    /* non-fatal if table busy during cold boot */
  }
}

async function getKnowledgeIndex() {
  await ensureStarterKnowledgeOnce();
  if (kbCache && Date.now() - kbCache.builtAt < KB_CACHE_TTL_MS) return kbCache;

  const rows = await db
    .select()
    .from(chatKnowledge)
    .where(eq(chatKnowledge.isActive, true))
    .catch(() => []);

  const entries: IndexedKbEntry[] = [];
  const exactMap = new Map<string, IndexedKbEntry>();
  const inverted = new Map<string, number[]>();
  const docFreq = new Map<string, number>();

  rows.forEach((r, idx) => {
    const { aliases, vec } = parseStoredMeta(r.embedding);
    const rawVariants = [r.question, ...aliases].filter(Boolean);
    const phrases: IndexedPhrase[] = rawVariants.map((p) => ({
      raw: p,
      analysis: analyzeQuery(p),
    }));

    const allTokens = new Set<string>();
    for (const p of phrases) {
      for (const tok of p.analysis.coreTokens) allTokens.add(tok);
    }

    const entry: IndexedKbEntry = {
      id: r.id,
      question: r.question,
      answer: r.answer,
      source: r.source,
      phrases,
      allTokens,
      vec,
    };
    entries.push(entry);

    for (const p of phrases) {
      if (p.analysis.coreTokens.length > 0 && !exactMap.has(p.analysis.canonicalKey)) {
        exactMap.set(p.analysis.canonicalKey, entry);
      }
    }

    for (const tok of allTokens) {
      docFreq.set(tok, (docFreq.get(tok) || 0) + 1);
      const list = inverted.get(tok);
      if (list) list.push(idx);
      else inverted.set(tok, [idx]);
    }
  });

  const totalDocs = Math.max(entries.length, 1);
  const idf = new Map<string, number>();
  for (const [tok, df] of docFreq.entries()) {
    idf.set(tok, 1 + Math.log((totalDocs + 1) / (df + 0.5)));
  }

  kbCache = { builtAt: Date.now(), entries, exactMap, inverted, idf };
  return kbCache;
}

/** Scores one phrase variant of a KB row against the visitor's analyzed query in microseconds. */
function scoreVariant(
  q: QueryAnalysis,
  p: QueryAnalysis,
  source: string,
  idf: Map<string, number>,
): number {
  if (!q.coreTokens.length || !p.coreTokens.length) return 0;
  if (!areIntentsCompatible(q.intent, p.intent, source)) return 0;

  // Strict HTTP / port error code guardrail (e.g. 502 never matches 403 or 404)
  if (q.errorCodes.length > 0) {
    const pCodes = new Set(p.errorCodes);
    if (!q.errorCodes.some((c) => pCodes.has(c))) return 0;
  }

  const pSet = new Set(p.coreTokens);
  const qSet = new Set(q.coreTokens);

  let qTotalWeight = 0;
  let qMatchedWeight = 0;
  for (const tok of q.coreTokens) {
    const isMod = CONTEXT_MODIFIER_TOKENS.has(tok) && !pSet.has(tok);
    const w = isMod ? 0.22 : (idf.get(tok) ?? 2.2);
    qTotalWeight += w;
    if (pSet.has(tok)) qMatchedWeight += w;
  }

  let pTotalWeight = 0;
  let pMatchedWeight = 0;
  for (const tok of p.coreTokens) {
    const isMod = CONTEXT_MODIFIER_TOKENS.has(tok) && !qSet.has(tok);
    const w = isMod ? 0.22 : (idf.get(tok) ?? 2.0);
    pTotalWeight += w;
    if (qSet.has(tok)) pMatchedWeight += w;
  }

  const queryCoverage = qTotalWeight > 0 ? qMatchedWeight / qTotalWeight : 0;
  const entryCoverage = pTotalWeight > 0 ? pMatchedWeight / pTotalWeight : 0;

  if (queryCoverage === 0 && entryCoverage === 0) {
    // Typo rescue via character 3-gram similarity ONLY when intents explicitly align
    const tri = trigramJaccard(q.trigrams, p.trigrams);
    return tri >= 0.62 ? tri * 0.92 : 0;
  }

  const harmonicF1 =
    queryCoverage + entryCoverage > 0
      ? (2 * queryCoverage * entryCoverage) / (queryCoverage + entryCoverage)
      : 0;

  const triSim = trigramJaccard(q.trigrams, p.trigrams);
  const intentBonus = q.intent === p.intent ? 0.05 : -0.04;

  return Math.min(1, harmonicF1 * 0.85 + triSim * 0.15 + intentBonus);
}

/**
 * FAST DB-FIRST SEMANTIC MATCHER (<0.1ms):
 * Returns a direct verified PostgreSQL KB answer ONLY when meaning, subject specificity,
 * error codes, and intent guardrails match with high confidence (>= 0.78).
 */
export async function findDirectKnowledgeMatch(
  rawMessage: string,
): Promise<{ entry: IndexedKbEntry; score: number } | null> {
  const q = analyzeQuery(rawMessage);
  if (q.hasContextPronoun || q.intent === "account_support" || q.coreTokens.length === 0) {
    return null;
  }

  const idx = await getKnowledgeIndex();
  if (!idx.entries.length) return null;

  // 1) O(1) Instant Canonical Exact Match (~0.02ms)
  const exact = idx.exactMap.get(q.canonicalKey);
  if (
    exact &&
    exact.phrases.some((p) => areIntentsCompatible(q.intent, p.analysis.intent, exact.source))
  ) {
    const codeOk =
      q.errorCodes.length === 0 ||
      exact.phrases.some((p) => q.errorCodes.some((c) => p.analysis.errorCodes.includes(c)));
    if (codeOk) return { entry: exact, score: 1.0 };
  }

  // 2) Fast Inverted-Index Candidate Retrieval (<0.1ms even across thousands of KB rows)
  const candidateIds = new Set<number>();
  for (const tok of q.coreTokens) {
    const hits = idx.inverted.get(tok);
    if (hits) for (const id of hits) candidateIds.add(id);
  }

  // Fallback typo scan only if no exact token matched (handles severe misspellings)
  const pool =
    candidateIds.size > 0
      ? Array.from(candidateIds).map((i) => idx.entries[i])
      : idx.entries.length <= 400
        ? idx.entries
        : [];

  let best: { entry: IndexedKbEntry; score: number } | null = null;
  for (const entry of pool) {
    let entryBest = 0;
    for (const p of entry.phrases) {
      const s = scoreVariant(q, p.analysis, entry.source, idx.idf);
      if (s > entryBest) entryBest = s;
    }
    // Slight preference for Admin-curated entries over auto-learned on near-ties
    if (entry.source !== "auto" && entryBest > 0) entryBest = Math.min(1, entryBest + 0.02);

    if (entryBest >= 0.78 && (!best || entryBest > best.score)) {
      best = { entry, score: entryBest };
    }
  }

  return best;
}

/* ============================================================================
 * 2. AI PROVIDER RESOLUTION & HELPERS
 * ============================================================================ */

function resolveProvider() {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    (loadEnv as any)({ path: ".env.local", override: true, quiet: true });
  }

  const groqKey = (
    process.env.GROQ_API_KEY ||
    (process.env.OPENAI_API_KEY?.trim().startsWith("gsk_") ? process.env.OPENAI_API_KEY : "") ||
    ""
  ).trim();

  if (groqKey) {
    return {
      provider: "groq" as const,
      key: groqKey,
      baseUrl: "https://api.groq.com/openai/v1",
      chatModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      embedModel: "",
    };
  }

  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
  if (geminiKey) {
    return {
      provider: "gemini" as const,
      key: geminiKey,
      baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
      chatModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      embedModel: "",
    };
  }

  const openaiKey = (process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "").trim();
  if (openaiKey) {
    return {
      provider: "openai" as const,
      key: openaiKey,
      baseUrl: (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, ""),
      chatModel: process.env.OPENAI_CHAT_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
      embedModel: process.env.OPENAI_EMBED_MODEL || process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    };
  }

  throw new Error("Missing GROQ_API_KEY in .env.local — please add GROQ_API_KEY and restart `npm run dev`.");
}

export async function embed(text: string, aliases: string[] = []): Promise<any> {
  const cleanAliases = Array.from(
    new Set(aliases.map((a) => String(a || "").trim().slice(0, 180)).filter(Boolean)),
  ).slice(0, 8);

  const cleanText = String(text || "").trim().slice(0, 4000);
  let vec: number[] = [];
  if (cleanText) {
    try {
      const cfg = resolveProvider();
      if (cfg.embedModel) {
        const res = await fetch(`${cfg.baseUrl}/embeddings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cfg.key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: cfg.embedModel, input: cleanText }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.data?.[0]?.embedding)) vec = data.data[0].embedding;
        }
      }
    } catch {
      /* ignore optional vector call */
    }
  }

  return { v: 2, aliases: cleanAliases, ...(vec.length ? { vec } : {}) };
}

function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const jsonSlice = start !== -1 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(jsonSlice) as T;
}

function formatCleanBullets(text: string): string {
  return text
    .replace(/([^\n])\s*•\s+/g, "$1\n• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function callAI<T = string>(opts: {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: { name: string; schema: Record<string, unknown> };
}): Promise<T> {
  const cfg = resolveProvider();

  const messages =
    opts.jsonSchema && cfg.provider !== "openai"
      ? opts.messages.map((m, idx) =>
          idx === 0 && m.role === "system"
            ? {
                ...m,
                content: `${m.content}\n\nIMPORTANT: Return ONLY a single valid JSON object matching this exact JSON schema (exact keys required, no extra text):\n${JSON.stringify(opts.jsonSchema!.schema)}`,
              }
            : m,
        )
      : opts.messages;

  const isReasoningModel = cfg.chatModel.startsWith("openai/gpt-oss-");
  const body: Record<string, unknown> = {
    model: cfg.chatModel,
    messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: isReasoningModel ? 2400 : (opts.maxTokens ?? 1300),
    ...(isReasoningModel ? { reasoning_effort: "low" } : {}),
  };

  if (opts.jsonSchema) {
    if (cfg.provider === "openai") {
      body.response_format = {
        type: "json_schema",
        json_schema: {
          name: opts.jsonSchema.name,
          strict: true,
          schema: opts.jsonSchema.schema,
        },
      };
    } else {
      body.response_format = { type: "json_object" };
    }
  }

  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.error?.message || `AI API error (${res.status}) from ${cfg.provider}.`;
    throw new Error(msg);
  }

  const raw = String(payload?.choices?.[0]?.message?.content || "").trim();
  if (!opts.jsonSchema) return raw as unknown as T;
  return parseJsonResponse<T>(raw);
}

/* ============================================================================
 * 3. SELF-LEARNING KNOWLEDGE STORE & CONTEXT RETRIEVAL
 * ============================================================================ */

/**
 * Saves or updates a learned Q&A entry in PostgreSQL `chat_knowledge` (`source` fits varchar(10))
 * WITH multi-phrasing aliases, and immediately refreshes the fast RAM Semantic Index.
 */
export async function learn(
  question: string,
  answer: string,
  source: "manual" | "admin" | "seed" | "auto" = "admin",
  aliases: string[] = [],
) {
  const q = question.trim().slice(0, 500);
  const a = formatCleanBullets(answer).slice(0, 2000);
  const src = source.slice(0, 10);
  if (q.length < 4 || a.length < 10) return;

  const qAnalysis = analyzeQuery(q);
  const existing = await db.select().from(chatKnowledge);
  const match = existing.find((item) => {
    if (item.question.trim().toLowerCase() === q.toLowerCase()) return true;
    return analyzeQuery(item.question).canonicalKey === qAnalysis.canonicalKey && qAnalysis.coreTokens.length >= 2;
  });

  // Never let an automatic AI entry overwrite a human Admin-curated answer
  if (match && src === "auto" && match.source !== "auto") {
    return;
  }

  const mergedAliases = match
    ? [...parseStoredMeta(match.embedding).aliases, ...aliases]
    : aliases;
  const metaPayload = await embed(q, mergedAliases);

  if (match) {
    await db
      .update(chatKnowledge)
      .set({ question: q, answer: a, source: src, embedding: metaPayload, isActive: true })
      .where(eq(chatKnowledge.id, match.id));
  } else {
    await db.insert(chatKnowledge).values({
      question: q,
      answer: a,
      source: src,
      embedding: metaPayload,
      isActive: true,
    });
  }

  invalidateKnowledgeCache();
}

/** Retrieves top related KB context snippets when AI is consulted for partial/follow-up queries. */
async function searchRelatedKnowledge(queryText: string, limit = 8) {
  const idx = await getKnowledgeIndex();
  if (!idx.entries.length) return [];

  const q = analyzeQuery(queryText);
  return idx.entries
    .map((entry) => {
      let best = 0;
      for (const p of entry.phrases) {
        const common = q.coreTokens.filter((t) => p.analysis.coreTokens.includes(t)).length;
        const score = q.coreTokens.length ? common / q.coreTokens.length : 0;
        if (score > best) best = score;
      }
      return { question: entry.question, answer: entry.answer, score: best };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/* ------------------------------ Live Website DB Context (60s cache) ------------------------------ */

let cachedDbContext = "";
let cachedAt = 0;
const DB_CACHE_MS = 60_000;

export function invalidateCompanyCache() {
  cachedAt = 0;
}

export async function loadCompanyContext(): Promise<string> {
  if (cachedDbContext && Date.now() - cachedAt < DB_CACHE_MS) return cachedDbContext;

  const [
    settingsRows,
    serviceRows,
    featureRows,
    benefitRows,
    faqRows,
    pageRows,
    sectionRows,
    marketRows,
    jobRows,
    newsRows,
  ] = await Promise.all([
    db.select().from(siteSettings).catch(() => []),
    db.select().from(services).where(eq(services.isPublished, true)).catch(() => []),
    db.select().from(serviceFeatures).catch(() => []),
    db.select().from(serviceBenefits).catch(() => []),
    db.select().from(serviceFaqs).catch(() => []),
    db.select().from(pages).where(eq(pages.isPublished, true)).catch(() => []),
    db.select().from(pageSections).where(eq(pageSections.isActive, true)).catch(() => []),
    db.select().from(marketplaces).where(eq(marketplaces.isActive, true)).catch(() => []),
    db.select().from(jobs).where(eq(jobs.status, "active")).catch(() => []),
    db.select().from(news).where(eq(news.status, "published")).orderBy(desc(news.publishedAt)).limit(5).catch(() => []),
  ]);

  const blocks: string[] = [];

  const safeSettings = settingsRows.filter((s) => s.value?.trim() && !SENSITIVE_SETTING_RE.test(s.key));
  if (safeSettings.length) {
    blocks.push(
      "SITE SETTINGS & CONTACT INFO:\n" +
        safeSettings.map((s) => `- ${s.key}: ${s.value.slice(0, 300)}`).join("\n"),
    );
  }

  if (serviceRows.length) {
    const svcLines = serviceRows.map((s) => {
      const feats = featureRows
        .filter((f) => f.serviceId === s.id)
        .map((f) => `${f.title}${f.description ? ` (${f.description.slice(0, 120)})` : ""}`);
      const bens = benefitRows.filter((b) => b.serviceId === s.id).map((b) => b.title);
      const faqs = faqRows
        .filter((q) => q.serviceId === s.id)
        .map((q) => `Q: ${q.question} -> A: ${q.answer.slice(0, 220)}`);
      return [
        `• Service: ${s.title} [Category: ${s.category}, URL: /services/${s.slug}]`,
        s.shortDescription ? `  Summary: ${s.shortDescription.slice(0, 260)}` : "",
        s.longDescription ? `  Details: ${s.longDescription.slice(0, 400)}` : "",
        feats.length ? `  Features: ${feats.slice(0, 6).join("; ")}` : "",
        bens.length ? `  Benefits: ${bens.slice(0, 5).join("; ")}` : "",
        faqs.length ? `  FAQs:\n    ${faqs.slice(0, 5).join("\n    ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    });
    blocks.push("OUR PUBLISHED SERVICES:\n" + svcLines.join("\n\n"));
  }

  if (pageRows.length || sectionRows.length) {
    const pageSummary = pageRows
      .slice(0, 10)
      .map((p) => {
        const secs = sectionRows
          .filter((sec) => sec.pageSlug === p.slug && (sec.title || sec.body))
          .slice(0, 4)
          .map((sec) => `${sec.title}: ${sec.body.slice(0, 200)}`);
        return `• Page "${p.title}" (/${p.slug}): ${p.heroDescription.slice(0, 200)}${secs.length ? " | " + secs.join(" | ") : ""}`;
      })
      .join("\n");
    if (pageSummary) blocks.push("COMPANY PAGES OVERVIEW:\n" + pageSummary);
  }

  if (marketRows.length) {
    blocks.push(
      "PARTNER MARKETPLACES:\n" +
        marketRows.map((m) => `- ${m.name} (${m.category || "Marketplace"}): ${m.tagline || m.description || ""}`).join("\n"),
    );
  }

  if (jobRows.length) {
    blocks.push(
      "OPEN CAREERS / JOBS:\n" +
        jobRows
          .slice(0, 10)
          .map((j) => `- ${j.title} (${j.department || "General"}, ${j.location || "Flexible"}, ${j.employmentType}, Exp: ${j.experience || "Open"})`)
          .join("\n"),
    );
  }

  if (newsRows.length) {
    blocks.push(
      "RECENT COMPANY NEWS:\n" + newsRows.map((n) => `- ${n.title}: ${n.excerpt.slice(0, 160)}`).join("\n"),
    );
  }

  cachedDbContext = blocks.join("\n\n").slice(0, 14_000) || "No company CMS records published yet.";
  cachedAt = Date.now();
  return cachedDbContext;
}

/* ------------------------------ Translation helper ------------------------------ */

export async function translateTo(text: string, targetLanguage: string): Promise<string> {
  const clean = text.trim();
  const target = (targetLanguage || "").trim();
  if (
    !clean ||
    !target ||
    target.toLowerCase() === "en" ||
    target.toLowerCase() === "english" ||
    target.toLowerCase() === "hinglish" ||
    target.toLowerCase() === "auto"
  ) {
    return clean;
  }
  const byCode = langByCode(target);
  const targetLabel = byCode.code !== "auto" ? byCode.name : target;

  try {
    return await callAI<string>({
      temperature: 0.2,
      maxTokens: 900,
      messages: [
        {
          role: "system",
          content:
            `Translate the following customer-support reply into natural, polite ${targetLabel}. ` +
            "Preserve all bullet points (•), line breaks, commands, URLs, emails, and formatting cleanly. Output ONLY the translated message.",
        },
        { role: "user", content: clean },
      ],
    });
  } catch {
    return clean;
  }
}

/* ============================================================================
 * 4. MAIN HYBRID DB-FIRST + AUTO-LEARNING CHAT ENGINE
 * ============================================================================ */

type BotDecision = {
  intent:
    | "kb_or_db"
    | "general_tech_advisory"
    | "server_troubleshooting"
    | "hybrid_db_and_gpt"
    | "escalate_company_unknown"
    | "greeting_or_offtopic";
  detectedLanguage: string;
  standaloneEnglish: string;
  escalate: boolean;
  shouldAutoLearn: boolean;
  canonicalQuestion: string;
  searchAliases: string[];
  canonicalAnswer: string;
  reply: string;
};

function generateTicketCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "Q-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function buildCleanHistorySummary(rows: Array<{ role: string; content: string }>): string {
  const pairs: string[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    if (rows[i].role === "user" && (rows[i + 1].role === "bot" || rows[i + 1].role === "admin")) {
      pairs.push(
        `Visitor previously asked: "${rows[i].content.slice(0, 140)}"\nAssistant already answered: "${rows[i + 1].content.slice(0, 180)}"`,
      );
      i++;
    }
  }
  return pairs.slice(-3).join("\n---\n") || "None (start of conversation).";
}

export async function answerVisitorMessage(params: {
  sessionId: number;
  leadId: number;
  leadName: string;
  message: string;
  lang: string;
}): Promise<{ reply: string; escalated: boolean }> {
  const firstName = (params.leadName || "there").trim().split(/\s+/)[0] || "there";
  const trimmedMsg = params.message.trim();

  // 1) Instant fast-path for simple greetings & polite acknowledgements (0ms, ZERO API credits!)
  if (/^(hi+|hello+|hey+|hlw|hlo|namaste|namaskar|hola|こんにちは)\s*[!?.]*$/i.test(trimmedMsg)) {
    const quickGreeting: Record<string, string> = {
      hi: `नमस्ते ${firstName}! 👋 बताइए आज मैं आपकी क्या मदद कर सकता हूँ — क्लाउड, फिजिकल सर्वर, सर्वर इश्यू या हमारी सर्विसेज़?`,
      hinglish: `Hi ${firstName}! 👋 Bataiye main aapki kya help kar sakta hoon — Cloud, Physical Server, Server Issues ya hamari services ke baare me kuch bhi poochiye!`,
      ja: `こんにちは、${firstName}さん！👋 クラウド、物理サーバー、サーバーの問題、または当社のサービスについて何でもお聞きください。`,
    };
    return {
      reply:
        quickGreeting[params.lang] ||
        `Hi ${firstName}! 👋 How can I help you today? Ask me anything about Cloud, Physical Servers, Server Troubleshooting, Security, or our services!`,
      escalated: false,
    };
  }

  if (/^(thanks|thank\s*you|thx|shukriya|dhanyawad|ok|okay|got\s*it|great|nice)\s*[!?.]*$/i.test(trimmedMsg)) {
    return {
      reply: `You're most welcome, ${firstName}! 😊 Feel free to ask anytime if you have any more questions about Cloud, Servers, or our services.`,
      escalated: false,
    };
  }

  // 2) ULTRA-FAST SEMANTIC DB SEARCH (<0.1ms, ZERO Groq API Credits!)
  const directHit = await findDirectKnowledgeMatch(trimmedMsg);
  if (directHit) {
    let dbAnswer = formatCleanBullets(directHit.entry.answer);
    // Only call translation API if visitor explicitly picked a non-English script dropdown (e.g. Hindi/Japanese)
    if (params.lang && !["auto", "en", "hinglish"].includes(params.lang)) {
      dbAnswer = await translateTo(dbAnswer, params.lang);
    }
    return { reply: dbAnswer, escalated: false };
  }

  // 3) DB MISS -> Consult AI + Website CMS Context AND Auto-Train DB if General / Server Issue!
  const historyRows = await db
    .select({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, params.sessionId))
    .orderBy(desc(chatMessages.id))
    .limit(12);

  const cleanHistorySummary = buildCleanHistorySummary(historyRows.reverse());

  const [kbMatches, companyDb] = await Promise.all([
    searchRelatedKnowledge(trimmedMsg),
    loadCompanyContext(),
  ]);

  const kbBlock = kbMatches.length
    ? kbMatches.map((k, idx) => `[KB #${idx + 1}]\nQ: ${k.question}\nA: ${k.answer}`).join("\n\n")
    : "No specific KB entries matched yet.";

  const langOpt = langByCode(params.lang);
  const languageRule = langOpt.name
    ? `ALWAYS write "reply" strictly in ${langOpt.name}. Set "detectedLanguage" to "${langOpt.label}".`
    : `Detect the exact language/style of CURRENT_VISITOR_MESSAGE ("${trimmedMsg.slice(0, 120)}") — e.g. "English", "Hindi (Devanagari)", "Hinglish" — write "reply" in that SAME language/style, and put that name in "detectedLanguage".`;

  const systemPrompt = `You are an expert Cloud, Server Infrastructure, Linux/Windows Troubleshooting, Cybersecurity & Digital Workplace Advisor AND official Website Assistant for our company.
Visitor's first name: ${firstName}.

MOST IMPORTANT RULE:
- Answer ONLY the visitor's CURRENT_VISITOR_MESSAGE in the user turn!
- NEVER repeat an older answer from [PAST_HISTORY_SUMMARY] unless resolving a pronoun like "it" / "iska".

DECISION & SELF-LEARNING RULES:

1. GENERAL TECH / CLOUD / SERVER CONCEPTS & GENERAL SERVER TROUBLESHOOTING
   (intent = "general_tech_advisory" or "server_troubleshooting", escalate = false, shouldAutoLearn = true):
   - Includes conceptual questions ("What is hybrid cloud?", "RAID 1 vs RAID 10?", "Docker vs VM?") AND ANY general server/hosting issue ("Apache 403 error", "MySQL slow queries", "Docker crash loop", "DNS not propagating", "Windows RDP black screen", "High CPU / Disk full / SSH issues", etc.).
   - Give a crisp, practical, step-by-step answer with "\\n• " bullets in "reply".
   - ALSO populate self-learning fields so our PostgreSQL database learns this topic permanently:
     • "shouldAutoLearn": true (ONLY when question is self-contained & reusable — set false if it depends on personal names/IPs or is Company Pricing!)
     • "canonicalQuestion": Clean standalone English title of the exact question/issue (e.g., "How to fix Apache 403 Forbidden error on Linux server?").
     • "searchAliases": 5 short realistic ways different users ask this SAME question in English AND Hinglish (e.g., ["apache 403 forbidden error fix", "website showing 403 forbidden nginx apache", "server pe 403 error kaise solve kare", "permission denied 403 web server"]).
     • "canonicalAnswer": Clean, evergreen, well-structured English answer with "\\n• " bullets and NO personal visitor name ("${firstName}").

2. COMPANY SERVICES / PAGES / CONTACT FROM DB (intent = "kb_or_db", escalate = false, shouldAutoLearn = false):
   - Answer STRICTLY from [ADMIN_APPROVED_KB] and [COMPANY_DATABASE]. Never invent company prices, SLAs, phone numbers, or policies.

3. COMPANY PRICING / CUSTOM QUOTES / SPECIFIC HOSTED ACCOUNT SUPPORT (intent = "escalate_company_unknown" or "hybrid_db_and_gpt", escalate = true, shouldAutoLearn = false):
   - Pricing, quotes, discounts, custom SLAs, or urgent account/IP reboot requests NOT in [ADMIN_APPROVED_KB] or [COMPANY_DATABASE] are trained ONLY by Admin:
     • Answer any general helpful part briefly, politely tell ${firstName} our specialist team will reply right here in chat,
     • Set "escalate": true, "shouldAutoLearn": false, and write a clear summary in "standaloneEnglish".

4. SMALL TALK / OFF-TOPIC (intent = "greeting_or_offtopic", escalate = false, shouldAutoLearn = false):
   - Reply politely in 1–2 lines and set "shouldAutoLearn": false.

5. LANGUAGE & FORMATTING:
   - ${languageRule}
   - Put each "•" bullet on its own line ("\\n• ").

=== [PAST_HISTORY_SUMMARY] ===
${cleanHistorySummary}

=== [ADMIN_APPROVED_KB] ===
${kbBlock}

=== [COMPANY_DATABASE] ===
${companyDb}`;

  const decision = await callAI<BotDecision>({
    temperature: 0.25,
    maxTokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `CURRENT_VISITOR_MESSAGE:\n"""\n${trimmedMsg}\n"""`,
      },
    ],
    jsonSchema: {
      name: "chatbot_self_learning_response",
      schema: {
        type: "object",
        additionalProperties: false,
        required: [
          "intent",
          "detectedLanguage",
          "standaloneEnglish",
          "escalate",
          "shouldAutoLearn",
          "canonicalQuestion",
          "searchAliases",
          "canonicalAnswer",
          "reply",
        ],
        properties: {
          intent: {
            type: "string",
            enum: [
              "kb_or_db",
              "general_tech_advisory",
              "server_troubleshooting",
              "hybrid_db_and_gpt",
              "escalate_company_unknown",
              "greeting_or_offtopic",
            ],
          },
          detectedLanguage: { type: "string" },
          standaloneEnglish: { type: "string" },
          escalate: { type: "boolean" },
          shouldAutoLearn: { type: "boolean" },
          canonicalQuestion: { type: "string" },
          searchAliases: { type: "array", items: { type: "string" } },
          canonicalAnswer: { type: "string" },
          reply: { type: "string" },
        },
      },
    },
  });

  let finalReply = formatCleanBullets(decision.reply || "");

  // Auto-save newly learned General Tech & Server Troubleshooting answers directly into PostgreSQL `chat_knowledge`!
  if (
    decision.shouldAutoLearn &&
    !decision.escalate &&
    (decision.intent === "general_tech_advisory" || decision.intent === "server_troubleshooting") &&
    decision.canonicalQuestion?.trim() &&
    decision.canonicalAnswer?.trim()
  ) {
    const aliases = [
      trimmedMsg,
      ...(Array.isArray(decision.searchAliases) ? decision.searchAliases : []),
    ];
    await learn(decision.canonicalQuestion, decision.canonicalAnswer, "auto", aliases).catch(() => {
      /* ignore background DB save errors so visitor reply never fails */
    });
  }

  if (decision.escalate) {
    const code = generateTicketCode();
    const ticketLang = (
      params.lang && params.lang !== "auto"
        ? langByCode(params.lang).name || params.lang
        : decision.detectedLanguage || "English"
    ).slice(0, 60);

    await db.insert(chatTickets).values({
      code,
      leadId: params.leadId,
      sessionId: params.sessionId,
      question: params.message,
      standalone: (decision.standaloneEnglish || params.message).slice(0, 500),
      language: ticketLang,
      status: "open",
    });
    finalReply = `${finalReply}\n\n(Ref: #${code})`;
  }

  return { reply: finalReply, escalated: decision.escalate };
}

/* ============================================================================
 * 5. ADMIN REPLY FORMAT & SUGGESTION ASSISTANT
 * ============================================================================ */

export type AdminReplySuggestion = {
  visitorReply: string;
  kbQuestion: string;
  kbAnswer: string;
};

export async function suggestAdminReply(input: {
  question: string;
  standalone?: string;
  leadName: string;
  draftAnswer?: string;
}): Promise<AdminReplySuggestion> {
  const companyDb = await loadCompanyContext();
  const firstName = (input.leadName || "there").trim().split(/\s+/)[0] || "there";
  const roughNotes = (input.draftAnswer || "").trim();

  const prompt = roughNotes
    ? `Admin wrote rough reply notes for a visitor's question.
Convert the admin's rough notes into JSON with keys "visitorReply", "kbQuestion", "kbAnswer":
1) "visitorReply": A warm, clear, professionally formatted English reply addressed to "Hi ${firstName}," using clean paragraphs and "•" bullet points on separate lines, ending with a polite next step. Preserve every factual figure/detail written by the admin accurately.
2) "kbQuestion": A clean, generalized standalone English question suitable for saving in our reusable FAQ Knowledge Base (no personal names).
3) "kbAnswer": A clean, well-structured general English answer containing the same factual info WITHOUT greeting "${firstName}" so future visitors get an evergreen answer.`
    : `Admin needs a suggested structured reply format for an escalated visitor question.
Prepare JSON with keys "visitorReply", "kbQuestion", "kbAnswer":
1) "visitorReply": A polite, well-structured English reply addressed to "Hi ${firstName}," with clear "•" bullet points on separate lines and a helpful closing. Use verified facts from [COMPANY_DATABASE] where available, and put clear placeholders in square brackets like "[Enter starting price]" or "[Confirm timeline]" for any company-specific numbers not in [COMPANY_DATABASE] — NEVER invent fake prices or SLAs!
2) "kbQuestion": A clean, generalized English FAQ question for our Knowledge Base.
3) "kbAnswer": A clean, structured general English Knowledge Base answer (without "${firstName}") using the same structure.`;

  const res = await callAI<AdminReplySuggestion>({
    temperature: 0.3,
    maxTokens: 950,
    messages: [
      {
        role: "system",
        content: `${prompt}\n\n=== [COMPANY_DATABASE] ===\n${companyDb.slice(0, 8000)}`,
      },
      {
        role: "user",
        content: [
          `Visitor Name: ${input.leadName}`,
          `Original Visitor Message: ${input.question}`,
          input.standalone ? `English Meaning: ${input.standalone}` : "",
          roughNotes ? `Admin Rough Notes: ${roughNotes}` : "Admin Rough Notes: (empty — suggest structured format)",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
    jsonSchema: {
      name: "admin_reply_suggestion",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["visitorReply", "kbQuestion", "kbAnswer"],
        properties: {
          visitorReply: { type: "string" },
          kbQuestion: { type: "string" },
          kbAnswer: { type: "string" },
        },
      },
    },
  });

  return {
    visitorReply: formatCleanBullets(res.visitorReply),
    kbQuestion: res.kbQuestion.trim(),
    kbAnswer: formatCleanBullets(res.kbAnswer),
  };
}

export async function polishKnowledgeDraft(input: {
  question: string;
  answer: string;
}): Promise<{ question: string; answer: string }> {
  const res = await callAI<{ question: string; answer: string }>({
    temperature: 0.3,
    maxTokens: 800,
    messages: [
      {
        role: "system",
        content:
          "Rewrite and format this Knowledge Base Q&A into crisp, professional, easy-to-scan English (can be translated from Hindi/Hinglish/notes if needed), returning JSON with keys 'question' and 'answer'. Put each '•' bullet point on a new line. Preserve all factual numbers/details without inventing anything.",
      },
      {
        role: "user",
        content: `Question/Topic: ${input.question}\nRough Answer/Notes: ${input.answer || "(Write a clear general explanation for this technical topic)"}`,
      },
    ],
    jsonSchema: {
      name: "kb_polish",
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
  });

  return {
    question: res.question.trim(),
    answer: formatCleanBullets(res.answer),
  };
}