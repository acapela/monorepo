-- This migration is destructive, only run it if you're sure this is what you want
-- DROP TABLE notification_room_added_to CASCADE;
-- DROP TABLE notification_room_closed CASCADE;
-- DROP TABLE notification_topic_added_to CASCADE;
-- DROP TABLE notification_topic_assigned CASCADE;
-- DROP TABLE notification_topic_closed CASCADE;
-- DROP TABLE notification_topic_mention CASCADE;
--
-- TRUNCATE TABLE notification;
--
-- ALTER TABLE notification
--   ADD COLUMN "data" JSONB NOT NULL;
--
