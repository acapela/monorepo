CREATE TABLE "public"."notification_linear" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "notification_id" uuid NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    "type" text NOT NULL, "issue_id" uuid NOT NULL,
    "issue_title" text NOT NULL, PRIMARY KEY ("id") ,
    FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON UPDATE cascade ON DELETE cascade,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
