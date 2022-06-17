alter table "public"."sync_request"
  add constraint "sync_request_team_id_fkey"
  foreign key (team_id)
  references "public"."team"
  (id) on update cascade on delete cascade;
alter table "public"."sync_request" alter column "team_id" drop not null;
alter table "public"."sync_request" add column "team_id" uuid;
