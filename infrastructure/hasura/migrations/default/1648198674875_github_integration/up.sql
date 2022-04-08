
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

CREATE TABLE "public"."github_account" ("user_id" uuid NOT NULL, "github_login" text NOT NULL, "github_user_id" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade);
CREATE TRIGGER "set_public_github_account_updated_at"
BEFORE UPDATE ON "public"."github_account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_github_account_updated_at" ON "public"."github_account" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE TABLE "public"."github_installation" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "installation_id" integer NOT NULL UNIQUE, "account_id" integer NOT NULL, "account_login" text NOT NULL, "target_type" text NOT NULL, "repository_selection" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE TRIGGER "set_public_github_installation_updated_at"
BEFORE UPDATE ON "public"."github_installation"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_github_installation_updated_at" ON "public"."github_installation" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE TABLE "public"."notification_github" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "notification_id" uuid NOT NULL, "type" text NOT NULL, "issue_id" integer NOT NULL, "issue_title" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade);
CREATE TRIGGER "set_public_notification_github_updated_at"
BEFORE UPDATE ON "public"."notification_github"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_github_updated_at" ON "public"."notification_github" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE TABLE "public"."github_account_to_installation" ("user_id" uuid NOT NULL, "installation_id" uuid NOT NULL, PRIMARY KEY ("user_id","installation_id") , FOREIGN KEY ("user_id") REFERENCES "public"."github_account"("user_id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("installation_id") REFERENCES "public"."github_installation"("id") ON UPDATE cascade ON DELETE cascade);
