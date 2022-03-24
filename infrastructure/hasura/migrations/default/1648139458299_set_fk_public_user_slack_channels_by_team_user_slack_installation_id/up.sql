alter table "public"."user_slack_channels_by_team"
  add constraint "user_slack_channels_by_team_user_slack_installation_id_fkey"
  foreign key ("user_slack_installation_id")
  references "public"."user_slack_installation"
  ("id") on update cascade on delete cascade;
