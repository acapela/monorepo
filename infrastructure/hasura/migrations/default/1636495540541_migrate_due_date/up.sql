
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
