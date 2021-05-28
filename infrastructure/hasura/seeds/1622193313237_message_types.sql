INSERT INTO message_type (value)
VALUES ('TEXT'),
       ('AUDIO'),
       ('VIDEO'),
       ('FILE')
ON CONFLICT DO NOTHING;
