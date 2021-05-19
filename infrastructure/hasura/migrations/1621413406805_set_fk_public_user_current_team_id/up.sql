alter table "public"."user"
           add constraint "user_current_team_id_fkey"
           foreign key ("current_team_id")
           references "public"."team"
           ("id") on update restrict on delete restrict;
