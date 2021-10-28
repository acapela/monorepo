alter table "public"."topic_event_topic_archived" drop constraint "topic_event_topic_archived_archived_by_user_id_fkey",
  add constraint "topic_event_topic_archived_archived_by_user_id_fkey"
  foreign key ("archived_by_user_id")
  references "public"."user"
  ("id") on update no action on delete no action;
