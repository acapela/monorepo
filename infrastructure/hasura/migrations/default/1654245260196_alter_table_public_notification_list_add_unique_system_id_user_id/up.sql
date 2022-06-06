alter table "public"."notification_list" add constraint "notification_list_system_id_user_id_key" unique ("system_id", "user_id");
