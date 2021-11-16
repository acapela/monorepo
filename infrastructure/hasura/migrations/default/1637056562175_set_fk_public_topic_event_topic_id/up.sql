alter table "public"."topic_event" drop constraint "topic_event_topic_id_fkey",
  add constraint "topic_event_topic_id_fkey"
  foreign key ("topic_id")
  references "public"."topic"
  ("id") on update cascade on delete cascade;
