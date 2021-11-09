
alter table "public"."task" drop constraint "task_message_task_due_date_id_fkey",
  add constraint "task_message_task_due_date_id_fkey"
  foreign key ("message_task_due_date_id")
  references "public"."message_task_due_date"
  ("id") on update set null on delete set null;


alter table "public"."task" drop constraint "task_id_key";

alter table "public"."task" drop constraint "task_message_task_due_date_id_fkey";

DROP TABLE "public"."message_task_due_date";
