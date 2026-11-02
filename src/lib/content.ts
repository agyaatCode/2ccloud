// /* Default / seed content. After first run everything here is editable from the admin CMS. */

// export type NavLink = { label: string; href: string; desc?: string };
// export type NavItem = {
//   label: string;
//   href: string;
//   image?: string;
//   imageTitle?: string;
//   imageText?: string;
//   columns?: { title: string; links: NavLink[] }[];
// };

// export const NAV: NavItem[] = [
//   { label: "Home", href: "/" },
//   {
//     label: "Cloud",
//     href: "/cloud/public-cloud",
//     image: "/images/hero/campus-aerial.jpg",
//     imageTitle: "Cloud, engineered for your workloads",
//     imageText: "Architecture, migration and 24×7 operations across public, private and hybrid platforms.",
//     columns: [
//       {
//         title: "Cloud models",
//         links: [
//           { label: "Public Cloud", href: "/cloud/public-cloud", desc: "Elastic infrastructure on leading hyperscalers" },
//           { label: "Private Cloud", href: "/cloud/private-cloud", desc: "Dedicated, isolated enterprise environments" },
//           { label: "Hybrid Cloud", href: "/cloud/hybrid-cloud", desc: "Private and public, run as one estate" },
//         ],
//       },
//       {
//         title: "Public cloud platforms",
//         links: [
//           { label: "AWS", href: "/cloud/aws", desc: "Amazon Web Services" },
//           { label: "Azure", href: "/cloud/azure", desc: "Microsoft Azure" },
//           { label: "Google Cloud", href: "/cloud/google-cloud", desc: "Google Cloud Platform" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Workplace Mobility",
//     href: "/workplace/m365",
//     image: "/images/hero/mail-servers.jpg",
//     imageTitle: "Email and collaboration, managed",
//     imageText: "Tenant setup, migration, security hardening and everyday support.",
//     columns: [
//       {
//         title: "Workplace platforms",
//         links: [
//           { label: "M365", href: "/workplace/m365", desc: "Microsoft 365 deployment and administration" },
//           { label: "Google Workspace", href: "/workplace/google-workspace", desc: "Mail, drive and collaboration" },
//           { label: "Zimbra Email", href: "/workplace/zimbra-email", desc: "Self-hosted enterprise mail" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Services",
//     href: "/services/cloud-migration",
//     image: "/images/hero/noc-wall.jpg",
//     imageTitle: "Operations you can rely on",
//     imageText: "Migration, DevOps, managed services and continuity under one accountable team.",
//     columns: [
//       {
//         title: "Services",
//         links: [
//           { label: "Cloud Migration", href: "/services/cloud-migration", desc: "Move servers, apps and data safely" },
//           { label: "DevOps", href: "/services/devops", desc: "CI/CD, automation and platform engineering" },
//           { label: "Managed Services", href: "/services/managed-services", desc: "24×7 monitoring and support" },
//           { label: "Business Continuity", href: "/services/business-continuity", desc: "Backup and disaster recovery" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Security",
//     href: "/security/ddos-protection",
//     image: "/images/hero/firewall-rack.jpg",
//     imageTitle: "Defence in depth",
//     imageText: "Layered controls from the network edge to identity and data.",
//     columns: [
//       {
//         title: "Security services",
//         links: [
//           { label: "DDoS Protection", href: "/security/ddos-protection", desc: "Volumetric and application-layer mitigation" },
//           { label: "Data Security", href: "/security/data-security", desc: "Encryption, DLP and access governance" },
//           { label: "VAPT", href: "/security/vapt", desc: "Vulnerability assessment and penetration testing" },
//         ],
//       },
//       {
//         title: "Endpoint & identity",
//         links: [
//           { label: "Anti-Virus", href: "/security/anti-virus", desc: "Endpoint and server protection" },
//           { label: "Active Directory", href: "/security/active-directory", desc: "Identity, authentication and policy" },
//         ],
//       },
//     ],
//   },
//   {
//     label: "About Us",
//     href: "/about",
//     image: "/images/stock/about.jpg",
//     imageTitle: "Infrastructure people",
//     imageText: "Engineers who run real servers, real clouds and real security.",
//     columns: [
//       {
//         title: "Company",
//         links: [
//           { label: "About Us", href: "/about" },
//           { label: "Vision", href: "/vision" },
//           { label: "Mission", href: "/mission" },
//         ],
//       },
//       {
//         title: "Connect",
//         links: [
//           { label: "News", href: "/news" },
//           { label: "Careers", href: "/careers" },
//           { label: "Contact Us", href: "/contact" },
//         ],
//       },
//     ],
//   },
// ];

// export const CATEGORY_LABEL: Record<string, string> = {
//   cloud: "Cloud",
//   workplace: "Workplace Mobility",
//   services: "Services",
//   security: "Security",
// };

// export const TRADEMARK_NOTE =
//   "AWS, Microsoft, Azure, Microsoft 365, Google Cloud and Google Workspace are trademarks of their respective owners. References on this page describe the platforms we support and do not imply an official partnership or endorsement unless explicitly stated.";

// /* ------------------------------ services ------------------------------ */
// type Svc = {
//   slug: string; category: "cloud" | "workplace" | "services" | "security"; parent?: string; title: string;
//   icon: string; diagram: string; image: string; pos?: string; posM?: string; featured?: boolean;
//   eyebrow: string; heroTitle: string; heroDesc: string; short: string; long: string; features: [string, string][];
//   cta?: string; overlay?: string; opacity?: number;
// };

