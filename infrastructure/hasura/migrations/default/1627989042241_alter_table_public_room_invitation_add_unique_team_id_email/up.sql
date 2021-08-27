alter table "public"."room_invitation" add constraint "room_invitation_team_id_email_key" unique ("team_id", "email");
