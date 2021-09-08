INSERT INTO membership_status (value)
VALUES
    ('invited'),
    ('rejected'),
    ('accepted'),
    ('cancelled')
ON CONFLICT DO NOTHING;
