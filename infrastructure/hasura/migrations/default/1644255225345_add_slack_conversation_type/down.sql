
alter table "public"."notification_slack_message" drop constraint "notification_slack_message_conversation_type_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_slack_message" add column "conversation_type" text
--  null;

DROP TABLE "public"."slack_conversation_type";
