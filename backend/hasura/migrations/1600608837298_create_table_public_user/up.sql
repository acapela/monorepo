CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."user"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" text NOT NULL, "firebase_id" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("email"), UNIQUE ("firebase_id"));
