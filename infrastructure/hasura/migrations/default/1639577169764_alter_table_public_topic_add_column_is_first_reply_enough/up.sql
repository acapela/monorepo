alter table "public"."topic" add column "is_first_reply_enough" boolean
 not null default 'false';
