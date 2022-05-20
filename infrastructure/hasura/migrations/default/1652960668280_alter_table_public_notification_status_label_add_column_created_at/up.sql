alter table "public"."notification_status_label" add column "created_at" timestamptz
 null default now();
