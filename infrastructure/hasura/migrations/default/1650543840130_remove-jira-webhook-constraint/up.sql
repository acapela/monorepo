
CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."jira_webhook" add column "id" uuid
 not null unique default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."jira_webhook" DROP CONSTRAINT "jira_webhook_pkey";

ALTER TABLE "public"."jira_webhook"
    ADD CONSTRAINT "jira_webhook_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;

alter table "public"."jira_webhook" add constraint "jira_webhook_jira_webhook_id_jira_account_id_key" unique ("jira_webhook_id", "jira_account_id");

alter table "public"."jira_webhook" drop constraint "jira_webhook_id_key";

alter table "public"."jira_webhook" add constraint "jira_webhook_id_key" unique ("id");
