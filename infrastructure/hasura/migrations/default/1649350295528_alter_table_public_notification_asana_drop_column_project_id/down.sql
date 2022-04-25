alter table "public"."notification_asana" alter column "project_id" drop not null;
alter table "public"."notification_asana" add column "project_id" text;
