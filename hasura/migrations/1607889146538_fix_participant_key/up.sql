
alter table "public"."room_participants" drop constraint "room_participants_room_id_key";
alter table "public"."room_participants" add constraint "room_participants_room_id_user_id_key" unique ("room_id", "user_id");

alter table "public"."room_participants" drop constraint "room_participants_user_id_key";
