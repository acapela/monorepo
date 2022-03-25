alter table "public"."user_slack_channels_by_team" add constraint "user_slack_channels_by_team_user_slack_installation_id_key" unique ("user_slack_installation_id");
