CREATE TABLE "public"."processed_message" ("id" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );COMMENT ON TABLE "public"."processed_message" IS E'this table is used to mark messages from google pubsub as processed';
