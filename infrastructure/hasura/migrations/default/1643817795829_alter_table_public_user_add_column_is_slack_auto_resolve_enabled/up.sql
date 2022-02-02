alter table "public"."user" add column "is_slack_auto_resolve_enabled" boolean
 not null default 'False';
