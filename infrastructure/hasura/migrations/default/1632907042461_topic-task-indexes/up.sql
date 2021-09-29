
CREATE  INDEX "topic_closed_at_index" on
  "public"."topic" using btree ("closed_at");

CREATE  INDEX "topic_updated_at_index" on
  "public"."topic" using btree ("updated_at");

CREATE  INDEX "task_done_at_index" on
  "public"."task" using btree ("done_at");

CREATE  INDEX "task_updated_at_index" on
  "public"."task" using btree ("updated_at");
