CREATE TABLE "public"."whitelist"("email" Text NOT NULL, "timestamp" timestamptz NOT NULL DEFAULT now(), "approved" boolean NOT NULL DEFAULT FALSE, PRIMARY KEY ("email") , UNIQUE ("email"));
