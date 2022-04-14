alter table "public"."account" add column "email" text null;
create index "account_email_idx" on "public"."account" ("email");
