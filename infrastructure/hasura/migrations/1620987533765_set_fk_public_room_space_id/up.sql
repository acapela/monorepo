alter table "public"."room"
           add constraint "room_space_id_fkey"
           foreign key ("space_id")
           references "public"."space"
           ("id") on update restrict on delete restrict;
