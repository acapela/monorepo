DROP VIEW IF EXISTS "public"."unread_messages";

DROP VIEW "public"."room_last_posted_message";

alter table "public"."topic" drop column "room_id" cascade;

DROP VIEW "public"."private_room";

DROP table "public"."room_member";

DROP table "public"."room_invitation";

DROP table "public"."notification_room_closed";

DROP table "public"."notification_room_added_to";

DROP table "public"."room";

DROP table "public"."space_member";

DROP table "public"."space";

DROP table "public"."notification_topic_added_to";

DROP table "public"."notification_topic_assigned";

DROP table "public"."notification_topic_closed";

DROP table "public"."notification_topic_mention";

DROP table "public"."notification";

DROP table "public"."membership_status";

DROP table "public"."topic_member";

CREATE VIEW "public"."unread_messages" AS
SELECT tm.user_id,
       topic.team_id,
       topic.id AS topic_id,
       count(message.id) AS unread_messages
FROM (((team_member tm
    LEFT JOIN topic ON ((topic.team_id = tm.team_id)))
    LEFT JOIN last_seen_message ON (((last_seen_message.user_id = tm.user_id) AND (last_seen_message.topic_id = topic.id))))
         LEFT JOIN message ON ((message.topic_id = topic.id)))
WHERE ((message.user_id <> tm.user_id) AND ((message.created_at > last_seen_message.seen_at) OR (last_seen_message.seen_at IS NULL))) AND topic.closed_at IS NULL
GROUP BY tm.user_id, topic.team_id, topic.id
ORDER BY tm.user_id, topic.team_id, topic.id;
