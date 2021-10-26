alter table "public"."topic" alter column "closing_summary" drop not null;
alter table "public"."topic" add column "closing_summary" text;
