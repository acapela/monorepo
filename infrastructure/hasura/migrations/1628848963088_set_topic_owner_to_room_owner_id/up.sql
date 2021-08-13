UPDATE
   topic
SET
   owner_id = (
      SELECT
         owner_id
      FROM
         room
      WHERE
         topic.room_id = room.id
   )
WHERE
   owner_id IS NULL;

ALTER TABLE
   "public"."topic"
ALTER COLUMN
   "owner_id"
SET
   NOT NULL;
