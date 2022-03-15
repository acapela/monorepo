alter table "public"."jira_account" add constraint "jira_account_account_id_jira_cloud_id_key" unique ("account_id", "jira_cloud_id");
