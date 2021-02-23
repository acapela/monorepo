
alter table "public"."room_invites" drop constraint "room_invites_room_id_email_key";

alter table "public"."room_invites" rename column "used_at" to "accepted_at";
