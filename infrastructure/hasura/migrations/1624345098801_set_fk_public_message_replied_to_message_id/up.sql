alter table "public"."message"
           add constraint "message_replied_to_message_id_fkey"
           foreign key ("replied_to_message_id")
           references "public"."message"
           ("id") on update restrict on delete restrict;
