BEGIN TRANSACTION;
ALTER TABLE "public"."jira_account" DROP CONSTRAINT "jira_account_pkey";

ALTER TABLE "public"."jira_account"
    ADD CONSTRAINT "jira_account_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;
