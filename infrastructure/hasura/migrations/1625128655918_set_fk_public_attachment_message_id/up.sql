alter table "public"."attachment"
           add constraint "attachment_message_id_fkey"
           foreign key ("message_id")
           references "public"."message"
           ("id") on update cascade on delete cascade;
