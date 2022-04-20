
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


CREATE TABLE "public"."asana_account" ("user_id" uuid NOT NULL, "access_token" text NOT NULL, "refresh_token" text NOT NULL, "asana_user_id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "expires_at" timestamptz NOT NULL, PRIMARY KEY ("user_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("asana_user_id"));

CREATE TRIGGER "set_public_asana_account_updated_at"
BEFORE UPDATE ON "public"."asana_account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_asana_account_updated_at" ON "public"."asana_account" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE TABLE "public"."asana_webhook" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "secret" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."asana_account"("user_id") ON UPDATE cascade ON DELETE cascade );

CREATE TRIGGER "set_public_asana_webhook_updated_at"
BEFORE UPDATE ON "public"."asana_webhook"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_asana_webhook_updated_at" ON "public"."asana_webhook" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
