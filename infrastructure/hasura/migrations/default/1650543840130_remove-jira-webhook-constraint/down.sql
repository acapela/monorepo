
alter table "public"."jira_webhook" drop constraint "jira_webhook_id_key";

alter table "public"."jira_webhook" add constraint "jira_webhook_id_key" unique ("id");

alter table "public"."jira_webhook" drop constraint "jira_webhook_jira_webhook_id_jira_account_id_key";

alter table "public"."jira_webhook" drop constraint "jira_webhook_pkey";
alter table "public"."jira_webhook"
    add constraint "jira_webhook_pkey"
    primary key ("jira_webhook_id");

alter table "public"."jira_webhook" drop column "id" cascade
alter table "public"."jira_webhook" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
