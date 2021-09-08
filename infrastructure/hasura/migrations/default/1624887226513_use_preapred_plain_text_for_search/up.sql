CREATE OR REPLACE VIEW "public"."message_full_text" AS 
 SELECT message.id,
    message.topic_id,
    message.user_id,
    message.transcription_id,
    message.type,
    message.created_at,
    message.content_text AS content_txt
   FROM message
     
  GROUP BY message.id, message.topic_id, message.user_id, message.transcription_id, message.type;
