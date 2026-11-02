/**
 * FILE: src/lib/chat-templates.ts
 * TYPE: Shared Client & Server Constants (pure TypeScript — zero DB/OpenAI imports)
 * PURPOSE:
 *   1) Quick reply format templates so Admin doesn't have to design message structure from scratch
 *   2) Curated Cloud, Physical Server, VPS, & Server-Troubleshooting starter Q&As with rich
 *      English + Hinglish + Hindi semantic aliases for instant <0.1ms DB-first answering
 */

export type ReplyTemplate = {
  id: string;
  label: string;
  hint: string;
  build: (leadName: string, topic: string) => { visitorReply: string; kbAnswer: string };
};

const first = (leadName: string) => (leadName || "there").trim().split(/\s+/)[0] || "there";

/** Ready-made reply structures for `/admin/ai-leads` -> Unanswered tab. */
export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "pricing",
    label: "💰 Pricing / Plan Format",
    hint: "Best for cost, plans, billing, or custom quote questions",
    build: (leadName, topic) => {
      const core = `Here are the pricing details regarding ${topic}:

• Standard Plan: [Enter price / starting range]
• Key Inclusions: [Enter resources / support / SLA included]
• Setup & Billing Cycle: [Monthly / Annual — Zero or one-time setup]

Would you like a tailored quote based on your exact workload?`;
      return {
        visitorReply: `Hi ${first(leadName)},\n\nThank you for your inquiry! ${core} Feel free to reply right here!`,
        kbAnswer: core,
      };
    },
  },
  {
    id: "cloud_vs_physical",
    label: "☁️ Cloud vs Physical Server Advice",
    hint: "Best when a client asks whether Cloud or Dedicated/Physical Server suits them",
    build: (leadName, topic) => {
      const core = `Here is a quick comparison regarding ${topic}:

• Cloud Server (Recommended for Scalability & High Uptime):
  - Instant RAM/CPU scaling without downtime
  - Pay-as-you-go flexibility with automated backups & failover
• Physical / Dedicated Server (Best for Fixed Heavy Workloads):
  - Dedicated bare-metal hardware & predictable monthly cost
  - Ideal when strict single-tenant hardware I/O is required`;
      return {
        visitorReply: `Hi ${first(leadName)},\n\n${core}\n\nShare your expected users/database size here and our cloud architect will recommend the exact configuration for you!`,
        kbAnswer: core,
      };
    },
  },
  {
    id: "technical",
    label: "🛠️ Technical / SLA / Security Format",
    hint: "Best for architecture, migration, backup, or compliance questions",
    build: (leadName, topic) => {
      const core = `Here are the technical details regarding ${topic}:

• Architecture & Reliability: [Enter SLA / redundancy details]
• Security & Backups: End-to-end encryption, firewall protection & scheduled automated backups
• Migration Support: Zero-downtime assisted onboarding by our engineering team`;
      return {
        visitorReply: `Hi ${first(leadName)},\n\n${core}\n\nLet us know if you have any specific technical requirements — happy to help right here!`,
        kbAnswer: core,
      };
    },
  },
  {
    id: "callback",
    label: "📞 Consultation / Demo Invite",
    hint: "Best for complex custom enterprise requirements",
    build: (leadName, topic) => ({
      visitorReply: `Hi ${first(leadName)},

Thank you for reaching out about ${topic}!

Since this involves a custom setup tailored to your environment, our senior solution specialist has noted your details and will connect with you shortly with a complete proposal.

• Preferred Time: Please reply here if you prefer a specific callback window today.`,
      kbAnswer: "",
    }),
  },
];

export type StarterKbItem = {
  topic: string;
  question: string;
  aliases: string[];
  answer: string;
};

