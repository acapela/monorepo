CREATE TABLE "public"."notification_status_label" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "user_id" uuid NOT NULL, "order" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
