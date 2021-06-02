
ALTER TABLE "public"."topic" ADD COLUMN "closed_at" date NULL;

ALTER TABLE "public"."topic" ALTER COLUMN "closed_at" TYPE timestamptz;

ALTER TABLE "public"."topic" ADD COLUMN "closed_by" uuid NULL;

ALTER TABLE "public"."topic" ALTER COLUMN "closed_at" TYPE timestamp;

ALTER TABLE "public"."topic" ADD COLUMN "closing_summary" text NULL;

alter table "public"."topic" rename column "closed_by" to "closed_by_user_id";
