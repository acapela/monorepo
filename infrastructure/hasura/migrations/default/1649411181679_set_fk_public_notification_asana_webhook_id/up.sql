alter table "public"."notification_asana"
  add constraint "notification_asana_webhook_id_fkey"
  foreign key ("webhook_id")
  references "public"."asana_webhook"
  ("id") on update cascade on delete set null;
