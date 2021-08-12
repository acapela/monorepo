DROP TRIGGER IF EXISTS "set_public_topic_updated_at" ON "public"."topic";
ALTER TABLE "public"."topic" DROP COLUMN "updated_at";
