CREATE OR REPLACE VIEW message_full_text AS
SELECT message.id, topic_id, user_id, transcription_id, type, created_at, string_agg(content_txt, ' ') AS content_txt
FROM message LEFT JOIN (
    SELECT id, jsonb_array_elements(content) ->> 'insert' AS content_txt
    FROM message
    WHERE is_draft = false
) t ON t.id = message.id
GROUP BY message.id, topic_id, user_id, transcription_id, type;
