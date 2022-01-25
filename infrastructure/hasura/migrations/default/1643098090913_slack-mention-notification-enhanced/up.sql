
alter table "public"."notification_slack_mention" add column "from" text
 not null;

alter table "public"."notification_slack_mention" add column "channel_name" text
 not null;

alter table "public"."notification_slack_mention" add column "is_private_message" bool
 not null default 'false';
