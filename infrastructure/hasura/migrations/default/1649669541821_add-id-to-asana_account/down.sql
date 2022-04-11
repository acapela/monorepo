
alter table "public"."asana_webhook" drop constraint "asana_webhook_asana_account_id_fkey";

alter table "public"."asana_account" drop constraint "asana_account_pkey";
alter table "public"."asana_account"
    add constraint "asana_account_pkey"
    primary key ("user_id");

alter table "public"."asana_webhook" alter column "user_id" drop not null;
alter table "public"."asana_webhook" add column "user_id" uuid;

alter table "public"."asana_webhook"
  add constraint "asana_webhook_user_id_fkey"
  foreign key ("user_id")
  references "public"."asana_account"
  ("user_id") on update cascade on delete cascade;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."asana_webhook" add column "asana_account_id" uuid
--  not null;

alter table "public"."asana_account" drop column "id" cascade
alter table "public"."asana_account" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
