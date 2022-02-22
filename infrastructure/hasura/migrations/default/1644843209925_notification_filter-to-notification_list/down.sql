
alter table "public"."notification_list" rename column "filters" to "data";

alter table "public"."notification_list" rename to "notification_filter";

alter table "public"."notification_slack_message" alter column "is_private_conversation" set default false;
alter table "public"."notification_slack_message" alter column "is_private_conversation" drop not null;
alter table "public"."notification_slack_message" add column "is_private_conversation" bool;
