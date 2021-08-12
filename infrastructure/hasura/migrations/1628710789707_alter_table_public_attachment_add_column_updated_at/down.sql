DROP TRIGGER IF EXISTS "set_public_attachment_updated_at" ON "public"."attachment";
ALTER TABLE "public"."attachment" DROP COLUMN "updated_at";
