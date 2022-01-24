
alter table "public"."notification" alter column "title" drop not null;
alter table "public"."notification" add column "title" text;

alter table "public"."notification_notion_user_mentioned" drop constraint "notification_notion_user_mentioned_notification_id_fkey";

DROP TABLE "public"."notification_notion_user_mentioned";

DROP TABLE "public"."notion_page";

alter table "public"."notification" alter column "source_id" drop not null;
alter table "public"."notification" add column "source_id" text;

alter table "public"."notification" alter column "source" drop not null;
alter table "public"."notification" add column "source" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification" add column "source_id" text
--  not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification" add column "source" text
--  not null;
