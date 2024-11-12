import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_tags_style" AS ENUM('outline', 'solid');
  ALTER TABLE "tags" ALTER COLUMN "color" SET DEFAULT 'gray';
  ALTER TABLE "tags" ALTER COLUMN "color" SET NOT NULL;
  ALTER TABLE "tags" ADD COLUMN "style" "enum_tags_style" DEFAULT 'outline' NOT NULL;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "tags" ALTER COLUMN "color" DROP DEFAULT;
  ALTER TABLE "tags" ALTER COLUMN "color" DROP NOT NULL;
  ALTER TABLE "tags" DROP COLUMN IF EXISTS "style";
  DROP TYPE "public"."enum_tags_style";`)
}
