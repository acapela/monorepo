
alter table "public"."linear_oauth_token" add column "linear_user_id" uuid
 null;

alter table "public"."linear_oauth_token" add column "linear_organization_id" uuid
 null;

alter table "public"."linear_oauth_token"
  add constraint "linear_oauth_token_user_id_fkey"
  foreign key ("user_id")
  references "public"."user"
  ("id") on update cascade on delete cascade;
