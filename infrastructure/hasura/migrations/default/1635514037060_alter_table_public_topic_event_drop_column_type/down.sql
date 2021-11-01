alter table "public"."topic_event" alter column "type" drop not null;
alter table "public"."topic_event" add column "type" text;
