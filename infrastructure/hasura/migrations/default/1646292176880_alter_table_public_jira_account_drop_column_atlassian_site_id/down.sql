comment on column "public"."jira_account"."atlassian_site_id" is E'jira_cloud_id <> account_id join table';
alter table "public"."jira_account" add constraint "jira_account_account_id_jira_cloud_id_key" unique (account_id, atlassian_site_id);
alter table "public"."jira_account" alter column "atlassian_site_id" drop not null;
alter table "public"."jira_account" add column "atlassian_site_id" text;
