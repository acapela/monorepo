alter table "public"."topic_event_topic_unarchived" drop constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey",
  add constraint "topic_event_topic_unarchived_unarchived_by_user_id_fkey"
  foreign key ("unarchived_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;
