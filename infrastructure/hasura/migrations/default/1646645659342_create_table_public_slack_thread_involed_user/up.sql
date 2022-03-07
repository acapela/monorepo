CREATE TABLE "public"."slack_thread_involed_user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "thread_ts" Text NOT NULL, "user_id" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("thread_ts", "user_id"));COMMENT ON TABLE "public"."slack_thread_involed_user" IS E'Collect mentioned or authoring users within a thread to reduce Slack API requests';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
