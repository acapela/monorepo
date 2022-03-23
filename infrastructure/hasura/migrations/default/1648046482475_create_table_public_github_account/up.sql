CREATE TABLE "public"."github_account" ("user_id" uuid NOT NULL, "github_login" text NOT NULL, "github_user_id" integer NOT NULL, "github_installation_id" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id","github_user_id","github_installation_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade);
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
CREATE TRIGGER "set_public_github_account_updated_at"
BEFORE UPDATE ON "public"."github_account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_github_account_updated_at" ON "public"."github_account" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
