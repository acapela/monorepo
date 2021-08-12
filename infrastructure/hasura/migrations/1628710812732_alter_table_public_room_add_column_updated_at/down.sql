DROP TRIGGER IF EXISTS "set_public_room_updated_at" ON "public"."room";
ALTER TABLE "public"."room" DROP COLUMN "updated_at";
