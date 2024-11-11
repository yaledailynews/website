import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_posts_hero_style" AS ENUM('standard', 'full');
  CREATE TYPE "public"."enum__posts_v_version_hero_style" AS ENUM('standard', 'full');
  ALTER TABLE "posts" ADD COLUMN "hero_style" "enum_posts_hero_style";
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_style" "enum__posts_v_version_hero_style";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" DROP COLUMN IF EXISTS "hero_style";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_hero_style";
  DROP TYPE "public"."enum_posts_hero_style";
  DROP TYPE "public"."enum__posts_v_version_hero_style";`)
}
