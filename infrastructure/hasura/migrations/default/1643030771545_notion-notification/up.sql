
alter table "public"."notification" add column "source" text
 not null;

alter table "public"."notification" add column "source_id" text
 not null;

alter table "public"."notification" drop column "source" cascade;

alter table "public"."notification" drop column "source_id" cascade;

CREATE TABLE "public"."notion_page" ("id" uuid NOT NULL, "title" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."notification_notion_user_mentioned" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "notion_page_id" uuid NOT NULL, "from" text NOT NULL, "notification_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notion_page_id") REFERENCES "public"."notion_page"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_notification_notion_user_mentioned_updated_at"
BEFORE UPDATE ON "public"."notification_notion_user_mentioned"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_notion_user_mentioned_updated_at" ON "public"."notification_notion_user_mentioned" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notification_notion_user_mentioned"
  add constraint "notification_notion_user_mentioned_notification_id_fkey"
  foreign key ("notification_id")
  references "public"."notification"
  ("id") on update cascade on delete cascade;

alter table "public"."notification" drop column "title" cascade;
