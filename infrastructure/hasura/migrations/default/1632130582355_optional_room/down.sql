alter table "public"."topic"
  alter column "room_id" set not null,
  drop column "team_id";
