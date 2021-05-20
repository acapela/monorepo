
alter table "public"."room" drop constraint "room_space_id_fkey";

ALTER TABLE "public"."room" DROP COLUMN "space_id";

alter table "public"."space_participants" drop constraint "space_participants_space_id_fkey";

alter table "public"."space_participants" drop constraint "space_participants_user_id_fkey";

ALTER TABLE "public"."space" DROP COLUMN "creator_id";

DROP TABLE "public"."space_participants";

DROP TABLE "public"."space";
