alter table "public"."topic"
  add constraint "topic_team_id_fkey"
  foreign key ("team_id")
  references "public"."team"
  ("id") on update cascade on delete cascade;
