alter table "public"."topic" drop constraint "topic_owner_id_fkey";

ALTER TABLE "public"."topic" DROP COLUMN "owner_id";
