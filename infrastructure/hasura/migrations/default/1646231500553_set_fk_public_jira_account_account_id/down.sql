alter table "public"."jira_account" drop constraint "jira_account_account_id_fkey",
  add constraint "jira_account_account_id_fkey"
  foreign key ("account_id")
  references "public"."account"
  ("id") on update cascade on delete restrict;
