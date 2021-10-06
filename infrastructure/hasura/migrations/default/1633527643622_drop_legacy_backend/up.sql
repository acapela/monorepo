
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


alter table "public"."team_member" add column "created_at" timestamptz
 not null default now();

alter table "public"."team_member" add column "updated_at" timestamptz
 not null default now();

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_team_member_updated_at"
BEFORE UPDATE ON "public"."team_member"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_team_member_updated_at" ON "public"."team_member"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';


CREATE OR REPLACE VIEW "public"."unread_messages" AS
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
