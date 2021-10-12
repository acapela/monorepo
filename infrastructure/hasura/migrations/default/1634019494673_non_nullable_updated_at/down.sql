
alter table "public"."attachment" alter column "updated_at" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."last_seen_message" add column "updated_at" timestamptz
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
-- CREATE TRIGGER "set_public_last_seen_message_updated_at"
-- BEFORE UPDATE ON "public"."last_seen_message"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_last_seen_message_updated_at" ON "public"."last_seen_message"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."message_reaction" alter column "updated_at" drop not null;

alter table "public"."task" alter column "updated_at" drop not null;

alter table "public"."team" alter column "updated_at" drop not null;

alter table "public"."team_invitation" alter column "updated_at" drop not null;

alter table "public"."topic" alter column "updated_at" drop not null;
