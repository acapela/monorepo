comment on column "public"."team_member_slack"."slack_team_id" is E'Individual team member Slack integration for adding team members from private chats automatically to Acapela rooms';
alter table "public"."team_member_slack"
  add constraint "team_member_slack_installation_slack_team_id_fkey"
  foreign key (slack_team_id)
  references "public"."team_slack_installation"
  (slack_team_id) on update cascade on delete cascade;
alter table "public"."team_member_slack" alter column "slack_team_id" drop not null;
alter table "public"."team_member_slack" add column "slack_team_id" text;
