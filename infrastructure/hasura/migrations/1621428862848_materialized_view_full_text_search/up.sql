CREATE MATERIALIZED VIEW full_text_search AS
SELECT room.id room_id,
       room.name room_name,
       room_participants.user_id user_id,
       topic.id topic_id,
       topic.name topic_name,
       message.created_at message_created_at,
       type message_type,
       message.id message_id,
       content_txt message_content,
       transcription_full_text.transcription_id transcription_id,
       attachment.id attachment_id,
       original_name attachment_name,
       transcript
FROM room
    INNER JOIN room_participants on room.id = room_participants.room_id
    INNER JOIN topic on room.id = topic.room_id
    INNER JOIN message_full_text as message on topic.id = message.topic_id
    LEFT JOIN message_attachments ma on message.id = ma.message_id
    LEFT JOIN attachment on ma.attachment_id = attachment.id
    LEFT JOIN transcription_full_text on message.transcription_id = transcription_full_text.transcription_id;