// export const SERVICES: Svc[] = [
//   { slug: "public-cloud", category: "cloud", title: "Public Cloud", icon: "cloud", diagram: "cloud", image: "/images/hero/campus-aerial.jpg", featured: true,
//     eyebrow: "Cloud Infrastructure", heroTitle: "Cloud infrastructure built for business", heroDesc: "Secure, scalable and professionally managed public cloud environments for modern businesses.",
//     short: "Architecture, deployment and day-to-day operations on AWS, Azure and Google Cloud.",
//     long: "Public cloud rewards good design and punishes guesswork. We plan landing zones, networking, identity and cost controls first, then migrate and operate workloads with the monitoring, backup and governance a production business needs.\n\nWhether you are moving your first application or consolidating an estate across providers, our engineers stay accountable from architecture to 24×7 support.",
//     features: [["Landing zone design", "Accounts, networking, identity and guardrails designed before the first workload moves."], ["Right-sized capacity", "Compute, storage and database sizing based on measured utilisation, not estimates."], ["Cost governance", "Budgets, tagging and reporting so cloud spend stays predictable."], ["Operations and monitoring", "Patching, backup, alerting and incident response handled by our team."]] },
//   { slug: "aws", category: "cloud", parent: "public-cloud", title: "AWS", icon: "cloud", diagram: "cloud", image: "/images/stock/aws.jpg", pos: "center 40%",
//     eyebrow: "Public Cloud · AWS", heroTitle: "AWS environments, designed and operated properly", heroDesc: "Well-architected Amazon Web Services deployments with security, resilience and cost control built in.",
//     short: "Design, migration and managed operations for workloads running on Amazon Web Services.",
//     long: "We design AWS environments around the Well-Architected principles: separated accounts, least-privilege IAM, private networking, encrypted storage and automated backups. From EC2 and RDS to containers and serverless, we build what your workload needs and keep it healthy.",
//     features: [["Multi-account structure", "Production, staging and security accounts with central logging and guardrails."], ["Compute and containers", "EC2, ECS/EKS and serverless sized and automated for your workloads."], ["Managed databases", "RDS and Aurora with replication, backups and tested recovery."], ["Security and compliance", "IAM, KMS, GuardDuty-style monitoring and audit-ready logging."]] },
//   { slug: "azure", category: "cloud", parent: "public-cloud", title: "Azure", icon: "cloud", diagram: "cloud", image: "/images/stock/azure.jpg", pos: "center 55%",
//     eyebrow: "Public Cloud · Azure", heroTitle: "Microsoft Azure for the enterprise estate", heroDesc: "Azure landing zones, identity integration and managed operations for organisations that run on Microsoft.",
//     short: "Azure architecture, hybrid identity and managed operations for Microsoft-centric organisations.",
//     long: "Azure fits naturally where Active Directory, Microsoft 365 and Windows Server already live. We build subscriptions, networking and governance that connect cleanly to your existing estate, then migrate and run the workloads on top.",
//     features: [["Landing zones", "Subscriptions, management groups, policy and hub-spoke networking."], ["Hybrid identity", "Entra ID integration with on-premises Active Directory."], ["IaaS and PaaS", "Virtual machines, App Service and managed SQL sized for the job."], ["Backup and recovery", "Azure Backup and Site Recovery with documented runbooks."]] },
//   { slug: "google-cloud", category: "cloud", parent: "public-cloud", title: "Google Cloud", icon: "cloud", diagram: "cloud", image: "/images/stock/gcp.jpg", pos: "center 45%",
//     eyebrow: "Public Cloud · Google Cloud", heroTitle: "Data-intensive workloads on Google Cloud", heroDesc: "Scalable compute, containers and analytics platforms engineered and operated by our team.",
//     short: "Google Cloud design, Kubernetes platforms and managed operations.",
//     long: "Google Cloud is a strong platform for container-based and data-heavy applications. We design projects, networking and IAM for clarity, then build GKE, Cloud SQL and data pipelines with monitoring and cost visibility from the start.",
//     features: [["Project and IAM design", "Organisation structure and least-privilege access from day one."], ["Kubernetes platforms", "GKE clusters with autoscaling, ingress and observability."], ["Managed data services", "Cloud SQL, storage and pipelines with backup policies."], ["Cost visibility", "Budgets and labelling that make spend explainable."]] },
//   { slug: "private-cloud", category: "cloud", title: "Private Cloud", icon: "server", diagram: "private", image: "/images/stock/private.jpg", pos: "center 50%", featured: true,
//     eyebrow: "Private Cloud", heroTitle: "Dedicated infrastructure, cloud-style operations", heroDesc: "Isolated, high-performance private cloud environments for workloads that demand control and compliance.",
//     short: "Dedicated virtualised infrastructure with the agility of cloud and the isolation of your own hardware.",
//     long: "Some workloads belong on dedicated hardware: regulated data, predictable heavy compute, latency-sensitive systems. We design and operate private clouds on virtualisation platforms with software-defined storage and networking, secured and monitored like a hyperscaler.",
//     features: [["Dedicated resources", "No noisy neighbours: compute and storage reserved for your workloads."], ["Virtualisation platform", "Hypervisor clusters with high availability and live migration."], ["Network isolation", "Segmented VLANs, firewalls and private connectivity."], ["Managed lifecycle", "Patching, capacity planning and hardware support included."]] },
//   { slug: "hybrid-cloud", category: "cloud", title: "Hybrid Cloud", icon: "hybrid", diagram: "hybrid", image: "/images/stock/fiber.jpg", pos: "center 40%",
//     eyebrow: "Hybrid Cloud", heroTitle: "Private and public infrastructure, connected", heroDesc: "Run sensitive workloads privately and burst to public cloud, managed as one consistent environment.",
//     short: "Connect on-premises and cloud environments with secure networking, shared identity and unified monitoring.",
//     long: "Hybrid is rarely a destination; it is where most businesses actually live. We connect your data centre and cloud accounts with private links, shared identity and consistent policy so teams can place each workload where it makes most sense.",
//     features: [["Private connectivity", "Site-to-site VPN and dedicated links between environments."], ["Shared identity", "One directory and access model across private and public."], ["Unified monitoring", "A single view of health, capacity and cost."], ["Workload placement", "Guidance on what runs where, and why."]] },
//   { slug: "m365", category: "workplace", title: "M365", icon: "mail", diagram: "email", image: "/images/stock/m365.jpg", pos: "center 40%",
//     eyebrow: "Workplace Mobility", heroTitle: "Microsoft 365, deployed and managed", heroDesc: "Email, Teams and SharePoint set up securely, migrated cleanly and supported day to day.",
//     short: "Tenant design, mailbox migration, security hardening and ongoing administration for Microsoft 365.",
//     long: "A well-configured Microsoft 365 tenant is the backbone of modern work. We handle licensing, tenant design, conditional access, mail flow and migration, then provide administration and user support so your team just gets on with their work.",
//     features: [["Tenant setup", "Domains, licensing, groups and policies configured to best practice."], ["Mailbox migration", "Staged or cutover migration with minimal disruption."], ["Security baseline", "MFA, conditional access, anti-phishing and device policy."], ["Ongoing administration", "Onboarding, offboarding, licences and helpdesk support."]] },
//   { slug: "google-workspace", category: "workplace", title: "Google Workspace", icon: "mail", diagram: "email", image: "/images/stock/gws.jpg", pos: "center 35%",
//     eyebrow: "Workplace Mobility", heroTitle: "Google Workspace for collaborative teams", heroDesc: "Gmail, Drive and Meet configured securely and migrated from your existing platform.",
//     short: "Workspace deployment, data migration, domain security and support.",
//     long: "We deploy Google Workspace with proper domain authentication, access policies and data controls, migrate mail and files from legacy systems, and provide administration so collaboration works from the first day.",
//     features: [["Domain and mail authentication", "SPF, DKIM and DMARC configured to protect your brand."], ["Data migration", "Mail, calendar, contacts and Drive content moved reliably."], ["Admin policies", "Sharing, device and security policies tailored to your organisation."], ["User support", "Training and responsive helpdesk for your team."]] },
//   { slug: "zimbra-email", category: "workplace", title: "Zimbra Email", icon: "mail", diagram: "email", image: "/images/hero/mail-servers.jpg", pos: "center 45%",
//     eyebrow: "Enterprise Email", heroTitle: "Enterprise email on infrastructure you control", heroDesc: "Self-hosted Zimbra collaboration, secured, monitored and backed up by our engineers.",
//     short: "Hosted or on-premises Zimbra with anti-spam, backup and 24×7 monitoring.",
//     long: "For organisations that want ownership of their mail data, Zimbra is a proven platform. We deploy and run it with multi-layer spam and malware filtering, encrypted transport, scheduled backups and tested recovery.",
//     features: [["Dedicated mail infrastructure", "Sized for your mailbox count and retention needs."], ["Anti-spam and anti-malware", "Layered filtering with reputation and content checks."], ["Backup and archiving", "Scheduled backups with point-in-time restoration."], ["Migration from legacy mail", "IMAP and server-to-server migration with validation."]] },
//   { slug: "cloud-migration", category: "services", title: "Cloud Migration", icon: "migrate", diagram: "migration", image: "/images/hero/migration-hall.jpg", pos: "center 50%", featured: true,
//     eyebrow: "Cloud Migration", heroTitle: "Move your infrastructure with confidence", heroDesc: "Secure and carefully managed migration for applications, servers and business data.",
//     short: "Discovery, planning and execution of server, application and data migrations with minimal downtime.",
//     long: "Migrations fail on surprises: forgotten dependencies, undersized targets, cutovers with no rollback. We start with discovery and dependency mapping, rehearse the move, and cut over with a tested rollback plan so the business notices as little as possible.",
//     features: [["Discovery and dependency mapping", "Know what you run, what talks to what, and what can wait."], ["Rehearsed cutovers", "Test migrations and rollback plans before the real window."], ["Data integrity checks", "Verification at source and target, with reconciliation reports."], ["Post-migration hypercare", "Dedicated support while the new environment settles."]] },
//   { slug: "devops", category: "services", title: "DevOps", icon: "pipeline", diagram: "devops", image: "/images/stock/devops.jpg", pos: "center 40%", featured: true,
//     eyebrow: "DevOps Engineering", heroTitle: "Ship faster without breaking production", heroDesc: "CI/CD pipelines, infrastructure as code and observability that make delivery routine.",
//     short: "CI/CD, infrastructure as code, containers and observability for reliable, repeatable delivery.",
//     long: "We help engineering teams automate the path from commit to production: build and test pipelines, security scanning, immutable infrastructure and monitoring that tells you what is wrong before customers do.",
//     features: [["CI/CD pipelines", "Automated build, test, scan and deploy workflows."], ["Infrastructure as code", "Terraform and configuration management under version control."], ["Containers and Kubernetes", "Packaging, orchestration and safe rollout strategies."], ["Observability", "Metrics, logs and traces with actionable alerting."]] },
//   { slug: "managed-services", category: "services", title: "Managed Services", icon: "monitor", diagram: "monitoring", image: "/images/hero/noc-wall.jpg", pos: "center 45%",
//     eyebrow: "Managed Services", heroTitle: "Infrastructure operations, handled", heroDesc: "24×7 monitoring, patching and support from a team that treats your systems as its own.",
//     short: "Round-the-clock monitoring, incident response, patching and capacity management.",
//     long: "Your engineers should build things, not babysit servers. Our network operations team monitors your infrastructure around the clock, responds to incidents against agreed SLAs, and handles patching, backups and capacity planning.",
//     features: [["24×7 monitoring", "Proactive alerting across servers, network and applications."], ["Incident management", "Defined severity levels, response targets and escalation paths."], ["Patch and update management", "Scheduled, tested patching with maintenance windows."], ["Reporting and reviews", "Monthly service reports and regular improvement reviews."]] },
//   { slug: "business-continuity", category: "services", title: "Business Continuity", icon: "backup", diagram: "continuity", image: "/images/stock/continuity.jpg", pos: "center 50%",
//     eyebrow: "Business Continuity", heroTitle: "Be ready before something goes wrong", heroDesc: "Backup and disaster recovery designed around your recovery time and recovery point objectives.",
//     short: "Backup, replication and disaster recovery with tested runbooks.",
//     long: "Backups you have never restored are a hope, not a plan. We define RTO and RPO with you, implement backup and replication to match, and rehearse recovery so that when it matters, it works.",
//     features: [["RTO / RPO planning", "Recovery targets agreed with the business, not assumed."], ["Offsite and immutable backups", "Copies that survive ransomware and site failure."], ["Replication and failover", "Warm or hot standby for critical systems."], ["Recovery testing", "Scheduled drills with documented results."]] },
//   { slug: "ddos-protection", category: "security", title: "DDoS Protection", icon: "shield", diagram: "ddos", image: "/images/hero/firewall-rack.jpg", pos: "center 50%",
//     eyebrow: "Network Security", heroTitle: "Keep your services online under attack", heroDesc: "Traffic filtered at the edge so legitimate users stay connected while attacks are absorbed.",
//     short: "Always-on volumetric and application-layer DDoS mitigation.",
//     long: "Distributed denial-of-service attacks target availability. We place scrubbing and rate-limiting in front of your services, tune detection to your normal traffic profile, and provide a response team for when an attack begins.",
//     features: [["Volumetric mitigation", "Large floods absorbed upstream before they reach your network."], ["Application-layer protection", "WAF and behavioural rules for HTTP floods."], ["Traffic baselining", "Detection tuned to your real traffic patterns."], ["Incident response", "Engineers on call when an attack starts."]] },
//   { slug: "data-security", category: "security", title: "Data Security", icon: "lock", diagram: "datasec", image: "/images/stock/datasec.jpg", pos: "center 50%",
//     eyebrow: "Data Protection", heroTitle: "Protect the data that runs your business", heroDesc: "Encryption, access governance and monitoring across databases, storage and endpoints.",
//     short: "Encryption, access control, DLP and audit across your data estate.",
//     long: "Data security begins with knowing where sensitive data lives and who can reach it. We classify, encrypt and restrict it, then monitor access so unusual behaviour is caught early.",
//     features: [["Encryption at rest and in transit", "Modern ciphers with managed key lifecycle."], ["Access governance", "Least-privilege roles, reviews and privileged access controls."], ["Data loss prevention", "Policies for email, endpoints and cloud storage."], ["Audit and monitoring", "Searchable trails for compliance and investigation."]] },
//   { slug: "vapt", category: "security", title: "VAPT", icon: "scan", diagram: "vapt", image: "/images/stock/vapt.jpg", pos: "center 50%",
//     eyebrow: "Security Testing", heroTitle: "Find the weaknesses before attackers do", heroDesc: "Vulnerability assessment and penetration testing for applications, networks and cloud environments.",
//     short: "Structured vulnerability assessment and penetration testing with clear remediation guidance.",
//     long: "Our testers combine automated scanning with manual exploitation to show how real attackers would move through your environment, then deliver prioritised findings your team can act on, with retesting once fixes are in.",
//     features: [["Web and API testing", "OWASP-aligned testing of applications and services."], ["Network and infrastructure testing", "External and internal assessments of exposed systems."], ["Cloud configuration review", "Misconfiguration and privilege analysis."], ["Reporting and retest", "Prioritised findings, evidence and verification of fixes."]] },
//   { slug: "anti-virus", category: "security", title: "Anti-Virus", icon: "endpoint", diagram: "endpoint", image: "/images/stock/av.jpg", pos: "center 50%",
//     eyebrow: "Endpoint Security", heroTitle: "Endpoint and server protection that stays current", heroDesc: "Centrally managed anti-malware and endpoint detection across desktops, laptops and servers.",
//     short: "Centrally managed endpoint and server protection with reporting.",
//     long: "We deploy and manage endpoint protection across your devices with central policy, automatic updates and alerting, and respond to detections so threats are contained rather than ignored.",
//     features: [["Central management", "One console for policy, updates and visibility."], ["Server and endpoint coverage", "Windows, Linux and macOS protection."], ["Detection and response", "Behavioural detection with guided remediation."], ["Compliance reporting", "Coverage and incident reports for audits."]] },
//   { slug: "active-directory", category: "security", title: "Active Directory", icon: "identity", diagram: "identity", image: "/images/hero/access-control.jpg", pos: "center 50%",
//     eyebrow: "Identity & Access", heroTitle: "Identity is the new perimeter", heroDesc: "Active Directory design, hardening and administration for secure, manageable authentication.",
//     short: "AD design, hardening, group policy and hybrid identity with Entra ID.",
//     long: "Most breaches involve compromised credentials. We design clean directory structures, apply tiered administration and group policy, secure domain controllers and connect on-premises identity to the cloud.",
//     features: [["Directory design", "OU structure, sites and replication that scale."], ["Hardening and tiering", "Reduce the blast radius of compromised accounts."], ["Group policy management", "Consistent, auditable configuration for users and devices."], ["Hybrid identity", "Single sign-on and MFA across cloud and on-premises."]] },
// ];

