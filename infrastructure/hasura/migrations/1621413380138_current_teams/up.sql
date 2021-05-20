ALTER TABLE "public"."user" ADD COLUMN "current_team" uuid NULL;

alter table "public"."user" rename column "current_team" to "current_team_id";

alter table "public"."user"
           add constraint "user_current_team_id_fkey"
           foreign key ("current_team_id")
           references "public"."team"
           ("id") on update restrict on delete restrict;

alter table "public"."team" drop constraint "team_pkey";
alter table "public"."team"
    add constraint "team_pkey" 
    primary key ( "id" );
