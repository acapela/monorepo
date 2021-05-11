
alter table "public"."message" rename column "topic_id" to "thread_id";

alter table "public"."topic" rename to "thread";
