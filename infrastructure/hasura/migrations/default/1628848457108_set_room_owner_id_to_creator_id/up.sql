UPDATE
  room
SET
  owner_id = creator_id
WHERE
  owner_id IS NULL;

ALTER TABLE
  "public"."room"
ALTER COLUMN
  "owner_id"
SET
  NOT NULL;
