ALTER TABLE "public"."team_invitation" DROP COLUMN "used_by_user_id";

alter table "public"."team_invitation" drop constraint "team_invitation_used_by_user_id_fkey";
