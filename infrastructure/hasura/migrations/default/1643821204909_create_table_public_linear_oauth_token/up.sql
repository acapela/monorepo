
CREATE TABLE "public"."linear_oauth_token" ("user_id" uuid NOT NULL, "access_token" text, "expires_at" timestamptz, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id","access_token") );

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
CREATE TRIGGER "set_public_linear_oauth_token_updated_at"
BEFORE UPDATE ON "public"."linear_oauth_token"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_linear_oauth_token_updated_at" ON "public"."linear_oauth_token"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
