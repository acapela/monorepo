
alter table "public"."task" alter column "due_at" drop not null;
alter table "public"."task" add column "due_at" timestamptz;

alter table "public"."task" drop constraint "task_id_key";

DROP TABLE "public"."message_task_due_date";
