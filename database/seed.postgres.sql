--
-- PostgreSQL database dump
--

\restrict bQiTejyifEdNAOkdRDZHq4y624b8pqvXvviWTKtbE9bdslclgRKrbPTI1iWoQvq

-- Dumped from database version 15.19 (Debian 15.19-0+deb12u1)
-- Dumped by pg_dump version 15.19 (Debian 15.19-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles VALUES (1, 'super_admin', 'Super Admin', '2026-10-06 06:02:52.036532', '2026-10-06 06:02:52.036532');
INSERT INTO public.roles VALUES (2, 'content_editor', 'Content Editor', '2026-10-06 06:02:52.04233', '2026-10-06 06:02:52.04233');
INSERT INTO public.roles VALUES (3, 'hr_manager', 'HR Manager', '2026-10-06 06:02:52.045004', '2026-10-06 06:02:52.045004');
INSERT INTO public.roles VALUES (4, 'support', 'Support', '2026-10-06 06:02:52.046868', '2026-10-06 06:02:52.046868');


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.admins VALUES (1, 'Site Administrator', 'admin@2ccloud.com', 'scrypt$4501bd92e9fd3329318a7015a710ac59$3e628120ace2af4ff5ccf99ee78c6e16939d1affc4d0442c68aa93ab45230fc11bddae3eabea1aa94dfb29b90ed18770b8f30ef553032197a269a492f804e0fc', 1, true, '2026-10-06 06:21:56.478', '2026-10-06 06:02:52.115144', '2026-10-06 06:02:52.115144');


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.jobs VALUES (1, 'cloud-engineer', 'Cloud Engineer', 'Engineering', 'India (hybrid)', 'Full-time', '2–5 years', 1, 'Design, migrate and operate customer workloads on AWS, Azure and Google Cloud.', 'You will join our cloud team to design environments, run migrations and keep production healthy for managed-services customers.', 'Design and build cloud environments using infrastructure as code
Plan and execute server and application migrations
Monitor, patch and improve customer environments
Document architecture and runbooks', 'Hands-on experience with at least one major cloud platform
Solid Linux and networking fundamentals
Experience with Terraform or similar tooling
Clear written and spoken communication', '', '/images/stock/careers.jpg', '', 'active', NULL, '2026-10-06 06:02:52.308088', '2026-10-06 06:02:52.308088');
INSERT INTO public.jobs VALUES (2, 'devops-engineer', 'DevOps Engineer', 'Engineering', 'India (hybrid)', 'Full-time', '3–6 years', 1, 'Build CI/CD pipelines, platform automation and observability for client engineering teams.', 'Work with client teams to automate delivery and improve reliability across their platforms.', 'Build and maintain CI/CD pipelines
Containerise applications and operate Kubernetes clusters
Implement monitoring, logging and alerting
Automate infrastructure with code', 'Experience with Git-based CI/CD tooling
Containers and Kubernetes experience
Scripting in Bash or Python
Understanding of security basics in pipelines', '', '/images/stock/devops.jpg', '', 'active', NULL, '2026-10-06 06:02:52.308088', '2026-10-06 06:02:52.308088');
INSERT INTO public.jobs VALUES (3, 'security-analyst', 'Security Analyst', 'Security', 'India (on-site)', 'Full-time', '2–4 years', 1, 'Run vulnerability assessments, monitor security tooling and support incident response.', 'Support our security services including VAPT, endpoint protection and DDoS response.', 'Perform vulnerability assessments and report findings
Monitor security alerts and triage incidents
Support customer remediation
Maintain security documentation', 'Understanding of networking and common attack techniques
Experience with scanning and testing tools
Structured, accurate reporting
Certifications such as CEH or Security+ are a plus', '', '/images/stock/vapt.jpg', '', 'active', NULL, '2026-10-06 06:02:52.308088', '2026-10-06 06:02:52.308088');


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: applicant_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: applicant_education; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.boards VALUES (1, 'CBSE', true, 0, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (2, 'ICSE / CISCE', true, 1, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (3, 'Bihar School Examination Board', true, 2, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (4, 'Jharkhand Academic Council', true, 3, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (5, 'UP Board', true, 4, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (6, 'Maharashtra State Board', true, 5, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (7, 'Tamil Nadu State Board', true, 6, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (8, 'West Bengal Board', true, 7, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (9, 'Karnataka State Board', true, 8, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (10, 'Rajasthan Board', true, 9, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (11, 'Gujarat Board', true, 10, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (12, 'Madhya Pradesh Board', true, 11, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');
INSERT INTO public.boards VALUES (13, 'NIOS', true, 12, '2026-10-06 06:02:52.301148', '2026-10-06 06:02:52.301148');


--
-- Data for Name: branding_settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.branding_settings VALUES (1, '/brand/logo.svg', '/brand/logo.svg', '/brand/logo-dark.svg', '/brand/favicon.svg', '2026-10-06 06:02:52.127201', '2026-10-06 06:22:12.865');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: contact_queries; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: job_roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.job_roles VALUES (1, 'Cloud Engineer', true, 0, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (2, 'DevOps Engineer', true, 1, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (3, 'System Administrator', true, 2, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (4, 'Network Engineer', true, 3, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (5, 'Security Analyst', true, 4, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (6, 'Technical Support Engineer', true, 5, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (7, 'Software Developer', true, 6, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (8, 'Sales Executive', true, 7, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (9, 'HR Executive', true, 8, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');
INSERT INTO public.job_roles VALUES (10, 'Other', true, 9, '2026-10-06 06:02:52.304606', '2026-10-06 06:02:52.304606');


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.media VALUES (1, 'access control', 'access control', 'image', 'upload', '/images/hero/access-control.jpg', '', 'image/jpeg', 250891, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (2, 'campus aerial', 'campus aerial', 'image', 'upload', '/images/hero/campus-aerial.jpg', '', 'image/jpeg', 273795, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (3, 'firewall rack', 'firewall rack', 'image', 'upload', '/images/hero/firewall-rack.jpg', '', 'image/jpeg', 169063, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (4, 'home datacenter', 'home datacenter', 'image', 'upload', '/images/hero/home-datacenter.jpg', '', 'image/jpeg', 179487, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (5, 'home poster', 'home poster', 'image', 'upload', '/images/hero/home-poster.jpg', '', 'image/jpeg', 279835, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (6, 'mail servers', 'mail servers', 'image', 'upload', '/images/hero/mail-servers.jpg', '', 'image/jpeg', 195870, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (7, 'migration hall', 'migration hall', 'image', 'upload', '/images/hero/migration-hall.jpg', '', 'image/jpeg', 236399, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (8, 'noc wall', 'noc wall', 'image', 'upload', '/images/hero/noc-wall.jpg', '', 'image/jpeg', 176961, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (9, 'vision corridor', 'vision corridor', 'image', 'upload', '/images/hero/vision-corridor.jpg', '', 'image/jpeg', 201414, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (10, 'about', 'about', 'image', 'upload', '/images/stock/about.jpg', '', 'image/jpeg', 580886, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (11, 'av', 'av', 'image', 'upload', '/images/stock/av.jpg', '', 'image/jpeg', 187561, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (12, 'aws', 'aws', 'image', 'upload', '/images/stock/aws.jpg', '', 'image/jpeg', 177838, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (13, 'azure', 'azure', 'image', 'upload', '/images/stock/azure.jpg', '', 'image/jpeg', 204112, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (14, 'cables', 'cables', 'image', 'upload', '/images/stock/cables.jpg', '', 'image/jpeg', 192828, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (15, 'careers', 'careers', 'image', 'upload', '/images/stock/careers.jpg', '', 'image/jpeg', 359567, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (16, 'contact', 'contact', 'image', 'upload', '/images/stock/contact.jpg', '', 'image/jpeg', 238052, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (17, 'continuity', 'continuity', 'image', 'upload', '/images/stock/continuity.jpg', '', 'image/jpeg', 135997, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (18, 'datasec', 'datasec', 'image', 'upload', '/images/stock/datasec.jpg', '', 'image/jpeg', 235637, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (19, 'devops', 'devops', 'image', 'upload', '/images/stock/devops.jpg', '', 'image/jpeg', 143661, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (20, 'fiber', 'fiber', 'image', 'upload', '/images/stock/fiber.jpg', '', 'image/jpeg', 275145, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (21, 'gcp', 'gcp', 'image', 'upload', '/images/stock/gcp.jpg', '', 'image/jpeg', 218641, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (22, 'gws', 'gws', 'image', 'upload', '/images/stock/gws.jpg', '', 'image/jpeg', 244215, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (23, 'm365', 'm365', 'image', 'upload', '/images/stock/m365.jpg', '', 'image/jpeg', 211346, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (24, 'mission', 'mission', 'image', 'upload', '/images/stock/mission.jpg', '', 'image/jpeg', 184713, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (25, 'news', 'news', 'image', 'upload', '/images/stock/news.jpg', '', 'image/jpeg', 257088, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (26, 'noc', 'noc', 'image', 'upload', '/images/stock/noc.jpg', '', 'image/jpeg', 198749, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (27, 'patch', 'patch', 'image', 'upload', '/images/stock/patch.jpg', '', 'image/jpeg', 252380, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (28, 'private', 'private', 'image', 'upload', '/images/stock/private.jpg', '', 'image/jpeg', 155157, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (29, 'public cloud', 'public cloud', 'image', 'upload', '/images/stock/public-cloud.jpg', '', 'image/jpeg', 161822, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (30, 'register', 'register', 'image', 'upload', '/images/stock/register.jpg', '', 'image/jpeg', 459119, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (31, 'vapt', 'vapt', 'image', 'upload', '/images/stock/vapt.jpg', '', 'image/jpeg', 189850, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (32, 'favicon', 'favicon', 'image', 'upload', '/brand/favicon.svg', '', 'image/svg+xml', 856, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (33, 'logo dark', 'logo dark', 'image', 'upload', '/brand/logo-dark.svg', '', 'image/svg+xml', 862, NULL, '2026-10-06 06:02:52.317901');
INSERT INTO public.media VALUES (34, 'logo', 'logo', 'image', 'upload', '/brand/logo.svg', '', 'image/svg+xml', 856, NULL, '2026-10-06 06:02:52.317901');


--
-- Data for Name: news_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.news_categories VALUES (1, 'Insights', 'insights', '2026-10-06 06:02:52.289055', '2026-10-06 06:02:52.289055');
INSERT INTO public.news_categories VALUES (2, 'Engineering', 'engineering', '2026-10-06 06:02:52.289055', '2026-10-06 06:02:52.289055');
INSERT INTO public.news_categories VALUES (3, 'Security', 'security', '2026-10-06 06:02:52.289055', '2026-10-06 06:02:52.289055');
INSERT INTO public.news_categories VALUES (4, 'Company', 'company', '2026-10-06 06:02:52.289055', '2026-10-06 06:02:52.289055');


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.news VALUES (1, 'five-questions-before-a-cloud-migration', 'Five questions to answer before a cloud migration', 'Most migration problems are decided before the first server moves. These are the questions we ask in discovery.', 'Cloud migrations rarely fail because of the target platform. They fail because of surprises: an undocumented dependency, an undersized database, a cutover with no way back.

Before planning any move, we work through five questions with the client.

1. What do you actually run? A reliable inventory of servers, applications and data stores is the foundation of every plan.

2. What talks to what? Dependency mapping shows which systems must move together and which can wait.

3. What does downtime cost? The answer sets the migration method, from a weekend cutover to continuous replication.

4. How will we know it worked? Define validation checks for data and function in advance.

5. How do we go back? A rehearsed rollback plan turns a risky window into a routine one.

Answering these early makes the rest of the project calmer, cheaper and faster.', 1, 'Editorial Team', '/images/hero/migration-hall.jpg', '', '', 'center center', 'published', '2026-09-30 06:02:52.293', true, '2026-10-06 06:02:52.29421', '2026-10-06 06:02:52.29421');
INSERT INTO public.news VALUES (2, 'backups-you-have-never-restored', 'Backups you have never restored are not backups', 'Recovery testing is the difference between having a backup job and having a recovery capability.', 'A green tick on a backup dashboard confirms that a job ran. It does not confirm that your business can recover.

Good recovery practice has three parts: agreed recovery objectives, copies that survive the failure modes you actually face, and regular tests that prove it works.

Start by agreeing a recovery time objective and recovery point objective for each system with the people who rely on it. Keep at least one copy offsite and immutable, so ransomware cannot encrypt it. Then schedule a restore drill, time it, and write down what went wrong.

The first drill almost always finds a gap. Better to find it on a Tuesday afternoon than during an incident.', 2, 'Editorial Team', '/images/stock/continuity.jpg', '', '', 'center center', 'published', '2026-09-18 06:02:52.294', false, '2026-10-06 06:02:52.295113', '2026-10-06 06:02:52.295113');
INSERT INTO public.news VALUES (3, 'layered-ddos-defence', 'Layered DDoS defence: what actually helps', 'No single product stops every attack. A layered approach keeps services reachable under pressure.', 'Denial-of-service attacks come in different shapes: large floods that saturate bandwidth, protocol attacks that exhaust connection tables, and application-layer floods that look like ordinary users.

Effective defence is layered. Upstream scrubbing absorbs volumetric attacks before they reach your network. Rate limiting and a web application firewall handle application-layer floods. Sensible architecture, with caching and redundancy, reduces how much any one component can be hurt.

Just as important is preparation: know your normal traffic, document who to call, and rehearse the response. Detection is only useful if someone acts on it.', 3, 'Editorial Team', '/images/hero/firewall-rack.jpg', '', '', 'center center', 'published', '2026-09-03 06:02:52.296', false, '2026-10-06 06:02:52.297229', '2026-10-06 06:02:52.297229');


--
-- Data for Name: news_images; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pages VALUES (2, 'about', 'About Us', true, 'About Us', 'Engineers who run real infrastructure', 'A technology services company focused on cloud, servers, security and managed operations.', 'Our Services', '/services/managed-services', 'Contact Us', '/contact', 'image', '/images/stock/about.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 40%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (3, 'vision', 'Vision', true, 'Our Vision', 'Infrastructure that businesses can depend on', 'Where we are heading, and the standard we hold ourselves to.', 'Our Mission', '/mission', '', '', 'image', '/images/hero/vision-corridor.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 50%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (4, 'mission', 'Mission', true, 'Our Mission', 'People and infrastructure, working together', 'How we deliver reliable technology services every day.', 'Join Our Team', '/careers', '', '', 'image', '/images/stock/mission.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 40%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (5, 'news', 'News', true, 'News & Insights', 'News from the operations floor', 'Announcements, engineering notes and insights on cloud, security and infrastructure.', '', '', '', '', 'image', '/images/stock/news.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 45%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (6, 'careers', 'Careers', true, 'Careers', 'Build the infrastructure behind modern businesses', 'Join engineers who design, secure and operate real cloud and server environments.', 'View Open Roles', '#openings', '', '', 'image', '/images/stock/careers.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 40%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (7, 'contact', 'Contact Us', true, 'Contact', 'Talk to an infrastructure expert', 'Tell us about your environment and what you need. We will respond within one business day.', '', '', '', '', 'image', '/images/stock/contact.jpg', '', '', '', '#0A1F44', 78, 'left', 600, 'center 50%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (8, 'register', 'Register', true, 'Customer Portal', 'Create your customer account', 'Register to request services, track enquiries and manage your details.', '', '', '', '', 'image', '/images/stock/register.jpg', '', '', '', '#0A1F44', 82, 'left', 440, 'center 50%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (9, 'login', 'Sign in', true, 'Customer Portal', 'Welcome back', 'Sign in to your customer dashboard.', '', '', '', '', 'image', '/images/stock/patch.jpg', '', '', '', '#0A1F44', 82, 'left', 440, 'center 50%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:02:52.136062');
INSERT INTO public.pages VALUES (1, 'home', 'Home', true, 'Cloud · Servers · Security · Managed Services', 'Cloud infrastructure built for business', 'Secure, scalable and professionally managed infrastructure — from cloud migration and DevOps to security and 24×7 operations.', 'Explore Services', '/services/cloud-migration', 'Talk to an Expert', '/contact', 'image', '/images/hero/home-datacenter.jpg', '', '', '', '#0A1F44', 70, 'left', 720, 'center 55%', 'center center', true, true, '2026-10-06 06:02:52.136062', '2026-10-06 06:22:12.881');


--
-- Data for Name: page_sections; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.page_sections VALUES (1, 'home', 'story', '', 'Real servers. Real cloud. Real accountability.', '', '', '', '', '', '{"items": [{"text": "Architecture first.", "title": "Design"}, {"text": "24x7.", "title": "Operate"}, {"text": "Security everywhere.", "title": "Protect"}]}', 0, true, '2026-10-06 06:22:12.883063', '2026-10-06 06:22:12.883063');


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.permissions VALUES (1, 'branding.manage', 'Edit logo and favicon');
INSERT INTO public.permissions VALUES (2, 'settings.manage', 'Edit site settings');
INSERT INTO public.permissions VALUES (3, 'pages.manage', 'Edit pages, heroes and sections');
INSERT INTO public.permissions VALUES (4, 'services.manage', 'Manage services');
INSERT INTO public.permissions VALUES (5, 'news.manage', 'Manage news');
INSERT INTO public.permissions VALUES (6, 'media.manage', 'Manage media library');
INSERT INTO public.permissions VALUES (7, 'seo.manage', 'Manage SEO');
INSERT INTO public.permissions VALUES (8, 'jobs.manage', 'Manage jobs');
INSERT INTO public.permissions VALUES (9, 'applicants.manage', 'Manage applicants');
INSERT INTO public.permissions VALUES (10, 'masters.manage', 'Manage universities, boards, qualifications, roles');
INSERT INTO public.permissions VALUES (11, 'customers.view', 'View and manage customers');
INSERT INTO public.permissions VALUES (12, 'contacts.manage', 'Manage contact enquiries');
INSERT INTO public.permissions VALUES (13, 'audit.view', 'View audit logs');
INSERT INTO public.permissions VALUES (14, 'admins.manage', 'Manage admin users');


--
-- Data for Name: qualifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.qualifications VALUES (1, 'Matric', true, 0, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (2, 'Intermediate', true, 1, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (3, 'Diploma', true, 2, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (4, 'Graduation', true, 3, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (5, 'Post Graduation / Master''s', true, 4, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (6, 'PhD', true, 5, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');
INSERT INTO public.qualifications VALUES (7, 'Other', true, 6, '2026-10-06 06:02:52.303201', '2026-10-06 06:02:52.303201');


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.role_permissions VALUES (1, 1);
INSERT INTO public.role_permissions VALUES (1, 2);
INSERT INTO public.role_permissions VALUES (1, 3);
INSERT INTO public.role_permissions VALUES (1, 4);
INSERT INTO public.role_permissions VALUES (1, 5);
INSERT INTO public.role_permissions VALUES (1, 6);
INSERT INTO public.role_permissions VALUES (1, 7);
INSERT INTO public.role_permissions VALUES (1, 8);
INSERT INTO public.role_permissions VALUES (1, 9);
INSERT INTO public.role_permissions VALUES (1, 10);
INSERT INTO public.role_permissions VALUES (1, 11);
INSERT INTO public.role_permissions VALUES (1, 12);
INSERT INTO public.role_permissions VALUES (1, 13);
INSERT INTO public.role_permissions VALUES (1, 14);
INSERT INTO public.role_permissions VALUES (2, 3);
INSERT INTO public.role_permissions VALUES (2, 4);
INSERT INTO public.role_permissions VALUES (2, 5);
INSERT INTO public.role_permissions VALUES (2, 6);
INSERT INTO public.role_permissions VALUES (2, 7);
INSERT INTO public.role_permissions VALUES (3, 6);
INSERT INTO public.role_permissions VALUES (3, 8);
INSERT INTO public.role_permissions VALUES (3, 9);
INSERT INTO public.role_permissions VALUES (3, 10);
INSERT INTO public.role_permissions VALUES (4, 11);
INSERT INTO public.role_permissions VALUES (4, 12);


--
-- Data for Name: seo_metadata; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.services VALUES (2, 'aws', 'cloud', 'public-cloud', 'AWS', 'Design, migration and managed operations for workloads running on Amazon Web Services.', 'We design AWS environments around the Well-Architected principles: separated accounts, least-privilege IAM, private networking, encrypted storage and automated backups. From EC2 and RDS to containers and serverless, we build what your workload needs and keep it healthy.', 'cloud', '/images/stock/aws.jpg', '/images/stock/aws.jpg', 'cloud', 'Talk to an expert about AWS', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=AWS', 1, false, true, 'Public Cloud · AWS', 'AWS environments, designed and operated properly', 'Well-architected Amazon Web Services deployments with security, resilience and cost control built in.', 'Start a Conversation', '/contact?service=AWS', 'Request a Callback', '/contact', 'image', '/images/stock/aws.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 40%', 'center 40%', true, true, '2026-10-06 06:02:52.145896', '2026-10-06 06:02:52.145896');
INSERT INTO public.services VALUES (3, 'azure', 'cloud', 'public-cloud', 'Azure', 'Azure architecture, hybrid identity and managed operations for Microsoft-centric organisations.', 'Azure fits naturally where Active Directory, Microsoft 365 and Windows Server already live. We build subscriptions, networking and governance that connect cleanly to your existing estate, then migrate and run the workloads on top.', 'cloud', '/images/stock/azure.jpg', '/images/stock/azure.jpg', 'cloud', 'Talk to an expert about Azure', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Azure', 2, false, true, 'Public Cloud · Azure', 'Microsoft Azure for the enterprise estate', 'Azure landing zones, identity integration and managed operations for organisations that run on Microsoft.', 'Start a Conversation', '/contact?service=Azure', 'Request a Callback', '/contact', 'image', '/images/stock/azure.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 55%', 'center 55%', true, true, '2026-10-06 06:02:52.153294', '2026-10-06 06:02:52.153294');
INSERT INTO public.services VALUES (4, 'google-cloud', 'cloud', 'public-cloud', 'Google Cloud', 'Google Cloud design, Kubernetes platforms and managed operations.', 'Google Cloud is a strong platform for container-based and data-heavy applications. We design projects, networking and IAM for clarity, then build GKE, Cloud SQL and data pipelines with monitoring and cost visibility from the start.', 'cloud', '/images/stock/gcp.jpg', '/images/stock/gcp.jpg', 'cloud', 'Talk to an expert about Google Cloud', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Google%20Cloud', 3, false, true, 'Public Cloud · Google Cloud', 'Data-intensive workloads on Google Cloud', 'Scalable compute, containers and analytics platforms engineered and operated by our team.', 'Start a Conversation', '/contact?service=Google%20Cloud', 'Request a Callback', '/contact', 'image', '/images/stock/gcp.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 45%', 'center 45%', true, true, '2026-10-06 06:02:52.15952', '2026-10-06 06:02:52.15952');
INSERT INTO public.services VALUES (5, 'private-cloud', 'cloud', '', 'Private Cloud', 'Dedicated virtualised infrastructure with the agility of cloud and the isolation of your own hardware.', 'Some workloads belong on dedicated hardware: regulated data, predictable heavy compute, latency-sensitive systems. We design and operate private clouds on virtualisation platforms with software-defined storage and networking, secured and monitored like a hyperscaler.', 'server', '/images/stock/private.jpg', '/images/stock/private.jpg', 'private', 'Talk to an expert about Private Cloud', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Private%20Cloud', 4, true, true, 'Private Cloud', 'Dedicated infrastructure, cloud-style operations', 'Isolated, high-performance private cloud environments for workloads that demand control and compliance.', 'Start a Conversation', '/contact?service=Private%20Cloud', 'Request a Callback', '/contact', 'image', '/images/stock/private.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.169412', '2026-10-06 06:02:52.169412');
INSERT INTO public.services VALUES (6, 'hybrid-cloud', 'cloud', '', 'Hybrid Cloud', 'Connect on-premises and cloud environments with secure networking, shared identity and unified monitoring.', 'Hybrid is rarely a destination; it is where most businesses actually live. We connect your data centre and cloud accounts with private links, shared identity and consistent policy so teams can place each workload where it makes most sense.', 'hybrid', '/images/stock/fiber.jpg', '/images/stock/fiber.jpg', 'hybrid', 'Talk to an expert about Hybrid Cloud', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Hybrid%20Cloud', 5, false, true, 'Hybrid Cloud', 'Private and public infrastructure, connected', 'Run sensitive workloads privately and burst to public cloud, managed as one consistent environment.', 'Start a Conversation', '/contact?service=Hybrid%20Cloud', 'Request a Callback', '/contact', 'image', '/images/stock/fiber.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 40%', 'center 40%', true, true, '2026-10-06 06:02:52.177957', '2026-10-06 06:02:52.177957');
INSERT INTO public.services VALUES (7, 'm365', 'workplace', '', 'M365', 'Tenant design, mailbox migration, security hardening and ongoing administration for Microsoft 365.', 'A well-configured Microsoft 365 tenant is the backbone of modern work. We handle licensing, tenant design, conditional access, mail flow and migration, then provide administration and user support so your team just gets on with their work.', 'mail', '/images/stock/m365.jpg', '/images/stock/m365.jpg', 'email', 'Talk to an expert about M365', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=M365', 6, false, true, 'Workplace Mobility', 'Microsoft 365, deployed and managed', 'Email, Teams and SharePoint set up securely, migrated cleanly and supported day to day.', 'Start a Conversation', '/contact?service=M365', 'Request a Callback', '/contact', 'image', '/images/stock/m365.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 40%', 'center 40%', true, true, '2026-10-06 06:02:52.188048', '2026-10-06 06:02:52.188048');
INSERT INTO public.services VALUES (8, 'google-workspace', 'workplace', '', 'Google Workspace', 'Workspace deployment, data migration, domain security and support.', 'We deploy Google Workspace with proper domain authentication, access policies and data controls, migrate mail and files from legacy systems, and provide administration so collaboration works from the first day.', 'mail', '/images/stock/gws.jpg', '/images/stock/gws.jpg', 'email', 'Talk to an expert about Google Workspace', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Google%20Workspace', 7, false, true, 'Workplace Mobility', 'Google Workspace for collaborative teams', 'Gmail, Drive and Meet configured securely and migrated from your existing platform.', 'Start a Conversation', '/contact?service=Google%20Workspace', 'Request a Callback', '/contact', 'image', '/images/stock/gws.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 35%', 'center 35%', true, true, '2026-10-06 06:02:52.196017', '2026-10-06 06:02:52.196017');
INSERT INTO public.services VALUES (9, 'zimbra-email', 'workplace', '', 'Zimbra Email', 'Hosted or on-premises Zimbra with anti-spam, backup and 24×7 monitoring.', 'For organisations that want ownership of their mail data, Zimbra is a proven platform. We deploy and run it with multi-layer spam and malware filtering, encrypted transport, scheduled backups and tested recovery.', 'mail', '/images/hero/mail-servers.jpg', '/images/hero/mail-servers.jpg', 'email', 'Talk to an expert about Zimbra Email', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Zimbra%20Email', 8, false, true, 'Enterprise Email', 'Enterprise email on infrastructure you control', 'Self-hosted Zimbra collaboration, secured, monitored and backed up by our engineers.', 'Start a Conversation', '/contact?service=Zimbra%20Email', 'Request a Callback', '/contact', 'image', '/images/hero/mail-servers.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 45%', 'center 45%', true, true, '2026-10-06 06:02:52.201049', '2026-10-06 06:02:52.201049');
INSERT INTO public.services VALUES (10, 'cloud-migration', 'services', '', 'Cloud Migration', 'Discovery, planning and execution of server, application and data migrations with minimal downtime.', 'Migrations fail on surprises: forgotten dependencies, undersized targets, cutovers with no rollback. We start with discovery and dependency mapping, rehearse the move, and cut over with a tested rollback plan so the business notices as little as possible.', 'migrate', '/images/hero/migration-hall.jpg', '/images/hero/migration-hall.jpg', 'migration', 'Talk to an expert about Cloud Migration', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Cloud%20Migration', 9, true, true, 'Cloud Migration', 'Move your infrastructure with confidence', 'Secure and carefully managed migration for applications, servers and business data.', 'Start a Conversation', '/contact?service=Cloud%20Migration', 'Request a Callback', '/contact', 'image', '/images/hero/migration-hall.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.207874', '2026-10-06 06:02:52.207874');
INSERT INTO public.services VALUES (11, 'devops', 'services', '', 'DevOps', 'CI/CD, infrastructure as code, containers and observability for reliable, repeatable delivery.', 'We help engineering teams automate the path from commit to production: build and test pipelines, security scanning, immutable infrastructure and monitoring that tells you what is wrong before customers do.', 'pipeline', '/images/stock/devops.jpg', '/images/stock/devops.jpg', 'devops', 'Talk to an expert about DevOps', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=DevOps', 10, true, true, 'DevOps Engineering', 'Ship faster without breaking production', 'CI/CD pipelines, infrastructure as code and observability that make delivery routine.', 'Start a Conversation', '/contact?service=DevOps', 'Request a Callback', '/contact', 'image', '/images/stock/devops.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 40%', 'center 40%', true, true, '2026-10-06 06:02:52.214637', '2026-10-06 06:02:52.214637');
INSERT INTO public.services VALUES (12, 'managed-services', 'services', '', 'Managed Services', 'Round-the-clock monitoring, incident response, patching and capacity management.', 'Your engineers should build things, not babysit servers. Our network operations team monitors your infrastructure around the clock, responds to incidents against agreed SLAs, and handles patching, backups and capacity planning.', 'monitor', '/images/hero/noc-wall.jpg', '/images/hero/noc-wall.jpg', 'monitoring', 'Talk to an expert about Managed Services', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Managed%20Services', 11, false, true, 'Managed Services', 'Infrastructure operations, handled', '24×7 monitoring, patching and support from a team that treats your systems as its own.', 'Start a Conversation', '/contact?service=Managed%20Services', 'Request a Callback', '/contact', 'image', '/images/hero/noc-wall.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 45%', 'center 45%', true, true, '2026-10-06 06:02:52.222403', '2026-10-06 06:02:52.222403');
INSERT INTO public.services VALUES (13, 'business-continuity', 'services', '', 'Business Continuity', 'Backup, replication and disaster recovery with tested runbooks.', 'Backups you have never restored are a hope, not a plan. We define RTO and RPO with you, implement backup and replication to match, and rehearse recovery so that when it matters, it works.', 'backup', '/images/stock/continuity.jpg', '/images/stock/continuity.jpg', 'continuity', 'Talk to an expert about Business Continuity', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Business%20Continuity', 12, false, true, 'Business Continuity', 'Be ready before something goes wrong', 'Backup and disaster recovery designed around your recovery time and recovery point objectives.', 'Start a Conversation', '/contact?service=Business%20Continuity', 'Request a Callback', '/contact', 'image', '/images/stock/continuity.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.236755', '2026-10-06 06:02:52.236755');
INSERT INTO public.services VALUES (14, 'ddos-protection', 'security', '', 'DDoS Protection', 'Always-on volumetric and application-layer DDoS mitigation.', 'Distributed denial-of-service attacks target availability. We place scrubbing and rate-limiting in front of your services, tune detection to your normal traffic profile, and provide a response team for when an attack begins.', 'shield', '/images/hero/firewall-rack.jpg', '/images/hero/firewall-rack.jpg', 'ddos', 'Talk to an expert about DDoS Protection', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=DDoS%20Protection', 13, false, true, 'Network Security', 'Keep your services online under attack', 'Traffic filtered at the edge so legitimate users stay connected while attacks are absorbed.', 'Start a Conversation', '/contact?service=DDoS%20Protection', 'Request a Callback', '/contact', 'image', '/images/hero/firewall-rack.jpg', '', '', '', '#071A33', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.247662', '2026-10-06 06:02:52.247662');
INSERT INTO public.services VALUES (15, 'data-security', 'security', '', 'Data Security', 'Encryption, access control, DLP and audit across your data estate.', 'Data security begins with knowing where sensitive data lives and who can reach it. We classify, encrypt and restrict it, then monitor access so unusual behaviour is caught early.', 'lock', '/images/stock/datasec.jpg', '/images/stock/datasec.jpg', 'datasec', 'Talk to an expert about Data Security', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Data%20Security', 14, false, true, 'Data Protection', 'Protect the data that runs your business', 'Encryption, access governance and monitoring across databases, storage and endpoints.', 'Start a Conversation', '/contact?service=Data%20Security', 'Request a Callback', '/contact', 'image', '/images/stock/datasec.jpg', '', '', '', '#071A33', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.261541', '2026-10-06 06:02:52.261541');
INSERT INTO public.services VALUES (16, 'vapt', 'security', '', 'VAPT', 'Structured vulnerability assessment and penetration testing with clear remediation guidance.', 'Our testers combine automated scanning with manual exploitation to show how real attackers would move through your environment, then deliver prioritised findings your team can act on, with retesting once fixes are in.', 'scan', '/images/stock/vapt.jpg', '/images/stock/vapt.jpg', 'vapt', 'Talk to an expert about VAPT', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=VAPT', 15, false, true, 'Security Testing', 'Find the weaknesses before attackers do', 'Vulnerability assessment and penetration testing for applications, networks and cloud environments.', 'Start a Conversation', '/contact?service=VAPT', 'Request a Callback', '/contact', 'image', '/images/stock/vapt.jpg', '', '', '', '#071A33', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.267333', '2026-10-06 06:02:52.267333');
INSERT INTO public.services VALUES (17, 'anti-virus', 'security', '', 'Anti-Virus', 'Centrally managed endpoint and server protection with reporting.', 'We deploy and manage endpoint protection across your devices with central policy, automatic updates and alerting, and respond to detections so threats are contained rather than ignored.', 'endpoint', '/images/stock/av.jpg', '/images/stock/av.jpg', 'endpoint', 'Talk to an expert about Anti-Virus', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Anti-Virus', 16, false, true, 'Endpoint Security', 'Endpoint and server protection that stays current', 'Centrally managed anti-malware and endpoint detection across desktops, laptops and servers.', 'Start a Conversation', '/contact?service=Anti-Virus', 'Request a Callback', '/contact', 'image', '/images/stock/av.jpg', '', '', '', '#071A33', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.278149', '2026-10-06 06:02:52.278149');
INSERT INTO public.services VALUES (18, 'active-directory', 'security', '', 'Active Directory', 'AD design, hardening, group policy and hybrid identity with Entra ID.', 'Most breaches involve compromised credentials. We design clean directory structures, apply tiered administration and group policy, secure domain controllers and connect on-premises identity to the cloud.', 'identity', '/images/hero/access-control.jpg', '/images/hero/access-control.jpg', 'identity', 'Talk to an expert about Active Directory', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Active%20Directory', 17, false, true, 'Identity & Access', 'Identity is the new perimeter', 'Active Directory design, hardening and administration for secure, manageable authentication.', 'Start a Conversation', '/contact?service=Active%20Directory', 'Request a Callback', '/contact', 'image', '/images/hero/access-control.jpg', '', '', '', '#071A33', 80, 'left', 600, 'center 50%', 'center 50%', true, true, '2026-10-06 06:02:52.283405', '2026-10-06 06:02:52.283405');
INSERT INTO public.services VALUES (1, 'public-cloud', 'cloud', '', 'Public Cloud', 'Architecture, deployment and day-to-day operations on AWS, Azure and Google Cloud.', 'Public cloud rewards good design and punishes guesswork. We plan landing zones, networking, identity and cost controls first, then migrate and operate workloads with the monitoring, backup and governance a production business needs.

Whether you are moving your first application or consolidating an estate across providers, our engineers stay accountable from architecture to 24×7 support.', 'cloud', '/images/hero/campus-aerial.jpg', '/images/hero/campus-aerial.jpg', 'cloud', 'Talk to an expert about Public Cloud', 'Share a few details about your environment and an engineer will get back to you within one business day.', 'Start a Conversation', '/contact?service=Public%20Cloud', 0, true, true, 'Cloud Infrastructure', 'Cloud infrastructure built for business', 'Secure, scalable and professionally managed public cloud environments for modern businesses.', 'Start a Conversation', '/contact?service=Public%20Cloud', 'Request a Callback', '/contact', 'image', '/images/hero/campus-aerial.jpg', '', '', '', '#0A1F44', 80, 'left', 600, 'center center', 'center center', true, true, '2026-10-06 06:02:52.138566', '2026-10-06 06:21:56.673');


--
-- Data for Name: service_benefits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_benefits VALUES (1, 1, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (2, 1, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (3, 1, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (4, 2, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (5, 2, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (6, 2, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (7, 3, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (8, 3, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (9, 3, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (10, 4, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (11, 4, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (12, 4, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (13, 5, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (14, 5, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (15, 5, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (16, 6, 'Predictable operations', 'Defined SLAs, monitoring and escalation rather than ad-hoc firefighting.', 0);
INSERT INTO public.service_benefits VALUES (17, 6, 'Security by design', 'Least-privilege access, encryption and logging built into the foundation.', 1);
INSERT INTO public.service_benefits VALUES (18, 6, 'One accountable partner', 'Architecture, migration and run support from the same team.', 2);
INSERT INTO public.service_benefits VALUES (19, 7, 'Minimal disruption', 'Planned migrations scheduled around your working hours.', 0);
INSERT INTO public.service_benefits VALUES (20, 7, 'Secure by default', 'MFA, anti-phishing and mail authentication configured from day one.', 1);
INSERT INTO public.service_benefits VALUES (21, 7, 'Responsive support', 'Real engineers for administration and user issues.', 2);
INSERT INTO public.service_benefits VALUES (22, 8, 'Minimal disruption', 'Planned migrations scheduled around your working hours.', 0);
INSERT INTO public.service_benefits VALUES (23, 8, 'Secure by default', 'MFA, anti-phishing and mail authentication configured from day one.', 1);
INSERT INTO public.service_benefits VALUES (24, 8, 'Responsive support', 'Real engineers for administration and user issues.', 2);
INSERT INTO public.service_benefits VALUES (25, 9, 'Minimal disruption', 'Planned migrations scheduled around your working hours.', 0);
INSERT INTO public.service_benefits VALUES (26, 9, 'Secure by default', 'MFA, anti-phishing and mail authentication configured from day one.', 1);
INSERT INTO public.service_benefits VALUES (27, 9, 'Responsive support', 'Real engineers for administration and user issues.', 2);
INSERT INTO public.service_benefits VALUES (28, 10, 'Lower risk', 'Rehearsed changes and documented rollback for every critical step.', 0);
INSERT INTO public.service_benefits VALUES (29, 10, 'Transparent delivery', 'Regular reporting so you always know where things stand.', 1);
INSERT INTO public.service_benefits VALUES (30, 10, 'Experienced engineers', 'Hands-on specialists, not just account managers.', 2);
INSERT INTO public.service_benefits VALUES (31, 11, 'Lower risk', 'Rehearsed changes and documented rollback for every critical step.', 0);
INSERT INTO public.service_benefits VALUES (32, 11, 'Transparent delivery', 'Regular reporting so you always know where things stand.', 1);
INSERT INTO public.service_benefits VALUES (33, 11, 'Experienced engineers', 'Hands-on specialists, not just account managers.', 2);
INSERT INTO public.service_benefits VALUES (34, 12, 'Lower risk', 'Rehearsed changes and documented rollback for every critical step.', 0);
INSERT INTO public.service_benefits VALUES (35, 12, 'Transparent delivery', 'Regular reporting so you always know where things stand.', 1);
INSERT INTO public.service_benefits VALUES (36, 12, 'Experienced engineers', 'Hands-on specialists, not just account managers.', 2);
INSERT INTO public.service_benefits VALUES (37, 13, 'Lower risk', 'Rehearsed changes and documented rollback for every critical step.', 0);
INSERT INTO public.service_benefits VALUES (38, 13, 'Transparent delivery', 'Regular reporting so you always know where things stand.', 1);
INSERT INTO public.service_benefits VALUES (39, 13, 'Experienced engineers', 'Hands-on specialists, not just account managers.', 2);
INSERT INTO public.service_benefits VALUES (40, 14, 'Layered protection', 'Controls at the edge, network, identity, endpoint and data layers.', 0);
INSERT INTO public.service_benefits VALUES (41, 14, 'Actionable findings', 'Prioritised recommendations with clear owners and effort.', 1);
INSERT INTO public.service_benefits VALUES (42, 14, 'Audit-ready evidence', 'Logs and reports that support compliance conversations.', 2);
INSERT INTO public.service_benefits VALUES (43, 15, 'Layered protection', 'Controls at the edge, network, identity, endpoint and data layers.', 0);
INSERT INTO public.service_benefits VALUES (44, 15, 'Actionable findings', 'Prioritised recommendations with clear owners and effort.', 1);
INSERT INTO public.service_benefits VALUES (45, 15, 'Audit-ready evidence', 'Logs and reports that support compliance conversations.', 2);
INSERT INTO public.service_benefits VALUES (46, 16, 'Layered protection', 'Controls at the edge, network, identity, endpoint and data layers.', 0);
INSERT INTO public.service_benefits VALUES (47, 16, 'Actionable findings', 'Prioritised recommendations with clear owners and effort.', 1);
INSERT INTO public.service_benefits VALUES (48, 16, 'Audit-ready evidence', 'Logs and reports that support compliance conversations.', 2);
INSERT INTO public.service_benefits VALUES (49, 17, 'Layered protection', 'Controls at the edge, network, identity, endpoint and data layers.', 0);
INSERT INTO public.service_benefits VALUES (50, 17, 'Actionable findings', 'Prioritised recommendations with clear owners and effort.', 1);
INSERT INTO public.service_benefits VALUES (51, 17, 'Audit-ready evidence', 'Logs and reports that support compliance conversations.', 2);
INSERT INTO public.service_benefits VALUES (52, 18, 'Layered protection', 'Controls at the edge, network, identity, endpoint and data layers.', 0);
INSERT INTO public.service_benefits VALUES (53, 18, 'Actionable findings', 'Prioritised recommendations with clear owners and effort.', 1);
INSERT INTO public.service_benefits VALUES (54, 18, 'Audit-ready evidence', 'Logs and reports that support compliance conversations.', 2);


--
-- Data for Name: service_faqs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_faqs VALUES (4, 2, 'How do you get started with AWS?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (5, 2, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (6, 2, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (7, 3, 'How do you get started with Azure?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (8, 3, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (9, 3, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (10, 4, 'How do you get started with Google Cloud?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (11, 4, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (12, 4, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (13, 5, 'How do you get started with Private Cloud?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (14, 5, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (15, 5, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (16, 6, 'How do you get started with Hybrid Cloud?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (17, 6, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (18, 6, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (19, 7, 'How do you get started with M365?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (20, 7, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (21, 7, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (22, 8, 'How do you get started with Google Workspace?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (23, 8, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (24, 8, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (25, 9, 'How do you get started with Zimbra Email?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (26, 9, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (27, 9, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (28, 10, 'How do you get started with Cloud Migration?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (29, 10, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (30, 10, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (31, 11, 'How do you get started with DevOps?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (32, 11, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (33, 11, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (34, 12, 'How do you get started with Managed Services?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (35, 12, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (36, 12, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (37, 13, 'How do you get started with Business Continuity?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (38, 13, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (39, 13, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (40, 14, 'How do you get started with DDoS Protection?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (41, 14, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (42, 14, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (43, 15, 'How do you get started with Data Security?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (44, 15, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (45, 15, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (46, 16, 'How do you get started with VAPT?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (47, 16, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (48, 16, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (49, 17, 'How do you get started with Anti-Virus?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (50, 17, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (51, 17, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (52, 18, 'How do you get started with Active Directory?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (53, 18, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (54, 18, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);
INSERT INTO public.service_faqs VALUES (56, 1, 'How do you get started with Public Cloud?', 'We begin with a short discovery conversation and an assessment of your current environment, then propose a scoped plan with timelines and responsibilities.', 0);
INSERT INTO public.service_faqs VALUES (57, 1, 'Will you work with our existing team and tools?', 'Yes. We can run the whole service or work alongside your engineers, adopting your processes and tooling where they already work well.', 1);
INSERT INTO public.service_faqs VALUES (58, 1, 'How is support provided after delivery?', 'Support is provided under an agreed SLA with defined response times, a named escalation path and regular service reviews.', 2);


--
-- Data for Name: service_features; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_features VALUES (1, 1, 'feature', 'Landing zone design', 'Accounts, networking, identity and guardrails designed before the first workload moves.', 0);
INSERT INTO public.service_features VALUES (2, 1, 'feature', 'Right-sized capacity', 'Compute, storage and database sizing based on measured utilisation, not estimates.', 1);
INSERT INTO public.service_features VALUES (3, 1, 'feature', 'Cost governance', 'Budgets, tagging and reporting so cloud spend stays predictable.', 2);
INSERT INTO public.service_features VALUES (4, 1, 'feature', 'Operations and monitoring', 'Patching, backup, alerting and incident response handled by our team.', 3);
INSERT INTO public.service_features VALUES (5, 1, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (6, 1, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (7, 1, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (8, 1, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (9, 2, 'feature', 'Multi-account structure', 'Production, staging and security accounts with central logging and guardrails.', 0);
INSERT INTO public.service_features VALUES (10, 2, 'feature', 'Compute and containers', 'EC2, ECS/EKS and serverless sized and automated for your workloads.', 1);
INSERT INTO public.service_features VALUES (11, 2, 'feature', 'Managed databases', 'RDS and Aurora with replication, backups and tested recovery.', 2);
INSERT INTO public.service_features VALUES (12, 2, 'feature', 'Security and compliance', 'IAM, KMS, GuardDuty-style monitoring and audit-ready logging.', 3);
INSERT INTO public.service_features VALUES (13, 2, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (14, 2, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (15, 2, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (16, 2, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (17, 3, 'feature', 'Landing zones', 'Subscriptions, management groups, policy and hub-spoke networking.', 0);
INSERT INTO public.service_features VALUES (18, 3, 'feature', 'Hybrid identity', 'Entra ID integration with on-premises Active Directory.', 1);
INSERT INTO public.service_features VALUES (19, 3, 'feature', 'IaaS and PaaS', 'Virtual machines, App Service and managed SQL sized for the job.', 2);
INSERT INTO public.service_features VALUES (20, 3, 'feature', 'Backup and recovery', 'Azure Backup and Site Recovery with documented runbooks.', 3);
INSERT INTO public.service_features VALUES (21, 3, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (22, 3, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (23, 3, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (24, 3, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (25, 4, 'feature', 'Project and IAM design', 'Organisation structure and least-privilege access from day one.', 0);
INSERT INTO public.service_features VALUES (26, 4, 'feature', 'Kubernetes platforms', 'GKE clusters with autoscaling, ingress and observability.', 1);
INSERT INTO public.service_features VALUES (27, 4, 'feature', 'Managed data services', 'Cloud SQL, storage and pipelines with backup policies.', 2);
INSERT INTO public.service_features VALUES (28, 4, 'feature', 'Cost visibility', 'Budgets and labelling that make spend explainable.', 3);
INSERT INTO public.service_features VALUES (29, 4, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (30, 4, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (31, 4, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (32, 4, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (33, 5, 'feature', 'Dedicated resources', 'No noisy neighbours: compute and storage reserved for your workloads.', 0);
INSERT INTO public.service_features VALUES (34, 5, 'feature', 'Virtualisation platform', 'Hypervisor clusters with high availability and live migration.', 1);
INSERT INTO public.service_features VALUES (35, 5, 'feature', 'Network isolation', 'Segmented VLANs, firewalls and private connectivity.', 2);
INSERT INTO public.service_features VALUES (36, 5, 'feature', 'Managed lifecycle', 'Patching, capacity planning and hardware support included.', 3);
INSERT INTO public.service_features VALUES (37, 5, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (38, 5, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (39, 5, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (40, 5, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (41, 6, 'feature', 'Private connectivity', 'Site-to-site VPN and dedicated links between environments.', 0);
INSERT INTO public.service_features VALUES (42, 6, 'feature', 'Shared identity', 'One directory and access model across private and public.', 1);
INSERT INTO public.service_features VALUES (43, 6, 'feature', 'Unified monitoring', 'A single view of health, capacity and cost.', 2);
INSERT INTO public.service_features VALUES (44, 6, 'feature', 'Workload placement', 'Guidance on what runs where, and why.', 3);
INSERT INTO public.service_features VALUES (45, 6, 'process', 'Assess', 'We review workloads, dependencies, compliance needs and current costs.', 0);
INSERT INTO public.service_features VALUES (46, 6, 'process', 'Design', 'Architecture, networking, identity and security controls are designed and agreed.', 1);
INSERT INTO public.service_features VALUES (47, 6, 'process', 'Build and migrate', 'Environments are built as code and workloads are moved with tested rollback.', 2);
INSERT INTO public.service_features VALUES (48, 6, 'process', 'Operate', 'Monitoring, patching, backup and optimisation by our operations team.', 3);
INSERT INTO public.service_features VALUES (49, 7, 'feature', 'Tenant setup', 'Domains, licensing, groups and policies configured to best practice.', 0);
INSERT INTO public.service_features VALUES (50, 7, 'feature', 'Mailbox migration', 'Staged or cutover migration with minimal disruption.', 1);
INSERT INTO public.service_features VALUES (51, 7, 'feature', 'Security baseline', 'MFA, conditional access, anti-phishing and device policy.', 2);
INSERT INTO public.service_features VALUES (52, 7, 'feature', 'Ongoing administration', 'Onboarding, offboarding, licences and helpdesk support.', 3);
INSERT INTO public.service_features VALUES (53, 7, 'process', 'Discover', 'Users, domains, mail flow and data volumes are inventoried.', 0);
INSERT INTO public.service_features VALUES (54, 7, 'process', 'Configure', 'Tenant or server is configured with security and policy baselines.', 1);
INSERT INTO public.service_features VALUES (55, 7, 'process', 'Migrate', 'Mail and files are moved in planned batches with validation.', 2);
INSERT INTO public.service_features VALUES (56, 7, 'process', 'Support', 'Training, administration and helpdesk after go-live.', 3);
INSERT INTO public.service_features VALUES (57, 8, 'feature', 'Domain and mail authentication', 'SPF, DKIM and DMARC configured to protect your brand.', 0);
INSERT INTO public.service_features VALUES (58, 8, 'feature', 'Data migration', 'Mail, calendar, contacts and Drive content moved reliably.', 1);
INSERT INTO public.service_features VALUES (59, 8, 'feature', 'Admin policies', 'Sharing, device and security policies tailored to your organisation.', 2);
INSERT INTO public.service_features VALUES (60, 8, 'feature', 'User support', 'Training and responsive helpdesk for your team.', 3);
INSERT INTO public.service_features VALUES (61, 8, 'process', 'Discover', 'Users, domains, mail flow and data volumes are inventoried.', 0);
INSERT INTO public.service_features VALUES (62, 8, 'process', 'Configure', 'Tenant or server is configured with security and policy baselines.', 1);
INSERT INTO public.service_features VALUES (63, 8, 'process', 'Migrate', 'Mail and files are moved in planned batches with validation.', 2);
INSERT INTO public.service_features VALUES (64, 8, 'process', 'Support', 'Training, administration and helpdesk after go-live.', 3);
INSERT INTO public.service_features VALUES (65, 9, 'feature', 'Dedicated mail infrastructure', 'Sized for your mailbox count and retention needs.', 0);
INSERT INTO public.service_features VALUES (66, 9, 'feature', 'Anti-spam and anti-malware', 'Layered filtering with reputation and content checks.', 1);
INSERT INTO public.service_features VALUES (67, 9, 'feature', 'Backup and archiving', 'Scheduled backups with point-in-time restoration.', 2);
INSERT INTO public.service_features VALUES (68, 9, 'feature', 'Migration from legacy mail', 'IMAP and server-to-server migration with validation.', 3);
INSERT INTO public.service_features VALUES (69, 9, 'process', 'Discover', 'Users, domains, mail flow and data volumes are inventoried.', 0);
INSERT INTO public.service_features VALUES (70, 9, 'process', 'Configure', 'Tenant or server is configured with security and policy baselines.', 1);
INSERT INTO public.service_features VALUES (71, 9, 'process', 'Migrate', 'Mail and files are moved in planned batches with validation.', 2);
INSERT INTO public.service_features VALUES (72, 9, 'process', 'Support', 'Training, administration and helpdesk after go-live.', 3);
INSERT INTO public.service_features VALUES (73, 10, 'feature', 'Discovery and dependency mapping', 'Know what you run, what talks to what, and what can wait.', 0);
INSERT INTO public.service_features VALUES (74, 10, 'feature', 'Rehearsed cutovers', 'Test migrations and rollback plans before the real window.', 1);
INSERT INTO public.service_features VALUES (75, 10, 'feature', 'Data integrity checks', 'Verification at source and target, with reconciliation reports.', 2);
INSERT INTO public.service_features VALUES (76, 10, 'feature', 'Post-migration hypercare', 'Dedicated support while the new environment settles.', 3);
INSERT INTO public.service_features VALUES (77, 10, 'process', 'Assess', 'Current-state review, risks and objectives are documented.', 0);
INSERT INTO public.service_features VALUES (78, 10, 'process', 'Plan', 'A clear plan with milestones, owners and rollback options.', 1);
INSERT INTO public.service_features VALUES (79, 10, 'process', 'Execute', 'Delivery by experienced engineers with regular status reporting.', 2);
INSERT INTO public.service_features VALUES (80, 10, 'process', 'Support', 'Handover, documentation and ongoing support.', 3);
INSERT INTO public.service_features VALUES (81, 11, 'feature', 'CI/CD pipelines', 'Automated build, test, scan and deploy workflows.', 0);
INSERT INTO public.service_features VALUES (82, 11, 'feature', 'Infrastructure as code', 'Terraform and configuration management under version control.', 1);
INSERT INTO public.service_features VALUES (83, 11, 'feature', 'Containers and Kubernetes', 'Packaging, orchestration and safe rollout strategies.', 2);
INSERT INTO public.service_features VALUES (84, 11, 'feature', 'Observability', 'Metrics, logs and traces with actionable alerting.', 3);
INSERT INTO public.service_features VALUES (85, 11, 'process', 'Assess', 'Current-state review, risks and objectives are documented.', 0);
INSERT INTO public.service_features VALUES (86, 11, 'process', 'Plan', 'A clear plan with milestones, owners and rollback options.', 1);
INSERT INTO public.service_features VALUES (87, 11, 'process', 'Execute', 'Delivery by experienced engineers with regular status reporting.', 2);
INSERT INTO public.service_features VALUES (88, 11, 'process', 'Support', 'Handover, documentation and ongoing support.', 3);
INSERT INTO public.service_features VALUES (89, 12, 'feature', '24×7 monitoring', 'Proactive alerting across servers, network and applications.', 0);
INSERT INTO public.service_features VALUES (90, 12, 'feature', 'Incident management', 'Defined severity levels, response targets and escalation paths.', 1);
INSERT INTO public.service_features VALUES (91, 12, 'feature', 'Patch and update management', 'Scheduled, tested patching with maintenance windows.', 2);
INSERT INTO public.service_features VALUES (92, 12, 'feature', 'Reporting and reviews', 'Monthly service reports and regular improvement reviews.', 3);
INSERT INTO public.service_features VALUES (93, 12, 'process', 'Assess', 'Current-state review, risks and objectives are documented.', 0);
INSERT INTO public.service_features VALUES (94, 12, 'process', 'Plan', 'A clear plan with milestones, owners and rollback options.', 1);
INSERT INTO public.service_features VALUES (95, 12, 'process', 'Execute', 'Delivery by experienced engineers with regular status reporting.', 2);
INSERT INTO public.service_features VALUES (96, 12, 'process', 'Support', 'Handover, documentation and ongoing support.', 3);
INSERT INTO public.service_features VALUES (97, 13, 'feature', 'RTO / RPO planning', 'Recovery targets agreed with the business, not assumed.', 0);
INSERT INTO public.service_features VALUES (98, 13, 'feature', 'Offsite and immutable backups', 'Copies that survive ransomware and site failure.', 1);
INSERT INTO public.service_features VALUES (99, 13, 'feature', 'Replication and failover', 'Warm or hot standby for critical systems.', 2);
INSERT INTO public.service_features VALUES (100, 13, 'feature', 'Recovery testing', 'Scheduled drills with documented results.', 3);
INSERT INTO public.service_features VALUES (101, 13, 'process', 'Assess', 'Current-state review, risks and objectives are documented.', 0);
INSERT INTO public.service_features VALUES (102, 13, 'process', 'Plan', 'A clear plan with milestones, owners and rollback options.', 1);
INSERT INTO public.service_features VALUES (103, 13, 'process', 'Execute', 'Delivery by experienced engineers with regular status reporting.', 2);
INSERT INTO public.service_features VALUES (104, 13, 'process', 'Support', 'Handover, documentation and ongoing support.', 3);
INSERT INTO public.service_features VALUES (105, 14, 'feature', 'Volumetric mitigation', 'Large floods absorbed upstream before they reach your network.', 0);
INSERT INTO public.service_features VALUES (106, 14, 'feature', 'Application-layer protection', 'WAF and behavioural rules for HTTP floods.', 1);
INSERT INTO public.service_features VALUES (107, 14, 'feature', 'Traffic baselining', 'Detection tuned to your real traffic patterns.', 2);
INSERT INTO public.service_features VALUES (108, 14, 'feature', 'Incident response', 'Engineers on call when an attack starts.', 3);
INSERT INTO public.service_features VALUES (109, 14, 'process', 'Assess exposure', 'We map assets, access paths and existing controls.', 0);
INSERT INTO public.service_features VALUES (110, 14, 'process', 'Design controls', 'Layered controls are designed against realistic threats.', 1);
INSERT INTO public.service_features VALUES (111, 14, 'process', 'Implement and validate', 'Controls are deployed and tested to confirm they work.', 2);
INSERT INTO public.service_features VALUES (112, 14, 'process', 'Monitor and improve', 'Continuous monitoring, reporting and periodic review.', 3);
INSERT INTO public.service_features VALUES (113, 15, 'feature', 'Encryption at rest and in transit', 'Modern ciphers with managed key lifecycle.', 0);
INSERT INTO public.service_features VALUES (114, 15, 'feature', 'Access governance', 'Least-privilege roles, reviews and privileged access controls.', 1);
INSERT INTO public.service_features VALUES (115, 15, 'feature', 'Data loss prevention', 'Policies for email, endpoints and cloud storage.', 2);
INSERT INTO public.service_features VALUES (116, 15, 'feature', 'Audit and monitoring', 'Searchable trails for compliance and investigation.', 3);
INSERT INTO public.service_features VALUES (117, 15, 'process', 'Assess exposure', 'We map assets, access paths and existing controls.', 0);
INSERT INTO public.service_features VALUES (118, 15, 'process', 'Design controls', 'Layered controls are designed against realistic threats.', 1);
INSERT INTO public.service_features VALUES (119, 15, 'process', 'Implement and validate', 'Controls are deployed and tested to confirm they work.', 2);
INSERT INTO public.service_features VALUES (120, 15, 'process', 'Monitor and improve', 'Continuous monitoring, reporting and periodic review.', 3);
INSERT INTO public.service_features VALUES (121, 16, 'feature', 'Web and API testing', 'OWASP-aligned testing of applications and services.', 0);
INSERT INTO public.service_features VALUES (122, 16, 'feature', 'Network and infrastructure testing', 'External and internal assessments of exposed systems.', 1);
INSERT INTO public.service_features VALUES (123, 16, 'feature', 'Cloud configuration review', 'Misconfiguration and privilege analysis.', 2);
INSERT INTO public.service_features VALUES (124, 16, 'feature', 'Reporting and retest', 'Prioritised findings, evidence and verification of fixes.', 3);
INSERT INTO public.service_features VALUES (125, 16, 'process', 'Assess exposure', 'We map assets, access paths and existing controls.', 0);
INSERT INTO public.service_features VALUES (126, 16, 'process', 'Design controls', 'Layered controls are designed against realistic threats.', 1);
INSERT INTO public.service_features VALUES (127, 16, 'process', 'Implement and validate', 'Controls are deployed and tested to confirm they work.', 2);
INSERT INTO public.service_features VALUES (128, 16, 'process', 'Monitor and improve', 'Continuous monitoring, reporting and periodic review.', 3);
INSERT INTO public.service_features VALUES (129, 17, 'feature', 'Central management', 'One console for policy, updates and visibility.', 0);
INSERT INTO public.service_features VALUES (130, 17, 'feature', 'Server and endpoint coverage', 'Windows, Linux and macOS protection.', 1);
INSERT INTO public.service_features VALUES (131, 17, 'feature', 'Detection and response', 'Behavioural detection with guided remediation.', 2);
INSERT INTO public.service_features VALUES (132, 17, 'feature', 'Compliance reporting', 'Coverage and incident reports for audits.', 3);
INSERT INTO public.service_features VALUES (133, 17, 'process', 'Assess exposure', 'We map assets, access paths and existing controls.', 0);
INSERT INTO public.service_features VALUES (134, 17, 'process', 'Design controls', 'Layered controls are designed against realistic threats.', 1);
INSERT INTO public.service_features VALUES (135, 17, 'process', 'Implement and validate', 'Controls are deployed and tested to confirm they work.', 2);
INSERT INTO public.service_features VALUES (136, 17, 'process', 'Monitor and improve', 'Continuous monitoring, reporting and periodic review.', 3);
INSERT INTO public.service_features VALUES (137, 18, 'feature', 'Directory design', 'OU structure, sites and replication that scale.', 0);
INSERT INTO public.service_features VALUES (138, 18, 'feature', 'Hardening and tiering', 'Reduce the blast radius of compromised accounts.', 1);
INSERT INTO public.service_features VALUES (139, 18, 'feature', 'Group policy management', 'Consistent, auditable configuration for users and devices.', 2);
INSERT INTO public.service_features VALUES (140, 18, 'feature', 'Hybrid identity', 'Single sign-on and MFA across cloud and on-premises.', 3);
INSERT INTO public.service_features VALUES (141, 18, 'process', 'Assess exposure', 'We map assets, access paths and existing controls.', 0);
INSERT INTO public.service_features VALUES (142, 18, 'process', 'Design controls', 'Layered controls are designed against realistic threats.', 1);
INSERT INTO public.service_features VALUES (143, 18, 'process', 'Implement and validate', 'Controls are deployed and tested to confirm they work.', 2);
INSERT INTO public.service_features VALUES (144, 18, 'process', 'Monitor and improve', 'Continuous monitoring, reporting and periodic review.', 3);


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.site_settings VALUES (1, 'company_name', 'Cirrostratus Services Pvt. Ltd.', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (2, 'brand_name', '2CCloud', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (3, 'tagline', 'Cloud, server, DevOps and security services', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (4, 'contact_email', 'contact@2ccloud.com', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (5, 'contact_phone', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (6, 'address', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (7, 'header_cta_text', 'Contact', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (8, 'header_cta_url', '/contact', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (9, 'footer_blurb', 'Cloud, server, DevOps, security and managed services for businesses that depend on their infrastructure.', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (10, 'site_url', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (11, 'notify_email', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (12, 'linkedin_url', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (13, 'twitter_url', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (14, 'facebook_url', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (15, 'youtube_url', '', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');
INSERT INTO public.site_settings VALUES (16, 'default_og_image', '/images/hero/home-datacenter.jpg', '2026-10-06 06:02:52.129575', '2026-10-06 06:02:52.129575');


--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.universities VALUES (1, 'Delhi University', true, 0, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (2, 'Jawaharlal Nehru University', true, 1, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (3, 'Anna University', true, 2, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (4, 'Savitribai Phule Pune University', true, 3, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (5, 'University of Mumbai', true, 4, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (6, 'Osmania University', true, 5, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (7, 'Banaras Hindu University', true, 6, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (8, 'Aligarh Muslim University', true, 7, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (9, 'Jadavpur University', true, 8, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (10, 'Visvesvaraya Technological University', true, 9, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (11, 'Rajiv Gandhi Proudyogiki Vishwavidyalaya', true, 10, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (12, 'Dr. A.P.J. Abdul Kalam Technical University', true, 11, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (13, 'Gujarat Technological University', true, 12, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');
INSERT INTO public.universities VALUES (14, 'Indira Gandhi National Open University', true, 13, '2026-10-06 06:02:52.298965', '2026-10-06 06:02:52.298965');


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: applicant_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.applicant_documents_id_seq', 2, true);


--
-- Name: applicant_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.applicant_education_id_seq', 3, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 13, true);


--
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.boards_id_seq', 13, true);


--
-- Name: branding_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.branding_settings_id_seq', 1, true);


--
-- Name: contact_queries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_queries_id_seq', 2, true);


--
-- Name: email_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_logs_id_seq', 6, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 1, true);


--
-- Name: job_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_roles_id_seq', 10, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 3, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 35, true);


--
-- Name: news_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_categories_id_seq', 4, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_seq', 3, true);


--
-- Name: news_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_images_id_seq', 1, false);


--
-- Name: page_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_sections_id_seq', 1, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pages_id_seq', 9, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 14, true);


--
-- Name: qualifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.qualifications_id_seq', 7, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: seo_metadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.seo_metadata_id_seq', 1, false);


--
-- Name: service_benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_benefits_id_seq', 54, true);


--
-- Name: service_faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_faqs_id_seq', 58, true);


--
-- Name: service_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_features_id_seq', 144, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 18, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 16, true);


--
-- Name: universities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.universities_id_seq', 16, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict bQiTejyifEdNAOkdRDZHq4y624b8pqvXvviWTKtbE9bdslclgRKrbPTI1iWoQvq

