
CREATE TRIGGER "refresh_search"
AFTER DELETE ON "public"."transcription"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_full_text_search();

CREATE TRIGGER "refresh_search"
AFTER DELETE ON "public"."room_member"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_full_text_search();

CREATE TRIGGER "refresh_search"
AFTER DELETE ON "public"."room"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_full_text_search();

CREATE TRIGGER "refresh_search"
AFTER DELETE ON "public"."attachment"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_full_text_search();

CREATE TRIGGER "refresh_search"
AFTER DELETE ON "public"."topic"
FOR EACH STATEMENT EXECUTE FUNCTION refresh_full_text_search();


ALTER TABLE "public"."message" ADD COLUMN "transcription_id" uuid;
ALTER TABLE "public"."message" ALTER COLUMN "transcription_id" DROP NOT NULL;
ALTER TABLE "public"."message" ADD CONSTRAINT message_transcription_id_fkey FOREIGN KEY (transcription_id) REFERENCES "public"."transcription" (id) ON DELETE cascade ON UPDATE cascade;

CREATE OR REPLACE FUNCTION public.search_full_text_topic(search text)
 RETURNS SETOF full_text_search
 LANGUAGE sql
 STABLE
AS $function$
SELECT DISTINCT
    ON (user_id, topic_id) *
FROM full_text_search
WHERE
        search
        <% (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content
        , '') || ' ' || COALESCE (transcript
                , '') || ' ' || COALESCE (attachment_name
                , ''));
$function$;

CREATE OR REPLACE FUNCTION public.search_full_text(search text)
 RETURNS SETOF full_text_search
 LANGUAGE sql
 STABLE
AS $function$
SELECT *
FROM full_text_search
WHERE search <% (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content
    , '') || ' ' || COALESCE (transcript
                     , '') || ' ' || COALESCE (attachment_name
                     , ''))
ORDER BY
    similarity(search, (room_name || ' ' || COALESCE (topic_name, '') || ' ' || COALESCE (message_content, '') || ' ' || COALESCE (transcript, '') || ' ' || COALESCE (attachment_name, ''))) DESC;
$function$;

alter table "public"."attachment" drop constraint "attachment_transcription_id_fkey";

ALTER TABLE "public"."attachment" DROP COLUMN "transcription_id";
