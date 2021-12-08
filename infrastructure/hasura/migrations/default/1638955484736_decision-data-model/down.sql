
alter table "public"."decision_vote" alter column "updated_at" drop not null;

alter table "public"."decision_vote" alter column "created_at" drop not null;

alter table "public"."decision_vote" alter column "updated_at" set not null;

alter table "public"."decision_vote" alter column "created_at" set not null;


-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decision_vote" add column "updated_at" timestamptz
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
-- CREATE TRIGGER "set_public_decision_vote_updated_at"
-- BEFORE UPDATE ON "public"."decision_vote"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_decision_vote_updated_at" ON "public"."decision_vote"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."decision_vote" alter column "created_at" drop not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decision_vote" add column "created_at" timestamptz
--  null default now();


DROP TABLE "public"."decision_vote";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
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
-- CREATE TRIGGER "set_public_decision_option_updated_at"
-- BEFORE UPDATE ON "public"."decision_option"
-- FOR EACH ROW
-- EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
-- COMMENT ON TRIGGER "set_public_decision_option_updated_at" ON "public"."decision_option"
-- IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decision_option" add column "updated_at" timestamptz
--  not null default now();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."decision_option" add column "created_at" timestamptz
--  not null default now();

DROP TABLE "public"."decision_option";
