ALTER TABLE notification_slack_mention RENAME TO notification_slack_message;

ALTER TABLE "public".notification_slack_message
  ADD CONSTRAINT "notification_slack_mention_slack_conversation_id_slack_message_ts_key" UNIQUE ("slack_conversation_id", "slack_message_ts");

ALTER TABLE "public".notification_slack_message
  ADD COLUMN "is_mention" BOOLEAN
    NOT NULL DEFAULT 'False';

ALTER TABLE "public".notification_slack_message
  ADD COLUMN "slack_thread_ts" TEXT
    NULL;

  ALTER TABLE "public"."notification_slack_message"
  DROP COLUMN "from";

ALTER TABLE "public"."notification"
  ADD COLUMN "from" TEXT NOT NULL;

ALTER TABLE "public"."notification_slack_message"
  RENAME COLUMN "channel_name" TO "conversation_name";

ALTER TABLE "public"."notification_slack_message"
  RENAME COLUMN "is_private_message" TO "is_private_conversation";
