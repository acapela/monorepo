

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

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."team"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "slug" text NOT NULL, "name" text NOT NULL, PRIMARY KEY ("id","slug") , UNIQUE ("slug"), UNIQUE ("id"));

CREATE TABLE "public"."team_membership"("team_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("team_id","user_id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON UPDATE restrict ON DELETE restrict);

CREATE TABLE "public"."team_membership_status"("value" text NOT NULL, PRIMARY KEY ("value") );

ALTER TABLE "public"."team_membership" ADD COLUMN "status" text NOT NULL;

alter table "public"."team_membership"
           add constraint "team_membership_status_fkey"
           foreign key ("status")
           references "public"."team_membership_status"
           ("value") on update restrict on delete restrict;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "public"."team_membership" ADD COLUMN "token" uuid NOT NULL DEFAULT gen_random_uuid();

CREATE TABLE "public"."topic_participants"("topic_id" uuid NOT NULL, "user_id" uuid NOT NULL, PRIMARY KEY ("topic_id","user_id") , FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("topic_id", "user_id"));

alter table "public"."team_membership" rename to "team_memberships";

alter table "public"."room_participants" rename to "room_participant";

alter table "public"."space_participants" rename to "space_participant";

alter table "public"."team_memberships" rename to "team_membership";

alter table "public"."topic_participants" rename to "topic_participant";

alter table "public"."message_attachments" rename to "message_attachment";

ALTER TABLE "public"."space" ADD COLUMN "team_id" uuid NOT NULL;

alter table "public"."space"
           add constraint "space_team_id_fkey"
           foreign key ("team_id")
           references "public"."team"
           ("id") on update restrict on delete restrict;

ALTER TABLE "public"."space" ADD COLUMN "slug" text NOT NULL;

alter table "public"."space" add constraint "space_team_id_slug_key" unique ("team_id", "slug");

ALTER TABLE "public"."room" ADD COLUMN "slug" text NOT NULL;

alter table "public"."room" add constraint "room_slug_space_id_key" unique ("slug", "space_id");

ALTER TABLE "public"."topic" ADD COLUMN "slug" text NOT NULL;

alter table "public"."topic" add constraint "topic_slug_room_id_key" unique ("slug", "room_id");

ALTER TABLE "public"."team" ADD COLUMN "owner_id" uuid NOT NULL;

alter table "public"."team"
           add constraint "team_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."user"
           ("id") on update restrict on delete restrict;

ALTER TABLE "public"."team_membership" ADD COLUMN "unregistered_user_email" text NULL;

alter table "public"."team_membership_status" rename to "invitation_status";

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."team_invitation"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "email" text NOT NULL, "used_at" date, "token" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "inviting_user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("inviting_user_id") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict);

ALTER TABLE "public"."team_membership" DROP COLUMN "unregistered_user_email" CASCADE;

ALTER TABLE "public"."team_membership" DROP COLUMN "token" CASCADE;

alter table "public"."invitation_status" rename to "membership_status";

alter table "public"."team_membership" rename to "team_member";

alter table "public"."space_participant" rename to "space_member";

alter table "public"."room_participant" rename to "room_member";

alter table "public"."topic_participant" rename to "topic_member";

ALTER TABLE "public"."team_invitation" ADD COLUMN "team_id" uuid NOT NULL;

alter table "public"."team_invitation"
           add constraint "team_invitation_team_id_fkey"
           foreign key ("team_id")
           references "public"."team"
           ("id") on update restrict on delete restrict;

alter table "public"."team_invitation" add constraint "team_invitation_token_key" unique ("token");

ALTER TABLE "public"."team_member" DROP COLUMN "status" CASCADE;
