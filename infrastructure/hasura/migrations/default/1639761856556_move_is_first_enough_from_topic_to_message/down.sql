
alter table "public"."topic" alter column "is_first_reply_enough" set default false;
alter table "public"."topic" alter column "is_first_reply_enough" drop not null;
alter table "public"."topic" add column "is_first_reply_enough" bool;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."message" add column "is_first_completion_enough" boolean
--  not null default 'False';
