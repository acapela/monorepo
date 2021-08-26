
CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."team_member" add column "id" uuid
 not null unique default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."team_member" DROP CONSTRAINT "team_membership_pkey";

ALTER TABLE "public"."team_member"
    ADD CONSTRAINT "team_membership_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;

alter table "public"."team_slack_installation" alter column "slack_team_id" set not null;

alter table "public"."team_slack_installation" add constraint "team_slack_installation_slack_team_id_key" unique ("slack_team_id");

CREATE TABLE "public"."team_member_slack_installation" ("team_member_id" uuid NOT NULL, "data" jsonb NOT NULL, "slack_team_id" text NOT NULL, "slack_user_id" text NOT NULL, PRIMARY KEY ("team_member_id") , FOREIGN KEY ("team_member_id") REFERENCES "public"."team_member"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("slack_team_id") REFERENCES "public"."team_slack_installation"("slack_team_id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("team_member_id"));COMMENT ON TABLE "public"."team_member_slack_installation" IS E'Individual team member Slack integration for adding team members from private chats automatically to Acapela rooms';
