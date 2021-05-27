
DROP FUNCTION search_full_text_topic;

DROP FUNCTION search_full_text;

DROP INDEX full_text_search_idx;
DROP EXTENSION pg_trgm;

DROP TRIGGER refresh_search ON message;
DROP TRIGGER refresh_search ON transcription;
DROP TRIGGER refresh_search ON room_member;
DROP TRIGGER refresh_search ON room;
DROP TRIGGER refresh_search ON topic;
DROP TRIGGER refresh_search ON message_attachment;
DROP TRIGGER refresh_search ON attachment;

DROP FUNCTION refresh_full_text_search;

DROP MATERIALIZED VIEW full_text_search;

DROP VIEW message_full_text;

DROP VIEW transcription_full_text;

DROP VIEW "public"."unread_messages";

DROP TABLE "public"."last_seen_message";

ALTER TABLE "public"."user" DROP COLUMN "current_team";

alter table "public"."user" rename column "current_team_id" to "current_team";

alter table "public"."user" drop constraint "user_current_team_id_fkey";

alter table "public"."team" drop constraint "team_pkey";
alter table "public"."team"
    add constraint "team_pkey" 
    primary key ( "slug", "id" );


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


alter table "public"."room" drop constraint "room_space_id_fkey";

ALTER TABLE "public"."room" DROP COLUMN "space_id";

alter table "public"."space_participants" drop constraint "space_participants_space_id_fkey";

alter table "public"."space_participants" drop constraint "space_participants_user_id_fkey";

ALTER TABLE "public"."space" DROP COLUMN "creator_id";

DROP TABLE "public"."space_participants";

DROP TABLE "public"."space";


alter table "public"."message" rename column "topic_id" to "thread_id";

alter table "public"."topic" rename to "thread";

ALTER TABLE "public"."attachment" ALTER COLUMN "original_name" DROP NOT NULL;



alter table "public"."message" drop constraint "message_transcription_id_fkey";

ALTER TABLE "public"."message" DROP COLUMN "transcription_id";

ALTER TABLE "public"."message" ADD COLUMN "transcription" text;
ALTER TABLE "public"."message" ALTER COLUMN "transcription" DROP NOT NULL;

DROP TABLE "public"."transcription";

DROP TABLE "public"."transcription_status";


ALTER TABLE "public"."message" ADD COLUMN "text" text;
ALTER TABLE "public"."message" ALTER COLUMN "text" DROP NOT NULL;

alter table "public"."message" add constraint "check_text_message_text_not_null" check (CHECK (type <> 'TEXT'::text OR text IS NOT NULL));

ALTER TABLE "public"."message" DROP COLUMN "content";


ALTER TABLE "public"."message" ADD COLUMN "media_url" text;

ALTER TABLE "public"."message" DROP COLUMN "is_draft";

DROP TABLE "public"."message_attachments";

alter table "public"."attachment" drop constraint "attachment_id_key";

DROP TABLE "public"."attachment";


ALTER TABLE "public"."user" DROP COLUMN "email_verified";

ALTER TABLE "public"."user" ADD COLUMN "firebase_id" text;
ALTER TABLE "public"."user" ALTER COLUMN "firebase_id" DROP NOT NULL;
ALTER TABLE "public"."user" ADD CONSTRAINT user_firebase_id_key UNIQUE (firebase_id);

DROP TABLE "public"."verification_requests";

ALTER TABLE "public"."user" ALTER COLUMN "firebase_id" SET NOT NULL;

COMMENT ON TABLE "public"."account" IS NULL;

DROP TABLE "public"."account";


alter table "public"."room_participants" add constraint "room_participants_user_id_key" unique ("user_id");

alter table "public"."room_participants" drop constraint "room_participants_room_id_user_id_key";
alter table "public"."room_participants" add constraint "room_participants_room_id_key" unique ("room_id");


ALTER TABLE "public"."user" ALTER COLUMN "name" SET NOT NULL;

ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL;


alter table "public"."room_invites" drop constraint "room_invites_room_id_email_key";

alter table "public"."room_invites" rename column "used_at" to "accepted_at";

DROP TABLE "public"."room_invites";


alter table "public"."message" drop constraint "check_file_message_media_not_null";

alter table "public"."message" drop constraint "check_video_message_media_not_null";

alter table "public"."message" drop constraint "check_audio_message_media_not_null";

DELETE FROM "public"."message_type" WHERE "value" IN ('AUDIO', 'VIDEO', 'FILE');

alter table "public"."message" add constraint "message_thread_id_key" unique ("thread_id");

alter table "public"."message" add constraint "message_user_id_key" unique ("user_id");

alter table "public"."message" drop constraint "message_pkey";
alter table "public"."message"
    add constraint "message_pkey"
    primary key ( "user_id", "thread_id" );

ALTER TABLE "public"."message" DROP COLUMN "id";


alter table "public"."message" drop constraint "check_text_message_text_not_null";
alter table "public"."message" add constraint "check_text_message_text_not_null" check (CHECK (type <> 'TEXT'::text OR text IS NOT NULL));

alter table "public"."message" drop constraint "check_text_message_text_not_null";

ALTER TABLE "public"."message" ALTER COLUMN "transcription" SET NOT NULL;

ALTER TABLE "public"."message" ALTER COLUMN "text" SET NOT NULL;

ALTER TABLE "public"."message" ALTER COLUMN "media_url" SET NOT NULL;


ALTER TABLE "public"."room" DROP COLUMN "finished_at";

ALTER TABLE "public"."room" ADD COLUMN "finished_at" bool;
ALTER TABLE "public"."room" ALTER COLUMN "finished_at" DROP NOT NULL;

ALTER TABLE "public"."room" ALTER COLUMN "is_finished" TYPE boolean;
ALTER TABLE ONLY "public"."room" ALTER COLUMN "is_finished" SET DEFAULT false;
ALTER TABLE "public"."room" ALTER COLUMN "is_finished" SET NOT NULL;
alter table "public"."room" rename column "finished_at" to "is_finished";


ALTER TABLE "public"."user" ADD COLUMN "last_active_at" timestamptz;
ALTER TABLE "public"."user" ALTER COLUMN "last_active_at" DROP NOT NULL;
ALTER TABLE "public"."user" ALTER COLUMN "last_active_at" SET DEFAULT now();

ALTER TABLE "public"."room" DROP COLUMN "is_finished";

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete set null;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete no action;

alter table "public"."room" drop constraint "room_creator_id_fkey",
          add constraint "room_creator_id_fkey"
          foreign key ("creator_id")
          references "public"."user"
          ("id")
          on update cascade
          on delete restrict;


DROP TABLE "public"."room_participants";

alter table "public"."message" drop constraint "message_type_fkey";

DROP TABLE "public"."message_type";

DROP TABLE "public"."message";

DROP TABLE "public"."thread";

DROP TABLE "public"."room";

ALTER TABLE "public"."user" DROP COLUMN "last_active_at";

ALTER TABLE "public"."user" DROP COLUMN "created_at";

ALTER TABLE "public"."user" DROP COLUMN "avatar_url";

ALTER TABLE ONLY "public"."user" ALTER COLUMN "name" SET DEFAULT '' '::text';

ALTER TABLE "public"."user" DROP COLUMN "name";
