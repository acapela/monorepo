
alter table "public"."slack_notification_queue" add column "topic_id" uuid
 null;

TRUNCATE slack_notification_queue;

ALTER TABLE "public"."slack_notification_queue" ALTER COLUMN "payload" TYPE text;

