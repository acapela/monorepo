-- Remove old slack_included_channels column, this should be migrated 
-- by now, so don't worry about the data
ALTER TABLE
    "public"."user" DROP COLUMN IF EXISTS "slack_included_channels";

-- Add new column to indicate if all channels are included by default
ALTER TABLE
    "public"."user_slack_channels_by_team"
ADD
    COLUMN "are_all_channels_included" boolean NOT NULL DEFAULT 'false';

-- Add new column for excluded channels
ALTER TABLE
    "public"."user_slack_channels_by_team"
ADD
    COLUMN "excluded_channels" JSONB NOT NULL DEFAULT '[]';

-- Set are_all_channels_included based on if the old list contains the 
-- all-channels-included placeholder
UPDATE
    "public"."user_slack_channels_by_team"
SET
    "are_all_channels_included" = 'true'
WHERE
    "included_channels" :: jsonb ? '*****';
