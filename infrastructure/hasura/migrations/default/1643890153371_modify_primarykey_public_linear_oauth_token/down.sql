alter table "public"."linear_oauth_token" drop constraint "linear_oauth_token_pkey";
alter table "public"."linear_oauth_token"
    add constraint "linear_oauth_token_pkey"
    primary key ("user_id", "access_token");
