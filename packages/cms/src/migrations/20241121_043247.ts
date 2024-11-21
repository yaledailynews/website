import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "pages_slug_idx";
  DROP INDEX IF EXISTS "posts_slug_idx";
  DROP INDEX IF EXISTS "categories_slug_idx";
  DROP INDEX IF EXISTS "authors_slug_idx";
  DROP INDEX IF EXISTS "layouts_slug_idx";
  DROP INDEX IF EXISTS "tags_slug_idx";
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "layouts_slug_idx" ON "layouts" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags" USING btree ("slug");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "pages_slug_idx";
  DROP INDEX IF EXISTS "posts_slug_idx";
  DROP INDEX IF EXISTS "categories_slug_idx";
  DROP INDEX IF EXISTS "authors_slug_idx";
  DROP INDEX IF EXISTS "layouts_slug_idx";
  DROP INDEX IF EXISTS "tags_slug_idx";
  CREATE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "layouts_slug_idx" ON "layouts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags" USING btree ("slug");`)
}
