alter table "public"."slack_notification_queue" alter column "payload" drop not null;
alter table "public"."slack_notification_queue" add column "payload" text;
