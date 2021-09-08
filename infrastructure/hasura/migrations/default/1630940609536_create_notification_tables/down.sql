DROP TABLE notification_room_added_to CASCADE;
DROP TABLE notification_room_closed CASCADE;
DROP TABLE notification_topic_added_to CASCADE;
DROP TABLE notification_topic_assigned CASCADE;
DROP TABLE notification_topic_closed CASCADE;
DROP TABLE notification_topic_mention CASCADE;

TRUNCATE TABLE notification;

ALTER TABLE notification
  ADD COLUMN "data" JSONB NOT NULL,
  DROP COLUMN notification_room_added_to_id,
  DROP COLUMN notification_room_closed_id,
  DROP COLUMN notification_topic_added_to_id,
  DROP COLUMN notification_topic_assigned_id,
  DROP COLUMN notification_topic_closed_id,
  DROP COLUMN notification_topic_mention_id;

