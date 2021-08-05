

ALTER TABLE "public"."attachment" ADD COLUMN "transcription_id" uuid NULL;

alter table "public"."attachment"
           add constraint "attachment_transcription_id_fkey"
           foreign key ("transcription_id")
           references "public"."transcription"
           ("id") on update cascade on delete cascade;

DROP FUNCTION "public"."search_full_text"("pg_catalog"."text");

DROP FUNCTION "public"."search_full_text_topic"("pg_catalog"."text");

ALTER TABLE "public"."message" DROP COLUMN "transcription_id" CASCADE;

DROP TRIGGER "refresh_search" ON "public"."topic";

DROP TRIGGER "refresh_search" ON "public"."attachment";

DROP TRIGGER "refresh_search" ON "public"."room";

DROP TRIGGER "refresh_search" ON "public"."room_member";

DROP TRIGGER "refresh_search" ON "public"."transcription";

DROP VIEW "public"."transcription_full_text";
