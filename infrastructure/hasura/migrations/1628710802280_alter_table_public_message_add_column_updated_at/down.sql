DROP TRIGGER IF EXISTS "set_public_message_updated_at" ON "public"."message";
ALTER TABLE "public"."message" DROP COLUMN "updated_at";
