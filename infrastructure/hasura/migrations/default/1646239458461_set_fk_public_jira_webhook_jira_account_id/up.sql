alter table "public"."jira_webhook"
  add constraint "jira_webhook_jira_account_id_fkey"
  foreign key ("jira_account_id")
  references "public"."account"
  ("id") on update cascade on delete cascade;
