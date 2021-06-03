alter table "public"."topic_member" drop constraint "topic_participants_topic_id_fkey",
             add constraint "topic_member_topic_id_fkey"
             foreign key ("topic_id")
             references "public"."topic"
             ("id") on update restrict on delete cascade;
