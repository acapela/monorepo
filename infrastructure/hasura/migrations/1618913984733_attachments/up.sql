CREATE TABLE "public"."attachment"("id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "url" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."message_attachments"("message_id" uuid NOT NULL, "attachment_id" uuid NOT NULL, PRIMARY KEY ("message_id","attachment_id") , FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("message_id"), UNIQUE ("attachment_id"));

ALTER TABLE "public"."attachment" DROP COLUMN "url" CASCADE;

ALTER TABLE "public"."attachment" ADD COLUMN "original_name" text NULL;

ALTER TABLE "public"."message" ADD COLUMN "is_draft" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."message" ALTER COLUMN "is_draft" TYPE text;

ALTER TABLE "public"."message" DROP COLUMN "is_draft" CASCADE;

ALTER TABLE "public"."message" ADD COLUMN "is_draft" boolean NULL;

alter table "public"."message_attachments" drop constraint "message_attachments_message_id_key";

alter table "public"."message_attachments" drop constraint "message_attachments_attachment_id_key";

ALTER TABLE "public"."message" DROP COLUMN "media_url" CASCADE;

