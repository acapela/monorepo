
alter table "public"."topic_event" drop constraint "topic_event_topic_to_priority_fkey";

alter table "public"."topic_event" drop constraint "topic_event_topic_from_priority_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."topic_event" add column "topic_to_priority" text
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."topic_event" add column "topic_from_priority" text
--  null;
