CREATE OR REPLACE VIEW "public"."unread_messages" AS 
 SELECT rp.user_id,
    room.id AS room_id,
    topic.id AS topic_id,
    count(message.id) AS unread_messages
   FROM ((((room_participants rp
     LEFT JOIN room ON ((room.id = rp.room_id)))
     LEFT JOIN topic ON ((topic.room_id = room.id)))
     LEFT JOIN last_seen_message ON (((last_seen_message.user_id = rp.user_id) AND (last_seen_message.topic_id = topic.id))))
     LEFT JOIN message ON ((message.topic_id = topic.id)))
  WHERE ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))
  GROUP BY rp.user_id, room.id, topic.id
  ORDER BY rp.user_id, room.id, topic.id;
