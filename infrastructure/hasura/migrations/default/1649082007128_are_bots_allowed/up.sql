
alter table "public"."user_slack_channels_by_team" add column "are_bots_enabled" boolean
 null default 'true';

alter table "public"."user_slack_channels_by_team" alter column "are_bots_enabled" set default 'true';
