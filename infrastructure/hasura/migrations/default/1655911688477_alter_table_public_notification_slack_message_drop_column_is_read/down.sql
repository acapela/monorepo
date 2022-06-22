alter table "public"."notification_slack_message" alter column "is_read" set default false;
alter table "public"."notification_slack_message" alter column "is_read" drop not null;
alter table "public"."notification_slack_message" add column "is_read" bool;
