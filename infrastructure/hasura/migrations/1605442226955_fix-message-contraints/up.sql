
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "public"."message" ADD COLUMN "id" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();

alter table "public"."message" drop constraint "message_pkey";
alter table "public"."message"
    add constraint "message_pkey" 
    primary key ( "id" );

alter table "public"."message" drop constraint "message_user_id_key";

alter table "public"."message" drop constraint "message_thread_id_key";
