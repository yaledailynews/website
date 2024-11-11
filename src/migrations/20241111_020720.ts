import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" ALTER COLUMN "hero_style" SET DEFAULT 'standard';
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_style" SET DEFAULT 'standard';`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" ALTER COLUMN "hero_style" DROP DEFAULT;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_style" DROP DEFAULT;`)
}
