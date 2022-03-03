
alter table "public"."account"
    add constraint "account_provider_account_id_key" unique ("provider_account_id");

CREATE TABLE "public"."atlassian_refresh_token_expiry" ("atlassian_account_id" text NOT NULL, "expires_at" timestamptz NOT NULL, PRIMARY KEY ("atlassian_account_id") , FOREIGN KEY ("atlassian_account_id") REFERENCES "public"."account"("provider_account_id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("atlassian_account_id"));
