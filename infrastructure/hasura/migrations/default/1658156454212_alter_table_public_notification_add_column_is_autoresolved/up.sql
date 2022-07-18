alter table "public"."notification" add column "is_autoresolved" boolean
 not null default 'false';
