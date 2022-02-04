alter table "public"."notification_slack_message" add constraint "notification_slack_message_slack_conversation_id_slack_message_ts_key" unique ("slack_conversation_id", "slack_message_ts");
