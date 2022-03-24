alter table "public"."github_account" drop constraint "github_account_pkey";
alter table "public"."github_account"
    add constraint "github_account_pkey"
    primary key ("github_installation_id", "user_id");
