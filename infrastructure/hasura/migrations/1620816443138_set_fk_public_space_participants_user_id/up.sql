alter table "public"."space_participants"
           add constraint "space_participants_user_id_fkey"
           foreign key ("user_id")
           references "public"."user"
           ("id") on update restrict on delete restrict;
