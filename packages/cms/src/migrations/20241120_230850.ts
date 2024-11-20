import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_hero_style" AS ENUM('standard', 'full');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_hero_style" AS ENUM('standard', 'full');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_layouts_template" AS ENUM('standard', 'category', 'special-issue', 'magazine', 'podcast');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_articles_template" AS ENUM('SimpleList', 'FeaturedSingle', 'FeaturedPair', 'SmallImageTrio', 'TallImageTrio', 'TwoColumnQuad', 'LargeImageQuad', 'Opinion', 'WKND', 'Magazine', 'SidebarTrio');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_articles_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_articles_source" AS ENUM('manual', 'latestFromCategory');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_articles_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_text_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_text_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_podcasts_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_podcasts_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_newsletter_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum_layouts_blocks_layouts_newsletter_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_layouts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__layouts_v_version_template" AS ENUM('standard', 'category', 'special-issue', 'magazine', 'podcast');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_articles_template" AS ENUM('SimpleList', 'FeaturedSingle', 'FeaturedPair', 'SmallImageTrio', 'TallImageTrio', 'TwoColumnQuad', 'LargeImageQuad', 'Opinion', 'WKND', 'Magazine', 'SidebarTrio');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_articles_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_articles_source" AS ENUM('manual', 'latestFromCategory');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_articles_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_text_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_text_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_podcasts_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_podcasts_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_newsletter_desktop_position" AS ENUM('main', 'sidebar', 'fullTop', 'fullBottom');
  CREATE TYPE "public"."enum__layouts_v_blocks_layouts_newsletter_top_divider" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__layouts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tags_color" AS ENUM('gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose');
  CREATE TYPE "public"."enum_tags_style" AS ENUM('outline', 'solid');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_primary_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_secondary_button_type" AS ENUM('reference', 'custom');
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subhead" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"hero_style" "enum_posts_hero_style" DEFAULT 'standard',
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"authors_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_subhead" varchar,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_hero_style" "enum__posts_v_version_hero_style" DEFAULT 'standard',
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"tags_id" integer,
  	"authors_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"author_id" integer,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_sm_url" varchar,
  	"sizes_sm_width" numeric,
  	"sizes_sm_height" numeric,
  	"sizes_sm_mime_type" varchar,
  	"sizes_sm_filesize" numeric,
  	"sizes_sm_filename" varchar,
  	"sizes_md_url" varchar,
  	"sizes_md_width" numeric,
  	"sizes_md_height" numeric,
  	"sizes_md_mime_type" varchar,
  	"sizes_md_filesize" numeric,
  	"sizes_md_filename" varchar,
  	"sizes_lg_url" varchar,
  	"sizes_lg_width" numeric,
  	"sizes_lg_height" numeric,
  	"sizes_lg_mime_type" varchar,
  	"sizes_lg_filesize" numeric,
  	"sizes_lg_filename" varchar,
  	"sizes_xl_url" varchar,
  	"sizes_xl_width" numeric,
  	"sizes_xl_height" numeric,
  	"sizes_xl_mime_type" varchar,
  	"sizes_xl_filesize" numeric,
  	"sizes_xl_filename" varchar,
  	"sizes_avatar_sm_url" varchar,
  	"sizes_avatar_sm_width" numeric,
  	"sizes_avatar_sm_height" numeric,
  	"sizes_avatar_sm_mime_type" varchar,
  	"sizes_avatar_sm_filesize" numeric,
  	"sizes_avatar_sm_filename" varchar,
  	"sizes_avatar_lg_url" varchar,
  	"sizes_avatar_lg_width" numeric,
  	"sizes_avatar_lg_height" numeric,
  	"sizes_avatar_lg_mime_type" varchar,
  	"sizes_avatar_lg_filesize" numeric,
  	"sizes_avatar_lg_filename" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"layout_id" integer,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"bio" jsonb,
  	"avatar_id" integer,
  	"show_posts" boolean DEFAULT true,
  	"show_media" boolean DEFAULT false,
  	"twitter" varchar,
  	"instagram" varchar,
  	"user_id" integer,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "layouts_blocks_layouts_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"template" "enum_layouts_blocks_layouts_articles_template",
  	"desktop_position" "enum_layouts_blocks_layouts_articles_desktop_position" DEFAULT 'main',
  	"source" "enum_layouts_blocks_layouts_articles_source" DEFAULT 'manual',
  	"category_id" integer,
  	"top_divider" "enum_layouts_blocks_layouts_articles_top_divider" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "layouts_blocks_layouts_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"desktop_position" "enum_layouts_blocks_layouts_text_desktop_position" DEFAULT 'main',
  	"top_divider" "enum_layouts_blocks_layouts_text_top_divider" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "layouts_blocks_layouts_podcasts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"desktop_position" "enum_layouts_blocks_layouts_podcasts_desktop_position" DEFAULT 'sidebar',
  	"top_divider" "enum_layouts_blocks_layouts_podcasts_top_divider" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "layouts_blocks_layouts_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"desktop_position" "enum_layouts_blocks_layouts_newsletter_desktop_position" DEFAULT 'sidebar',
  	"top_divider" "enum_layouts_blocks_layouts_newsletter_top_divider" DEFAULT 'dark',
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "layouts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"published_at" timestamp(3) with time zone,
  	"slug" varchar,
  	"template" "enum_layouts_template" DEFAULT 'standard',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_layouts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "layouts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v_blocks_layouts_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"template" "enum__layouts_v_blocks_layouts_articles_template",
  	"desktop_position" "enum__layouts_v_blocks_layouts_articles_desktop_position" DEFAULT 'main',
  	"source" "enum__layouts_v_blocks_layouts_articles_source" DEFAULT 'manual',
  	"category_id" integer,
  	"top_divider" "enum__layouts_v_blocks_layouts_articles_top_divider" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v_blocks_layouts_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"desktop_position" "enum__layouts_v_blocks_layouts_text_desktop_position" DEFAULT 'main',
  	"top_divider" "enum__layouts_v_blocks_layouts_text_top_divider" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v_blocks_layouts_podcasts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"desktop_position" "enum__layouts_v_blocks_layouts_podcasts_desktop_position" DEFAULT 'sidebar',
  	"top_divider" "enum__layouts_v_blocks_layouts_podcasts_top_divider" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v_blocks_layouts_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"desktop_position" "enum__layouts_v_blocks_layouts_newsletter_desktop_position" DEFAULT 'sidebar',
  	"top_divider" "enum__layouts_v_blocks_layouts_newsletter_top_divider" DEFAULT 'dark',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_template" "enum__layouts_v_version_template" DEFAULT 'standard',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__layouts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_layouts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"color" "enum_tags_color" DEFAULT 'gray' NOT NULL,
  	"style" "enum_tags_style" DEFAULT 'outline' NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"authors_id" integer,
  	"layouts_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"home_layout_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"authors_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"description" jsonb NOT NULL,
  	"company_name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"primary_button_type" "enum_footer_primary_button_type" DEFAULT 'reference',
  	"primary_button_new_tab" boolean,
  	"primary_button_url" varchar,
  	"primary_button_label" varchar NOT NULL,
  	"secondary_button_type" "enum_footer_secondary_button_type" DEFAULT 'reference',
  	"secondary_button_new_tab" boolean,
  	"secondary_button_url" varchar,
  	"secondary_button_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"authors_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  DO $$ BEGIN
   ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "media" ADD CONSTRAINT "media_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories" ADD CONSTRAINT "categories_layout_id_layouts_id_fk" FOREIGN KEY ("layout_id") REFERENCES "public"."layouts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_blocks_layouts_articles" ADD CONSTRAINT "layouts_blocks_layouts_articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_blocks_layouts_articles" ADD CONSTRAINT "layouts_blocks_layouts_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_blocks_layouts_text" ADD CONSTRAINT "layouts_blocks_layouts_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_blocks_layouts_podcasts" ADD CONSTRAINT "layouts_blocks_layouts_podcasts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_blocks_layouts_newsletter" ADD CONSTRAINT "layouts_blocks_layouts_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_rels" ADD CONSTRAINT "layouts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "layouts_rels" ADD CONSTRAINT "layouts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_blocks_layouts_articles" ADD CONSTRAINT "_layouts_v_blocks_layouts_articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_blocks_layouts_articles" ADD CONSTRAINT "_layouts_v_blocks_layouts_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layouts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_blocks_layouts_text" ADD CONSTRAINT "_layouts_v_blocks_layouts_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layouts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_blocks_layouts_podcasts" ADD CONSTRAINT "_layouts_v_blocks_layouts_podcasts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layouts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_blocks_layouts_newsletter" ADD CONSTRAINT "_layouts_v_blocks_layouts_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_layouts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v" ADD CONSTRAINT "_layouts_v_parent_id_layouts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."layouts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_rels" ADD CONSTRAINT "_layouts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_layouts_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_layouts_v_rels" ADD CONSTRAINT "_layouts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_layouts_fk" FOREIGN KEY ("layouts_id") REFERENCES "public"."layouts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "settings" ADD CONSTRAINT "settings_home_layout_id_layouts_id_fk" FOREIGN KEY ("home_layout_id") REFERENCES "public"."layouts"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_contacts" ADD CONSTRAINT "footer_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "posts_rels_authors_id_idx" ON "posts_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_authors_id_idx" ON "_posts_v_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "media_author_idx" ON "media" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_sm_sizes_sm_filename_idx" ON "media" USING btree ("sizes_sm_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_md_sizes_md_filename_idx" ON "media" USING btree ("sizes_md_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_lg_sizes_lg_filename_idx" ON "media" USING btree ("sizes_lg_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_xl_sizes_xl_filename_idx" ON "media" USING btree ("sizes_xl_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_avatar_sm_sizes_avatar_sm_filename_idx" ON "media" USING btree ("sizes_avatar_sm_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_avatar_lg_sizes_avatar_lg_filename_idx" ON "media" USING btree ("sizes_avatar_lg_filename");
  CREATE INDEX IF NOT EXISTS "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX IF NOT EXISTS "categories_layout_idx" ON "categories" USING btree ("layout_id");
  CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
  CREATE INDEX IF NOT EXISTS "authors_user_idx" ON "authors" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_articles_order_idx" ON "layouts_blocks_layouts_articles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_articles_parent_id_idx" ON "layouts_blocks_layouts_articles" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_articles_path_idx" ON "layouts_blocks_layouts_articles" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_articles_category_idx" ON "layouts_blocks_layouts_articles" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_text_order_idx" ON "layouts_blocks_layouts_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_text_parent_id_idx" ON "layouts_blocks_layouts_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_text_path_idx" ON "layouts_blocks_layouts_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_podcasts_order_idx" ON "layouts_blocks_layouts_podcasts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_podcasts_parent_id_idx" ON "layouts_blocks_layouts_podcasts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_podcasts_path_idx" ON "layouts_blocks_layouts_podcasts" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_newsletter_order_idx" ON "layouts_blocks_layouts_newsletter" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_newsletter_parent_id_idx" ON "layouts_blocks_layouts_newsletter" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "layouts_blocks_layouts_newsletter_path_idx" ON "layouts_blocks_layouts_newsletter" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "layouts_slug_idx" ON "layouts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "layouts_updated_at_idx" ON "layouts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "layouts_created_at_idx" ON "layouts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "layouts__status_idx" ON "layouts" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "layouts_rels_order_idx" ON "layouts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "layouts_rels_parent_idx" ON "layouts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "layouts_rels_path_idx" ON "layouts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "layouts_rels_posts_id_idx" ON "layouts_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_articles_order_idx" ON "_layouts_v_blocks_layouts_articles" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_articles_parent_id_idx" ON "_layouts_v_blocks_layouts_articles" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_articles_path_idx" ON "_layouts_v_blocks_layouts_articles" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_articles_category_idx" ON "_layouts_v_blocks_layouts_articles" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_text_order_idx" ON "_layouts_v_blocks_layouts_text" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_text_parent_id_idx" ON "_layouts_v_blocks_layouts_text" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_text_path_idx" ON "_layouts_v_blocks_layouts_text" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_podcasts_order_idx" ON "_layouts_v_blocks_layouts_podcasts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_podcasts_parent_id_idx" ON "_layouts_v_blocks_layouts_podcasts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_podcasts_path_idx" ON "_layouts_v_blocks_layouts_podcasts" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_newsletter_order_idx" ON "_layouts_v_blocks_layouts_newsletter" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_newsletter_parent_id_idx" ON "_layouts_v_blocks_layouts_newsletter" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_blocks_layouts_newsletter_path_idx" ON "_layouts_v_blocks_layouts_newsletter" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_layouts_v_parent_idx" ON "_layouts_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_version_version_slug_idx" ON "_layouts_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_layouts_v_version_version_updated_at_idx" ON "_layouts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_layouts_v_version_version_created_at_idx" ON "_layouts_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_layouts_v_version_version__status_idx" ON "_layouts_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_layouts_v_created_at_idx" ON "_layouts_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_layouts_v_updated_at_idx" ON "_layouts_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_layouts_v_latest_idx" ON "_layouts_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_layouts_v_autosave_idx" ON "_layouts_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_layouts_v_rels_order_idx" ON "_layouts_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_layouts_v_rels_parent_idx" ON "_layouts_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_layouts_v_rels_path_idx" ON "_layouts_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_layouts_v_rels_posts_id_idx" ON "_layouts_v_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_layouts_id_idx" ON "payload_locked_documents_rels" USING btree ("layouts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "settings_home_layout_idx" ON "settings" USING btree ("home_layout_id");
  CREATE INDEX IF NOT EXISTS "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "header_rels_authors_id_idx" ON "header_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "header_rels_categories_id_idx" ON "header_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_contacts_order_idx" ON "footer_contacts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_contacts_parent_id_idx" ON "footer_contacts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_authors_id_idx" ON "footer_rels" USING btree ("authors_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "footer_rels_categories_id_idx" ON "footer_rels" USING btree ("categories_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "layouts_blocks_layouts_articles" CASCADE;
  DROP TABLE "layouts_blocks_layouts_text" CASCADE;
  DROP TABLE "layouts_blocks_layouts_podcasts" CASCADE;
  DROP TABLE "layouts_blocks_layouts_newsletter" CASCADE;
  DROP TABLE "layouts" CASCADE;
  DROP TABLE "layouts_rels" CASCADE;
  DROP TABLE "_layouts_v_blocks_layouts_articles" CASCADE;
  DROP TABLE "_layouts_v_blocks_layouts_text" CASCADE;
  DROP TABLE "_layouts_v_blocks_layouts_podcasts" CASCADE;
  DROP TABLE "_layouts_v_blocks_layouts_newsletter" CASCADE;
  DROP TABLE "_layouts_v" CASCADE;
  DROP TABLE "_layouts_v_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer_contacts" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_posts_hero_style";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_hero_style";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_layouts_template";
  DROP TYPE "public"."enum_layouts_blocks_layouts_articles_template";
  DROP TYPE "public"."enum_layouts_blocks_layouts_articles_desktop_position";
  DROP TYPE "public"."enum_layouts_blocks_layouts_articles_source";
  DROP TYPE "public"."enum_layouts_blocks_layouts_articles_top_divider";
  DROP TYPE "public"."enum_layouts_blocks_layouts_text_desktop_position";
  DROP TYPE "public"."enum_layouts_blocks_layouts_text_top_divider";
  DROP TYPE "public"."enum_layouts_blocks_layouts_podcasts_desktop_position";
  DROP TYPE "public"."enum_layouts_blocks_layouts_podcasts_top_divider";
  DROP TYPE "public"."enum_layouts_blocks_layouts_newsletter_desktop_position";
  DROP TYPE "public"."enum_layouts_blocks_layouts_newsletter_top_divider";
  DROP TYPE "public"."enum_layouts_status";
  DROP TYPE "public"."enum__layouts_v_version_template";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_articles_template";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_articles_desktop_position";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_articles_source";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_articles_top_divider";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_text_desktop_position";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_text_top_divider";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_podcasts_desktop_position";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_podcasts_top_divider";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_newsletter_desktop_position";
  DROP TYPE "public"."enum__layouts_v_blocks_layouts_newsletter_top_divider";
  DROP TYPE "public"."enum__layouts_v_version_status";
  DROP TYPE "public"."enum_tags_color";
  DROP TYPE "public"."enum_tags_style";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_footer_primary_button_type";
  DROP TYPE "public"."enum_footer_secondary_button_type";`)
}
