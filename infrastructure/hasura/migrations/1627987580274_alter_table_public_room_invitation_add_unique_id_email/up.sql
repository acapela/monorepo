alter table "public"."room_invitation" add constraint "room_invitation_id_email_key" unique ("id", "email");
