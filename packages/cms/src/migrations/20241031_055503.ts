import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "media_sizes_avatar_sizes_avatar_filename_idx";
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_sm_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_lg_filename" varchar;
  CREATE INDEX IF NOT EXISTS "media_sizes_avatar_sm_sizes_avatar_sm_filename_idx" ON "media" USING btree ("sizes_avatar_sm_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_avatar_lg_sizes_avatar_lg_filename_idx" ON "media" USING btree ("sizes_avatar_lg_filename");
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_filename";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "media_sizes_avatar_sm_sizes_avatar_sm_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_avatar_lg_sizes_avatar_lg_filename_idx";
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_avatar_filename" varchar;
  CREATE INDEX IF NOT EXISTS "media_sizes_avatar_sizes_avatar_filename_idx" ON "media" USING btree ("sizes_avatar_filename");
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_sm_filename";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_avatar_lg_filename";`)
}
