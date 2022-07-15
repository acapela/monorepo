alter table "public"."team"
  add constraint "team_owner_id_fkey"
  foreign key ("owner_id")
  references "public"."user"
  ("id") on update cascade on delete restrict;
