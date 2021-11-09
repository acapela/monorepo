CREATE TRIGGER "set_public_message_task_due_date_updated_at"
BEFORE UPDATE ON "public"."message_task_due_date"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_message_task_due_date_updated_at" ON "public"."message_task_due_date" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
