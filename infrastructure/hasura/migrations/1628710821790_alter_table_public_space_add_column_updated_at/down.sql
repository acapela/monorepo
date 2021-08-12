DROP TRIGGER IF EXISTS "set_public_space_updated_at" ON "public"."space";
ALTER TABLE "public"."space" DROP COLUMN "updated_at";
