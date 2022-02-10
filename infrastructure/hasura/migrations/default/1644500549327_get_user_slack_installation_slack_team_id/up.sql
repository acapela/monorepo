CREATE FUNCTION get_user_slack_installation_slack_team_id(user_slack_installation_row user_slack_installation)
  RETURNS TEXT AS $$
 select data -> 'team' ->> 'id' from user_slack_installation
$$ LANGUAGE sql STABLE;
