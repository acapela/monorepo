DROP FUNCTION public.search_full_text;
DROP FUNCTION public.search_full_text_topic;

DROP MATERIALIZED VIEW full_text_search;
CREATE MATERIALIZED VIEW public.full_text_search AS
SELECT room.id                  AS room_id,
       room.name                AS room_name,
       room_member.user_id,
       topic.id                 AS topic_id,
       topic.name               AS topic_name,
       message.created_at       AS message_created_at,
       message.type             AS message_type,
       message.id               AS message_id,
       message.content_txt      AS message_content,
       transcription_full_text.transcription_id,
       attachment.id            AS attachment_id,
       attachment.original_name AS attachment_name,
       transcription_full_text.transcript
FROM ((((((public.room
    JOIN public.room_member ON ((room.id = room_member.room_id)))
    LEFT JOIN public.topic ON ((room.id = topic.room_id)))
    LEFT JOIN public.message_full_text message ON ((topic.id = message.topic_id)))
    LEFT JOIN public.message_attachment ma ON ((message.id = ma.message_id)))
    LEFT JOIN public.attachment ON ((ma.attachment_id = attachment.id)))
         LEFT JOIN public.transcription_full_text
                   ON ((message.transcription_id = transcription_full_text.transcription_id)));


CREATE FUNCTION public.search_full_text(search text) RETURNS SETOF public.full_text_search
    LANGUAGE sql STABLE
AS $$
SELECT *
FROM full_text_search
WHERE search <% (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content
    , '') || ' ' || COALESCE (transcript
                     , '') || ' ' || COALESCE (attachment_name
                     , ''))
ORDER BY
    similarity(search, (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content, '') || ' ' || COALESCE (transcript, '') || ' ' || COALESCE (attachment_name, ''))) DESC;
$$;

CREATE FUNCTION public.search_full_text_topic(search text) RETURNS SETOF public.full_text_search
    LANGUAGE sql STABLE
AS $$
SELECT DISTINCT
    ON (user_id, topic_id) *
FROM full_text_search
WHERE
        search
        <% (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content
        , '') || ' ' || COALESCE (transcript
                , '') || ' ' || COALESCE (attachment_name
                , ''));
$$;

CREATE INDEX full_text_search_idx ON public.full_text_search USING gin ((((((((((room_name || ' '::text) || COALESCE (topic_name, ''::text)) || ' '::text) || COALESCE(message_content, ''::text)) || ' '::text) || COALESCE(transcript, ''::text)) || ' '::text) || COALESCE(attachment_name, ''::text))) public.gin_trgm_ops);
