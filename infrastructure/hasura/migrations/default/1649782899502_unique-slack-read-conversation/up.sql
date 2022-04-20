
alter table "public"."user_slack_conversation_read" drop column "slack_thread_ts" cascade;


alter table "public"."user_slack_conversation_read" drop constraint if exists "user_slack_conversation_read_user_slack_installation_id_slack_conversation_id_key";
alter table "public"."user_slack_conversation_read" add constraint "user_slack_conversation_read_user_slack_installation_id_slack_conversation_id_key" unique ("user_slack_installation_id", "slack_conversation_id");