// const GENERIC = {
//   cloud: {
//     process: [["Assess", "We review workloads, dependencies, compliance needs and current costs."], ["Design", "Architecture, networking, identity and security controls are designed and agreed."], ["Build and migrate", "Environments are built as code and workloads are moved with tested rollback."], ["Operate", "Monitoring, patching, backup and optimisation by our operations team."]],
//     benefits: [["Predictable operations", "Defined SLAs, monitoring and escalation rather than ad-hoc firefighting."], ["Security by design", "Least-privilege access, encryption and logging built into the foundation."], ["One accountable partner", "Architecture, migration and run support from the same team."]],
//   },
//   workplace: {
//     process: [["Discover", "Users, domains, mail flow and data volumes are inventoried."], ["Configure", "Tenant or server is configured with security and policy baselines."], ["Migrate", "Mail and files are moved in planned batches with validation."], ["Support", "Training, administration and helpdesk after go-live."]],
//     benefits: [["Minimal disruption", "Planned migrations scheduled around your working hours."], ["Secure by default", "MFA, anti-phishing and mail authentication configured from day one."], ["Responsive support", "Real engineers for administration and user issues."]],
//   },
//   services: {
//     process: [["Assess", "Current-state review, risks and objectives are documented."], ["Plan", "A clear plan with milestones, owners and rollback options."], ["Execute", "Delivery by experienced engineers with regular status reporting."], ["Support", "Handover, documentation and ongoing support."]],
//     benefits: [["Lower risk", "Rehearsed changes and documented rollback for every critical step."], ["Transparent delivery", "Regular reporting so you always know where things stand."], ["Experienced engineers", "Hands-on specialists, not just account managers."]],
//   },
//   security: {
//     process: [["Assess exposure", "We map assets, access paths and existing controls."], ["Design controls", "Layered controls are designed against realistic threats."], ["Implement and validate", "Controls are deployed and tested to confirm they work."], ["Monitor and improve", "Continuous monitoring, reporting and periodic review."]],
//     benefits: [["Layered protection", "Controls at the edge, network, identity, endpoint and data layers."], ["Actionable findings", "Prioritised recommendations with clear owners and effort."], ["Audit-ready evidence", "Logs and reports that support compliance conversations."]],
//   },
// } as const;

// export function serviceExtras(s: Svc) {
//   const g = GENERIC[s.category];
//   const faqs: [string, string][] = [
//     [`How do you get started with ${s.title}?`, "We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities."],
//     ["Will you work with our existing team and tools?", "Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well."],
//     ["How is support provided after delivery?", "Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews."],
//   ];
//   return { process: g.process as unknown as [string, string][], benefits: g.benefits as unknown as [string, string][], faqs };
// }

// /* ------------------------------ pages ------------------------------ */
// export type PageSeed = {
//   slug: string; title: string; eyebrow: string; heroTitle: string; heroDesc: string; image: string; pos?: string;
//   primary?: [string, string]; secondary?: [string, string]; opacity?: number;
// };
// export const PAGES: PageSeed[] = [
//   { slug: "home", title: "Home", eyebrow: "Cloud · Servers · Security · Managed Services", heroTitle: "Cloud infrastructure built for business", heroDesc: "Secure, scalable and professionally managed infrastructure — from cloud migration and DevOps to security and 24×7 operations.", image: "/images/hero/home-datacenter.jpg", pos: "center 55%", primary: ["Explore Services", "/services/cloud-migration"], secondary: ["Talk to an Expert", "/contact"], opacity: 70 },
//   { slug: "about", title: "About Us", eyebrow: "About Us", heroTitle: "Engineers who run real infrastructure", heroDesc: "A technology services company focused on cloud, servers, security and managed operations.", image: "/images/stock/about.jpg", pos: "center 40%", primary: ["Our Services", "/services/managed-services"], secondary: ["Contact Us", "/contact"] },
//   { slug: "vision", title: "Vision", eyebrow: "Our Vision", heroTitle: "Infrastructure that businesses can depend on", heroDesc: "Where we are heading, and the standard we hold ourselves to.", image: "/images/hero/vision-corridor.jpg", pos: "center 50%", primary: ["Our Mission", "/mission"] },
//   { slug: "mission", title: "Mission", eyebrow: "Our Mission", heroTitle: "People and infrastructure, working together", heroDesc: "How we deliver reliable technology services every day.", image: "/images/stock/mission.jpg", pos: "center 40%", primary: ["Join Our Team", "/careers"] },
//   { slug: "news", title: "News", eyebrow: "News & Insights", heroTitle: "News from the operations floor", heroDesc: "Announcements, engineering notes and insights on cloud, security and infrastructure.", image: "/images/stock/news.jpg", pos: "center 45%" },
//   { slug: "careers", title: "Careers", eyebrow: "Careers", heroTitle: "Build the infrastructure behind modern businesses", heroDesc: "Join engineers who design, secure and operate real cloud and server environments.", image: "/images/stock/careers.jpg", pos: "center 40%", primary: ["View Open Roles", "#openings"] },
//   { slug: "contact", title: "Contact Us", eyebrow: "Contact", heroTitle: "Talk to an infrastructure expert", heroDesc: "Tell us about your environment and what you need. We will respond within one business day.", image: "/images/stock/contact.jpg", pos: "center 50%" },
//   { slug: "register", title: "Register", eyebrow: "Customer Portal", heroTitle: "Create your customer account", heroDesc: "Register to request services, track enquiries and manage your details.", image: "/images/stock/register.jpg", pos: "center 50%", opacity: 82 },
//   { slug: "login", title: "Sign in", eyebrow: "Customer Portal", heroTitle: "Welcome back", heroDesc: "Sign in to your customer dashboard.", image: "/images/stock/patch.jpg", pos: "center 50%", opacity: 82 },
// ];

