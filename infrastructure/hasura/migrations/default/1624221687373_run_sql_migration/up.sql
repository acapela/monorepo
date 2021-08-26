create or REPLACE VIEW room_last_posted_message AS
    SELECT room.id as room_id, max(message.created_at) as last_posted_message_time
    FROM room
    left join topic
    on room.id = topic.room_id
    left join message
    on topic.id = message.topic_id
    group by room.id;
