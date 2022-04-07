CREATE TABLE "public"."notification_asana" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "notification_id" uuid NOT NULL, "task_id" text NOT NULL, "project_id" text NOT NULL, "type" text NOT NULL, "title" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_notification_asana_updated_at"
BEFORE UPDATE ON "public"."notification_asana"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_asana_updated_at" ON "public"."notification_asana" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
