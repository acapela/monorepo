ALTER TABLE "public"."topic"
  ADD COLUMN "team_id" UUID;

UPDATE "public"."topic"
SET team_id = (
  SELECT space.team_id
  FROM room
  LEFT JOIN space ON space.id = room.space_id
  WHERE room.id = topic.room_id
);

ALTER TABLE "public"."topic"
  ALTER COLUMN "room_id" DROP NOT NULL,
  ALTER COLUMN "team_id" SET NOT NULL;
