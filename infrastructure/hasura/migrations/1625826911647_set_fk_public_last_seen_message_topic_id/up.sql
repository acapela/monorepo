alter table "public"."last_seen_message"
           add constraint "last_seen_message_topic_id_fkey"
           foreign key ("topic_id")
           references "public"."topic"
           ("id") on update cascade on delete cascade;
