ALTER TABLE "public"."team_invitation" DROP COLUMN "used_by";

alter table "public"."team_invitation" drop constraint "team_invitation_used_by_fkey";
