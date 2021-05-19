CREATE OR REPLACE VIEW transcription_full_text AS
    SELECT id transcription_id, string_agg(txt, ' ') transcript
    FROM (
        SELECT id, jsonb_array_elements(jsonb_array_elements(transcript -> 'transcript') -> 'words') ->> 'text' txt
        FROM transcription WHERE status = 'completed'
        ) t
    GROUP BY t.id;
