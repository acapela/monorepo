CREATE OR REPLACE FUNCTION public.user_slack_installation_user_scopes(installation_row user_slack_installation)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  SELECT (installation_row.data -> 'user' ->> 'scopes')::jsonb
$function$;
