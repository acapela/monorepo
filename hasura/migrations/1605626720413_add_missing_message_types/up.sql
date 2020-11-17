
INSERT INTO "public"."message_type" ("value") VALUES ('AUDIO'), ('VIDEO'), ('FILE');
alter table "public"."message" add constraint "check_audio_message_media_not_null" check (type <> 'AUDIO'::text OR media_url IS NOT NULL);

alter table "public"."message" add constraint "check_video_message_media_not_null" check (type <> 'VIDEO'::text OR media_url IS NOT NULL);

alter table "public"."message" add constraint "check_file_message_media_not_null" check (type <> 'FILE'::text OR media_url IS NOT NULL);
