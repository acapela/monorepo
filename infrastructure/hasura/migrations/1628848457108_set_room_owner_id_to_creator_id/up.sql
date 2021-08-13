UPDATE room SET owner_id = creator_id;

ALTER TABLE "public"."room" ALTER COLUMN "owner_id" SET NOT NULL;
