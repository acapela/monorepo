ALTER TABLE "public"."team_member"
  ADD COLUMN "has_joined" BOOLEAN
    NOT NULL DEFAULT false;

UPDATE "public"."team_member" SET "has_joined" = true;
