alter table "public"."notification_status" add column "created_at" timestamptz
 null default now();
