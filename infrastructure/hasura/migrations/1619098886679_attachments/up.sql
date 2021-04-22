CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."attachment"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "original_name" text NULL, "mime_type" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

alter table "public"."attachment" add constraint "attachment_id_key" unique ("id");

CREATE TABLE "public"."message_attachments"("message_id" uuid NOT NULL, "attachment_id" uuid NOT NULL, PRIMARY KEY ("message_id","attachment_id"), FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON UPDATE cascade ON DELETE cascade);

ALTER TABLE "public"."message" ADD COLUMN "is_draft" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."message" DROP COLUMN "media_url" CASCADE;


