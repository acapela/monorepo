
alter table "public"."topic" rename column "closed_by_user_id" to "closed_by";

ALTER TABLE "public"."topic" DROP COLUMN "closing_summary";

ALTER TABLE "public"."topic" ALTER COLUMN "closed_at" TYPE timestamp with time zone;

ALTER TABLE "public"."topic" DROP COLUMN "closed_by";

ALTER TABLE "public"."topic" ALTER COLUMN "closed_at" TYPE date;

ALTER TABLE "public"."topic" DROP COLUMN "closed_at";
