CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."team_member_slack_installation" add column "id" uuid
 not null unique default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."team_member_slack_installation" DROP CONSTRAINT "team_member_slack_installation_pkey";

ALTER TABLE "public"."team_member_slack_installation"
    ADD CONSTRAINT "team_member_slack_installation_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
