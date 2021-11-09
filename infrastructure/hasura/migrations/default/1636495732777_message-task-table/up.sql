

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

-- Sets trigger that updates updated_at automatically
CREATE TRIGGER "set_public_message_task_due_date_updated_at"
BEFORE UPDATE ON "public"."message_task_due_date"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_message_task_due_date_updated_at" ON "public"."message_task_due_date" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

-- Moves all of previous due dates to new table
INSERT INTO "public"."message_task_due_date" (message_id, due_date)
SELECT message_id, MIN(due_at) due_date
FROM "public"."task"
WHERE due_at IS NOT NULL AND message_task_due_date_id IS NULL
GROUP BY message_id;

-- Links tasks to new due_date table
UPDATE "public"."task" t
SET message_task_due_date_id = mt.id
FROM "public"."message_task_due_date" mt
where t.message_id = mt.message_id;

alter table "public"."task" drop column "due_at" cascade;
