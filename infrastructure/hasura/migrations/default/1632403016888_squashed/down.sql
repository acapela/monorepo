
ALTER TABLE "public"."task" ALTER COLUMN "due_at" TYPE timestamp without time zone;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."task" add column "due_at" timestamp
--  null;
