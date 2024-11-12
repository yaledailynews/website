import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_footer_primary_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_primary_button_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_footer_secondary_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_secondary_button_appearance" AS ENUM('default', 'outline');
  CREATE TABLE IF NOT EXISTS "footer_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL
  );
  
  ALTER TABLE "footer" ADD COLUMN "description" jsonb NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "company_name" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "address" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "phone" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "primary_button_type" "enum_footer_primary_button_type" DEFAULT 'reference';
  ALTER TABLE "footer" ADD COLUMN "primary_button_new_tab" boolean;
  ALTER TABLE "footer" ADD COLUMN "primary_button_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "primary_button_label" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "primary_button_appearance" "enum_footer_primary_button_appearance" DEFAULT 'default';
  ALTER TABLE "footer" ADD COLUMN "secondary_button_type" "enum_footer_secondary_button_type" DEFAULT 'reference';
  ALTER TABLE "footer" ADD COLUMN "secondary_button_new_tab" boolean;
  ALTER TABLE "footer" ADD COLUMN "secondary_button_url" varchar;
  ALTER TABLE "footer" ADD COLUMN "secondary_button_label" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "secondary_button_appearance" "enum_footer_secondary_button_appearance" DEFAULT 'default';
  DO $$ BEGIN
   ALTER TABLE "footer_contacts" ADD CONSTRAINT "footer_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "footer_contacts_order_idx" ON "footer_contacts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_contacts_parent_id_idx" ON "footer_contacts" USING btree ("_parent_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "footer_contacts";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "company_name";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "address";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "phone";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_type";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_new_tab";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_url";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_label";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_appearance";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_type";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_new_tab";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_url";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_label";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_appearance";
  DROP TYPE "public"."enum_footer_primary_button_type";
  DROP TYPE "public"."enum_footer_primary_button_appearance";
  DROP TYPE "public"."enum_footer_secondary_button_type";
  DROP TYPE "public"."enum_footer_secondary_button_appearance";`)
}
