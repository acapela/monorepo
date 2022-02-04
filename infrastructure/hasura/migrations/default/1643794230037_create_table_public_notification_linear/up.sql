CREATE TABLE "public"."notification_linear" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "notification_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "type" text NOT NULL, "issue_id" uuid NOT NULL,
    "issue_title" text NOT NULL, PRIMARY KEY ("id") ,
    FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
CREATE TRIGGER "set_public_notification_linear_updated_at"
    BEFORE UPDATE ON "public"."notification_linear"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_linear_updated_at" ON "public"."notification_linear"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
