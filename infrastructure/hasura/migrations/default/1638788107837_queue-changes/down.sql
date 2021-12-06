

ALTER TABLE "public"."slack_notification_queue" ALTER COLUMN "payload" TYPE jsonb;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- TRUNCATE slack_notification_queue;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."slack_notification_queue" add column "topic_id" uuid
--  null;
