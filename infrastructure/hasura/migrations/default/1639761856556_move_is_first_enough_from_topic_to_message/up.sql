ALTER TABLE "public"."message"
  ADD COLUMN "is_first_completion_enough" BOOLEAN
    NOT NULL DEFAULT 'False';

UPDATE message
SET is_first_completion_enough = TRUE
WHERE topic_id IN (SELECT id FROM topic WHERE is_first_reply_enough);

ALTER TABLE "public"."topic"
  DROP COLUMN "is_first_reply_enough" CASCADE;
