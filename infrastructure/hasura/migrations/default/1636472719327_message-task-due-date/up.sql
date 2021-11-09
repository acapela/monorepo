
CREATE TABLE "public"."message_task_due_date" ("message_id" uuid NOT NULL, "due_date" timestamptz NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("message_id") REFERENCES "public"."message"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("id"), UNIQUE ("message_id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."task" add column "message_task_due_date_id" uuid
 null;

alter table "public"."task"
  add constraint "task_message_task_due_date_id_fkey"
  foreign key ("message_task_due_date_id")
  references "public"."message_task_due_date"
  ("id") on update set null on delete set null;

alter table "public"."task" add constraint "task_id_key" unique ("id");
