alter table "public"."last_seen_message"
           add constraint "last_seen_message_user_id_fkey"
           foreign key ("user_id")
           references "public"."user"
           ("id") on update cascade on delete cascade;
