CREATE OR REPLACE FUNCTION delete_single_team_slack_installation(from_team_id uuid)
  RETURNS SETOF team
AS
$$
BEGIN
  DELETE FROM team_slack_installation WHERE team_id = from_team_id;
  RETURN QUERY SELECT * FROM team WHERE id = from_team_id;
END
$$ LANGUAGE 'plpgsql' VOLATILE;
