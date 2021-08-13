ALTER TABLE "public"."topic" ADD COLUMN "owner_id" uuid NULL;

alter table "public"."topic"
           add constraint "topic_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."user"
           ("id") on update cascade on delete cascade;
