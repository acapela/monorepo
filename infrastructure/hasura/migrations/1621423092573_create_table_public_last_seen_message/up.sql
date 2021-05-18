CREATE TABLE "public"."last_seen_message"("user_id" uuid NOT NULL, "topic_id" uuid NOT NULL, "message_id" uuid NOT NULL, "seen_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id","topic_id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_seen_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."seen_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_last_seen_message_seen_at"
BEFORE UPDATE ON "public"."last_seen_message"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_seen_at"();
COMMENT ON TRIGGER "set_public_last_seen_message_seen_at" ON "public"."last_seen_message" 
IS 'trigger to set value of column "seen_at" to current timestamp on row update';
