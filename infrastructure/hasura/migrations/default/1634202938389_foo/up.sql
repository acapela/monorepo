CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."last_seen_message" add column "id" uuid
 not null default gen_random_uuid();

alter table "public"."topic" add column "created_at" timestamptz
 null default now();
