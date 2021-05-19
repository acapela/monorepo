CREATE EXTENSION pg_trgm;
CREATE INDEX full_text_search_idx ON full_text_search
    USING GIN ((room_name || ' ' || topic_name || ' ' || COALESCE(message_content, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(attachment_name, '')) gin_trgm_ops);
