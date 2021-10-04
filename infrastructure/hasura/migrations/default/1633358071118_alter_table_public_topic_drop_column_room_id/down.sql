alter table "public"."topic" add constraint "topic_slug_room_id_key" unique (slug, room_id);
alter table "public"."topic"
  add constraint "thread_room_id_fkey"
  foreign key (room_id)
  references "public"."room"
  (id) on update cascade on delete cascade;
alter table "public"."topic" alter column "room_id" drop not null;
alter table "public"."topic" add column "room_id" uuid;
