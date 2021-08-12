DROP TRIGGER IF EXISTS "set_public_team_updated_at" ON "public"."team";
ALTER TABLE "public"."team" DROP COLUMN "updated_at";
