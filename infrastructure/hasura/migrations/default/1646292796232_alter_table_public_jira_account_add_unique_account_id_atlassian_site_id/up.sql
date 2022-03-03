alter table "public"."jira_account" add constraint "jira_account_account_id_atlassian_site_id_key" unique ("account_id", "atlassian_site_id");
