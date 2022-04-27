
CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."asana_account" add column "id" uuid
 not null default gen_random_uuid();

alter table "public"."asana_webhook" add column "asana_account_id" uuid
 not null;

alter table "public"."asana_webhook" drop constraint "asana_webhook_user_id_fkey";

alter table "public"."asana_webhook" drop column "user_id" cascade;

BEGIN TRANSACTION;
ALTER TABLE "public"."asana_account" DROP CONSTRAINT "asana_account_pkey";

ALTER TABLE "public"."asana_account"
    ADD CONSTRAINT "asana_account_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;

alter table "public"."asana_webhook"
  add constraint "asana_webhook_asana_account_id_fkey"
  foreign key ("asana_account_id")
  references "public"."asana_account"
  ("id") on update cascade on delete cascade;
