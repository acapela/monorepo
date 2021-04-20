ALTER TABLE "public"."message" ADD COLUMN "media_url" text;
ALTER TABLE "public"."message" ALTER COLUMN "media_url" DROP NOT NULL;

alter table "public"."message_attachments" add constraint "message_attachments_attachment_id_key" unique ("attachment_id");

alter table "public"."message_attachments" add constraint "message_attachments_message_id_key" unique ("message_id");

ALTER TABLE "public"."message" DROP COLUMN "is_draft";

ALTER TABLE "public"."message" ADD COLUMN "is_draft" text;
ALTER TABLE "public"."message" ALTER COLUMN "is_draft" DROP NOT NULL;
ALTER TABLE "public"."message" ALTER COLUMN "is_draft" SET DEFAULT false;

ALTER TABLE "public"."message" ALTER COLUMN "is_draft" TYPE boolean;

ALTER TABLE "public"."message" DROP COLUMN "is_draft";

ALTER TABLE "public"."attachment" DROP COLUMN "original_name";

ALTER TABLE "public"."attachment" ADD COLUMN "url" text;
ALTER TABLE "public"."attachment" ALTER COLUMN "url" DROP NOT NULL;

DROP TABLE "public"."message_attachments";

DROP TABLE "public"."attachment";
