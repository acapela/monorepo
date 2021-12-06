
CREATE TABLE "public"."slack_notification_queue" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "team_member_slack_id" uuid NOT NULL, "payload" jsonb NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("team_member_slack_id") REFERENCES "public"."team_member_slack"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

comment on TABLE "public"."slack_notification_queue" is E'Serves as queue for notifications sent to user outside of work hours';
