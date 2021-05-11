
alter table "public"."thread" rename to "topic";

alter table "public"."message" rename column "thread_id" to "topic_id";
