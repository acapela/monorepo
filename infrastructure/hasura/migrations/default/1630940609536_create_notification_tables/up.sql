CREATE TABLE notification_room_added_to
(
  id               UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  room_id          UUID                                  NOT NULL REFERENCES room (id) ON DELETE CASCADE,
  added_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id  UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

CREATE TABLE notification_room_closed
(
  id                UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  room_id           UUID                                  NOT NULL REFERENCES room (id) ON DELETE CASCADE,
  closed_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id   UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

CREATE TABLE notification_topic_added_to
(
  id               UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  topic_id         UUID                                  NOT NULL REFERENCES topic (id) ON DELETE CASCADE,
  added_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id  UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

CREATE TABLE notification_topic_assigned
(
  id                  UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  topic_id            UUID                                  NOT NULL REFERENCES topic (id) ON DELETE CASCADE,
  assigned_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id     UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

CREATE TABLE notification_topic_mention
(
  id                   UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  topic_id             UUID                                  NOT NULL REFERENCES topic (id) ON DELETE CASCADE,
  mentioned_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id      UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

CREATE TABLE notification_topic_closed
(
  id                UUID DEFAULT public.gen_random_uuid() NOT NULL PRIMARY KEY,
  topic_id          UUID                                  NOT NULL REFERENCES topic (id) ON DELETE CASCADE,
  closed_by_user_id UUID                                  NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  notification_id   UUID UNIQUE                           NOT NULL REFERENCES notification (id) ON DELETE CASCADE INITIALLY DEFERRED
);

ALTER TABLE notification
  ALTER COLUMN data DROP NOT NULL;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'addedToRoom'),
     inserted AS (
       INSERT INTO notification_room_added_to (room_id, added_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'roomId')::UUID,
                (data -> 'payload' ->> 'addedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM room WHERE id = (data -> 'payload' ->> 'roomId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'roomClosed'),
     inserted AS (
       INSERT INTO notification_room_closed (room_id, closed_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'roomId')::UUID,
                (data -> 'payload' ->> 'closedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM room WHERE id = (data -> 'payload' ->> 'roomId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'addedToTopic'),
     inserted AS (
       INSERT INTO notification_topic_added_to (topic_id, added_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'topicId')::UUID,
                (data -> 'payload' ->> 'addedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM topic WHERE id = (data -> 'payload' ->> 'topicId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'topicAssigned'),
     inserted AS (
       INSERT INTO notification_topic_assigned (topic_id, assigned_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'topicId')::UUID,
                (data -> 'payload' ->> 'assignedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM topic WHERE id = (data -> 'payload' ->> 'topicId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'topicClosed'),
     inserted AS (
       INSERT INTO notification_topic_closed (topic_id, closed_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'topicId')::UUID,
                (data -> 'payload' ->> 'closedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM topic WHERE id = (data -> 'payload' ->> 'topicId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

WITH existing_notification AS (SELECT * FROM notification WHERE data ->> 'type' = 'topicMention'),
     inserted AS (
       INSERT INTO notification_topic_mention (topic_id, mentioned_by_user_id, notification_id)
         SELECT (data -> 'payload' ->> 'topicId')::UUID,
                (data -> 'payload' ->> 'mentionedByUserId')::UUID,
                id
         FROM existing_notification
         WHERE EXISTS(SELECT * FROM topic WHERE id = (data -> 'payload' ->> 'topicId')::UUID)
         RETURNING *
     )
UPDATE notification
SET data = NULL
FROM inserted
WHERE notification.id = inserted.notification_id;

DELETE
FROM notification
WHERE data IS NOT NULL
  AND NOT (EXISTS(SELECT * FROM topic WHERE id = (data -> 'payload' ->> 'topicId')::UUID) OR
           EXISTS(SELECT * FROM room WHERE id = (data -> 'payload' ->> 'roomId')::UUID));

DO
$$
  BEGIN
    ASSERT
          ((SELECT COUNT(*) FROM public.notification WHERE data IS NOT NULL)) = 0;
  END;
$$ LANGUAGE plpgsql;

ALTER TABLE notification
  DROP COLUMN data;
