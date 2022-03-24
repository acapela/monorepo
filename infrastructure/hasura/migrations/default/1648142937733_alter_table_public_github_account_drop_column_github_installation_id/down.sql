alter table "public"."github_account" alter column "github_installation_id" drop not null;
alter table "public"."github_account" add column "github_installation_id" int4;
