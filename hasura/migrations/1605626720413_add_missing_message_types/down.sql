
alter table "public"."message" drop constraint "check_file_message_media_not_null";

alter table "public"."message" drop constraint "check_video_message_media_not_null";

alter table "public"."message" drop constraint "check_audio_message_media_not_null";

DELETE FROM "public"."message_type" WHERE "value" IN ('AUDIO', 'VIDEO', 'FILE');