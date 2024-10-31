import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "media" RENAME COLUMN "placeholder" TO "blurhash";
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "layouts_updated_at_idx" ON "layouts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_layouts_v_version_version_updated_at_idx" ON "_layouts_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "media" RENAME COLUMN "blurhash" TO "placeholder";
  DROP INDEX IF EXISTS "pages_updated_at_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "posts_updated_at_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "media_updated_at_idx";
  DROP INDEX IF EXISTS "categories_updated_at_idx";
  DROP INDEX IF EXISTS "users_updated_at_idx";
  DROP INDEX IF EXISTS "authors_updated_at_idx";
  DROP INDEX IF EXISTS "layouts_updated_at_idx";
  DROP INDEX IF EXISTS "_layouts_v_version_version_updated_at_idx";
  DROP INDEX IF EXISTS "redirects_updated_at_idx";
  DROP INDEX IF EXISTS "search_updated_at_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_updated_at_idx";
  DROP INDEX IF EXISTS "payload_preferences_updated_at_idx";
  DROP INDEX IF EXISTS "payload_migrations_updated_at_idx";`)
}
