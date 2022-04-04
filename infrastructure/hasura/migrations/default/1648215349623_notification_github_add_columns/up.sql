
alter table "public"."notification_github" add column "repository_id" integer
 null;

alter table "public"."notification_github" add column "repository_full_name" text
 null;

alter table "public"."notification_github" add column "pr_id" integer
 null;

alter table "public"."notification_github" alter column "issue_title" drop not null;
alter table "public"."notification_github" rename column "issue_title" to "title";

alter table "public"."notification_github" alter column "issue_id" drop not null;
