alter table "public"."attachment"
           add constraint "attachment_user_id_fkey"
           foreign key ("user_id")
           references "public"."user"
           ("id") on update cascade on delete cascade;
