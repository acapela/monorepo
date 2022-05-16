
CREATE TABLE "public"."alerts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid, "kind" text NOT NULL DEFAULT 'default', "app_version_range" text, "link" text, "content_type" text NOT NULL DEFAULT 'text/plain', "title" text, "body" text NOT NULL, "received_at" timestamptz, "connected_integrations" jsonb, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_alerts_updated_at"
BEFORE UPDATE ON "public"."alerts"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_alerts_updated_at" ON "public"."alerts" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."alerts" add column "expires_at" timestamptz
 null;

alter table "public"."alerts" drop column "received_at" cascade;

alter table "public"."alerts" rename to "alert";

CREATE TABLE "public"."alert_read_receipt" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "read_at" timestamptz, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
