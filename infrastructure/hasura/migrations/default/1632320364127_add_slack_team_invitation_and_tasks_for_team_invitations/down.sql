-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- ALTER TABLE team_invitation
--   ADD COLUMN slack_user_id TEXT,
--   ALTER COLUMN email DROP NOT NULL,
--   ADD CONSTRAINT team_invitation_has_email_or_slack_user_id CHECK (email IS NOT NULL OR slack_user_id IS NOT NULL);
--
-- ALTER TABLE task
--   ADD COLUMN team_invitation_id UUID,
--   ALTER COLUMN user_id DROP NOT NULL,
--   ADD CONSTRAINT task_has_user_id_or_team_invitation_id CHECK (user_id IS NOT NULL OR team_invitation_id IS NOT NULL);
