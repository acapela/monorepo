CREATE OR REPLACE FUNCTION search_full_text(search text)
    RETURNS SETOF full_text_search AS $$
SELECT *
FROM full_text_search
WHERE
        search <% (room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''))
ORDER BY
    similarity(search,(room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, ''))) DESC;
$$ LANGUAGE sql STABLE;
