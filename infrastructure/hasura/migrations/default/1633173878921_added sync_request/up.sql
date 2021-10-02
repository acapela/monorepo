
CREATE TABLE "public"."sync_request" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "team_id" uuid NOT NULL, "entity_id" uuid NOT NULL, "change_type" text NOT NULL, "date" timestamptz NOT NULL, "entity_name" text NOT NULL, "user_id" uuid, PRIMARY KEY ("id") , FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE  INDEX "sync_request_entity_id" on
  "public"."sync_request" using btree ("entity_id");

CREATE  INDEX "sync_request_change_type" on
  "public"."sync_request" using btree ("change_type");

CREATE  INDEX "sync_request_date" on
  "public"."sync_request" using btree ("date");

CREATE  INDEX "sync_request_entity_name" on
  "public"."sync_request" using btree ("entity_name");

CREATE  INDEX "sync_request_team_id" on
  "public"."sync_request" using btree ("team_id");

CREATE  INDEX "sync_request_user_id" on
  "public"."sync_request" using btree ("user_id");
