
ALTER TABLE "public"."message" ADD COLUMN "content" jsonb NOT NULL DEFAULT jsonb_build_array();

alter table "public"."message" drop constraint "check_text_message_text_not_null";

ALTER TABLE "public"."message" DROP COLUMN "text" CASCADE;
