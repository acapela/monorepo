alter table "public"."jira_account"
  add constraint "jira_account_atlassian_site_id_fkey"
  foreign key ("atlassian_site_id")
  references "public"."atlassian_site"
  ("id") on update cascade on delete cascade;
