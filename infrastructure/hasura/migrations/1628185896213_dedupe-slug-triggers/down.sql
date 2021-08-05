DROP TRIGGER dedupe_space_slug ON space;
DROP TRIGGER dedupe_room_slug ON room;
DROP TRIGGER dedupe_topic_slug ON topic;

DROP FUNCTION dedupe_space_slug();
DROP FUNCTION dedupe_room_slug();
DROP FUNCTION dedupe_topic_slug();
