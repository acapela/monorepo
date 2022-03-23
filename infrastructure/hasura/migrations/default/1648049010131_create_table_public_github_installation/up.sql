CREATE TABLE "public"."github_installation" ("id" integer NOT NULL, "account_id" integer NOT NULL, "account_login" text NOT NULL, "target_type" text NOT NULL, "repository_selection" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_github_installation_updated_at"
BEFORE UPDATE ON "public"."github_installation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_github_installation_updated_at" ON "public"."github_installation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
