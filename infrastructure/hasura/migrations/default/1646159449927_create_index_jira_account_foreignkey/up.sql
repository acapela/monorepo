CREATE  INDEX "jira_account_foreignkey" on
  "public"."jira_webhook" using btree ("jira_account_id");
