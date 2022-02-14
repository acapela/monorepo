
alter table "public"."notification_slack_message" drop column "is_private_conversation" cascade;

alter table "public"."notification_filter" rename to "notification_list";

alter table "public"."notification_list" rename column "data" to "filters";