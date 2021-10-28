CREATE TABLE "public"."topic_slack_message" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "topic_id" uuid NOT NULL, "slack_channel_id" text NOT NULL, "slack_message_ts" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "slack_message_updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("topic_id"));
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
CREATE TRIGGER "set_public_topic_slack_message_updated_at"
BEFORE UPDATE ON "public"."topic_slack_message"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_topic_slack_message_updated_at" ON "public"."topic_slack_message"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
