
CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."team_slack_installation" add column "id" uuid
 not null default gen_random_uuid();

alter table "public"."team_slack_installation" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_team_slack_installation_updated_at"
BEFORE UPDATE ON "public"."team_slack_installation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_slack_installation_updated_at" ON "public"."team_slack_installation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
