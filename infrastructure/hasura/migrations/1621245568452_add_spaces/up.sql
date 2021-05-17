
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."space"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

CREATE TABLE "public"."space_participants"("space_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("space_id","user_id") , UNIQUE ("space_id", "user_id"));

ALTER TABLE "public"."space" ADD COLUMN "creator_id" uuid NOT NULL;

alter table "public"."space_participants"
           add constraint "space_participants_user_id_fkey"
           foreign key ("user_id")
           references "public"."user"
           ("id") on update restrict on delete restrict;

alter table "public"."space_participants"
           add constraint "space_participants_space_id_fkey"
           foreign key ("space_id")
           references "public"."space"
           ("id") on update restrict on delete restrict;

ALTER TABLE "public"."room" ADD COLUMN "space_id" uuid NULL;

alter table "public"."room"
           add constraint "room_space_id_fkey"
           foreign key ("space_id")
           references "public"."space"
           ("id") on update restrict on delete restrict;
