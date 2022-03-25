
alter table "public"."user_slack_channels_by_team" drop constraint "user_slack_channels_by_team_user_id_slack_workspace_id_key";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."user_slack_channels_by_team" add column "updated_at" timestamptz
--  null default now();
--
-- CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   _new record;
-- BEGIN
--   _new := NEW;
--   _new."updated_at" = NOW();
--   RETURN _new;
-- END;
-- $$ LANGUAGE plpgsql;
-- CREATE TRIGGER "set_public_user_slack_channels_by_team_updated_at"
-- BEFORE UPDATE ON "public"."user_slack_channels_by_team"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_user_slack_channels_by_team_updated_at" ON "public"."user_slack_channels_by_team"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."user_slack_channels_by_team" add column "created_at" timestamptz
--  null default now();

DROP TABLE "public"."user_slack_channels_by_team";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."user" add column "slack_included_channels_by_team" jsonb
--  null default jsonb_build_object();
