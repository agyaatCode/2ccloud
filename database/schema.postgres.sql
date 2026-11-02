--
-- PostgreSQL database dump
--

\restrict rk6w6fhhBiCKd8pwGrR6VonRou7tS3S9PzOlXWpqGXcr8c9ZXbe65KIL6BomaQ5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(190) NOT NULL,
    password_hash text NOT NULL,
    role_id integer,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: applicant_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_documents (
    id integer NOT NULL,
    application_id integer NOT NULL,
    doc_type character varying(20) NOT NULL,
    original_name text NOT NULL,
    stored_path text NOT NULL,
    mime_type character varying(100) NOT NULL,
    size integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: applicant_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.applicant_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: applicant_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.applicant_documents_id_seq OWNED BY public.applicant_documents.id;


--
-- Name: applicant_education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applicant_education (
    id integer NOT NULL,
    application_id integer NOT NULL,
    level character varying(30) NOT NULL,
    institution character varying(220) DEFAULT ''::character varying NOT NULL,
    year character varying(8) DEFAULT ''::character varying NOT NULL,
    score character varying(20) DEFAULT ''::character varying NOT NULL
);


--
-- Name: applicant_education_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.applicant_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: applicant_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.applicant_education_id_seq OWNED BY public.applicant_education.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    actor_type character varying(10) DEFAULT 'admin'::character varying NOT NULL,
    actor_id integer,
    actor_name character varying(140) DEFAULT ''::character varying NOT NULL,
    action character varying(60) NOT NULL,
    entity_type character varying(60) DEFAULT ''::character varying NOT NULL,
    entity_id character varying(60) DEFAULT ''::character varying NOT NULL,
    details text DEFAULT ''::text NOT NULL,
    ip character varying(64) DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: boards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- Name: branding_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branding_settings (
    id integer NOT NULL,
    logo_url text DEFAULT ''::text NOT NULL,
    mobile_logo_url text DEFAULT ''::text NOT NULL,
    dark_logo_url text DEFAULT ''::text NOT NULL,
    favicon_url text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: branding_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.branding_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branding_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.branding_settings_id_seq OWNED BY public.branding_settings.id;


--
-- Name: contact_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_queries (
    id integer NOT NULL,
    user_id integer,
    name character varying(140) NOT NULL,
    email character varying(190) NOT NULL,
    phone character varying(30) DEFAULT ''::character varying NOT NULL,
    company character varying(160) DEFAULT ''::character varying NOT NULL,
    subject character varying(200) DEFAULT ''::character varying NOT NULL,
    service_interest character varying(120) DEFAULT ''::character varying NOT NULL,
    message text NOT NULL,
    status character varying(12) DEFAULT 'new'::character varying NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    ip character varying(64) DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_queries_id_seq OWNED BY public.contact_queries.id;


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id integer NOT NULL,
    to_email character varying(190) NOT NULL,
    subject text NOT NULL,
    body text DEFAULT ''::text NOT NULL,
    status character varying(12) DEFAULT 'queued'::character varying NOT NULL,
    error text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: email_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    reference_no character varying(24) NOT NULL,
    job_id integer,
    role_name character varying(200) DEFAULT ''::character varying NOT NULL,
    role_other character varying(200) DEFAULT ''::character varying NOT NULL,
    full_name character varying(140) NOT NULL,
    father_name character varying(140) DEFAULT ''::character varying NOT NULL,
    email character varying(190) NOT NULL,
    mobile character varying(30) NOT NULL,
    dob date,
    gender character varying(20) DEFAULT ''::character varying NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    city character varying(80) DEFAULT ''::character varying NOT NULL,
    state character varying(80) DEFAULT ''::character varying NOT NULL,
    country character varying(80) DEFAULT ''::character varying NOT NULL,
    pin character varying(12) DEFAULT ''::character varying NOT NULL,
    highest_qualification character varying(120) DEFAULT ''::character varying NOT NULL,
    qualification_other character varying(160) DEFAULT ''::character varying NOT NULL,
    status character varying(20) DEFAULT 'applied'::character varying NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    ip character varying(64) DEFAULT ''::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: job_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_roles (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: job_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_roles_id_seq OWNED BY public.job_roles.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    slug character varying(160) NOT NULL,
    title character varying(200) NOT NULL,
    department character varying(120) DEFAULT ''::character varying NOT NULL,
    location character varying(160) DEFAULT ''::character varying NOT NULL,
    employment_type character varying(40) DEFAULT 'Full-time'::character varying NOT NULL,
    experience character varying(80) DEFAULT ''::character varying NOT NULL,
    openings integer DEFAULT 1 NOT NULL,
    summary text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    responsibilities text DEFAULT ''::text NOT NULL,
    requirements text DEFAULT ''::text NOT NULL,
    salary_range character varying(120) DEFAULT ''::character varying NOT NULL,
    hero_image_url text DEFAULT ''::text NOT NULL,
    hero_video_url text DEFAULT ''::text NOT NULL,
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    closing_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    title character varying(200) DEFAULT ''::character varying NOT NULL,
    alt_text character varying(300) DEFAULT ''::character varying NOT NULL,
    kind character varying(10) NOT NULL,
    source character varying(10) DEFAULT 'upload'::character varying NOT NULL,
    url text NOT NULL,
    storage_path text DEFAULT ''::text NOT NULL,
    mime_type character varying(100) DEFAULT ''::character varying NOT NULL,
    size integer DEFAULT 0 NOT NULL,
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id integer NOT NULL,
    slug character varying(160) NOT NULL,
    title character varying(220) NOT NULL,
    excerpt text DEFAULT ''::text NOT NULL,
    content text DEFAULT ''::text NOT NULL,
    category_id integer,
    author character varying(120) DEFAULT ''::character varying NOT NULL,
    featured_image_url text DEFAULT ''::text NOT NULL,
    video_url text DEFAULT ''::text NOT NULL,
    poster_url text DEFAULT ''::text NOT NULL,
    hero_pos_desktop character varying(40) DEFAULT 'center center'::character varying NOT NULL,
    status character varying(12) DEFAULT 'draft'::character varying NOT NULL,
    published_at timestamp without time zone,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: news_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_categories (
    id integer NOT NULL,
    name character varying(80) NOT NULL,
    slug character varying(80) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: news_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_categories_id_seq OWNED BY public.news_categories.id;


--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: news_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_images (
    id integer NOT NULL,
    news_id integer NOT NULL,
    url text NOT NULL,
    caption text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: news_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_images_id_seq OWNED BY public.news_images.id;


--
-- Name: page_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_sections (
    id integer NOT NULL,
    page_slug character varying(80) NOT NULL,
    section_key character varying(60) NOT NULL,
    eyebrow text DEFAULT ''::text NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    body text DEFAULT ''::text NOT NULL,
    image_url text DEFAULT ''::text NOT NULL,
    video_url text DEFAULT ''::text NOT NULL,
    button_text text DEFAULT ''::text NOT NULL,
    button_url text DEFAULT ''::text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: page_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_sections_id_seq OWNED BY public.page_sections.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    slug character varying(80) NOT NULL,
    title character varying(160) NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    hero_eyebrow text DEFAULT ''::text NOT NULL,
    hero_title text DEFAULT ''::text NOT NULL,
    hero_description text DEFAULT ''::text NOT NULL,
    hero_primary_text text DEFAULT ''::text NOT NULL,
    hero_primary_url text DEFAULT ''::text NOT NULL,
    hero_secondary_text text DEFAULT ''::text NOT NULL,
    hero_secondary_url text DEFAULT ''::text NOT NULL,
    hero_type character varying(10) DEFAULT 'image'::character varying NOT NULL,
    hero_image_url text DEFAULT ''::text NOT NULL,
    hero_mobile_image_url text DEFAULT ''::text NOT NULL,
    hero_video_url text DEFAULT ''::text NOT NULL,
    hero_poster_url text DEFAULT ''::text NOT NULL,
    hero_overlay_color character varying(9) DEFAULT '#0A1F44'::character varying NOT NULL,
    hero_overlay_opacity integer DEFAULT 78 NOT NULL,
    hero_align character varying(10) DEFAULT 'left'::character varying NOT NULL,
    hero_height integer DEFAULT 640 NOT NULL,
    hero_pos_desktop character varying(40) DEFAULT 'center center'::character varying NOT NULL,
    hero_pos_mobile character varying(40) DEFAULT 'center center'::character varying NOT NULL,
    hero_animate boolean DEFAULT true NOT NULL,
    hero_parallax boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    key character varying(60) NOT NULL,
    description text DEFAULT ''::text NOT NULL
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: qualifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qualifications (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: qualifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qualifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qualifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qualifications_id_seq OWNED BY public.qualifications.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    key character varying(40) NOT NULL,
    name character varying(80) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: seo_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo_metadata (
    id integer NOT NULL,
    entity_type character varying(20) NOT NULL,
    entity_key character varying(200) NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    canonical text DEFAULT ''::text NOT NULL,
    og_image text DEFAULT ''::text NOT NULL,
    twitter_image text DEFAULT ''::text NOT NULL,
    robots character varying(40) DEFAULT 'index,follow'::character varying NOT NULL,
    schema_json text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: seo_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seo_metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: seo_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seo_metadata_id_seq OWNED BY public.seo_metadata.id;


--
-- Name: service_benefits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_benefits (
    id integer NOT NULL,
    service_id integer NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: service_benefits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_benefits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_benefits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_benefits_id_seq OWNED BY public.service_benefits.id;


--
-- Name: service_faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_faqs (
    id integer NOT NULL,
    service_id integer NOT NULL,
    question text NOT NULL,
    answer text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: service_faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_faqs_id_seq OWNED BY public.service_faqs.id;


--
-- Name: service_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_features (
    id integer NOT NULL,
    service_id integer NOT NULL,
    kind character varying(10) DEFAULT 'feature'::character varying NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: service_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_features_id_seq OWNED BY public.service_features.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    slug character varying(80) NOT NULL,
    category character varying(20) NOT NULL,
    parent_slug character varying(80) DEFAULT ''::character varying NOT NULL,
    title character varying(160) NOT NULL,
    short_description text DEFAULT ''::text NOT NULL,
    long_description text DEFAULT ''::text NOT NULL,
    icon character varying(40) DEFAULT 'cloud'::character varying NOT NULL,
    card_image_url text DEFAULT ''::text NOT NULL,
    section_image_url text DEFAULT ''::text NOT NULL,
    diagram character varying(30) DEFAULT 'cloud'::character varying NOT NULL,
    cta_title text DEFAULT ''::text NOT NULL,
    cta_text text DEFAULT ''::text NOT NULL,
    cta_button_text text DEFAULT ''::text NOT NULL,
    cta_button_url text DEFAULT ''::text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    hero_eyebrow text DEFAULT ''::text NOT NULL,
    hero_title text DEFAULT ''::text NOT NULL,
    hero_description text DEFAULT ''::text NOT NULL,
    hero_primary_text text DEFAULT ''::text NOT NULL,
    hero_primary_url text DEFAULT ''::text NOT NULL,
    hero_secondary_text text DEFAULT ''::text NOT NULL,
    hero_secondary_url text DEFAULT ''::text NOT NULL,
    hero_type character varying(10) DEFAULT 'image'::character varying NOT NULL,
    hero_image_url text DEFAULT ''::text NOT NULL,
    hero_mobile_image_url text DEFAULT ''::text NOT NULL,
    hero_video_url text DEFAULT ''::text NOT NULL,
    hero_poster_url text DEFAULT ''::text NOT NULL,
    hero_overlay_color character varying(9) DEFAULT '#0A1F44'::character varying NOT NULL,
    hero_overlay_opacity integer DEFAULT 78 NOT NULL,
    hero_align character varying(10) DEFAULT 'left'::character varying NOT NULL,
    hero_height integer DEFAULT 640 NOT NULL,
    hero_pos_desktop character varying(40) DEFAULT 'center center'::character varying NOT NULL,
    hero_pos_mobile character varying(40) DEFAULT 'center center'::character varying NOT NULL,
    hero_animate boolean DEFAULT true NOT NULL,
    hero_parallax boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(64) NOT NULL,
    kind character varying(10) NOT NULL,
    subject_id integer NOT NULL,
    csrf_token character varying(64) NOT NULL,
    ip character varying(64) DEFAULT ''::character varying NOT NULL,
    user_agent text DEFAULT ''::text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    key character varying(80) NOT NULL,
    value text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: universities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.universities (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: universities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(140) NOT NULL,
    company character varying(160) DEFAULT ''::character varying NOT NULL,
    email character varying(190) NOT NULL,
    mobile character varying(30) DEFAULT ''::character varying NOT NULL,
    password_hash text NOT NULL,
    country character varying(80) DEFAULT ''::character varying NOT NULL,
    state character varying(80) DEFAULT ''::character varying NOT NULL,
    city character varying(80) DEFAULT ''::character varying NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    service_interest character varying(120) DEFAULT ''::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: applicant_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_documents ALTER COLUMN id SET DEFAULT nextval('public.applicant_documents_id_seq'::regclass);


--
-- Name: applicant_education id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_education ALTER COLUMN id SET DEFAULT nextval('public.applicant_education_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- Name: branding_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branding_settings ALTER COLUMN id SET DEFAULT nextval('public.branding_settings_id_seq'::regclass);


--
-- Name: contact_queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_queries ALTER COLUMN id SET DEFAULT nextval('public.contact_queries_id_seq'::regclass);


--
-- Name: email_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: job_roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_roles ALTER COLUMN id SET DEFAULT nextval('public.job_roles_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: news_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_categories ALTER COLUMN id SET DEFAULT nextval('public.news_categories_id_seq'::regclass);


--
-- Name: news_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images ALTER COLUMN id SET DEFAULT nextval('public.news_images_id_seq'::regclass);


--
-- Name: page_sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_sections ALTER COLUMN id SET DEFAULT nextval('public.page_sections_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: qualifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications ALTER COLUMN id SET DEFAULT nextval('public.qualifications_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: seo_metadata id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_metadata ALTER COLUMN id SET DEFAULT nextval('public.seo_metadata_id_seq'::regclass);


--
-- Name: service_benefits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_benefits ALTER COLUMN id SET DEFAULT nextval('public.service_benefits_id_seq'::regclass);


--
-- Name: service_faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_faqs ALTER COLUMN id SET DEFAULT nextval('public.service_faqs_id_seq'::regclass);


--
-- Name: service_features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features ALTER COLUMN id SET DEFAULT nextval('public.service_features_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: universities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.universities ALTER COLUMN id SET DEFAULT nextval('public.universities_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: admins admins_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_unique UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: applicant_documents applicant_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_documents
    ADD CONSTRAINT applicant_documents_pkey PRIMARY KEY (id);


--
-- Name: applicant_education applicant_education_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_education
    ADD CONSTRAINT applicant_education_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: boards boards_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_name_unique UNIQUE (name);


--
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: branding_settings branding_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branding_settings
    ADD CONSTRAINT branding_settings_pkey PRIMARY KEY (id);


--
-- Name: contact_queries contact_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_queries
    ADD CONSTRAINT contact_queries_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_reference_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_reference_no_unique UNIQUE (reference_no);


--
-- Name: job_roles job_roles_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_roles
    ADD CONSTRAINT job_roles_name_unique UNIQUE (name);


--
-- Name: job_roles job_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_roles
    ADD CONSTRAINT job_roles_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_slug_unique UNIQUE (slug);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_pkey PRIMARY KEY (id);


--
-- Name: news_categories news_categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_categories
    ADD CONSTRAINT news_categories_slug_unique UNIQUE (slug);


--
-- Name: news_images news_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images
    ADD CONSTRAINT news_images_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_slug_unique UNIQUE (slug);


--
-- Name: permissions permissions_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_key_unique UNIQUE (key);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: qualifications qualifications_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications
    ADD CONSTRAINT qualifications_name_unique UNIQUE (name);


--
-- Name: qualifications qualifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications
    ADD CONSTRAINT qualifications_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_pk PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_key_unique UNIQUE (key);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: seo_metadata seo_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo_metadata
    ADD CONSTRAINT seo_metadata_pkey PRIMARY KEY (id);


--
-- Name: service_benefits service_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_benefits
    ADD CONSTRAINT service_benefits_pkey PRIMARY KEY (id);


--
-- Name: service_faqs service_faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_faqs
    ADD CONSTRAINT service_faqs_pkey PRIMARY KEY (id);


--
-- Name: service_features service_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features
    ADD CONSTRAINT service_features_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_unique UNIQUE (key);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: universities universities_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_name_unique UNIQUE (name);


--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admins_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX admins_role_idx ON public.admins USING btree (role_id);


--
-- Name: apps_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX apps_email_idx ON public.job_applications USING btree (email);


--
-- Name: apps_job_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX apps_job_idx ON public.job_applications USING btree (job_id);


--
-- Name: apps_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX apps_status_idx ON public.job_applications USING btree (status);


--
-- Name: audit_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_created_idx ON public.audit_logs USING btree (created_at);


--
-- Name: contact_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX contact_status_idx ON public.contact_queries USING btree (status, created_at);


--
-- Name: docs_app_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX docs_app_idx ON public.applicant_documents USING btree (application_id);


--
-- Name: edu_app_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX edu_app_idx ON public.applicant_education USING btree (application_id);


--
-- Name: jobs_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_status_idx ON public.jobs USING btree (status);


--
-- Name: media_kind_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_kind_idx ON public.media USING btree (kind);


--
-- Name: news_cat_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_cat_idx ON public.news USING btree (category_id);


--
-- Name: news_images_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_images_idx ON public.news_images USING btree (news_id);


--
-- Name: news_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_status_idx ON public.news USING btree (status, published_at);


--
-- Name: page_sections_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX page_sections_uq ON public.page_sections USING btree (page_slug, section_key);


--
-- Name: seo_uq; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX seo_uq ON public.seo_metadata USING btree (entity_type, entity_key);


--
-- Name: service_benefits_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_benefits_idx ON public.service_benefits USING btree (service_id);


--
-- Name: service_faqs_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_faqs_idx ON public.service_faqs USING btree (service_id);


--
-- Name: service_features_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_features_idx ON public.service_features USING btree (service_id, kind);


--
-- Name: services_cat_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_cat_idx ON public.services USING btree (category, sort_order);


--
-- Name: sessions_exp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_exp_idx ON public.sessions USING btree (expires_at);


--
-- Name: sessions_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_subject_idx ON public.sessions USING btree (kind, subject_id);


--
-- Name: admins admins_role_id_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- Name: applicant_documents applicant_documents_application_id_job_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_documents
    ADD CONSTRAINT applicant_documents_application_id_job_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: applicant_education applicant_education_application_id_job_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applicant_education
    ADD CONSTRAINT applicant_education_application_id_job_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: contact_queries contact_queries_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_queries
    ADD CONSTRAINT contact_queries_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: job_applications job_applications_job_id_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE SET NULL;


--
-- Name: news news_category_id_news_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_category_id_news_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.news_categories(id) ON DELETE SET NULL;


--
-- Name: news_images news_images_news_id_news_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_images
    ADD CONSTRAINT news_images_news_id_news_id_fk FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: page_sections page_sections_page_slug_pages_slug_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_page_slug_pages_slug_fk FOREIGN KEY (page_slug) REFERENCES public.pages(slug) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_permissions_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_permissions_id_fk FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_roles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: service_benefits service_benefits_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_benefits
    ADD CONSTRAINT service_benefits_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: service_faqs service_faqs_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_faqs
    ADD CONSTRAINT service_faqs_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: service_features service_features_service_id_services_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_features
    ADD CONSTRAINT service_features_service_id_services_id_fk FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict rk6w6fhhBiCKd8pwGrR6VonRou7tS3S9PzOlXWpqGXcr8c9ZXbe65KIL6BomaQ5

