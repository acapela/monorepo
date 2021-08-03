alter table "public"."room_invitation" add constraint "room_invitation_email_team_id_key" unique ("email", "team_id");
