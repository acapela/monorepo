
CREATE TABLE "public"."user_group"
(
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "name"       TEXT        NOT NULL,
  "team_id"    UUID        NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("team_id") REFERENCES "public"."team" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE ("team_id", "name")
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
  RETURNS TRIGGER AS
$$
DECLARE
  _new RECORD;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_user_group_updated_at"
  BEFORE UPDATE
  ON "public"."user_group"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_group_updated_at" ON "public"."user_group"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."user_group_member" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_group_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_group_id") REFERENCES "public"."user_group"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("user_group_id", "user_id"));
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
CREATE TRIGGER "set_public_user_group_member_updated_at"
BEFORE UPDATE ON "public"."user_group_member"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_group_member_updated_at" ON "public"."user_group_member"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
