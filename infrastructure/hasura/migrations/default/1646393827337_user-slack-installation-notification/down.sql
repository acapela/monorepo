
alter table "public"."notification_slack_message" drop constraint "notification_slack_message_user_slack_installation_id_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_slack_message" add column "user_slack_installation_id" uuid
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.user_slack_installation_team_name(installation_row user_slack_installation)
--  RETURNS text
--  LANGUAGE sql
--  STABLE
-- AS $function$
--   SELECT (installation_row.data -> 'team' ->> 'name')::text
-- $function$;
