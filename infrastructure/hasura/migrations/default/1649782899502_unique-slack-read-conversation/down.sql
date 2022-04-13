

alter table "public"."user_slack_conversation_read" drop constraint "user_slack_conversation_read_user_slack_installation_id_slack_conversation_id_key";

comment on column "public"."user_slack_conversation_read"."slack_thread_ts" is E'A debounce buffer for marking slack messages as read when their notifications resolve';
alter table "public"."user_slack_conversation_read" alter column "slack_thread_ts" drop not null;
alter table "public"."user_slack_conversation_read" add column "slack_thread_ts" text;
