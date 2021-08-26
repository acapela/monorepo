
DROP TABLE "public"."team_member_slack_installation";

alter table "public"."team_slack_installation" drop constraint "team_slack_installation_slack_team_id_key";

alter table "public"."team_slack_installation" alter column "slack_team_id" drop not null;

alter table "public"."team_member" drop constraint "team_member_pkey";
alter table "public"."team_member"
    add constraint "team_membership_pkey"
    primary key ("team_id", "user_id");

alter table "public"."team_member" drop column "id" cascade
alter table "public"."team_member" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
