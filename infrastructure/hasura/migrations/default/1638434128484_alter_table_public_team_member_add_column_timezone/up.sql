alter table "public"."team_member" add column "timezone" text
 null;

alter table "public"."team_member" add column "work_start_hour_in_utc" integer
 null;

alter table "public"."team_member" add column "work_end_hour_in_utc" integer
 null;
