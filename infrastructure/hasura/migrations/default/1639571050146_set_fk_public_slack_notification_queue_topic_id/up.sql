alter table "public"."slack_notification_queue"
  add constraint "slack_notification_queue_topic_id_fkey"
  foreign key ("topic_id")
  references "public"."topic"
  ("id") on update cascade on delete cascade;
