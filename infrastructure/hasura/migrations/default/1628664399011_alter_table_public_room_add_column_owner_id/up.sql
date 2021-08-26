
ALTER TABLE "public"."room" ADD COLUMN "owner_id" uuid NULL;

alter table "public"."room"
           add constraint "room_owner_id_fkey"
           foreign key ("owner_id")
           references "public"."user"
           ("id") on update cascade on delete cascade;