// /* Default content blocks for CMS-driven sections (overridable in Admin → Pages). */
// export type SectionDefault = { eyebrow?: string; title?: string; body?: string; imageUrl?: string; videoUrl?: string; buttonText?: string; buttonUrl?: string; items?: { title: string; text: string }[] };

// export const SECTION_DEFAULTS: Record<string, Record<string, SectionDefault>> = {
//   home: {
//     story: { eyebrow: "The infrastructure story", title: "Real servers. Real cloud. Real accountability.", body: "Every business application ends up on physical hardware somewhere. We design, build and operate that layer — across public cloud, private cloud and your own racks — with the security and monitoring a production workload deserves.", items: [{ title: "Design", text: "Architecture first, tooling second." }, { title: "Operate", text: "24×7 monitoring and response." }, { title: "Protect", text: "Security built into every layer." }] },
//     services: { eyebrow: "Services", title: "Our Marketplaces", body: "Explore products and platforms trusted by our customers and powered by our reliable infrastructure." },
//     platforms: { eyebrow: "Cloud platforms", title: "The right platform for each workload", body: "We are platform-pragmatic: public, private or hybrid, chosen on merit." },
//     architecture: { eyebrow: "Reference architecture", title: "A resilient, layered production design", body: "Traffic is filtered at the edge, balanced across redundant application nodes, and persisted to replicated data stores with continuous backup." },
//     security: { eyebrow: "Security", title: "Defence in depth, from the edge to the data", body: "Layered controls reduce the chance of a breach and limit the damage if one occurs.", imageUrl: "/images/hero/firewall-rack.jpg", buttonText: "Explore security services", buttonUrl: "/security/ddos-protection" },
//     migration: { eyebrow: "Migration", title: "Move to the cloud without moving the risk", body: "Our migrations are planned, rehearsed and reversible.", imageUrl: "/images/hero/migration-hall.jpg", buttonText: "Plan a migration", buttonUrl: "/services/cloud-migration" },
//     devops: { eyebrow: "DevOps", title: "From commit to production, automated", body: "Pipelines, infrastructure as code and observability that make releases routine and recoveries fast.", buttonText: "Explore DevOps", buttonUrl: "/services/devops" },
//     managed: { eyebrow: "Managed infrastructure", title: "A network operations team watching your systems", body: "Monitoring, patching and incident response under clear SLAs, so your engineers can focus on the product.", imageUrl: "/images/hero/noc-wall.jpg", buttonText: "Learn about managed services", buttonUrl: "/services/managed-services" },
//     stats: { eyebrow: "At a glance", title: "Operated with discipline", items: [{ title: "24×7", text: "Monitoring and incident response" }, { title: "99.95%", text: "SLA" }, { title: "35", text: "Dedicated Team Members" }, { title: "100+", text: "Businesses Trust Us" }] },
//     news: { eyebrow: "News", title: "Latest from 2CCloud" },
//     cta: { eyebrow: "Get started", title: "Tell us about your infrastructure", body: "A short conversation with an engineer is the fastest way to find out what you need.", buttonText: "Talk to an Expert", buttonUrl: "/contact", imageUrl: "/images/stock/contact.jpg" },
//   },
//   about: {
//     intro: { eyebrow: "Who we are", title: "A technology services company, run by engineers", body: "Cirrostratus Services Pvt. Ltd., operating as 2CCloud, designs, migrates, secures and operates cloud and server infrastructure for businesses.\n\nWe focus on the unglamorous parts that decide whether technology works: architecture, security, monitoring, backup and support. Our teams work directly with yours, and stay accountable after go-live." },
//     image: { imageUrl: "/images/hero/campus-aerial.jpg", title: "Infrastructure, end to end", body: "From racks and networks to cloud platforms and the applications running on them." },
//     pillars: { eyebrow: "How we work", title: "What clients can expect", items: [{ title: "Engineering-led", text: "The people who design your environment are the people who understand it." }, { title: "Security first", text: "Controls are part of the design, not an add-on after the fact." }, { title: "Transparent delivery", text: "Clear plans, honest reporting and no surprise costs." }, { title: "Long-term partnership", text: "We measure ourselves by how your systems run a year from now." }] },
//   },
//   vision: {
//     intro: { eyebrow: "Where we are heading", title: "Infrastructure that businesses can simply depend on", body: "We envision a future where every organisation, regardless of size, has access to enterprise-grade infrastructure and security without needing to build a large in-house operations team.\n\nTechnology should be a quiet foundation, not a constant source of risk." },
//     pillars: { eyebrow: "Our direction", title: "What we are building towards", items: [{ title: "Reliable by default", text: "Resilience and monitoring as standard." }, { title: "Secure by design", text: "Security embedded across every layer of delivery." }, { title: "Accessible expertise", text: "Specialist skills available to businesses of every size." }] },
//   },
//   mission: {
//     intro: { eyebrow: "What we do every day", title: "Deliver reliable, secure technology services", body: "Our mission is to help organisations run on dependable infrastructure by combining deep engineering skill with clear communication and responsible operations.\n\nWe do this by listening first, designing carefully, building with discipline and supporting what we build." },
//     pillars: { eyebrow: "Principles", title: "How the mission shows up", items: [{ title: "Listen first", text: "Understand the business before proposing technology." }, { title: "Build carefully", text: "Test, document and rehearse before changing production." }, { title: "Stay accountable", text: "Own outcomes, including after delivery." }, { title: "Grow our people", text: "Invest in the engineers who serve clients." }] },
//   },
//   careers: {
//     intro: { eyebrow: "Work with us", title: "Engineering work with real consequences", body: "We operate real servers, real clouds and real security for real businesses. If you like understanding how systems work and making them better, you will fit in.", items: [{ title: "Hands-on engineering", text: "Work on production infrastructure from day one." }, { title: "Learning culture", text: "Certification support and time to learn." }, { title: "Clear growth paths", text: "Progression from support to architecture." }] },
//   },
//   contact: {
//     intro: { eyebrow: "Get in touch", title: "Let us understand your environment", body: "Share a few details and an engineer will respond within one business day." },
//   },
// };

// export const SETTINGS_DEFAULTS: Record<string, string> = {
//   company_name: "Cirrostratus Services Pvt. Ltd.",
//   brand_name: "2CCloud",
//   tagline: "Cloud, server, DevOps and security services",
//   contact_email: "contact@2ccloud.com",
//   contact_phone: "",
//   address: "",
//   header_cta_text: "Contact",
//   header_cta_url: "/contact",
//   footer_blurb: "Cloud, server, DevOps, security and managed services for businesses that depend on their infrastructure.",
//   site_url: "",
//   notify_email: "",
//   linkedin_url: "",
//   twitter_url: "",
//   facebook_url: "",
//   youtube_url: "",
//   default_og_image: "/images/hero/home-datacenter.jpg",
// };

// export const MASTER_SEEDS = {
//   universities: ["Delhi University", "Jawaharlal Nehru University", "Anna University", "Savitribai Phule Pune University", "University of Mumbai", "Osmania University", "Banaras Hindu University", "Aligarh Muslim University", "Jadavpur University", "Visvesvaraya Technological University", "Rajiv Gandhi Proudyogiki Vishwavidyalaya", "Dr. A.P.J. Abdul Kalam Technical University", "Gujarat Technological University", "Indira Gandhi National Open University"],
//   boards: ["CBSE", "ICSE / CISCE", "Bihar School Examination Board", "Jharkhand Academic Council", "UP Board", "Maharashtra State Board", "Tamil Nadu State Board", "West Bengal Board", "Karnataka State Board", "Rajasthan Board", "Gujarat Board", "Madhya Pradesh Board", "NIOS"],
//   qualifications: ["Matric", "Intermediate", "Diploma", "Graduation", "Post Graduation / Master's", "PhD", "Other"],
//   jobRoles: ["Cloud Engineer", "DevOps Engineer", "System Administrator", "Network Engineer", "Security Analyst", "Technical Support Engineer", "Software Developer", "Sales Executive", "HR Executive", "Other"],
// };






