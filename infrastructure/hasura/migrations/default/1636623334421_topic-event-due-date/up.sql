
alter table "public"."message_task_due_date" rename column "due_date" to "due_at";

alter table "public"."topic_event" add column "message_task_due_date_from_due_at" timestamptz
 null;

alter table "public"."topic_event" add column "message_task_due_date_to_due_at" timestamptz
 null;

alter table "public"."topic_event" add column "message_task_due_date_message_id" uuid
 null;
