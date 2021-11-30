CREATE FUNCTION team_slack_installation_scopes(team_slack_installation_row team_slack_installation)
RETURNS JSONB AS $$
  SELECT (team_slack_installation_row.data -> 'bot' ->> 'scopes')::jsonb
$$ LANGUAGE sql STABLE;
