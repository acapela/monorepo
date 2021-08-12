DROP TRIGGER IF EXISTS "set_public_user_updated_at" ON "public"."user";
ALTER TABLE "public"."user" DROP COLUMN "updated_at";
