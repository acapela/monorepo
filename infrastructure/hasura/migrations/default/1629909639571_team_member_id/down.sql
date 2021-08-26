
alter table "public"."team_member_slack_installation" drop constraint "team_member_slack_installation_pkey";
alter table "public"."team_member_slack_installation"
    add constraint "team_member_slack_installation_pkey"
    primary key ("team_member_id");

alter table "public"."team_member_slack_installation" drop column "id" cascade;
alter table "public"."team_member_slack_installation" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