/** Pre-built general Cloud, Physical Server, & Server-Troubleshooting FAQs with English + Hinglish aliases. */
export const STARTER_CLOUD_SERVER_KB: StarterKbItem[] = [
  {
    topic: "Public Cloud",
    question: "What is Public Cloud computing?",
    aliases: [
      "what is public cloud",
      "what is cloud computing",
      "public cloud kya hota hai",
      "cloud computing kya hota hai",
      "how does public cloud work",
    ],
    answer: `Public Cloud computing delivers computing resources — such as virtual servers, storage, databases, networking, and AI tools — over the internet on an on-demand, pay-as-you-go basis instead of buying physical hardware.

• Zero Upfront Hardware Cost: Launch servers in minutes without purchasing physical machines.
• Instant Scalability: Upgrade or scale down CPU, RAM, and storage anytime as traffic changes.
• High Reliability: Built-in redundancy across data centers keeps applications online even if hardware fails.
• Managed Security & Backups: Automated snapshots, firewalls, encryption, and DDoS protection keep workloads safe.`,
  },
  {
    topic: "Cloud vs Physical Server",
    question: "Why should businesses choose Cloud over a Physical Server?",
    aliases: [
      "why choose cloud over physical server",
      "why move to cloud from dedicated server",
      "benefits of cloud computing",
      "cloud server ke kya fayde hain",
      "cloud ke fayde business ke liye",
      "advantages of cloud server",
    ],
    answer: `Choosing Cloud infrastructure over an on-premise physical server gives businesses speed, resilience, and predictable growth:

• No Single Point of Failure: If a physical server's motherboard or disk fails, apps go down until parts are replaced. Cloud workloads automatically fail over to healthy nodes.
• Scale in Seconds, Not Weeks: Seasonal traffic spikes can be handled immediately without ordering new hardware.
• Lower Total Cost (TCO): Save on power, cooling, office rack space, hardware refresh cycles, and AMC maintenance.
• Work From Anywhere securely: Teams can access applications and files safely from any location with role-based security.`,
  },
  {
    topic: "Cloud vs Physical Comparison",
    question: "Cloud vs Physical Server — which one is better?",
    aliases: [
      "cloud vs physical server",
      "cloud vs dedicated server",
      "difference between cloud server and physical server",
      "cloud aur physical server me kya farak hai",
      "cloud vs bare metal server",
    ],
    answer: `Both Cloud Servers and Physical (Bare-Metal) Servers have clear strengths depending on your workload:

• Choose Cloud Server when you need:
  - Fast deployment, zero-downtime scaling, and high availability
  - Automated daily backups, disaster recovery, and flexible billing
  - Web apps, ERP/CRM, e-commerce, SaaS, APIs, and growing teams
• Choose Physical / Bare-Metal Server when you need:
  - 100% single-tenant raw hardware with zero virtualization layer
  - Specialized GPU/hardware dongles or strict on-premise regulatory mandates
• Hybrid Option: Many organizations combine both — keeping core apps on Cloud while linking legacy local systems securely.`,
  },
  {
    topic: "VPS vs Dedicated vs Cloud",
    question: "What is the difference between VPS, Dedicated Server, and Cloud Hosting?",
    aliases: [
      "vps vs dedicated server vs cloud",
      "difference between vps and dedicated server",
      "vps aur dedicated server me kya difference hai",
      "vps vs cloud server",
      "virtual private server vs dedicated",
    ],
    answer: `Here is how VPS, Dedicated Server, and Cloud Hosting differ:

• VPS (Virtual Private Server): A virtual slice on a single physical host machine with dedicated RAM/CPU allocation — affordable for small-to-medium websites and staging apps.
• Cloud Server: Runs across a redundant cluster of servers + distributed NVMe storage — delivers automatic failover, instant vertical/horizontal scaling, and enterprise uptime.
• Dedicated (Bare-Metal) Server: An entire physical machine reserved for one customer — ideal for heavy sustained CPU/disk I/O or custom hypervisors.`,
  },
  {
    topic: "Server Troubleshooting — 502 / 504",
    question: "How to fix 502 Bad Gateway or 504 Gateway Timeout error on a server?",
    aliases: [
      "502 bad gateway error fix",
      "504 gateway timeout error",
      "getting 504 gateway timeout",
      "502 bad gateway nginx",
      "server showing 502 error",
      "website 502 ya 504 error aa raha hai",
    ],
    answer: `502 Bad Gateway and 504 Gateway Timeout mean Nginx/Apache/Cloudflare reached your server, but your backend app (Node.js, PHP-FPM, Python, Java) crashed or took too long to respond:

• Step 1 — Check if backend service crashed: Run \`systemctl status php8.2-fpm\` or \`pm2 list\` / \`docker ps\` and restart crashed workers.
• Step 2 — Check error logs immediately: Inspect \`tail -n 80 /var/log/nginx/error.log\` to see upstream connection refused or timeout details.
• Step 3 — Check RAM / OOM kills: Run \`free -h\` and \`dmesg -T | tail -n 20\` — an Out-Of-Memory spike often kills PHP-FPM/Node workers causing instant 502s.
• Step 4 — Fix slow DB queries (504): If pages hang for 60s before 504, check locked/slow database queries (\`SHOW PROCESSLIST;\`) before increasing \`proxy_read_timeout\`.`,
  },
  {
    topic: "Server Troubleshooting — High CPU",
    question: "Server CPU usage is at 100% or running very slow — how to diagnose and fix?",
    aliases: [
      "server cpu 100 percent",
      "high cpu usage server slow",
      "server running very slow high cpu",
      "server bahut slow chal raha hai",
      "server hang ho raha hai cpu full",
    ],
    answer: `When a Linux or Windows server hits 100% CPU or slows down sharply, follow this quick checklist:

• Identify the exact process: Run \`htop\` or \`top -o %CPU\` (Linux) / Task Manager -> Processes (Windows) to see whether Web, Database, Backup, or unknown processes consume CPU.
• Check traffic spike vs bot attack: Inspect active connections (\`ss -tuna | wc -l\` and web access logs) to spot DDoS/scraper floods and enable WAF rate-limiting.
• Optimize heavy database queries: Sudden unindexed SQL scans quickly max out all vCPUs — enable slow-query logs and add missing indexes.
• Scan for unauthorized crypto-miners: If weird processes like \`kdevtmpfsi\` or \`kinsing\` appear in \`/tmp\`, kill the process, patch exposed app vulnerabilities, and rotate SSH keys immediately.`,
  },
  {
    topic: "Server Troubleshooting — Disk Full",
    question: "Server error: 'No space left on device' / Disk 100% full — how to clean safely?",
    aliases: [
      "no space left on device",
      "server disk 100 full",
      "disk space full clean safely",
      "server storage full ho gaya",
      "disk space full linux fix",
    ],
    answer: `When disk space hits 100%, databases (MySQL/PostgreSQL) and web sessions stop writing — clean space safely without deleting production data:

• Step 1 — Check disk & inode usage: Run \`df -h\` (block space) AND \`df -i\` (inodes — millions of tiny session/cache files can fill inodes even when GBs remain!).
• Step 2 — Find largest folders fast: Run \`du -xhd1 /var /home | sort -hr | head -n 15\`.
• Step 3 — Safe instant cleanups:
  - Trim systemd logs: \`journalctl --vacuum-time=7d\`
  - Clean package & Docker build caches: \`apt clean\` / \`docker builder prune -f\`
  - Truncate huge active log files safely (\`truncate -s 0 /var/log/nginx/access.log\` instead of \`rm\` so open file descriptors free disk space immediately!).`,
  },
  {
    topic: "Server Troubleshooting — SSH Access",
    question: "Unable to connect to server via SSH (Connection timed out or refused) — how to fix?",
    aliases: [
      "ssh connection refused port 22",
      "ssh connection timed out",
      "unable to connect ssh port 22",
      "ssh login nahi ho raha",
      "ssh permission denied publickey",
    ],
    answer: `SSH connection errors pinpoint the exact layer blocking access:

• 'Connection timed out': Packet never reached SSH — check Cloud Security Group / Firewall port 22 (or custom SSH port), verify server IP, and check via VNC/Console if \`ufw\`/\`iptables\` or Fail2Ban banned your IP.
• 'Connection refused': Server is reachable on network, but \`sshd\` daemon is stopped or listening on a non-22 port — open your Cloud Console (VNC) and run \`sudo systemctl restart sshd\`.
• 'Permission denied (publickey)': Wrong username (\`ubuntu\`, \`root\`, \`ec2-user\`, \`debian\`), wrong \`.pem\` key selected, or \`~/.ssh/authorized_keys\` permissions exceed \`600\`.`,
  },
  {
    topic: "Server Troubleshooting — RAM / OOM",
    question: "Server running out of RAM / OOM Killer killing MySQL, Node.js, or Java processes?",
    aliases: [
      "server running out of ram",
      "out of memory oom killer",
      "oom killer mysql node",
      "server ram full out of memory",
      "server memory full crash",
    ],
    answer: `When RAM and Swap exhaust completely, the Linux Kernel OOM (Out-Of-Memory) Killer terminates the largest memory process (often MySQL or your app server) to keep the OS alive:

• Confirm OOM event: Run \`dmesg -T | grep -i -E 'killed process|oom'\` to see which process was terminated and how much RAM it requested.
• Add emergency safety Swap: Add a 2–4 GB swap file on NVMe SSD so brief traffic spikes never hard-crash MySQL.
• Cap service memory pools: Tune \`innodb_buffer_pool_size\` (50–60% of RAM on dedicated DB hosts), PHP-FPM \`pm.max_children\`, or Node \`--max-old-space-size\` to match actual RAM, or scale up server RAM seamlessly.`,
  },
  {
    topic: "Server Troubleshooting — SSL / HTTPS",
    question: "Website SSL error: 'Your connection is not private' / SSL certificate expired?",
    aliases: [
      "website ssl error not private",
      "ssl certificate expired fix",
      "your connection is not private ssl",
      "https not working ssl error",
      "website not secure ssl renew",
    ],
    answer: `Browser SSL warnings usually come from one of four quick-to-fix causes:

• Expired SSL Certificate: Run \`sudo certbot renew\` and reload Nginx/Apache (\`sudo systemctl reload nginx\`), then verify auto-renewal timer (\`systemctl status certbot.timer\`).
• Missing Intermediate Chain: Use \`fullchain.pem\` (not \`cert.pem\` alone) in Nginx \`ssl_certificate\` so mobile browsers trust the certificate chain.
• Domain Mismatch: Ensure both \`example.com\` and \`www.example.com\` are covered on the SAN certificate and force HTTP -> HTTPS 301 redirect cleanly.
• Cloudflare SSL Mode Loop: Set Cloudflare SSL mode to **Full (Strict)** when valid origin SSL is installed (avoid Flexible mode redirect loops).`,
  },
  {
    topic: "Cloud Migration",
    question: "How does migrating from an existing server to the Cloud work?",
    aliases: [
      "how to migrate server to cloud",
      "cloud migration steps zero downtime",
      "physical server se cloud migration kaise hota hai",
      "website server migration process",
    ],
    answer: `A standard zero-or-minimal-downtime cloud migration happens in 4 structured steps:

• 1. Assessment & Sizing: Audit current CPU, RAM, storage, databases, OS dependencies, and security rules.
• 2. Staging Environment Setup: Provision matching cloud servers, private networking, SSL, and firewalls without touching live users.
• 3. Data Sync & Testing: Replicate files and databases incrementally and validate full application performance in staging.
• 4. Final Cutover & DNS Switch: Run final delta sync during off-peak minutes, point DNS to the new cloud setup, and monitor 24/7.`,
  },
  {
    topic: "Cloud Security & Backup",
    question: "How safe is data stored on the Cloud compared to local servers?",
    aliases: [
      "how safe is cloud data security",
      "is cloud safer than local physical server",
      "cloud backup and security vs on premise",
      "cloud data kitna safe hota hai",
    ],
    answer: `Enterprise Cloud environments provide stronger multi-layer protection than most office server rooms:

• Encryption Everywhere: Data is encrypted both in transit (TLS 1.3) and at rest (AES-256).
• Automated Offsite Backups: Point-in-time snapshots protect against accidental deletion, hardware failure, and ransomware.
• Network & Access Controls: Web Application Firewalls (WAF), private VPC subnets, MFA, and least-privilege IAM block unauthorized access.
• Physical Data Center Security: 24/7 biometric access control, redundant power grids, and fire suppression.`,
  },
];