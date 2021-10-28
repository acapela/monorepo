alter table "public"."topic_event_topic_closed" drop constraint "topic_event_topic_closed_closed_by_user_id_fkey",
  add constraint "topic_event_topic_closed_closed_by_user_id_fkey"
  foreign key ("closed_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;
