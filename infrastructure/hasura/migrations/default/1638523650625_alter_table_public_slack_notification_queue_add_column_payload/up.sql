alter table "public"."slack_notification_queue" add column "payload" jsonb
 not null;
