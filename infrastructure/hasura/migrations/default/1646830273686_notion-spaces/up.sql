

CREATE TABLE "public"."notification_space" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "space_id" text NOT NULL, "name" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_notification_space_updated_at"
BEFORE UPDATE ON "public"."notification_space"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_notification_space_updated_at" ON "public"."notification_space" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notification_space" add column "created_by" uuid
 not null;

alter table "public"."notification_space"
  add constraint "notification_space_created_by_fkey"
  foreign key ("created_by")
  references "public"."user"
  ("id") on update set null on delete set null;

alter table "public"."notification_space" alter column "created_by" drop not null;

alter table "public"."notification_space" rename to "notion_space";

CREATE TABLE "public"."notion_space_user" ("user_id" uuid NOT NULL, "notion_space_id" uuid NOT NULL, "first_synced_at" timestamptz NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("notion_space_id") REFERENCES "public"."notion_space"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("user_id", "notion_space_id"), UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."notification_notion" add column "notion_space_id" uuid
 null;

alter table "public"."notification_notion"
  add constraint "notification_notion_notion_space_id_fkey"
  foreign key ("notion_space_id")
  references "public"."notion_space"
  ("id") on update set null on delete set null;

alter table "public"."notion_space_user" add column "is_sync_enabled" boolean
 not null default 'false';
