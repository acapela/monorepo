
alter table "public"."team_member" add column "notify_email" boolean
 not null default 'true';

alter table "public"."team_member" add column "notify_slack" boolean
 not null default 'true';
