CREATE OR REPLACE VIEW "public"."unread_messages" AS 
 SELECT rm.user_id,
    topic.room_id,
    topic.id AS topic_id,
    count(message.id) AS unread_messages
   FROM (((room_member rm
     LEFT JOIN topic ON ((topic.room_id = rm.room_id)))
     LEFT JOIN last_seen_message ON (((last_seen_message.user_id = rm.user_id) AND (last_seen_message.topic_id = topic.id))))
     LEFT JOIN message ON ((message.topic_id = topic.id)))
  WHERE ((message.user_id <> rm.user_id) AND ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))) AND topic.closed_at IS NULL
  GROUP BY rm.user_id, topic.room_id, topic.id
  ORDER BY rm.user_id, topic.room_id, topic.id;
