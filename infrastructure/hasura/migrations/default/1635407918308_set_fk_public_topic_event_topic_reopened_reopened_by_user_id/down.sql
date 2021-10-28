alter table "public"."topic_event_topic_reopened" drop constraint "topic_event_topic_reopened_reopened_by_user_id_fkey",
  add constraint "topic_event_topic_reopened_reopened_by_user_id_fkey"
  foreign key ("reopened_by_user_id")
  references "public"."user"
  ("id") on update restrict on delete restrict;
