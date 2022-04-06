alter table "public"."notification" add column "was_auto_resolved" boolean
 not null default 'false';
