INSERT INTO transcription_status (value)
VALUES
    ('preparing'),
    ('transcribing'),
    ('completed'),
    ('blocked'),
    ('failed')
ON CONFLICT DO NOTHING;
