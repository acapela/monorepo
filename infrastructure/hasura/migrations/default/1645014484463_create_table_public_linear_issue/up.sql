

CREATE TABLE "public"."linear_issue" ("id" uuid NOT NULL, "organization_id" uuid NOT NULL, "title" text, "url" text, "data" jsonb, "last_webhook_action" text, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
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
CREATE TRIGGER "set_public_linear_issue_updated_at"
BEFORE UPDATE ON "public"."linear_issue"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_linear_issue_updated_at" ON "public"."linear_issue" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
