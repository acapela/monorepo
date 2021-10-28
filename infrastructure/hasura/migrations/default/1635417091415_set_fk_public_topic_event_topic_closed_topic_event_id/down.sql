alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_topic_event_id_fkey",
  add constraint "topic_event_topic_closed_topic_event_id_fkey"
  foreign key ("topic_event_id")
  references "public"."topic_event"
  ("id") on update restrict on delete restrict;
