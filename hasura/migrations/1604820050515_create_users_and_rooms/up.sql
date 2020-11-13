

ALTER TABLE "public"."user" ADD COLUMN "name" text NOT NULL DEFAULT ' ';

ALTER TABLE "public"."user" ALTER COLUMN "name" DROP DEFAULT;

ALTER TABLE "public"."user" ADD COLUMN "avatar_url" text NULL;

ALTER TABLE "public"."user" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now();

ALTER TABLE "public"."user" ADD COLUMN "last_active_at" timestamptz NOT NULL DEFAULT now();

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."room"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "creator_id" uuid NOT NULL, "name" text, "created_at" timestamptz NOT NULL DEFAULT now(), "deadline" timestamptz NOT NULL DEFAULT now(), "notification_job_id" text, "summary" text, PRIMARY KEY ("id") , FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE restrict, UNIQUE ("id"));

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."thread"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "room_id" uuid NOT NULL, "name" text, "index" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));

CREATE TABLE "public"."message"("thread_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "type" text NOT NULL, "media_url" text NOT NULL, "text" text NOT NULL, "transcription" text NOT NULL, PRIMARY KEY ("thread_id","user_id") , FOREIGN KEY ("thread_id") REFERENCES "public"."thread"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("thread_id"), UNIQUE ("user_id"));

CREATE TABLE "public"."message_type"("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value")); COMMENT ON TABLE "public"."message_type" IS E'Used as an ENUM for the message type field constraint.';

alter table "public"."message"
           add constraint "message_type_fkey"
           foreign key ("type")
           references "public"."message_type"
           ("value") on update cascade on delete restrict;

CREATE TABLE "public"."room_participants"("room_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("room_id","user_id") , FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("room_id"), UNIQUE ("user_id"));

alter table "public"."room" drop constraint "room_creator_id_fkey",
             add constraint "room_creator_id_fkey"
             foreign key ("creator_id")
             references "public"."user"
             ("id") on update cascade on delete no action;

alter table "public"."room" drop constraint "room_creator_id_fkey",
             add constraint "room_creator_id_fkey"
             foreign key ("creator_id")
             references "public"."user"
             ("id") on update cascade on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
             add constraint "room_creator_id_fkey"
             foreign key ("creator_id")
             references "public"."user"
             ("id") on update cascade on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
             add constraint "room_creator_id_fkey"
             foreign key ("creator_id")
             references "public"."user"
             ("id") on update cascade on delete no action;

ALTER TABLE "public"."room" ADD COLUMN "is_finished" boolean NOT NULL DEFAULT FALSE;

ALTER TABLE "public"."user" DROP COLUMN "last_active_at" CASCADE;
