
DROP TABLE "public"."atlassian_refresh_token_expiry";

alter table "public"."account" drop constraint "account_provider_id_provider_account_id_key";
