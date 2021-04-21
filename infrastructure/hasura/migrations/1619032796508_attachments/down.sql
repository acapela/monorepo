
ALTER TABLE "public"."message" ADD COLUMN "media_url" text;

ALTER TABLE "public"."message" DROP COLUMN "is_draft";

DROP TABLE "public"."message_attachments";

DROP TABLE "public"."attachment";

