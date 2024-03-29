-- Add the all-channels-included placeholder back to included_channels if 
-- are_all_channels_included is true and it isn't present already
UPDATE
    "public"."user_slack_channels_by_team"
SET
    "included_channels" = "included_channels" || '["*****"]' :: jsonb
WHERE
    "are_all_channels_included" = 'true'
    AND NOT "included_channels" :: jsonb ? '*****';

-- Remove the 2 added columns when migrating down
ALTER TABLE
    "public"."user_slack_channels_by_team" DROP COLUMN "are_all_channels_included";

ALTER TABLE
    "public"."user_slack_channels_by_team" DROP COLUMN "excluded_channels";
