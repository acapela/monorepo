
CREATE TABLE "public"."transcription_status"("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."transcription"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "sonix_media_id" text NOT NULL, "transcript" jsonb, "status" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("status") REFERENCES "public"."transcription_status"("value") ON UPDATE cascade ON DELETE restrict, UNIQUE ("id"), UNIQUE ("sonix_media_id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_transcription_updated_at"
BEFORE UPDATE ON "public"."transcription"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_transcription_updated_at" ON "public"."transcription" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."message" DROP COLUMN "transcription" CASCADE;

ALTER TABLE "public"."message" ADD COLUMN "transcription_id" uuid NULL;

alter table "public"."message"
           add constraint "message_transcription_id_fkey"
           foreign key ("transcription_id")
           references "public"."transcription"
           ("id") on update cascade on delete restrict;
