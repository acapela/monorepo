alter table "public"."notion_space_user" add column "created_at" timestamptz
 null default now();
