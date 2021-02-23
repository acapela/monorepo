
alter table "public"."room_invites" rename column "accepted_at" to "used_at";

alter table "public"."room_invites" add constraint "room_invites_room_id_email_key" unique ("room_id", "email");
