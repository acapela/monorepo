alter table "public"."jira_account" drop constraint "jira_account_pkey";
alter table "public"."jira_account"
    add constraint "jira_account_pkey"
    primary key ("account_id", "jira_cloud_id");
