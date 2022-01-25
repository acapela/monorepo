
alter table "public"."notification_notion_user_mentioned" add column "notion_page_title" text
 not null;

alter table "public"."notification_notion_user_mentioned" drop constraint "notification_notion_user_mentioned_notion_page_id_fkey";

DROP table "public"."notion_page";

alter table "public"."notification_notion_user_mentioned" add constraint "notification_notion_user_mentioned_notification_id_key" unique ("notification_id");
