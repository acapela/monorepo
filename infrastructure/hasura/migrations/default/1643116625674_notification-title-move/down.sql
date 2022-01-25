
alter table "public"."notification_notion_user_mentioned" drop constraint "notification_notion_user_mentioned_notification_id_key";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."notion_page";

alter table "public"."notification_notion_user_mentioned"
  add constraint "notification_notion_user_mentioned_notion_page_id_fkey"
  foreign key ("notion_page_id")
  references "public"."notion_page"
  ("id") on update cascade on delete cascade;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_notion_user_mentioned" add column "notion_page_title" text
--  not null;
