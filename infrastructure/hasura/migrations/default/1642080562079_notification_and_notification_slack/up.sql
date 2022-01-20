CREATE TABLE "public"."notification"
(
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     UUID        NOT NULL,
  "title"       TEXT        NOT NULL,
  "url"         TEXT        NOT NULL,
  "resolved_at" TIMESTAMPTZ,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id")
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
CREATE TRIGGER "set_public_notification_updated_at"
  BEFORE UPDATE
  ON "public"."notification"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_updated_at" ON "public"."notification"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."notification_slack_mention"
(
  "id"                    UUID        NOT NULL DEFAULT gen_random_uuid(),
  "slack_conversation_id" TEXT        NOT NULL,
  "slack_message_ts"       TEXT,
  "created_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "notification_id"       UUID        NOT NULL UNIQUE REFERENCES notification(id) ON DELETE CASCADE,
  PRIMARY KEY ("id")
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
CREATE TRIGGER "set_public_notification_slack_mention_updated_at"
  BEFORE UPDATE
  ON "public"."notification_slack_mention"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_slack_mention_updated_at" ON "public"."notification_slack_mention"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE INDEX "notification_slack_mention_slack_conversation_id_idx" ON
  "public"."notification_slack_mention" USING btree ("slack_conversation_id");

CREATE INDEX "notification_slack_mention_slack_message_ts_idx" ON
  "public"."notification_slack_mention" USING btree ("slack_message_ts");

CREATE INDEX "notification_resolved_at_idx" ON
  "public"."notification" USING btree ("resolved_at");
