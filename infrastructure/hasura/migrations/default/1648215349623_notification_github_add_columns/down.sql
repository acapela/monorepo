
alter table "public"."notification_github" alter column "issue_id" set not null;

alter table "public"."notification_github" rename column "title" to "issue_title";
alter table "public"."notification_github" alter column "issue_title" set not null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_github" add column "pr_id" integer
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_github" add column "repository_full_name" text
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."notification_github" add column "repository_id" integer
--  null;
