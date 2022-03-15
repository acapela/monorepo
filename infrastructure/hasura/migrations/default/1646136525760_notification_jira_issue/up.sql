CREATE TABLE "public"."notification_jira_issue_type"
(
    "value" text NOT NULL,
    PRIMARY KEY ("value")
);

INSERT INTO notification_jira_issue_type (value)
VALUES ('issue_created'),
       ('issue_updated'),
       ('comment_created'),
       ('comment_updated'),
       ('user_mentioned');

CREATE TABLE "public"."notification_jira_issue"
(
    "id"              uuid        NOT NULL DEFAULT gen_random_uuid(),
    "created_at"      timestamptz NOT NULL DEFAULT now(),
    "updated_at"      timestamptz NOT NULL DEFAULT now(),
    "notification_id" uuid        NOT NULL REFERENCES notification (id),
    "issue_id"        text        NOT NULL,
    "issue_title"     text        NOT NULL,
    "type"            TEXT        NOT NULL REFERENCES notification_jira_issue_type (value),
    PRIMARY KEY ("id")
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
CREATE TRIGGER "set_public_notification_jira_issue_updated_at"
    BEFORE UPDATE
    ON "public"."notification_jira_issue"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_jira_issue_updated_at" ON "public"."notification_jira_issue"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;