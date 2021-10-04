ALTER TABLE "public"."attachment" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_attachment_updated_at"
BEFORE UPDATE ON "public"."attachment"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_attachment_updated_at" ON "public"."attachment" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."message" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_message_updated_at"
BEFORE UPDATE ON "public"."message"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_message_updated_at" ON "public"."message" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."room" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_room_updated_at"
BEFORE UPDATE ON "public"."room"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_room_updated_at" ON "public"."room" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."space" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_space_updated_at"
BEFORE UPDATE ON "public"."space"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_space_updated_at" ON "public"."space" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."team" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_team_updated_at"
BEFORE UPDATE ON "public"."team"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_updated_at" ON "public"."team" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."topic" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_topic_updated_at"
BEFORE UPDATE ON "public"."topic"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_topic_updated_at" ON "public"."topic" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."user" ADD COLUMN "updated_at" timestamptz NULL DEFAULT now();

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
CREATE TRIGGER "set_public_user_updated_at"
BEFORE UPDATE ON "public"."user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_updated_at" ON "public"."user" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."message_reaction" add column "id" uuid
 not null unique default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."message_reaction" DROP CONSTRAINT "message_reaction_pkey";

ALTER TABLE "public"."message_reaction"
    ADD CONSTRAINT "message_reaction_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;


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
