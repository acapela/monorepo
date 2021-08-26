alter table "public"."team_invitation" add constraint "team_invitation_team_id_email_key" unique ("team_id", "email");
