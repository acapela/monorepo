
CREATE TABLE "public"."user_slack_channels_by_team" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "slack_workspace_id" text NOT NULL, "included_channels" jsonb NOT NULL DEFAULT '[]'::jsonb, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."user_slack_channels_by_team" add column "created_at" timestamptz
 null default now();

alter table "public"."user_slack_channels_by_team" add column "updated_at" timestamptz
 null default now();

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
CREATE TRIGGER "set_public_user_slack_channels_by_team_updated_at"
BEFORE UPDATE ON "public"."user_slack_channels_by_team"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_slack_channels_by_team_updated_at" ON "public"."user_slack_channels_by_team" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

alter table "public"."user_slack_channels_by_team" add constraint "user_slack_channels_by_team_user_id_slack_workspace_id_key" unique ("user_id", "slack_workspace_id");
