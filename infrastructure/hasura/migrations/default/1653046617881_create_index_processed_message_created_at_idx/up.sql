CREATE  INDEX "processed_message_created_at_idx" on
  "public"."processed_message" using btree ("created_at");
