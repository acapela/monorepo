alter table "public"."team_member" add column "timezone" text
 null;

alter table "public"."team_member" add column "work_start_time_in_utc" integer
 null;

alter table "public"."team_member" add column "work_end_time_in_utc" integer
 null;
