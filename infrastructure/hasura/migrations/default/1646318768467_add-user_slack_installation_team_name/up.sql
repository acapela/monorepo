CREATE OR REPLACE FUNCTION public.user_slack_installation_team_id(installation_row user_slack_installation)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  SELECT (installation_row.data -> 'team' ->> 'id')::text
$function$;

CREATE OR REPLACE FUNCTION public.user_slack_installation_team_name(installation_row user_slack_installation)
    RETURNS text
    LANGUAGE sql
    STABLE
AS $function$
SELECT (installation_row.data -> 'team' ->> 'name')::text
$function$;
