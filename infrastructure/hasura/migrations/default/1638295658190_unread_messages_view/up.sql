CREATE OR REPLACE VIEW "public"."unread_messages" AS
SELECT tm.user_id,
       topic.team_id,
       topic.id AS topic_id,
       count(message.id) AS unread_messages
FROM (((topic_member tm
    LEFT JOIN topic ON ((topic.id = tm.topic_id)))
    LEFT JOIN last_seen_message ON (((last_seen_message.user_id = tm.user_id) AND (last_seen_message.topic_id = tm.topic_id))))
    LEFT JOIN message ON ((message.topic_id = tm.topic_id)))
WHERE ((message.user_id <> tm.user_id) AND ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))) AND topic.closed_at IS NULL
GROUP BY tm.user_id, topic.team_id, topic.id
ORDER BY tm.user_id, topic.team_id, topic.id;
