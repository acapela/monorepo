
alter table "public"."topic_event" add column "topic_from_priority" text
 null;

alter table "public"."topic_event" add column "topic_to_priority" text
 null;

alter table "public"."topic_event"
  add constraint "topic_event_topic_from_priority_fkey"
  foreign key ("topic_from_priority")
  references "public"."priority"
  ("name") on update cascade on delete cascade;

alter table "public"."topic_event"
  add constraint "topic_event_topic_to_priority_fkey"
  foreign key ("topic_to_priority")
  references "public"."priority"
  ("name") on update cascade on delete cascade;
