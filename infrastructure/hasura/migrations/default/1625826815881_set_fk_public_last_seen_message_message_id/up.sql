alter table "public"."last_seen_message"
           add constraint "last_seen_message_message_id_fkey"
           foreign key ("message_id")
           references "public"."message"
           ("id") on update cascade on delete cascade;
