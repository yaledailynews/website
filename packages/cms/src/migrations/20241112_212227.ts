import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "footer" DROP COLUMN IF EXISTS "primary_button_appearance";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "secondary_button_appearance";
  DROP TYPE "public"."enum_footer_primary_button_appearance";
  DROP TYPE "public"."enum_footer_secondary_button_appearance";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_footer_primary_button_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_footer_secondary_button_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "footer" ADD COLUMN "primary_button_appearance" "enum_footer_primary_button_appearance" DEFAULT 'default';
  ALTER TABLE "footer" ADD COLUMN "secondary_button_appearance" "enum_footer_secondary_button_appearance" DEFAULT 'default';`)
}
