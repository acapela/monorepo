CREATE VIEW room_access AS
SELECT room.id AS room_id,
       CASE WHEN room.is_private THEN room_member.user_id ELSE team_member.user_id END
FROM room
LEFT JOIN room_member ON room.id = room_member.room_id
LEFT JOIN space ON room.space_id = space.id
LEFT JOIN team_member ON team_member.team_id = space.team_id;

CREATE VIEW topic_access AS
SELECT topic.id AS topic_id,
       CASE
         WHEN (topic.room_id IS NULL) THEN task.user_id
         ELSE room_access.user_id
         END    AS user_id
FROM (((topic
  LEFT JOIN room_access ON ((room_access.room_id = topic.room_id)))
  LEFT JOIN message ON ((message.topic_id = topic.id)))
LEFT JOIN task ON ((message.id = task.message_id)))
UNION
SELECT id AS topic_id, owner_id AS user_id
FROM topic;
