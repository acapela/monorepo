
DROP TABLE topic_event_topic;
TRUNCATE topic_event;

alter table "public"."topic_event" add column "topic_from_closed_at" timestamptz
 null;

alter table "public"."topic_event" add column "topic_to_closed_at" timestamptz
 null;

alter table "public"."topic_event" add column "topic_from_archived_at" timestamptz
 null;

alter table "public"."topic_event" add column "topic_to_archived_at" timestamptz
 null;

alter table "public"."topic_event" add column "topic_from_name" text
 null;

alter table "public"."topic_event" add column "topic_to_name" text
 null;

alter table "public"."topic_event" add constraint "topic_event_id_key" unique ("id");
