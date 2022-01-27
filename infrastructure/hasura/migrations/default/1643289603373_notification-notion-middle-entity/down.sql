
DROP TABLE "public"."notification_notion_user_invited";

alter table "public"."notification_notion_user_mentioned"
  add constraint "notification_notion_user_mentioned_notification_id_fkey"
  foreign key ("notification_notion_id")
  references "public"."notification"
  ("id") on update cascade on delete cascade;

alter table "public"."notification_notion_user_mentioned" drop constraint "notification_notion_user_mentioned_notification_notion_id_fk";

alter table "public"."notification_notion_user_mentioned" rename column "notification_notion_id" to "notification_id";

alter table "public"."notification_notion_user_mentioned" alter column "notion_page_title" drop not null;
alter table "public"."notification_notion_user_mentioned" add column "notion_page_title" text;

alter table "public"."notification_notion_user_mentioned" alter column "notion_page_id" drop not null;
alter table "public"."notification_notion_user_mentioned" add column "notion_page_id" uuid;

alter table "public"."notification_notion_commented" alter column "notion_page_id" drop not null;
alter table "public"."notification_notion_commented" add column "notion_page_id" uuid;

alter table "public"."notification_notion_commented" alter column "notion_page_title" drop not null;
alter table "public"."notification_notion_commented" add column "notion_page_title" text;

alter table "public"."notification_notion_commented" drop constraint "notification_notion_commented_notification_notion_id_fkey",
  add constraint "notification_notion_commented_notification_id_fkey"
  foreign key ("notification_notion_id")
  references "public"."notification"
  ("id") on update cascade on delete cascade;

alter table "public"."notification_notion_commented" rename column "notification_notion_id" to "notification_id";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_notion" add column "updated_at" timestamptz
--  null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_notification_notion_updated_at"
-- BEFORE UPDATE ON "public"."notification_notion"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_notification_notion_updated_at" ON "public"."notification_notion"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_notion" add column "created_at" timestamptz
--  null default now();

DROP TABLE "public"."notification_notion";
