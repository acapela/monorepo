CREATE OR REPLACE VIEW "public"."message_full_text" AS 
 SELECT message.id,
    message.topic_id,
    message.user_id,
    message.transcription_id,
    message.type,
    message.created_at,
    string_agg(t.content_txt, ' '::text) AS content_txt
   FROM (message
     LEFT JOIN ( SELECT message_1.id,
            (jsonb_array_elements(message_1.content) ->> 'insert'::text) AS content_txt
           FROM message message_1
          WHERE (message_1.is_draft = false)) t ON ((t.id = message.id)))
  GROUP BY message.id, message.topic_id, message.user_id, message.transcription_id, message.type;
