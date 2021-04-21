alter table "public"."message" add constraint "check_text_message_text_not_null" check (CHECK (type <> 'TEXT'::text OR text IS NOT NULL));
