alter table "public"."notification_notion_user_mentioned" alter column "from" drop not null;
alter table "public"."notification_notion_user_mentioned" add column "from" text;
