alter table "public"."message" add column "updated_at" timestamptz
 not null default now();

create index message_updated_at_idx on "public"."message"("updated_at");

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
CREATE TRIGGER "set_public_message_updated_at"
BEFORE UPDATE ON "public"."message"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_message_updated_at" ON "public"."message"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


