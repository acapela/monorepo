
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notion_space_user" add column "is_sync_enabled" boolean
--  not null default 'false';


alter table "public"."notification_notion" drop constraint "notification_notion_notion_space_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_notion" add column "notion_space_id" uuid
--  null;

DROP TABLE "public"."notion_space_user";

alter table "public"."notion_space" rename to "notification_space";

alter table "public"."notification_space" alter column "created_by" set not null;

alter table "public"."notification_space" drop constraint "notification_space_created_by_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_space" add column "created_by" uuid
--  not null;

DROP TABLE "public"."notification_space";
