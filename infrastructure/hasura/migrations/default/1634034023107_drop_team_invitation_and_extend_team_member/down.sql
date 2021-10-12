
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."team_member_slack" add column "updated_at" timestamptz
--  not null default now();
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
-- CREATE TRIGGER "set_public_team_member_slack_updated_at"
-- BEFORE UPDATE ON "public"."team_member_slack"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_team_member_slack_updated_at" ON "public"."team_member_slack"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."team_member_slack" add column "created_at" timestamptz
--  not null default now();


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."team_invitation";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP VIEW "public"."team_invitation_info";

alter table "public"."team_invitation" alter column "slack_user_id" drop not null;
alter table "public"."team_invitation" add column "slack_user_id" text;

alter table "public"."team_invitation"
  add constraint "team_invitation_used_by_user_id_fkey"
  foreign key (user_id)
  references "public"."user"
  (id) on update cascade on delete cascade;
alter table "public"."team_invitation" alter column "user_id" drop not null;
alter table "public"."team_invitation" add column "user_id" uuid;

alter table "public"."team_invitation" rename column "user_id" to "used_by_user_id";
alter table "public"."team_invitation" alter column "used_by_user_id" drop not null;

alter table "public"."team_member_slack" rename column "installation_data" to "data";
alter table "public"."team_member_slack" alter column "data" set not null;

alter table "public"."team_member_slack" rename to "team_member_slack_installation";

alter table "public"."task" alter column "user_id" drop not null;

alter table "public"."task"
  add constraint "task_team_invitation_id_fkey"
  foreign key (team_invitation_id)
  references "public"."team_invitation"
  (id) on update no action on delete cascade;
alter table "public"."task" alter column "team_invitation_id" drop not null;
alter table "public"."task" add column "team_invitation_id" uuid;

alter table "public"."task" add constraint "task_has_user_id_or_team_invitation_id" check (CHECK (user_id IS NOT NULL OR team_invitation_id IS NOT NULL));
