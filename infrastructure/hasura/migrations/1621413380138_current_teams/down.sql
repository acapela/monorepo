ALTER TABLE "public"."user" DROP COLUMN "current_team";

alter table "public"."user" rename column "current_team_id" to "current_team";

alter table "public"."user" drop constraint "user_current_team_id_fkey";

alter table "public"."team" drop constraint "team_pkey";
alter table "public"."team"
    add constraint "team_pkey" 
    primary key ( "slug", "id" );
