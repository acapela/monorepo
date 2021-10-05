
alter table "public"."team_member" add column "created_at" timestamptz
 not null default now();

alter table "public"."team_member" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_team_member_updated_at"
BEFORE UPDATE ON "public"."team_member"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_member_updated_at" ON "public"."team_member"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

