CREATE TABLE "public"."topic_member"
(
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "topic_id"   UUID        NOT NULL,
  "user_id"    UUID        NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("topic_id") REFERENCES "public"."topic" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE ("topic_id", "user_id")
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
CREATE TRIGGER "set_public_topic_member_updated_at"
  BEFORE UPDATE
  ON "public"."topic_member"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_topic_member_updated_at" ON "public"."topic_member"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO topic_member (topic_id, user_id)
SELECT DISTINCT topic_id, (jsonb_path_query(message.content, '$.**.userId') #>> '{}')::UUID AS user_id
FROM message
