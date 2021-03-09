CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."account"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "provider_id" Text NOT NULL, "provider_type" text NOT NULL, "provider_account_id" text NOT NULL, "refresh_token" text, "access_token" text, "access_token_expires" timestamptz, "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_account_updated_at"
BEFORE UPDATE ON "public"."account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_account_updated_at" ON "public"."account"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
