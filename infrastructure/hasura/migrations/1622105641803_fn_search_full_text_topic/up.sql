CREATE OR REPLACE FUNCTION search_full_text_topic(search text)
    RETURNS SETOF full_text_search AS $$
SELECT DISTINCT ON (user_id, topic_id) *
FROM full_text_search
WHERE
    search <% (room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''));
$$ LANGUAGE sql STABLE;
