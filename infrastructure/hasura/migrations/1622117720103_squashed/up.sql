




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

INSERT INTO "public"."message_type" ("value") VALUES ('TEXT');

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

ALTER TABLE "public"."room" ALTER COLUMN "is_finished" TYPE boolean;
ALTER TABLE "public"."room" ALTER COLUMN "is_finished" DROP DEFAULT;
ALTER TABLE "public"."room" ALTER COLUMN "is_finished" DROP NOT NULL;
alter table "public"."room" rename column "is_finished" to "finished_at";

ALTER TABLE "public"."room" DROP COLUMN "finished_at" CASCADE;

ALTER TABLE "public"."room" ADD COLUMN "finished_at" timestamptz NULL;

ALTER TABLE "public"."message" ALTER COLUMN "media_url" DROP NOT NULL;

ALTER TABLE "public"."message" ALTER COLUMN "text" DROP NOT NULL;

ALTER TABLE "public"."message" ALTER COLUMN "transcription" DROP NOT NULL;

alter table "public"."message" add constraint "check_text_message_text_not_null" check (type <> 'TEXT' OR text IS NOT NULL);

alter table "public"."message" drop constraint "check_text_message_text_not_null";
alter table "public"."message" add constraint "check_text_message_text_not_null" check (type <> 'TEXT'::text OR text IS NOT NULL);


CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "public"."message" ADD COLUMN "id" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();

alter table "public"."message" drop constraint "message_pkey";
alter table "public"."message"
    add constraint "message_pkey"
    primary key ( "id" );

alter table "public"."message" drop constraint "message_user_id_key";

alter table "public"."message" drop constraint "message_thread_id_key";


INSERT INTO "public"."message_type" ("value") VALUES ('AUDIO'), ('VIDEO'), ('FILE');
alter table "public"."message" add constraint "check_audio_message_media_not_null" check (type <> 'AUDIO'::text OR media_url IS NOT NULL);

alter table "public"."message" add constraint "check_video_message_media_not_null" check (type <> 'VIDEO'::text OR media_url IS NOT NULL);

alter table "public"."message" add constraint "check_file_message_media_not_null" check (type <> 'FILE'::text OR media_url IS NOT NULL);

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."room_invites"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "room_id" uuid NOT NULL, "inviter_id" uuid NOT NULL, "code" uuid NOT NULL DEFAULT gen_random_uuid(), "email" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "accepted_at" timestamptz, PRIMARY KEY ("id") , FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("code"));


alter table "public"."room_invites" rename column "accepted_at" to "used_at";

alter table "public"."room_invites" add constraint "room_invites_room_id_email_key" unique ("room_id", "email");


ALTER TABLE "public"."user" ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "public"."user" ALTER COLUMN "name" DROP NOT NULL;


alter table "public"."room_participants" drop constraint "room_participants_room_id_key";
alter table "public"."room_participants" add constraint "room_participants_room_id_user_id_key" unique ("room_id", "user_id");

alter table "public"."room_participants" drop constraint "room_participants_user_id_key";

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."account"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "provider_id" Text NOT NULL, "provider_type" text NOT NULL, "provider_account_id" text NOT NULL, "refresh_token" text, "access_token" text, "access_token_expires" timestamptz, "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"));
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
CREATE TRIGGER "set_public_account_updated_at"
BEFORE UPDATE ON "public"."account"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_account_updated_at" ON "public"."account"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

COMMENT ON TABLE "public"."account" IS E'Account represents 3rd party login methods used by given user.';

ALTER TABLE "public"."user" ALTER COLUMN "firebase_id" DROP NOT NULL;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."verification_requests"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "identifier" text NOT NULL, "token" text NOT NULL, "expires" timestamptz NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_verification_requests_updated_at"
BEFORE UPDATE ON "public"."verification_requests"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_verification_requests_updated_at" ON "public"."verification_requests"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."user" DROP COLUMN "firebase_id" CASCADE;

ALTER TABLE "public"."user" ADD COLUMN "email_verified" timestamptz NULL;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."attachment"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "original_name" text NULL, "mime_type" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));

alter table "public"."attachment" add constraint "attachment_id_key" unique ("id");

CREATE TABLE "public"."message_attachments"("message_id" uuid NOT NULL, "attachment_id" uuid NOT NULL, PRIMARY KEY ("message_id","attachment_id"), FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON UPDATE cascade ON DELETE cascade);

ALTER TABLE "public"."message" ADD COLUMN "is_draft" boolean NOT NULL DEFAULT false;

ALTER TABLE "public"."message" DROP COLUMN "media_url" CASCADE;




ALTER TABLE "public"."message" ADD COLUMN "content" jsonb NOT NULL DEFAULT jsonb_build_array();

alter table "public"."message" drop constraint "check_text_message_text_not_null";

ALTER TABLE "public"."message" DROP COLUMN "text" CASCADE;


CREATE TABLE "public"."transcription_status"("value" text NOT NULL, PRIMARY KEY ("value") , UNIQUE ("value"));

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."transcription"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "sonix_media_id" text NOT NULL, "transcript" jsonb, "status" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("status") REFERENCES "public"."transcription_status"("value") ON UPDATE cascade ON DELETE restrict, UNIQUE ("id"), UNIQUE ("sonix_media_id"));
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
CREATE TRIGGER "set_public_transcription_updated_at"
BEFORE UPDATE ON "public"."transcription"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_transcription_updated_at" ON "public"."transcription" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