// new new code 







/* Default / seed content. After first run everything here is editable from the admin CMS. */

export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = {
  label: string;
  href: string;
  image?: string;
  imageTitle?: string;
  imageText?: string;
  columns?: { title: string; links: NavLink[] }[];
};

export const NAV: NavItem[] = [
  {
    label: "Products",
    href: "/cloud/public-cloud",
    image: "/images/hero/campus-aerial.jpg",
    imageTitle: "Cloud and workplace platforms, engineered end to end",
    imageText: "Public, private and hybrid cloud, hyperscaler platforms and managed email — designed, migrated and operated by one team.",
    columns: [
      {
        title: "Cloud platforms",
        links: [
          { label: "Public Cloud", href: "/cloud/public-cloud", desc: "Elastic infrastructure on leading hyperscalers" },
          { label: "Private Cloud", href: "/cloud/private-cloud", desc: "Dedicated, isolated enterprise environments" },
          { label: "Hybrid Cloud", href: "/cloud/hybrid-cloud", desc: "Private and public, run as one estate" },
        ],
      },
      {
        title: "Cloud providers",
        links: [
          { label: "AWS", href: "/cloud/aws", desc: "Amazon Web Services" },
          { label: "Azure", href: "/cloud/azure", desc: "Microsoft Azure" },
          { label: "Google Cloud", href: "/cloud/google-cloud", desc: "Google Cloud Platform" },
        ],
      },
      {
        title: "Workplace & email",
        links: [
          { label: "M365", href: "/workplace/m365", desc: "Microsoft 365 deployment and administration" },
          { label: "Google Workspace", href: "/workplace/google-workspace", desc: "Mail, drive and collaboration" },
          { label: "Zimbra Email", href: "/workplace/zimbra-email", desc: "Self-hosted enterprise mail" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services/cloud-migration",
    image: "/images/hero/migration-hall.jpg",
    imageTitle: "Solutions for migration, modernisation and operations",
    imageText: "Move workloads to the cloud, automate delivery and run everything 24×7 — with rehearsed plans and rollback.",
    columns: [
      {
        title: "Modernise",
        links: [
          { label: "Cloud Migration", href: "/services/cloud-migration", desc: "Move servers, apps and data safely" },
          { label: "DevOps", href: "/services/devops", desc: "CI/CD, automation and platform engineering" },
        ],
      },
      {
        title: "Operate",
        links: [
          { label: "Managed Services", href: "/services/managed-services", desc: "24×7 monitoring and support" },
          { label: "Business Continuity", href: "/services/business-continuity", desc: "Backup and disaster recovery" },
        ],
      },
    ],
  },
  {
    label: "Security",
    href: "/security/ddos-protection",
    image: "/images/hero/firewall-rack.jpg",
    imageTitle: "Defence in depth",
    imageText: "Layered controls from the network edge to identity and data.",
    columns: [
      {
        title: "Security services",
        links: [
          { label: "DDoS Protection", href: "/security/ddos-protection", desc: "Volumetric and application-layer mitigation" },
          { label: "Data Security", href: "/security/data-security", desc: "Encryption, DLP and access governance" },
          { label: "VAPT", href: "/security/vapt", desc: "Vulnerability assessment and penetration testing" },
        ],
      },
      {
        title: "Endpoint & identity",
        links: [
          { label: "Anti-Virus", href: "/security/anti-virus", desc: "Endpoint and server protection" },
          { label: "Active Directory", href: "/security/active-directory", desc: "Identity, authentication and policy" },
        ],
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    image: "/images/stock/about.jpg",
    imageTitle: "Infrastructure people",
    imageText: "Engineers who run real servers, real clouds and real security.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about", desc: "Who we are and how we work" },
          { label: "Vision", href: "/vision", desc: "The future we are building towards" },
          { label: "Mission", href: "/mission", desc: "What we do, every single day" },
        ],
      },
      {
        title: "Connect",
        links: [
          { label: "News", href: "/news", desc: "Updates from the operations floor" },
          { label: "Careers", href: "/careers", desc: "Open roles with real engineering work" },
          { label: "Contact Us", href: "/contact", desc: "We respond within one business day" },
        ],
      },
    ],
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  cloud: "Cloud",
  workplace: "Workplace Mobility",
  services: "Services",
  security: "Security",
};

export const TRADEMARK_NOTE =
  "AWS, Microsoft, Azure, Microsoft 365, Google Cloud and Google Workspace are trademarks of their respective owners. References on this page describe the platforms we support and do not imply an official partnership or endorsement unless explicitly stated.";

/* ------------------------------ services ------------------------------ */
type Svc = {
  slug: string; category: "cloud" | "workplace" | "services" | "security"; parent?: string; title: string;
  icon: string; diagram: string; image: string; pos?: string; posM?: string; featured?: boolean;
  eyebrow: string; heroTitle: string; heroDesc: string; short: string; long: string; features: [string, string][];
  cta?: string; overlay?: string; opacity?: number;
};

export const SERVICES: Svc[] = [
  { slug: "public-cloud", category: "cloud", title: "Public Cloud", icon: "cloud", diagram: "cloud", image: "/images/hero/campus-aerial.jpg", featured: true,
    eyebrow: "Cloud Infrastructure", heroTitle: "Cloud infrastructure built for business", heroDesc: "Secure, scalable and professionally managed public cloud environments for modern businesses.",
    short: "Architecture, deployment and day-to-day operations on AWS, Azure and Google Cloud.",
    long: "Public cloud rewards good design and punishes guesswork. We plan landing zones, networking, identity and cost controls first, then migrate and operate workloads with the monitoring, backup and governance a production business needs.\n\nWhether you are moving your first application or consolidating an estate across providers, our engineers stay accountable from architecture to 24×7 support.",
    features: [["Landing zone design", "Accounts, networking, identity and guardrails designed before the first workload moves."], ["Right-sized capacity", "Compute, storage and database sizing based on measured utilisation, not estimates."], ["Cost governance", "Budgets, tagging and reporting so cloud spend stays predictable."], ["Operations and monitoring", "Patching, backup, alerting and incident response handled by our team."]] },
  { slug: "aws", category: "cloud", parent: "public-cloud", title: "AWS", icon: "cloud", diagram: "cloud", image: "/images/stock/aws.jpg", pos: "center 40%",
    eyebrow: "Public Cloud · AWS", heroTitle: "AWS environments, designed and operated properly", heroDesc: "Well-architected Amazon Web Services deployments with security, resilience and cost control built in.",
    short: "Design, migration and managed operations for workloads running on Amazon Web Services.",
    long: "We design AWS environments around the Well-Architected principles: separated accounts, least-privilege IAM, private networking, encrypted storage and automated backups. From EC2 and RDS to containers and serverless, we build what your workload needs and keep it healthy.",
    features: [["Multi-account structure", "Production, staging and security accounts with central logging and guardrails."], ["Compute and containers", "EC2, ECS/EKS and serverless sized and automated for your workloads."], ["Managed databases", "RDS and Aurora with replication, backups and tested recovery."], ["Security and compliance", "IAM, KMS, GuardDuty-style monitoring and audit-ready logging."]] },
  { slug: "azure", category: "cloud", parent: "public-cloud", title: "Azure", icon: "cloud", diagram: "cloud", image: "/images/stock/azure.jpg", pos: "center 55%",
    eyebrow: "Public Cloud · Azure", heroTitle: "Microsoft Azure for the enterprise estate", heroDesc: "Azure landing zones, identity integration and managed operations for organisations that run on Microsoft.",
    short: "Azure architecture, hybrid identity and managed operations for Microsoft-centric organisations.",
    long: "Azure fits naturally where Active Directory, Microsoft 365 and Windows Server already live. We build subscriptions, networking and governance that connect cleanly to your existing estate, then migrate and run the workloads on top.",
    features: [["Landing zones", "Subscriptions, management groups, policy and hub-spoke networking."], ["Hybrid identity", "Entra ID integration with on-premises Active Directory."], ["IaaS and PaaS", "Virtual machines, App Service and managed SQL sized for the job."], ["Backup and recovery", "Azure Backup and Site Recovery with documented runbooks."]] },
  { slug: "google-cloud", category: "cloud", parent: "public-cloud", title: "Google Cloud", icon: "cloud", diagram: "cloud", image: "/images/stock/gcp.jpg", pos: "center 45%",
    eyebrow: "Public Cloud · Google Cloud", heroTitle: "Data-intensive workloads on Google Cloud", heroDesc: "Scalable compute, containers and analytics platforms engineered and operated by our team.",
    short: "Google Cloud design, Kubernetes platforms and managed operations.",
    long: "Google Cloud is a strong platform for container-based and data-heavy applications. We design projects, networking and IAM for clarity, then build GKE, Cloud SQL and data pipelines with monitoring and cost visibility from the start.",
    features: [["Project and IAM design", "Organisation structure and least-privilege access from day one."], ["Kubernetes platforms", "GKE clusters with autoscaling, ingress and observability."], ["Managed data services", "Cloud SQL, storage and pipelines with backup policies."], ["Cost visibility", "Budgets and labelling that make spend explainable."]] },
  { slug: "private-cloud", category: "cloud", title: "Private Cloud", icon: "server", diagram: "private", image: "/images/stock/private.jpg", pos: "center 50%", featured: true,
    eyebrow: "Private Cloud", heroTitle: "Dedicated infrastructure, cloud-style operations", heroDesc: "Isolated, high-performance private cloud environments for workloads that demand control and compliance.",
    short: "Dedicated virtualised infrastructure with the agility of cloud and the isolation of your own hardware.",
    long: "Some workloads belong on dedicated hardware: regulated data, predictable heavy compute, latency-sensitive systems. We design and operate private clouds on virtualisation platforms with software-defined storage and networking, secured and monitored like a hyperscaler.",
    features: [["Dedicated resources", "No noisy neighbours: compute and storage reserved for your workloads."], ["Virtualisation platform", "Hypervisor clusters with high availability and live migration."], ["Network isolation", "Segmented VLANs, firewalls and private connectivity."], ["Managed lifecycle", "Patching, capacity planning and hardware support included."]] },
  { slug: "hybrid-cloud", category: "cloud", title: "Hybrid Cloud", icon: "hybrid", diagram: "hybrid", image: "/images/stock/fiber.jpg", pos: "center 40%",
    eyebrow: "Hybrid Cloud", heroTitle: "Private and public infrastructure, connected", heroDesc: "Run sensitive workloads privately and burst to public cloud, managed as one consistent environment.",
    short: "Connect on-premises and cloud environments with secure networking, shared identity and unified monitoring.",
    long: "Hybrid is rarely a destination; it is where most businesses actually live. We connect your data centre and cloud accounts with private links, shared identity and consistent policy so teams can place each workload where it makes most sense.",
    features: [["Private connectivity", "Site-to-site VPN and dedicated links between environments."], ["Shared identity", "One directory and access model across private and public."], ["Unified monitoring", "A single view of health, capacity and cost."], ["Workload placement", "Guidance on what runs where, and why."]] },
  { slug: "m365", category: "workplace", title: "M365", icon: "mail", diagram: "email", image: "/images/stock/m365.jpg", pos: "center 40%",
    eyebrow: "Workplace Mobility", heroTitle: "Microsoft 365, deployed and managed", heroDesc: "Email, Teams and SharePoint set up securely, migrated cleanly and supported day to day.",
    short: "Tenant design, mailbox migration, security hardening and ongoing administration for Microsoft 365.",
    long: "A well-configured Microsoft 365 tenant is the backbone of modern work. We handle licensing, tenant design, conditional access, mail flow and migration, then provide administration and user support so your team just gets on with their work.",
    features: [["Tenant setup", "Domains, licensing, groups and policies configured to best practice."], ["Mailbox migration", "Staged or cutover migration with minimal disruption."], ["Security baseline", "MFA, conditional access, anti-phishing and device policy."], ["Ongoing administration", "Onboarding, offboarding, licences and helpdesk support."]] },
  { slug: "google-workspace", category: "workplace", title: "Google Workspace", icon: "mail", diagram: "email", image: "/images/stock/gws.jpg", pos: "center 35%",
    eyebrow: "Workplace Mobility", heroTitle: "Google Workspace for collaborative teams", heroDesc: "Gmail, Drive and Meet configured securely and migrated from your existing platform.",
    short: "Workspace deployment, data migration, domain security and support.",
    long: "We deploy Google Workspace with proper domain authentication, access policies and data controls, migrate mail and files from legacy systems, and provide administration so collaboration works from the first day.",
    features: [["Domain and mail authentication", "SPF, DKIM and DMARC configured to protect your brand."], ["Data migration", "Mail, calendar, contacts and Drive content moved reliably."], ["Admin policies", "Sharing, device and security policies tailored to your organisation."], ["User support", "Training and responsive helpdesk for your team."]] },
  { slug: "zimbra-email", category: "workplace", title: "Zimbra Email", icon: "mail", diagram: "email", image: "/images/hero/mail-servers.jpg", pos: "center 45%",
    eyebrow: "Enterprise Email", heroTitle: "Enterprise email on infrastructure you control", heroDesc: "Self-hosted Zimbra collaboration, secured, monitored and backed up by our engineers.",
    short: "Hosted or on-premises Zimbra with anti-spam, backup and 24×7 monitoring.",
    long: "For organisations that want ownership of their mail data, Zimbra is a proven platform. We deploy and run it with multi-layer spam and malware filtering, encrypted transport, scheduled backups and tested recovery.",
    features: [["Dedicated mail infrastructure", "Sized for your mailbox count and retention needs."], ["Anti-spam and anti-malware", "Layered filtering with reputation and content checks."], ["Backup and archiving", "Scheduled backups with point-in-time restoration."], ["Migration from legacy mail", "IMAP and server-to-server migration with validation."]] },
  { slug: "cloud-migration", category: "services", title: "Cloud Migration", icon: "migrate", diagram: "migration", image: "/images/hero/migration-hall.jpg", pos: "center 50%", featured: true,
    eyebrow: "Cloud Migration", heroTitle: "Move your infrastructure with confidence", heroDesc: "Secure and carefully managed migration for applications, servers and business data.",
    short: "Discovery, planning and execution of server, application and data migrations with minimal downtime.",
    long: "Migrations fail on surprises: forgotten dependencies, undersized targets, cutovers with no rollback. We start with discovery and dependency mapping, rehearse the move, and cut over with a tested rollback plan so the business notices as little as possible.",
    features: [["Discovery and dependency mapping", "Know what you run, what talks to what, and what can wait."], ["Rehearsed cutovers", "Test migrations and rollback plans before the real window."], ["Data integrity checks", "Verification at source and target, with reconciliation reports."], ["Post-migration hypercare", "Dedicated support while the new environment settles."]] },
  { slug: "devops", category: "services", title: "DevOps", icon: "pipeline", diagram: "devops", image: "/images/stock/devops.jpg", pos: "center 40%", featured: true,
    eyebrow: "DevOps Engineering", heroTitle: "Ship faster without breaking production", heroDesc: "CI/CD pipelines, infrastructure as code and observability that make delivery routine.",
    short: "CI/CD, infrastructure as code, containers and observability for reliable, repeatable delivery.",
    long: "We help engineering teams automate the path from commit to production: build and test pipelines, security scanning, immutable infrastructure and monitoring that tells you what is wrong before customers do.",
    features: [["CI/CD pipelines", "Automated build, test, scan and deploy workflows."], ["Infrastructure as code", "Terraform and configuration management under version control."], ["Containers and Kubernetes", "Packaging, orchestration and safe rollout strategies."], ["Observability", "Metrics, logs and traces with actionable alerting."]] },
  { slug: "managed-services", category: "services", title: "Managed Services", icon: "monitor", diagram: "monitoring", image: "/images/hero/noc-wall.jpg", pos: "center 45%",
    eyebrow: "Managed Services", heroTitle: "Infrastructure operations, handled", heroDesc: "24×7 monitoring, patching and support from a team that treats your systems as its own.",
    short: "Round-the-clock monitoring, incident response, patching and capacity management.",
    long: "Your engineers should build things, not babysit servers. Our network operations team monitors your infrastructure around the clock, responds to incidents against agreed SLAs, and handles patching, backups and capacity planning.",
    features: [["24×7 monitoring", "Proactive alerting across servers, network and applications."], ["Incident management", "Defined severity levels, response targets and escalation paths."], ["Patch and update management", "Scheduled, tested patching with maintenance windows."], ["Reporting and reviews", "Monthly service reports and regular improvement reviews."]] },
  { slug: "business-continuity", category: "services", title: "Business Continuity", icon: "backup", diagram: "continuity", image: "/images/stock/continuity.jpg", pos: "center 50%",
    eyebrow: "Business Continuity", heroTitle: "Be ready before something goes wrong", heroDesc: "Backup and disaster recovery designed around your recovery time and recovery point objectives.",
    short: "Backup, replication and disaster recovery with tested runbooks.",
    long: "Backups you have never restored are a hope, not a plan. We define RTO and RPO with you, implement backup and replication to match, and rehearse recovery so that when it matters, it works.",
    features: [["RTO / RPO planning", "Recovery targets agreed with the business, not assumed."], ["Offsite and immutable backups", "Copies that survive ransomware and site failure."], ["Replication and failover", "Warm or hot standby for critical systems."], ["Recovery testing", "Scheduled drills with documented results."]] },
  { slug: "ddos-protection", category: "security", title: "DDoS Protection", icon: "shield", diagram: "ddos", image: "/images/hero/firewall-rack.jpg", pos: "center 50%",
    eyebrow: "Network Security", heroTitle: "Keep your services online under attack", heroDesc: "Traffic filtered at the edge so legitimate users stay connected while attacks are absorbed.",
    short: "Always-on volumetric and application-layer DDoS mitigation.",
    long: "Distributed denial-of-service attacks target availability. We place scrubbing and rate-limiting in front of your services, tune detection to your normal traffic profile, and provide a response team for when an attack begins.",
    features: [["Volumetric mitigation", "Large floods absorbed upstream before they reach your network."], ["Application-layer protection", "WAF and behavioural rules for HTTP floods."], ["Traffic baselining", "Detection tuned to your real traffic patterns."], ["Incident response", "Engineers on call when an attack starts."]] },
  { slug: "data-security", category: "security", title: "Data Security", icon: "lock", diagram: "datasec", image: "/images/stock/datasec.jpg", pos: "center 50%",
    eyebrow: "Data Protection", heroTitle: "Protect the data that runs your business", heroDesc: "Encryption, access governance and monitoring across databases, storage and endpoints.",
    short: "Encryption, access control, DLP and audit across your data estate.",
    long: "Data security begins with knowing where sensitive data lives and who can reach it. We classify, encrypt and restrict it, then monitor access so unusual behaviour is caught early.",
    features: [["Encryption at rest and in transit", "Modern ciphers with managed key lifecycle."], ["Access governance", "Least-privilege roles, reviews and privileged access controls."], ["Data loss prevention", "Policies for email, endpoints and cloud storage."], ["Audit and monitoring", "Searchable trails for compliance and investigation."]] },
  { slug: "vapt", category: "security", title: "VAPT", icon: "scan", diagram: "vapt", image: "/images/stock/vapt.jpg", pos: "center 50%",
    eyebrow: "Security Testing", heroTitle: "Find the weaknesses before attackers do", heroDesc: "Vulnerability assessment and penetration testing for applications, networks and cloud environments.",
    short: "Structured vulnerability assessment and penetration testing with clear remediation guidance.",
    long: "Our testers combine automated scanning with manual exploitation to show how real attackers would move through your environment, then deliver prioritised findings your team can act on, with retesting once fixes are in.",
    features: [["Web and API testing", "OWASP-aligned testing of applications and services."], ["Network and infrastructure testing", "External and internal assessments of exposed systems."], ["Cloud configuration review", "Misconfiguration and privilege analysis."], ["Reporting and retest", "Prioritised findings, evidence and verification of fixes."]] },
  { slug: "anti-virus", category: "security", title: "Anti-Virus", icon: "endpoint", diagram: "endpoint", image: "/images/stock/av.jpg", pos: "center 50%",
    eyebrow: "Endpoint Security", heroTitle: "Endpoint and server protection that stays current", heroDesc: "Centrally managed anti-malware and endpoint detection across desktops, laptops and servers.",
    short: "Centrally managed endpoint and server protection with reporting.",
    long: "We deploy and manage endpoint protection across your devices with central policy, automatic updates and alerting, and respond to detections so threats are contained rather than ignored.",
    features: [["Central management", "One console for policy, updates and visibility."], ["Server and endpoint coverage", "Windows, Linux and macOS protection."], ["Detection and response", "Behavioural detection with guided remediation."], ["Compliance reporting", "Coverage and incident reports for audits."]] },
  { slug: "active-directory", category: "security", title: "Active Directory", icon: "identity", diagram: "identity", image: "/images/hero/access-control.jpg", pos: "center 50%",
    eyebrow: "Identity & Access", heroTitle: "Identity is the new perimeter", heroDesc: "Active Directory design, hardening and administration for secure, manageable authentication.",
    short: "AD design, hardening, group policy and hybrid identity with Entra ID.",
    long: "Most breaches involve compromised credentials. We design clean directory structures, apply tiered administration and group policy, secure domain controllers and connect on-premises identity to the cloud.",
    features: [["Directory design", "OU structure, sites and replication that scale."], ["Hardening and tiering", "Reduce the blast radius of compromised accounts."], ["Group policy management", "Consistent, auditable configuration for users and devices."], ["Hybrid identity", "Single sign-on and MFA across cloud and on-premises."]] },
];

const GENERIC = {
  cloud: {
    process: [["Assess", "We review workloads, dependencies, compliance needs and current costs."], ["Design", "Architecture, networking, identity and security controls are designed and agreed."], ["Build and migrate", "Environments are built as code and workloads are moved with tested rollback."], ["Operate", "Monitoring, patching, backup and optimisation by our operations team."]],
    benefits: [["Predictable operations", "Defined SLAs, monitoring and escalation rather than ad-hoc firefighting."], ["Security by design", "Least-privilege access, encryption and logging built into the foundation."], ["One accountable partner", "Architecture, migration and run support from the same team."]],
  },
  workplace: {
    process: [["Discover", "Users, domains, mail flow and data volumes are inventoried."], ["Configure", "Tenant or server is configured with security and policy baselines."], ["Migrate", "Mail and files are moved in planned batches with validation."], ["Support", "Training, administration and helpdesk after go-live."]],
    benefits: [["Minimal disruption", "Planned migrations scheduled around your working hours."], ["Secure by default", "MFA, anti-phishing and mail authentication configured from day one."], ["Responsive support", "Real engineers for administration and user issues."]],
  },
  services: {
    process: [["Assess", "Current-state review, risks and objectives are documented."], ["Plan", "A clear plan with milestones, owners and rollback options."], ["Execute", "Delivery by experienced engineers with regular status reporting."], ["Support", "Handover, documentation and ongoing support."]],
    benefits: [["Lower risk", "Rehearsed changes and documented rollback for every critical step."], ["Transparent delivery", "Regular reporting so you always know where things stand."], ["Experienced engineers", "Hands-on specialists, not just account managers."]],
  },
  security: {
    process: [["Assess exposure", "We map assets, access paths and existing controls."], ["Design controls", "Layered controls are designed against realistic threats."], ["Implement and validate", "Controls are deployed and tested to confirm they work."], ["Monitor and improve", "Continuous monitoring, reporting and periodic review."]],
    benefits: [["Layered protection", "Controls at the edge, network, identity, endpoint and data layers."], ["Actionable findings", "Prioritised recommendations with clear owners and effort."], ["Audit-ready evidence", "Logs and reports that support compliance conversations."]],
  },
} as const;

export function serviceExtras(s: Svc) {
  const g = GENERIC[s.category];
  const faqs: [string, string][] = [
    [`How do you get started with ${s.title}?`, "We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities."],
    ["Will you work with our existing team and tools?", "Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well."],
    ["How is support provided after delivery?", "Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews."],
  ];
  return { process: g.process as unknown as [string, string][], benefits: g.benefits as unknown as [string, string][], faqs };
}

/* ------------------------------ pages ------------------------------ */
export type PageSeed = {
  slug: string; title: string; eyebrow: string; heroTitle: string; heroDesc: string; image: string; pos?: string;
  primary?: [string, string]; secondary?: [string, string]; opacity?: number;
};
export const PAGES: PageSeed[] = [
  { slug: "home", title: "Home", eyebrow: "Cloud · Servers · Security · Managed Services", heroTitle: "Cloud infrastructure built for business", heroDesc: "Secure, scalable and professionally managed infrastructure — from cloud migration and DevOps to security and 24×7 operations.", image: "/images/hero/home-datacenter.jpg", pos: "center 55%", primary: ["Explore Services", "/services/cloud-migration"], secondary: ["Talk to an Expert", "/contact"], opacity: 70 },
  { slug: "about", title: "About Us", eyebrow: "About Us", heroTitle: "Engineers who run real infrastructure", heroDesc: "A technology services company focused on cloud, servers, security and managed operations.", image: "/images/stock/about.jpg", pos: "center 40%", primary: ["Our Services", "/services/managed-services"], secondary: ["Contact Us", "/contact"] },
  { slug: "vision", title: "Vision", eyebrow: "Our Vision", heroTitle: "Infrastructure that businesses can depend on", heroDesc: "Where we are heading, and the standard we hold ourselves to.", image: "/images/hero/vision-corridor.jpg", pos: "center 50%", primary: ["Our Mission", "/mission"] },
  { slug: "mission", title: "Mission", eyebrow: "Our Mission", heroTitle: "People and infrastructure, working together", heroDesc: "How we deliver reliable technology services every day.", image: "/images/stock/mission.jpg", pos: "center 40%", primary: ["Join Our Team", "/careers"] },
  { slug: "news", title: "News", eyebrow: "News & Insights", heroTitle: "News from the operations floor", heroDesc: "Announcements, engineering notes and insights on cloud, security and infrastructure.", image: "/images/stock/news.jpg", pos: "center 45%" },
  { slug: "careers", title: "Careers", eyebrow: "Careers", heroTitle: "Build the infrastructure behind modern businesses", heroDesc: "Join engineers who design, secure and operate real cloud and server environments.", image: "/images/stock/careers.jpg", pos: "center 40%", primary: ["View Open Roles", "#openings"] },
  { slug: "contact", title: "Contact Us", eyebrow: "Contact", heroTitle: "Talk to an infrastructure expert", heroDesc: "Tell us about your environment and what you need. We will respond within one business day.", image: "/images/stock/contact.jpg", pos: "center 50%" },
  { slug: "register", title: "Register", eyebrow: "Customer Portal", heroTitle: "Create your customer account", heroDesc: "Register to request services, track enquiries and manage your details.", image: "/images/stock/register.jpg", pos: "center 50%", opacity: 82 },
  { slug: "login", title: "Sign in", eyebrow: "Customer Portal", heroTitle: "Welcome back", heroDesc: "Sign in to your customer dashboard.", image: "/images/stock/patch.jpg", pos: "center 50%", opacity: 82 },
];

/* Default content blocks for CMS-driven sections (overridable in Admin → Pages). */
export type SectionDefault = { eyebrow?: string; title?: string; body?: string; imageUrl?: string; videoUrl?: string; buttonText?: string; buttonUrl?: string; items?: { title: string; text: string }[] };

export const SECTION_DEFAULTS: Record<string, Record<string, SectionDefault>> = {
  home: {
    story: { eyebrow: "The infrastructure story", title: "Real servers. Real cloud. Real accountability.", body: "Every business application ends up on physical hardware somewhere. We design, build and operate that layer — across public cloud, private cloud and your own racks — with the security and monitoring a production workload deserves.", items: [{ title: "Design", text: "Architecture first, tooling second." }, { title: "Operate", text: "24×7 monitoring and response." }, { title: "Protect", text: "Security built into every layer." }] },
    services: { eyebrow: "Services", title: "Our Marketplaces", body: "Explore products and platforms trusted by our customers and powered by our reliable infrastructure." },
    platforms: { eyebrow: "Cloud platforms", title: "The right platform for each workload", body: "We are platform-pragmatic: public, private or hybrid, chosen on merit." },
    architecture: { eyebrow: "Reference architecture", title: "A resilient, layered production design", body: "Traffic is filtered at the edge, balanced across redundant application nodes, and persisted to replicated data stores with continuous backup." },
    security: { eyebrow: "Security", title: "Defence in depth, from the edge to the data", body: "Layered controls reduce the chance of a breach and limit the damage if one occurs.", imageUrl: "/images/hero/firewall-rack.jpg", buttonText: "Explore security services", buttonUrl: "/security/ddos-protection" },
    migration: { eyebrow: "Migration", title: "Move to the cloud without moving the risk", body: "Our migrations are planned, rehearsed and reversible.", imageUrl: "/images/hero/migration-hall.jpg", buttonText: "Plan a migration", buttonUrl: "/services/cloud-migration" },
    devops: { eyebrow: "DevOps", title: "From commit to production, automated", body: "Pipelines, infrastructure as code and observability that make releases routine and recoveries fast.", buttonText: "Explore DevOps", buttonUrl: "/services/devops" },
    managed: { eyebrow: "Managed infrastructure", title: "A network operations team watching your systems", body: "Monitoring, patching and incident response under clear SLAs, so your engineers can focus on the product.", imageUrl: "/images/hero/noc-wall.jpg", buttonText: "Learn about managed services", buttonUrl: "/services/managed-services" },
    stats: { eyebrow: "At a glance", title: "Operated with discipline", items: [{ title: "24×7", text: "Monitoring and incident response" }, { title: "99.95%", text: "SLA" }, { title: "35", text: "Dedicated Team Members" }, { title: "100+", text: "Businesses Trust Us" }] },
    news: { eyebrow: "News", title: "Latest from 2CCloud" },
    cta: { eyebrow: "Get started", title: "Tell us about your infrastructure", body: "A short conversation with an engineer is the fastest way to find out what you need.", buttonText: "Talk to an Expert", buttonUrl: "/contact", imageUrl: "/images/stock/contact.jpg" },
  },
  about: {
    intro: { eyebrow: "Who we are", title: "A technology services company, run by engineers", body: "Cirrostratus Services Pvt. Ltd., operating as 2CCloud, designs, migrates, secures and operates cloud and server infrastructure for businesses.\n\nWe focus on the unglamorous parts that decide whether technology works: architecture, security, monitoring, backup and support. Our teams work directly with yours, and stay accountable after go-live." },
    image: { imageUrl: "/images/hero/campus-aerial.jpg", title: "Infrastructure, end to end", body: "From racks and networks to cloud platforms and the applications running on them." },
    pillars: { eyebrow: "How we work", title: "What clients can expect", items: [{ title: "Engineering-led", text: "The people who design your environment are the people who understand it." }, { title: "Security first", text: "Controls are part of the design, not an add-on after the fact." }, { title: "Transparent delivery", text: "Clear plans, honest reporting and no surprise costs." }, { title: "Long-term partnership", text: "We measure ourselves by how your systems run a year from now." }] },
  },
  vision: {
    intro: { eyebrow: "Where we are heading", title: "Infrastructure that businesses can simply depend on", body: "We envision a future where every organisation, regardless of size, has access to enterprise-grade infrastructure and security without needing to build a large in-house operations team.\n\nTechnology should be a quiet foundation, not a constant source of risk." },
    pillars: { eyebrow: "Our direction", title: "What we are building towards", items: [{ title: "Reliable by default", text: "Resilience and monitoring as standard." }, { title: "Secure by design", text: "Security embedded across every layer of delivery." }, { title: "Accessible expertise", text: "Specialist skills available to businesses of every size." }] },
  },
  mission: {
    intro: { eyebrow: "What we do every day", title: "Deliver reliable, secure technology services", body: "Our mission is to help organisations run on dependable infrastructure by combining deep engineering skill with clear communication and responsible operations.\n\nWe do this by listening first, designing carefully, building with discipline and supporting what we build." },
    pillars: { eyebrow: "Principles", title: "How the mission shows up", items: [{ title: "Listen first", text: "Understand the business before proposing technology." }, { title: "Build carefully", text: "Test, document and rehearse before changing production." }, { title: "Stay accountable", text: "Own outcomes, including after delivery." }, { title: "Grow our people", text: "Invest in the engineers who serve clients." }] },
  },
  careers: {
    intro: { eyebrow: "Work with us", title: "Engineering work with real consequences", body: "We operate real servers, real clouds and real security for real businesses. If you like understanding how systems work and making them better, you will fit in.", items: [{ title: "Hands-on engineering", text: "Work on production infrastructure from day one." }, { title: "Learning culture", text: "Certification support and time to learn." }, { title: "Clear growth paths", text: "Progression from support to architecture." }] },
  },
  contact: {
    intro: { eyebrow: "Get in touch", title: "Let us understand your environment", body: "Share a few details and an engineer will respond within one business day." },
  },
};

// export const SETTINGS_DEFAULTS: Record<string, string> = {
//   company_name: "Cirrostratus Services Pvt. Ltd.",
//   brand_name: "2CCloud",
//   tagline: "Cloud, server, DevOps and security services",
//   contact_email: "contact@2ccloud.com",
//   contact_phone: "",
//   address: "",
//   header_cta_text: "Contact",
//   header_cta_url: "/contact",
//   footer_blurb: "Cloud, server, DevOps, security and managed services for businesses that depend on their infrastructure.",
//   site_url: "",
//   notify_email: "",
//   linkedin_url: "",
//   twitter_url: "",
//   facebook_url: "",
//   youtube_url: "",
//   default_og_image: "/images/hero/home-datacenter.jpg",
// };

export const SETTINGS_DEFAULTS: Record<string, string> = {
  company_name: "Cirrostratus Services Pvt. Ltd.",
  brand_name: "2CCloud",
  tagline: "Cloud, server, DevOps and security services",
  contact_email: "contact@2ccloud.com",
  contact_phone: "",
  contact_emails: "[]",
  contact_phones: "[]",
  address: "",
  header_cta_text: "Contact",
  header_cta_url: "/contact",
  footer_blurb: "Cloud, server, DevOps, security and managed services for businesses that depend on their infrastructure.",
  site_url: "",
  notify_email: "",
  linkedin_url: "",
  twitter_url: "",
  facebook_url: "",
  youtube_url: "",
  default_og_image: "/images/hero/home-datacenter.jpg",
};

export const MASTER_SEEDS = {
  universities: ["Delhi University", "Jawaharlal Nehru University", "Anna University", "Savitribai Phule Pune University", "University of Mumbai", "Osmania University", "Banaras Hindu University", "Aligarh Muslim University", "Jadavpur University", "Visvesvaraya Technological University", "Rajiv Gandhi Proudyogiki Vishwavidyalaya", "Dr. A.P.J. Abdul Kalam Technical University", "Gujarat Technological University", "Indira Gandhi National Open University"],
  boards: ["CBSE", "ICSE / CISCE", "Bihar School Examination Board", "Jharkhand Academic Council", "UP Board", "Maharashtra State Board", "Tamil Nadu State Board", "West Bengal Board", "Karnataka State Board", "Rajasthan Board", "Gujarat Board", "Madhya Pradesh Board", "NIOS"],
  qualifications: ["Matric", "Intermediate", "Diploma", "Graduation", "Post Graduation / Master's", "PhD", "Other"],
  jobRoles: ["Cloud Engineer", "DevOps Engineer", "System Administrator", "Network Engineer", "Security Analyst", "Technical Support Engineer", "Software Developer", "Sales Executive", "HR Executive", "Other"],
};
