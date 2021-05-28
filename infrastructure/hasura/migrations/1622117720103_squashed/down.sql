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

DROP TABLE "public"."team_invitation";

DROP TABLE "public"."topic_participants";

DROP TABLE "public"."team_membership_status";

DROP TABLE "public"."team_membership";

DROP TABLE "public"."team";

DROP TABLE "public"."space_participants";

DROP TABLE "public"."space";

DROP TABLE "public"."transcription";

DROP TABLE "public"."transcription_status";

DROP TABLE "public"."message_attachments";

DROP TABLE "public"."attachment";

DROP TABLE "public"."verification_requests";

DROP TABLE "public"."account";

DROP TABLE "public"."room_invites";

DROP TABLE "public"."room_participants";

DROP TABLE "public"."message_type";

DROP TABLE "public"."message";

DROP TABLE "public"."thread";

DROP TABLE "public"."room";

DROP TABLE "public"."user";

DROP EXTENSION pgcrypto;
DROP EXTENSION pg_trgm;
