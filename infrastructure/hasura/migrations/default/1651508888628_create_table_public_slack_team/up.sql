CREATE TABLE "public"."slack_team"
(
    "id"             uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"     timestamptz NOT NULL DEFAULT now(),
    "updated_at"     timestamptz NOT NULL DEFAULT now(),
    "slack_team_id"  text        NOT NULL,
    "team_info_data" jsonb       NOT NULL,
    PRIMARY KEY ("id"),
    UNIQUE ("slack_team_id")
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_slack_team_updated_at"
    BEFORE UPDATE
    ON "public"."slack_team"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_slack_team_updated_at" ON "public"."slack_team"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table user_slack_installation
    add constraint user_slack_installation_team_id_fk foreign key (slack_team_id) references slack_team (slack_team_id);