CREATE TABLE "public"."user_slack_conversation_read"
(
    "id"                         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "user_slack_installation_id" uuid        NOT NULL REFERENCES user_slack_installation ("id"),
    "slack_conversation_id"      text        NOT NULL,
    "slack_last_message_ts"      text        NOT NULL,
    "slack_thread_ts"            text,
    "created_at"                 timestamptz NOT NULL DEFAULT now(),
    "updated_at"                 timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);
COMMENT ON TABLE "public"."user_slack_conversation_read" IS E'A debounce buffer for marking slack messages as read when their notifications resolve';
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
CREATE TRIGGER "set_public_user_slack_conversation_read_updated_at"
    BEFORE UPDATE
    ON "public"."user_slack_conversation_read"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_slack_conversation_read_updated_at" ON "public"."user_slack_conversation_read"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

create index "user_slack_conversation_read_updated_at_idx" on "public"."user_slack_conversation_read" ("updated_at");
create index "user_slack_conversation_read_slack_conversation_id_idx" on "public"."user_slack_conversation_read" ("slack_conversation_id");
create index "user_slack_conversation_read_slack_thread_ts_idx" on "public"."user_slack_conversation_read" ("slack_thread_ts");