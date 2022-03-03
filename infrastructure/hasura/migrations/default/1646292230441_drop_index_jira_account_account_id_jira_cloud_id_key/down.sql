CREATE  INDEX "jira_account_account_id_jira_cloud_id_key" on
  "public"."jira_account" using btree ("account_id", "jira_cloud_id");
