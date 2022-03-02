alter table "public"."jira_webhook"
  add constraint "jira_webhook_jira_account_id_fkey"
  foreign key ("jira_cloud_id")
  references "public"."jira_account"
  ("id") on update cascade on delete cascade;
