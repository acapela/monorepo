

alter table "public"."alert_read_receipt" add column "alert_id" uuid
 not null;

alter table "public"."alert_read_receipt" add constraint "alert_read_receipt_id_user_id_key" unique ("id", "user_id");

alter table "public"."alert_read_receipt"
  add constraint "alert_read_receipt_alert_id_fkey"
  foreign key ("alert_id")
  references "public"."alert"
  ("id") on update cascade on delete cascade;

alter table "public"."alert_read_receipt" add constraint "alert_read_receipt_alert_id_key" unique ("alert_id");

alter table "public"."alert_read_receipt" drop constraint "alert_read_receipt_alert_id_key";

alter table "public"."alert_read_receipt" drop constraint "alert_read_receipt_id_user_id_key";
alter table "public"."alert_read_receipt" add constraint "alert_read_receipt_id_user_id_alert_id_key" unique ("id", "user_id", "alert_id");

alter table "public"."alert_read_receipt" add column "updated_at" timestamptz
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
CREATE TRIGGER "set_public_alert_read_receipt_updated_at"
BEFORE UPDATE ON "public"."alert_read_receipt"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_alert_read_receipt_updated_at" ON "public"."alert_read_receipt" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."alert_read_receipt" alter column "read_at" set default now();
alter table "public"."alert_read_receipt" alter column "read_at" set not null;
