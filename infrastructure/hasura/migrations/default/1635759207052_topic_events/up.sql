

CREATE TABLE "public"."topic_event" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "topic_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."topic_event" add column "actor_id" uuid
 null;

CREATE TABLE "public"."topic_event_topic" ("topic_event_id" uuid NOT NULL, "from_closed_at" timestamptz, "to_closed_at" timestamptz, "from_name" text, "to_name" text, "from_archived_at" timestamptz, "to_archived_at" timestamptz, PRIMARY KEY ("topic_event_id") , FOREIGN KEY ("topic_event_id") REFERENCES "public"."topic_event"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("topic_event_id"));

