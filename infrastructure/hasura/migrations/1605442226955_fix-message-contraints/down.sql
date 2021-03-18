
alter table "public"."message" add constraint "message_thread_id_key" unique ("thread_id");

alter table "public"."message" add constraint "message_user_id_key" unique ("user_id");

alter table "public"."message" drop constraint "message_pkey";
alter table "public"."message"
    add constraint "message_pkey"
    primary key ( "user_id", "thread_id" );

ALTER TABLE "public"."message" DROP COLUMN "id";
