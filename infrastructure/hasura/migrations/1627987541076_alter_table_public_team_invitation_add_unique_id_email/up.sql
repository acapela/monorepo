alter table "public"."team_invitation" add constraint "team_invitation_id_email_key" unique ("id", "email");
