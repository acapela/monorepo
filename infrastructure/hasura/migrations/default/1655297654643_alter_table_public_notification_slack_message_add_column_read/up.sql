ALTER TABLE
    "public"."notification_slack_message"
ADD
    COLUMN "is_read" boolean NOT NULL DEFAULT 'false';
