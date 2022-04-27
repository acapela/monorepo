
CREATE TABLE "public"."notification_drive" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "notification_id" uuid NOT NULL, "gmail_account_id" uuid NOT NULL, "gmail_message_id" text NOT NULL, "gmail_thread_id" text, "google_drive_file_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("gmail_message_id"), UNIQUE ("id"), UNIQUE ("google_drive_file_id"));
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
CREATE TRIGGER "set_public_notification_drive_updated_at"
BEFORE UPDATE ON "public"."notification_drive"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_drive_updated_at" ON "public"."notification_drive" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."google_drive_file" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "google_drive_original_file_id" text NOT NULL, "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("google_drive_original_file_id"), UNIQUE ("id"));
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
CREATE TRIGGER "set_public_google_drive_file_updated_at"
BEFORE UPDATE ON "public"."google_drive_file"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_google_drive_file_updated_at" ON "public"."google_drive_file" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notification_drive"
  add constraint "notification_drive_google_drive_file_id_fkey"
  foreign key ("google_drive_file_id")
  references "public"."google_drive_file"
  ("id") on update cascade on delete cascade;

alter table "public"."google_drive_file" add column "source" text
 not null;

alter table "public"."notification_drive" add column "type" text;

CREATE TABLE "public"."google_drive_activity_type" ("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

INSERT INTO "public"."google_drive_activity_type" (value)
VALUES ('invitation'),
       ('mention'),
       ('comment'),
       ('suggestion');

alter table "public"."notification_drive"
  add constraint "notification_drive_type_fkey"
  foreign key ("type")
  references "public"."google_drive_activity_type"
  ("value") on update cascade on delete set null;

alter table "public"."notification_drive" drop constraint "notification_drive_google_drive_file_id_key";
