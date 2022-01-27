
CREATE TABLE "public"."notification_notion" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "notion_original_notification_id" uuid NOT NULL, "page_id" uuid NOT NULL, "page_title" uuid NOT NULL, "notification_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("notion_original_notification_id"), UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notification_notion" add column "created_at" timestamptz
 null default now();

alter table "public"."notification_notion" add column "updated_at" timestamptz
 null default now();

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
CREATE TRIGGER "set_public_notification_notion_updated_at"
BEFORE UPDATE ON "public"."notification_notion"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_notion_updated_at" ON "public"."notification_notion" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."notification_notion_commented" rename column "notification_id" to "notification_notion_id";

alter table "public"."notification_notion_commented" drop constraint "notification_notion_commented_notification_id_fkey",
  add constraint "notification_notion_commented_notification_notion_id_fkey"
  foreign key ("notification_notion_id")
  references "public"."notification_notion"
  ("id") on update cascade on delete cascade;

alter table "public"."notification_notion_commented" drop column "notion_page_title" cascade;

alter table "public"."notification_notion_commented" drop column "notion_page_id" cascade;

alter table "public"."notification_notion_user_mentioned" drop column "notion_page_id" cascade;

alter table "public"."notification_notion_user_mentioned" drop column "notion_page_title" cascade;

alter table "public"."notification_notion_user_mentioned" rename column "notification_id" to "notification_notion_id";

alter table "public"."notification_notion_user_mentioned"
  add constraint "notification_notion_user_mentioned_notification_notion_id_fk"
  foreign key ("notification_notion_id")
  references "public"."notification_notion"
  ("id") on update cascade on delete cascade;

alter table "public"."notification_notion_user_mentioned" drop constraint "notification_notion_user_mentioned_notification_id_fkey";

CREATE TABLE "public"."notification_notion_user_invited" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "notification_notion_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notification_notion_id") REFERENCES "public"."notification_notion"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("notification_notion_id"), UNIQUE ("id"));
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
CREATE TRIGGER "set_public_notification_notion_user_invited_updated_at"
BEFORE UPDATE ON "public"."notification_notion_user_invited"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_notion_user_invited_updated_at" ON "public"."notification_notion_user_invited" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
