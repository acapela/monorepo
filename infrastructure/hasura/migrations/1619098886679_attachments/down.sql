
ALTER TABLE "public"."message" ADD COLUMN "media_url" text;

ALTER TABLE "public"."message" DROP COLUMN "is_draft";

DROP TABLE "public"."message_attachments";

alter table "public"."attachment" drop constraint "attachment_id_key";

DROP TABLE "public"."attachment";

