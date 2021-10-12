DELETE
FROM "task"
WHERE user_id IS NULL;

ALTER TABLE "public"."task"
  DROP CONSTRAINT "task_has_user_id_or_team_invitation_id",
  DROP COLUMN "team_invitation_id" CASCADE,
  ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "public"."team_member_slack_installation"
  RENAME TO "team_member_slack";

ALTER TABLE "public"."team_member_slack"
  ALTER COLUMN "data" DROP NOT NULL;
ALTER TABLE "public"."team_member_slack"
  RENAME COLUMN "data" TO "installation_data";

ALTER TABLE "public"."team_invitation"
  ALTER COLUMN "used_by_user_id" SET NOT NULL;
ALTER TABLE "public"."team_invitation"
  RENAME COLUMN "used_by_user_id" TO "user_id";

DROP VIEW "public"."team_invitation_info";

DROP TABLE "public"."team_invitation";


alter table "public"."team_member_slack" add column "created_at" timestamptz
  not null default now();

alter table "public"."team_member_slack" add column "updated_at" timestamptz
  not null default now();

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
CREATE TRIGGER "set_public_team_member_slack_updated_at"
  BEFORE UPDATE ON "public"."team_member_slack"
  FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_member_slack_updated_at" ON "public"."team_member_slack"
  IS 'trigger to set value of column "updated_at" to current timestamp on row update';
