
ALTER TABLE "public"."team_member" ADD COLUMN "status" text;
ALTER TABLE "public"."team_member" ALTER COLUMN "status" DROP NOT NULL;
ALTER TABLE "public"."team_member" ADD CONSTRAINT team_membership_status_fkey FOREIGN KEY (status) REFERENCES "public"."membership_status" (value) ON DELETE restrict ON UPDATE restrict;

alter table "public"."team_invitation" drop constraint "team_invitation_token_key";

alter table "public"."team_invitation" drop constraint "team_invitation_team_id_fkey";

ALTER TABLE "public"."team_invitation" DROP COLUMN "team_id";

alter table "public"."topic_member" rename to "topic_participant";

alter table "public"."room_member" rename to "room_participant";

alter table "public"."space_member" rename to "space_participant";

alter table "public"."team_member" rename to "team_membership";

alter table "public"."membership_status" rename to "invitation_status";

ALTER TABLE "public"."team_membership" ADD COLUMN "token" uuid;
ALTER TABLE "public"."team_membership" ALTER COLUMN "token" DROP NOT NULL;
ALTER TABLE "public"."team_membership" ALTER COLUMN "token" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."team_membership" ADD COLUMN "unregistered_user_email" text;
ALTER TABLE "public"."team_membership" ALTER COLUMN "unregistered_user_email" DROP NOT NULL;

DROP TABLE "public"."team_invitation";

alter table "public"."invitation_status" rename to "team_membership_status";

ALTER TABLE "public"."team_membership" DROP COLUMN "unregistered_user_email";

alter table "public"."team" drop constraint "team_owner_id_fkey";

ALTER TABLE "public"."team" DROP COLUMN "owner_id";

alter table "public"."topic" drop constraint "topic_slug_room_id_key";

ALTER TABLE "public"."topic" DROP COLUMN "slug";

alter table "public"."room" drop constraint "room_slug_space_id_key";

ALTER TABLE "public"."room" DROP COLUMN "slug";

alter table "public"."space" drop constraint "space_team_id_slug_key";

ALTER TABLE "public"."space" DROP COLUMN "slug";

alter table "public"."space" drop constraint "space_team_id_fkey";

ALTER TABLE "public"."space" DROP COLUMN "team_id";

alter table "public"."message_attachment" rename to "message_attachments";

alter table "public"."topic_participant" rename to "topic_participants";

alter table "public"."team_membership" rename to "team_memberships";

alter table "public"."space_participant" rename to "space_participants";

alter table "public"."room_participant" rename to "room_participants";

alter table "public"."team_memberships" rename to "team_membership";

DROP TABLE "public"."topic_participants";

ALTER TABLE "public"."team_membership" DROP COLUMN "token";

alter table "public"."team_membership" drop constraint "team_membership_status_fkey";

ALTER TABLE "public"."team_membership" DROP COLUMN "status";

DROP TABLE "public"."team_membership_status";

DROP TABLE "public"."team_membership";

DROP TABLE "public"."team";
