alter table "public"."user" add column "slack_included_channels" jsonb
 not null default '[]';
