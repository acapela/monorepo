

ALTER TABLE "public"."attachment" ADD COLUMN "transcription_id" uuid NULL;

alter table "public"."attachment"
           add constraint "attachment_transcription_id_fkey"
           foreign key ("transcription_id")
           references "public"."transcription"
           ("id") on update cascade on delete cascade;

ALTER TABLE "public"."message" DROP COLUMN "transcription_id" CASCADE;

DROP FUNCTION IF EXISTS "public"."search_full_text"("pg_catalog"."text");

DROP FUNCTION IF EXISTS "public"."search_full_text_topic"("pg_catalog"."text");

DROP TRIGGER IF EXISTS "refresh_search" ON "public"."topic";

DROP TRIGGER IF EXISTS "refresh_search" ON "public"."attachment";

DROP TRIGGER IF EXISTS "refresh_search" ON "public"."room";

DROP TRIGGER IF EXISTS "refresh_search" ON "public"."room_member";

DROP TRIGGER IF EXISTS "refresh_search" ON "public"."transcription";

DROP VIEW IF EXISTS "public"."transcription_full_text";
