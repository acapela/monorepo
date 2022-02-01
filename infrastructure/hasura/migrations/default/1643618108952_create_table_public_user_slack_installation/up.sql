CREATE TABLE "public"."user_slack_installation"
(
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    UUID        NOT NULL,
  "data"       JSONB       NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);
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
CREATE TRIGGER "set_public_user_slack_installation_updated_at"
  BEFORE UPDATE
  ON "public"."user_slack_installation"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_slack_installation_updated_at" ON "public"."user_slack_installation"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION has_slack_installation(user_row "user")
  RETURNS BOOLEAN AS $$
SELECT EXISTS (SELECT * FROM user_slack_installation WHERE user_id = user_row.id);
$$ LANGUAGE sql STABLE;
