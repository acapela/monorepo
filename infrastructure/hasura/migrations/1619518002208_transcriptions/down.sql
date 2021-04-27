

alter table "public"."message" drop constraint "message_transcription_id_fkey";

ALTER TABLE "public"."message" DROP COLUMN "transcription_id";

ALTER TABLE "public"."message" ADD COLUMN "transcription" text;
ALTER TABLE "public"."message" ALTER COLUMN "transcription" DROP NOT NULL;

DROP TABLE "public"."transcription";

DROP TABLE "public"."transcription_status";
