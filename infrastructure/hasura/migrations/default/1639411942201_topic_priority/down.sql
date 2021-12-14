
alter table "public"."topic" drop constraint "topic_priority_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."topic" add column "priority" text
--  null;

DROP TABLE "public"."priority";
