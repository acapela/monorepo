alter table "public"."space_participants"
           add constraint "space_participants_space_id_fkey"
           foreign key ("space_id")
           references "public"."space"
           ("id") on update restrict on delete restrict;
