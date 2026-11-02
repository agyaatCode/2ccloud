CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"email" varchar(190) NOT NULL,
	"password_hash" text NOT NULL,
	"role_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "applicant_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"doc_type" varchar(20) NOT NULL,
	"original_name" text NOT NULL,
	"stored_path" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applicant_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"level" varchar(30) NOT NULL,
	"institution" varchar(220) DEFAULT '' NOT NULL,
	"year" varchar(8) DEFAULT '' NOT NULL,
	"score" varchar(20) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_type" varchar(10) DEFAULT 'admin' NOT NULL,
	"actor_id" integer,
	"actor_name" varchar(140) DEFAULT '' NOT NULL,
	"action" varchar(60) NOT NULL,
	"entity_type" varchar(60) DEFAULT '' NOT NULL,
	"entity_id" varchar(60) DEFAULT '' NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"ip" varchar(64) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "boards_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "branding_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo_url" text DEFAULT '' NOT NULL,
	"mobile_logo_url" text DEFAULT '' NOT NULL,
	"dark_logo_url" text DEFAULT '' NOT NULL,
	"favicon_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"name" varchar(140) NOT NULL,
	"email" varchar(190) NOT NULL,
	"phone" varchar(30) DEFAULT '' NOT NULL,
	"company" varchar(160) DEFAULT '' NOT NULL,
	"subject" varchar(200) DEFAULT '' NOT NULL,
	"service_interest" varchar(120) DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"status" varchar(12) DEFAULT 'new' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"ip" varchar(64) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"to_email" varchar(190) NOT NULL,
	"subject" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"status" varchar(12) DEFAULT 'queued' NOT NULL,
	"error" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference_no" varchar(24) NOT NULL,
	"job_id" integer,
	"role_name" varchar(200) DEFAULT '' NOT NULL,
	"role_other" varchar(200) DEFAULT '' NOT NULL,
	"full_name" varchar(140) NOT NULL,
	"father_name" varchar(140) DEFAULT '' NOT NULL,
	"email" varchar(190) NOT NULL,
	"mobile" varchar(30) NOT NULL,
	"dob" date,
	"gender" varchar(20) DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"city" varchar(80) DEFAULT '' NOT NULL,
	"state" varchar(80) DEFAULT '' NOT NULL,
	"country" varchar(80) DEFAULT '' NOT NULL,
	"pin" varchar(12) DEFAULT '' NOT NULL,
	"highest_qualification" varchar(120) DEFAULT '' NOT NULL,
	"qualification_other" varchar(160) DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'applied' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"ip" varchar(64) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_applications_reference_no_unique" UNIQUE("reference_no")
);
--> statement-breakpoint
CREATE TABLE "job_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"department" varchar(120) DEFAULT '' NOT NULL,
	"location" varchar(160) DEFAULT '' NOT NULL,
	"employment_type" varchar(40) DEFAULT 'Full-time' NOT NULL,
	"experience" varchar(80) DEFAULT '' NOT NULL,
	"openings" integer DEFAULT 1 NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"responsibilities" text DEFAULT '' NOT NULL,
	"requirements" text DEFAULT '' NOT NULL,
	"salary_range" varchar(120) DEFAULT '' NOT NULL,
	"hero_image_url" text DEFAULT '' NOT NULL,
	"hero_video_url" text DEFAULT '' NOT NULL,
	"status" varchar(10) DEFAULT 'active' NOT NULL,
	"closing_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) DEFAULT '' NOT NULL,
	"alt_text" varchar(300) DEFAULT '' NOT NULL,
	"kind" varchar(10) NOT NULL,
	"source" varchar(10) DEFAULT 'upload' NOT NULL,
	"url" text NOT NULL,
	"storage_path" text DEFAULT '' NOT NULL,
	"mime_type" varchar(100) DEFAULT '' NOT NULL,
	"size" integer DEFAULT 0 NOT NULL,
	"uploaded_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(220) NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"category_id" integer,
	"author" varchar(120) DEFAULT '' NOT NULL,
	"featured_image_url" text DEFAULT '' NOT NULL,
	"video_url" text DEFAULT '' NOT NULL,
	"poster_url" text DEFAULT '' NOT NULL,
	"hero_pos_desktop" varchar(40) DEFAULT 'center center' NOT NULL,
	"status" varchar(12) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "news_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"news_id" integer NOT NULL,
	"url" text NOT NULL,
	"caption" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_slug" varchar(80) NOT NULL,
	"section_key" varchar(60) NOT NULL,
	"eyebrow" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"image_url" text DEFAULT '' NOT NULL,
	"video_url" text DEFAULT '' NOT NULL,
	"button_text" text DEFAULT '' NOT NULL,
	"button_url" text DEFAULT '' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"title" varchar(160) NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"hero_eyebrow" text DEFAULT '' NOT NULL,
	"hero_title" text DEFAULT '' NOT NULL,
	"hero_description" text DEFAULT '' NOT NULL,
	"hero_primary_text" text DEFAULT '' NOT NULL,
	"hero_primary_url" text DEFAULT '' NOT NULL,
	"hero_secondary_text" text DEFAULT '' NOT NULL,
	"hero_secondary_url" text DEFAULT '' NOT NULL,
	"hero_type" varchar(10) DEFAULT 'image' NOT NULL,
	"hero_image_url" text DEFAULT '' NOT NULL,
	"hero_mobile_image_url" text DEFAULT '' NOT NULL,
	"hero_video_url" text DEFAULT '' NOT NULL,
	"hero_poster_url" text DEFAULT '' NOT NULL,
	"hero_overlay_color" varchar(9) DEFAULT '#0A1F44' NOT NULL,
	"hero_overlay_opacity" integer DEFAULT 78 NOT NULL,
	"hero_align" varchar(10) DEFAULT 'left' NOT NULL,
	"hero_height" integer DEFAULT 640 NOT NULL,
	"hero_pos_desktop" varchar(40) DEFAULT 'center center' NOT NULL,
	"hero_pos_mobile" varchar(40) DEFAULT 'center center' NOT NULL,
	"hero_animate" boolean DEFAULT true NOT NULL,
	"hero_parallax" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(60) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "qualifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qualifications_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(40) NOT NULL,
	"name" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar(20) NOT NULL,
	"entity_key" varchar(200) NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"canonical" text DEFAULT '' NOT NULL,
	"og_image" text DEFAULT '' NOT NULL,
	"twitter_image" text DEFAULT '' NOT NULL,
	"robots" varchar(40) DEFAULT 'index,follow' NOT NULL,
	"schema_json" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_benefits" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_id" integer NOT NULL,
	"kind" varchar(10) DEFAULT 'feature' NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"category" varchar(20) NOT NULL,
	"parent_slug" varchar(80) DEFAULT '' NOT NULL,
	"title" varchar(160) NOT NULL,
	"short_description" text DEFAULT '' NOT NULL,
	"long_description" text DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT 'cloud' NOT NULL,
	"card_image_url" text DEFAULT '' NOT NULL,
	"section_image_url" text DEFAULT '' NOT NULL,
	"diagram" varchar(30) DEFAULT 'cloud' NOT NULL,
	"cta_title" text DEFAULT '' NOT NULL,
	"cta_text" text DEFAULT '' NOT NULL,
	"cta_button_text" text DEFAULT '' NOT NULL,
	"cta_button_url" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"hero_eyebrow" text DEFAULT '' NOT NULL,
	"hero_title" text DEFAULT '' NOT NULL,
	"hero_description" text DEFAULT '' NOT NULL,
	"hero_primary_text" text DEFAULT '' NOT NULL,
	"hero_primary_url" text DEFAULT '' NOT NULL,
	"hero_secondary_text" text DEFAULT '' NOT NULL,
	"hero_secondary_url" text DEFAULT '' NOT NULL,
	"hero_type" varchar(10) DEFAULT 'image' NOT NULL,
	"hero_image_url" text DEFAULT '' NOT NULL,
	"hero_mobile_image_url" text DEFAULT '' NOT NULL,
	"hero_video_url" text DEFAULT '' NOT NULL,
	"hero_poster_url" text DEFAULT '' NOT NULL,
	"hero_overlay_color" varchar(9) DEFAULT '#0A1F44' NOT NULL,
	"hero_overlay_opacity" integer DEFAULT 78 NOT NULL,
	"hero_align" varchar(10) DEFAULT 'left' NOT NULL,
	"hero_height" integer DEFAULT 640 NOT NULL,
	"hero_pos_desktop" varchar(40) DEFAULT 'center center' NOT NULL,
	"hero_pos_mobile" varchar(40) DEFAULT 'center center' NOT NULL,
	"hero_animate" boolean DEFAULT true NOT NULL,
	"hero_parallax" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"kind" varchar(10) NOT NULL,
	"subject_id" integer NOT NULL,
	"csrf_token" varchar(64) NOT NULL,
	"ip" varchar(64) DEFAULT '' NOT NULL,
	"user_agent" text DEFAULT '' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(80) NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "universities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(140) NOT NULL,
	"company" varchar(160) DEFAULT '' NOT NULL,
	"email" varchar(190) NOT NULL,
	"mobile" varchar(30) DEFAULT '' NOT NULL,
	"password_hash" text NOT NULL,
	"country" varchar(80) DEFAULT '' NOT NULL,
	"state" varchar(80) DEFAULT '' NOT NULL,
	"city" varchar(80) DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"service_interest" varchar(120) DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_documents" ADD CONSTRAINT "applicant_documents_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicant_education" ADD CONSTRAINT "applicant_education_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_queries" ADD CONSTRAINT "contact_queries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_category_id_news_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."news_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_images" ADD CONSTRAINT "news_images_news_id_news_id_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_slug_pages_slug_fk" FOREIGN KEY ("page_slug") REFERENCES "public"."pages"("slug") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_benefits" ADD CONSTRAINT "service_benefits_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_faqs" ADD CONSTRAINT "service_faqs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_features" ADD CONSTRAINT "service_features_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admins_role_idx" ON "admins" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "docs_app_idx" ON "applicant_documents" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "edu_app_idx" ON "applicant_education" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_status_idx" ON "contact_queries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "apps_job_idx" ON "job_applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "apps_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "apps_email_idx" ON "job_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "media_kind_idx" ON "media" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "news_status_idx" ON "news" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "news_cat_idx" ON "news" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "news_images_idx" ON "news_images" USING btree ("news_id");--> statement-breakpoint
CREATE UNIQUE INDEX "page_sections_uq" ON "page_sections" USING btree ("page_slug","section_key");--> statement-breakpoint
CREATE UNIQUE INDEX "seo_uq" ON "seo_metadata" USING btree ("entity_type","entity_key");--> statement-breakpoint
CREATE INDEX "service_benefits_idx" ON "service_benefits" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_faqs_idx" ON "service_faqs" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_features_idx" ON "service_features" USING btree ("service_id","kind");--> statement-breakpoint
CREATE INDEX "services_cat_idx" ON "services" USING btree ("category","sort_order");--> statement-breakpoint
CREATE INDEX "sessions_subject_idx" ON "sessions" USING btree ("kind","subject_id");--> statement-breakpoint
CREATE INDEX "sessions_exp_idx" ON "sessions" USING btree ("expires_at");