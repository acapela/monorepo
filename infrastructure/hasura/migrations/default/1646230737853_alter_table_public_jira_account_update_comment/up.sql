comment on TABLE "public"."jira_account" is E'jira_cloud_id <> account_id join table -> account.id is not deleting on cascade, it is cleared manually from hasura_event[account]["DELETE"]';
