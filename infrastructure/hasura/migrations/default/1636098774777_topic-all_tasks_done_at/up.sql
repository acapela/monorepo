
alter table "public"."topic" add column "all_tasks_done_at" timestamptz
 null;

alter table "public"."topic" add column "last_task_done_by" uuid
 null;
