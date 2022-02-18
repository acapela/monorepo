alter table "public"."notification_list" add column "seen_at" timestamptz
 not null default now();
