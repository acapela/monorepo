CREATE FUNCTION team_member_slack_scopes(team_member_slack_row team_member_slack)
RETURNS JSONB AS $$
  SELECT (team_member_slack_row.installation_data ->> 'scopes')::jsonb
$$ LANGUAGE sql STABLE;
