
alter table "public"."asana_webhook" add column "project_name" text
 null;

alter table "public"."asana_webhook" add column "workspace_name" text
 null;
