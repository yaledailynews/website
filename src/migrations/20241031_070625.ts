import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_posts_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_posts_fk";
  
  DROP INDEX IF EXISTS "posts_rels_posts_id_idx";
  DROP INDEX IF EXISTS "_posts_v_rels_posts_id_idx";
  ALTER TABLE "posts_rels" DROP COLUMN IF EXISTS "posts_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN IF EXISTS "posts_id";`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "posts_id" integer;
  DO $$ BEGIN
   ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");`)
}
