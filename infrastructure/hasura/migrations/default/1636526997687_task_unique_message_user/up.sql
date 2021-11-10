DELETE
FROM task t1
  USING task t2
WHERE t1.CTID > t2.CTID
  AND t1.message_id = t2.message_id
  AND t1.user_id = t2.user_id;

SELECT COUNT(*)
FROM task;

ALTER TABLE ONLY public.task
  ADD CONSTRAINT task_message_id_user_id_key UNIQUE (message_id, user_id);

