CREATE TABLE "public"."notification_notion_reminder" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "notification_notion_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("notification_notion_id") REFERENCES "public"."notification_notion"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("notification_notion_id"), UNIQUE ("id"));
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
CREATE TRIGGER "set_public_notification_notion_reminder_updated_at"
BEFORE UPDATE ON "public"."notification_notion_reminder"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_notion_reminder_updated_at" ON "public"."notification_notion_reminder" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
