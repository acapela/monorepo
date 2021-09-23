CREATE VIEW team_invitation_info AS
SELECT team_invitation.id,
       team.name             AS team_name,
       inviting_user.name    AS inviter_name,
       team_invitation.token AS token,
       team_invitation.email AS email
FROM team_invitation
LEFT JOIN team ON team.id = team_invitation.team_id
LEFT JOIN "user" inviting_user ON inviting_user.id = team_invitation.inviting_user_id;
