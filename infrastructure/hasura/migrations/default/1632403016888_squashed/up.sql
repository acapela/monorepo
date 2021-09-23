
alter table "public"."task" add column "due_at" timestamp
 null;

ALTER TABLE "public"."task" ALTER COLUMN "due_at" TYPE timestamptz;
