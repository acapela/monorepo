alter table "public"."notification_drive"
  add constraint "notification_drive_gmail_account_id_fkey"
  foreign key ("gmail_account_id")
  references "public"."gmail_account"
  ("id") on update cascade on delete cascade;
