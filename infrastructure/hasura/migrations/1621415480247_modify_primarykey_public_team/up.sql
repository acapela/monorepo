alter table "public"."team" drop constraint "team_pkey";
alter table "public"."team"
    add constraint "team_pkey" 
    primary key ( "id" );
