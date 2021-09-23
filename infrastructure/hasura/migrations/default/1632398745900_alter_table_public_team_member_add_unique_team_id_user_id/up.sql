alter table "public"."team_member" add constraint "team_member_team_id_user_id_key" unique ("team_id", "user_id");
