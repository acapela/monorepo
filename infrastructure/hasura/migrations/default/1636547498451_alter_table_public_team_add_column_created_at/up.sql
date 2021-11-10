alter table "public"."team" add column "created_at" timestamptz
 not null default now();
