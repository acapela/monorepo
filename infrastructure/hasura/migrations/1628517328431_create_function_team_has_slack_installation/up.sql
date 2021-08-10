CREATE FUNCTION team_has_slack_installation(team_row TEAM)
  RETURNS BOOLEAN AS
$$
SELECT EXISTS(SELECT 1 FROM team_slack_installation WHERE team_id = team_row.id)
$$ LANGUAGE sql STABLE;
