CREATE TABLE "public"."task_slack_message"
(
  "id"                       UUID        NOT NULL DEFAULT gen_random_uuid(),
  "task_id"                  UUID        NOT NULL,
  "slack_channel_id"         TEXT        NOT NULL,
  "slack_message_ts"         TEXT        NOT NULL,
  "created_at"               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "slack_message_updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("task_id") REFERENCES "public"."task" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE ("task_id")
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
CREATE TRIGGER "set_public_task_slack_message_updated_at"
  BEFORE UPDATE
  ON "public"."task_slack_message"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_task_slack_message_updated_at" ON "public"."task_slack_message"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
