


CREATE TABLE "public"."decision_option" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "message_id" uuid NOT NULL, "index" numeric NOT NULL, "option" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."decision_option" add column "created_at" timestamptz
 not null default now();

alter table "public"."decision_option" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_decision_option_updated_at"
BEFORE UPDATE ON "public"."decision_option"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_decision_option_updated_at" ON "public"."decision_option" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."decision_vote" ("decision_option_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("decision_option_id","user_id") , FOREIGN KEY ("decision_option_id") REFERENCES "public"."decision_option"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE no action ON DELETE no action);

alter table "public"."decision_vote" add column "created_at" timestamptz
 null default now();

alter table "public"."decision_vote" alter column "created_at" set not null;

alter table "public"."decision_vote" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_decision_vote_updated_at"
BEFORE UPDATE ON "public"."decision_vote"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_decision_vote_updated_at" ON "public"."decision_vote" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
