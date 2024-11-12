import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "pages" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_slug_lock";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_slug_lock";
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "authors" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "layouts" DROP COLUMN IF EXISTS "slug_lock";
  ALTER TABLE "_layouts_v" DROP COLUMN IF EXISTS "version_slug_lock";
  ALTER TABLE "tags" DROP COLUMN IF EXISTS "slug_lock";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "_pages_v" ADD COLUMN "version_slug_lock" boolean DEFAULT true;
  ALTER TABLE "posts" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "_posts_v" ADD COLUMN "version_slug_lock" boolean DEFAULT true;
  ALTER TABLE "categories" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "authors" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "layouts" ADD COLUMN "slug_lock" boolean DEFAULT true;
  ALTER TABLE "_layouts_v" ADD COLUMN "version_slug_lock" boolean DEFAULT true;
  ALTER TABLE "tags" ADD COLUMN "slug_lock" boolean DEFAULT true;`)
}
