
alter table "public"."room" drop constraint "room_owner_id_fkey";

ALTER TABLE "public"."room" DROP COLUMN "owner_id";
