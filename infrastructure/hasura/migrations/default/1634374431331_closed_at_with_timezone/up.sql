-- Cannot alter type of column used by a view or rule
-- The unread messages view is not needed any more, it's removed before alter column

BEGIN;  
  DROP VIEW "public"."unread_messages";

  ALTER TABLE "public"."topic" ALTER COLUMN "closed_at" TYPE timestamp with time zone;
COMMIT;
