alter table "public"."message" drop constraint "message_replied_to_message_id_fkey";

ALTER TABLE "public"."message" DROP COLUMN "replied_to_message_id";
