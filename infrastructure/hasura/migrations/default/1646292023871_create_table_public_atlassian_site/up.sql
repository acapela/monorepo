CREATE TABLE "public"."atlassian_site" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "atlassian_cloud_id" text NOT NULL, "name" text NOT NULL, "url" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("atlassian_cloud_id"), UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