ALTER TABLE "public"."message" DROP COLUMN "transcription" CASCADE;

ALTER TABLE "public"."message" ADD COLUMN "transcription_id" uuid NULL;

alter table "public"."message"
           add constraint "message_transcription_id_fkey"
           foreign key ("transcription_id")
           references "public"."transcription"
           ("id") on update cascade on delete restrict;

ALTER TABLE "public"."attachment" ALTER COLUMN "original_name" SET NOT NULL;


alter table "public"."thread" rename to "topic";

alter table "public"."message" rename column "thread_id" to "topic_id";


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

ALTER TABLE "public"."user" ADD COLUMN "current_team" uuid NULL;

alter table "public"."user" rename column "current_team" to "current_team_id";

alter table "public"."user"
           add constraint "user_current_team_id_fkey"
           foreign key ("current_team_id")
           references "public"."team"
           ("id") on update restrict on delete restrict;

alter table "public"."team" drop constraint "team_pkey";
alter table "public"."team"
    add constraint "team_pkey" 
    primary key ( "id" );

CREATE TABLE "public"."last_seen_message"("user_id" uuid NOT NULL, "topic_id" uuid NOT NULL, "message_id" uuid NOT NULL, "seen_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("user_id","topic_id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_seen_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."seen_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_last_seen_message_seen_at"
BEFORE UPDATE ON "public"."last_seen_message"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_seen_at"();
COMMENT ON TRIGGER "set_public_last_seen_message_seen_at" ON "public"."last_seen_message" 
IS 'trigger to set value of column "seen_at" to current timestamp on row update';

CREATE OR REPLACE VIEW "public"."unread_messages" AS 
 SELECT sm.user_id,
    room.id AS room_id,
    topic.id AS topic_id,
    count(message.id) AS unread_messages
   FROM ((((space_member sm
     LEFT JOIN room ON ((room.space_id = sm.space_id)))
     LEFT JOIN topic ON ((topic.room_id = room.id)))
     LEFT JOIN last_seen_message ON (((last_seen_message.user_id = sm.user_id) AND (last_seen_message.topic_id = topic.id))))
     LEFT JOIN message ON ((message.topic_id = topic.id)))
  WHERE ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))
  GROUP BY sm.user_id, room.id, topic.id
  ORDER BY sm.user_id, room.id, topic.id;

CREATE OR REPLACE VIEW transcription_full_text AS
    SELECT id transcription_id, string_agg(txt, ' ') transcript
    FROM (
        SELECT id, jsonb_array_elements(jsonb_array_elements(transcript -> 'transcript') -> 'words') ->> 'text' txt
        FROM transcription WHERE status = 'completed'
        ) t
    GROUP BY t.id;

CREATE OR REPLACE VIEW message_full_text AS
SELECT message.id, topic_id, user_id, transcription_id, type, created_at, string_agg(content_txt, ' ') AS content_txt
FROM message LEFT JOIN (
    SELECT id, jsonb_array_elements(content) ->> 'insert' AS content_txt
    FROM message
    WHERE is_draft = false
) t ON t.id = message.id
GROUP BY message.id, topic_id, user_id, transcription_id, type;

CREATE MATERIALIZED VIEW full_text_search AS
SELECT room.id room_id,
       room.name room_name,
       room_member.user_id user_id,
       topic.id topic_id,
       topic.name topic_name,
       message.created_at message_created_at,
       type message_type,
       message.id message_id,
       content_txt message_content,
       transcription_full_text.transcription_id transcription_id,
       attachment.id attachment_id,
       original_name attachment_name,
       transcript
FROM room
    INNER JOIN room_member on room.id = room_member.room_id
    INNER JOIN topic on room.id = topic.room_id
    INNER JOIN message_full_text as message on topic.id = message.topic_id
    LEFT JOIN message_attachment ma on message.id = ma.message_id
    LEFT JOIN attachment on ma.attachment_id = attachment.id
    LEFT JOIN transcription_full_text on message.transcription_id = transcription_full_text.transcription_id;

CREATE OR REPLACE FUNCTION refresh_full_text_search()
    RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW full_text_search;
RETURN NULL;
END $$;

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON message FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON transcription FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON room_member FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON room FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON topic FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();


CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON message_attachment FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE TRIGGER refresh_search
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON attachment FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_full_text_search();

CREATE EXTENSION pg_trgm;
CREATE INDEX full_text_search_idx ON full_text_search
    USING GIN ((room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, '')) gin_trgm_ops);

CREATE OR REPLACE FUNCTION search_full_text(search text)
    RETURNS SETOF full_text_search AS $$
SELECT *
FROM full_text_search
WHERE
        search <% (room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''))
ORDER BY
    similarity(search,(room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''))) DESC;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION search_full_text_topic(search text)
    RETURNS SETOF full_text_search AS $$
SELECT DISTINCT ON (user_id, topic_id) *
FROM full_text_search
WHERE
    search <% (room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''));
$$ LANGUAGE sql STABLE;
