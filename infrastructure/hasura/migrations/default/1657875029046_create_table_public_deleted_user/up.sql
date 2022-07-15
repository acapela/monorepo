CREATE TABLE "public"."deleted_user" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
