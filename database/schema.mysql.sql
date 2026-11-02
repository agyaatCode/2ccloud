-- MySQL / MariaDB schema mirror (phpMyAdmin-compatible), generated from the PostgreSQL schema used by the app.
-- Requires MySQL 8.0.13+ or MariaDB 10.2.1+.  phpMyAdmin → Import → choose this file.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `password_hash` TEXT NOT NULL,
  `role_id` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`),
  CONSTRAINT `admins_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  KEY `admins_role_idx` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `applicant_documents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `application_id` INT NOT NULL,
  `doc_type` VARCHAR(20) NOT NULL,
  `original_name` TEXT NOT NULL,
  `stored_path` TEXT NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `applicant_documents_application_id_job_applications_id_fk` FOREIGN KEY (`application_id`) REFERENCES `job_applications` (`id`) ON DELETE CASCADE,
  KEY `docs_app_idx` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `applicant_education` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `application_id` INT NOT NULL,
  `level` VARCHAR(30) NOT NULL,
  `institution` VARCHAR(220) NOT NULL DEFAULT '',
  `year` VARCHAR(8) NOT NULL DEFAULT '',
  `score` VARCHAR(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  CONSTRAINT `applicant_education_application_id_job_applications_id_fk` FOREIGN KEY (`application_id`) REFERENCES `job_applications` (`id`) ON DELETE CASCADE,
  KEY `edu_app_idx` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actor_type` VARCHAR(10) NOT NULL DEFAULT 'admin',
  `actor_id` INT NULL,
  `actor_name` VARCHAR(140) NOT NULL DEFAULT '',
  `action` VARCHAR(60) NOT NULL,
  `entity_type` VARCHAR(60) NOT NULL DEFAULT '',
  `entity_id` VARCHAR(60) NOT NULL DEFAULT '',
  `details` MEDIUMTEXT NOT NULL DEFAULT (''),
  `ip` VARCHAR(64) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `boards_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `branding_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `logo_url` TEXT NOT NULL DEFAULT (''),
  `mobile_logo_url` TEXT NOT NULL DEFAULT (''),
  `dark_logo_url` TEXT NOT NULL DEFAULT (''),
  `favicon_url` TEXT NOT NULL DEFAULT (''),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_queries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `name` VARCHAR(140) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(30) NOT NULL DEFAULT '',
  `company` VARCHAR(160) NOT NULL DEFAULT '',
  `subject` VARCHAR(200) NOT NULL DEFAULT '',
  `service_interest` VARCHAR(120) NOT NULL DEFAULT '',
  `message` TEXT NOT NULL,
  `status` VARCHAR(12) NOT NULL DEFAULT 'new',
  `notes` TEXT NOT NULL DEFAULT (''),
  `ip` VARCHAR(64) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `contact_queries_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  KEY `contact_status_idx` (`status`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `to_email` VARCHAR(190) NOT NULL,
  `subject` TEXT NOT NULL,
  `body` MEDIUMTEXT NOT NULL DEFAULT (''),
  `status` VARCHAR(12) NOT NULL DEFAULT 'queued',
  `error` TEXT NOT NULL DEFAULT (''),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reference_no` VARCHAR(24) NOT NULL,
  `job_id` INT NULL,
  `role_name` VARCHAR(200) NOT NULL DEFAULT '',
  `role_other` VARCHAR(200) NOT NULL DEFAULT '',
  `full_name` VARCHAR(140) NOT NULL,
  `father_name` VARCHAR(140) NOT NULL DEFAULT '',
  `email` VARCHAR(190) NOT NULL,
  `mobile` VARCHAR(30) NOT NULL,
  `dob` DATE NULL,
  `gender` VARCHAR(20) NOT NULL DEFAULT '',
  `address` TEXT NOT NULL DEFAULT (''),
  `city` VARCHAR(80) NOT NULL DEFAULT '',
  `state` VARCHAR(80) NOT NULL DEFAULT '',
  `country` VARCHAR(80) NOT NULL DEFAULT '',
  `pin` VARCHAR(12) NOT NULL DEFAULT '',
  `highest_qualification` VARCHAR(120) NOT NULL DEFAULT '',
  `qualification_other` VARCHAR(160) NOT NULL DEFAULT '',
  `status` VARCHAR(20) NOT NULL DEFAULT 'applied',
  `notes` TEXT NOT NULL DEFAULT (''),
  `ip` VARCHAR(64) NOT NULL DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_applications_reference_no_unique` (`reference_no`),
  CONSTRAINT `job_applications_job_id_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL,
  KEY `apps_job_idx` (`job_id`),
  KEY `apps_status_idx` (`status`),
  KEY `apps_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `job_roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(160) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `department` VARCHAR(120) NOT NULL DEFAULT '',
  `location` VARCHAR(160) NOT NULL DEFAULT '',
  `employment_type` VARCHAR(40) NOT NULL DEFAULT 'Full-time',
  `experience` VARCHAR(80) NOT NULL DEFAULT '',
  `openings` INT NOT NULL DEFAULT 1,
  `summary` TEXT NOT NULL DEFAULT (''),
  `description` TEXT NOT NULL DEFAULT (''),
  `responsibilities` TEXT NOT NULL DEFAULT (''),
  `requirements` TEXT NOT NULL DEFAULT (''),
  `salary_range` VARCHAR(120) NOT NULL DEFAULT '',
  `hero_image_url` TEXT NOT NULL DEFAULT (''),
  `hero_video_url` TEXT NOT NULL DEFAULT (''),
  `status` VARCHAR(10) NOT NULL DEFAULT 'active',
  `closing_date` DATE NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jobs_slug_unique` (`slug`),
  KEY `jobs_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL DEFAULT '',
  `alt_text` VARCHAR(300) NOT NULL DEFAULT '',
  `kind` VARCHAR(10) NOT NULL,
  `source` VARCHAR(10) NOT NULL DEFAULT 'upload',
  `url` TEXT NOT NULL,
  `storage_path` TEXT NOT NULL DEFAULT (''),
  `mime_type` VARCHAR(100) NOT NULL DEFAULT '',
  `size` INT NOT NULL DEFAULT 0,
  `uploaded_by` INT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `media_kind_idx` (`kind`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(160) NOT NULL,
  `title` VARCHAR(220) NOT NULL,
  `excerpt` TEXT NOT NULL DEFAULT (''),
  `content` MEDIUMTEXT NOT NULL DEFAULT (''),
  `category_id` INT NULL,
  `author` VARCHAR(120) NOT NULL DEFAULT '',
  `featured_image_url` TEXT NOT NULL DEFAULT (''),
  `video_url` TEXT NOT NULL DEFAULT (''),
  `poster_url` TEXT NOT NULL DEFAULT (''),
  `hero_pos_desktop` VARCHAR(40) NOT NULL DEFAULT 'center center',
  `status` VARCHAR(12) NOT NULL DEFAULT 'draft',
  `published_at` DATETIME NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_slug_unique` (`slug`),
  CONSTRAINT `news_category_id_news_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `news_categories` (`id`) ON DELETE SET NULL,
  KEY `news_status_idx` (`status`, `published_at`),
  KEY `news_cat_idx` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `news_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `news_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `news_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `news_id` INT NOT NULL,
  `url` TEXT NOT NULL,
  `caption` TEXT NOT NULL DEFAULT (''),
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `news_images_news_id_news_id_fk` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
  KEY `news_images_idx` (`news_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `page_slug` VARCHAR(80) NOT NULL,
  `section_key` VARCHAR(60) NOT NULL,
  `eyebrow` TEXT NOT NULL DEFAULT (''),
  `title` TEXT NOT NULL DEFAULT (''),
  `body` MEDIUMTEXT NOT NULL DEFAULT (''),
  `image_url` TEXT NOT NULL DEFAULT (''),
  `video_url` TEXT NOT NULL DEFAULT (''),
  `button_text` TEXT NOT NULL DEFAULT (''),
  `button_url` TEXT NOT NULL DEFAULT (''),
  `data` JSON NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `page_sections_page_slug_pages_slug_fk` FOREIGN KEY (`page_slug`) REFERENCES `pages` (`slug`) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY `page_sections_uq` (`page_slug`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `title` VARCHAR(160) NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `hero_eyebrow` TEXT NOT NULL DEFAULT (''),
  `hero_title` TEXT NOT NULL DEFAULT (''),
  `hero_description` TEXT NOT NULL DEFAULT (''),
  `hero_primary_text` TEXT NOT NULL DEFAULT (''),
  `hero_primary_url` TEXT NOT NULL DEFAULT (''),
  `hero_secondary_text` TEXT NOT NULL DEFAULT (''),
  `hero_secondary_url` TEXT NOT NULL DEFAULT (''),
  `hero_type` VARCHAR(10) NOT NULL DEFAULT 'image',
  `hero_image_url` TEXT NOT NULL DEFAULT (''),
  `hero_mobile_image_url` TEXT NOT NULL DEFAULT (''),
  `hero_video_url` TEXT NOT NULL DEFAULT (''),
  `hero_poster_url` TEXT NOT NULL DEFAULT (''),
  `hero_overlay_color` VARCHAR(9) NOT NULL DEFAULT '#0A1F44',
  `hero_overlay_opacity` INT NOT NULL DEFAULT 78,
  `hero_align` VARCHAR(10) NOT NULL DEFAULT 'left',
  `hero_height` INT NOT NULL DEFAULT 640,
  `hero_pos_desktop` VARCHAR(40) NOT NULL DEFAULT 'center center',
  `hero_pos_mobile` VARCHAR(40) NOT NULL DEFAULT 'center center',
  `hero_animate` TINYINT(1) NOT NULL DEFAULT 1,
  `hero_parallax` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(60) NOT NULL,
  `description` TEXT NOT NULL DEFAULT (''),
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `qualifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `qualifications_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(40) NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_metadata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(20) NOT NULL,
  `entity_key` VARCHAR(200) NOT NULL,
  `title` TEXT NOT NULL DEFAULT (''),
  `description` TEXT NOT NULL DEFAULT (''),
  `canonical` TEXT NOT NULL DEFAULT (''),
  `og_image` TEXT NOT NULL DEFAULT (''),
  `twitter_image` TEXT NOT NULL DEFAULT (''),
  `robots` VARCHAR(40) NOT NULL DEFAULT 'index,follow',
  `schema_json` MEDIUMTEXT NOT NULL DEFAULT (''),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seo_uq` (`entity_type`, `entity_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_benefits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL,
  `title` TEXT NOT NULL,
  `description` TEXT NOT NULL DEFAULT (''),
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `service_benefits_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  KEY `service_benefits_idx` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_faqs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL DEFAULT (''),
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `service_faqs_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  KEY `service_faqs_idx` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL,
  `kind` VARCHAR(10) NOT NULL DEFAULT 'feature',
  `title` TEXT NOT NULL,
  `description` TEXT NOT NULL DEFAULT (''),
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `service_features_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  KEY `service_features_idx` (`service_id`, `kind`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(80) NOT NULL,
  `category` VARCHAR(20) NOT NULL,
  `parent_slug` VARCHAR(80) NOT NULL DEFAULT '',
  `title` VARCHAR(160) NOT NULL,
  `short_description` TEXT NOT NULL DEFAULT (''),
  `long_description` MEDIUMTEXT NOT NULL DEFAULT (''),
  `icon` VARCHAR(40) NOT NULL DEFAULT 'cloud',
  `card_image_url` TEXT NOT NULL DEFAULT (''),
  `section_image_url` TEXT NOT NULL DEFAULT (''),
  `diagram` VARCHAR(30) NOT NULL DEFAULT 'cloud',
  `cta_title` TEXT NOT NULL DEFAULT (''),
  `cta_text` TEXT NOT NULL DEFAULT (''),
  `cta_button_text` TEXT NOT NULL DEFAULT (''),
  `cta_button_url` TEXT NOT NULL DEFAULT (''),
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `hero_eyebrow` TEXT NOT NULL DEFAULT (''),
  `hero_title` TEXT NOT NULL DEFAULT (''),
  `hero_description` TEXT NOT NULL DEFAULT (''),
  `hero_primary_text` TEXT NOT NULL DEFAULT (''),
  `hero_primary_url` TEXT NOT NULL DEFAULT (''),
  `hero_secondary_text` TEXT NOT NULL DEFAULT (''),
  `hero_secondary_url` TEXT NOT NULL DEFAULT (''),
  `hero_type` VARCHAR(10) NOT NULL DEFAULT 'image',
  `hero_image_url` TEXT NOT NULL DEFAULT (''),
  `hero_mobile_image_url` TEXT NOT NULL DEFAULT (''),
  `hero_video_url` TEXT NOT NULL DEFAULT (''),
  `hero_poster_url` TEXT NOT NULL DEFAULT (''),
  `hero_overlay_color` VARCHAR(9) NOT NULL DEFAULT '#0A1F44',
  `hero_overlay_opacity` INT NOT NULL DEFAULT 78,
  `hero_align` VARCHAR(10) NOT NULL DEFAULT 'left',
  `hero_height` INT NOT NULL DEFAULT 640,
  `hero_pos_desktop` VARCHAR(40) NOT NULL DEFAULT 'center center',
  `hero_pos_mobile` VARCHAR(40) NOT NULL DEFAULT 'center center',
  `hero_animate` TINYINT(1) NOT NULL DEFAULT 1,
  `hero_parallax` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`),
  KEY `services_cat_idx` (`category`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(64) NOT NULL,
  `kind` VARCHAR(10) NOT NULL,
  `subject_id` INT NOT NULL,
  `csrf_token` VARCHAR(64) NOT NULL,
  `ip` VARCHAR(64) NOT NULL DEFAULT '',
  `user_agent` TEXT NOT NULL DEFAULT (''),
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sessions_subject_idx` (`kind`, `subject_id`),
  KEY `sessions_exp_idx` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(80) NOT NULL,
  `value` TEXT NOT NULL DEFAULT (''),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `universities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `universities_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(140) NOT NULL,
  `company` VARCHAR(160) NOT NULL DEFAULT '',
  `email` VARCHAR(190) NOT NULL,
  `mobile` VARCHAR(30) NOT NULL DEFAULT '',
  `password_hash` TEXT NOT NULL,
  `country` VARCHAR(80) NOT NULL DEFAULT '',
  `state` VARCHAR(80) NOT NULL DEFAULT '',
  `city` VARCHAR(80) NOT NULL DEFAULT '',
  `address` TEXT NOT NULL DEFAULT (''),
  `service_interest` VARCHAR(120) NOT NULL DEFAULT '',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;